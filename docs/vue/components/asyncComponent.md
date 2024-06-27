---
editLink: false
---

# 异步组件与函数式组件

## 异步组件

```js
// 同步渲染
import App from "App.vue"
createApp(App).mount('#app')

// 异步渲染 (动态导入语句import()来加载组件，会返回一个Promise实例，组件加载成功后，会调用createApp函数完成挂载)
const loader = () => import('App.vue')
loader().then(App => {
  createApp(App).mount('#app')
})
```

异步渲染部分页面

```vue
<template>
  <CompA />
  <component :is="asyncComp" />
</template>
<script>
import { shallowRef } from 'vue'

export default {
  components: {CompA},
  setup() {
    const asyncComp = shallowRef(null)
    
    // 异步加载CompB组件
    import('CompB.vue').then(CompB => asyncComp.value = CompB)

    return {
      asyncComp
    }
  }
}
</script>

```

为异步组件提供更好的封装与支持，需要如下的能力
- 允许用户指定加载出错时要渲染的组件
- 允许用户指定Loading组件，以及展示该组件的延迟时间
- 允许用户设置加载组件的超时时长
- 组件加载失败时，为用户提供重试的能力

## 异步组件的实现原理
### 封装defineAsyncComponent函数

```vue
<template>
  <AsyncComp />
</template>

<script>
  export default {
    components: {
      AsyncComp: defineAsyncComponent(() => import('CompA'))
    }
  }
</script>

```

使用defineAsyncComponet来定义异步组件，并直接用于components组件选项来注册它。

```js
 // defineAsyncComponet 函数用于定义一个异步组件，接收一个异步组件加载器作为参数
  function defineAsyncComponent(loader) {
    let InnerComp = null
    return {
      name: 'AsyncComponentWrapper',
      setup() {
        // 异步组件是否加载成功
        const loaded = ref(false)
        // 执行加载器函数，返回一个Promise实例
        // 加载成功后，将加载成功的组件赋值给InnerComp，并将loaded标记为true，代表加载成功
        loader().then(c => {
          InnerComp = c
          loaded.value = true
        })
        return () => {
          return loaded.value ? { type: InnerComp } : { type: Text, children: '' }
        }
      }
    }
  }
```
- defineAsyncComponent函数本质上是一个高阶组件，它的返回值是一个包装组件
- 包装组件会根据加载器的状态来决定渲染什么内容。如果加载器成功地加载了组件，则渲染被加载的组件，否则会渲染一个占位内容
- 通常占位内容是一个注释节点。组件没有被加载成功时，页面中会渲染一个注释节点来占位。

### 超时与Error组件

```js
// defineAsyncComponet 函数用于定义一个异步组件，接收一个异步组件加载器作为参数
  function defineAsyncComponent(options) {
    // options可以是配置项，也可以是加载器
    if (typeof options === 'function') {
      options = {
        loader: options
      }
    }
    const { loader } = options
    let InnerComp = null
    return {
      name: 'AsyncComponentWrapper',
      setup() {
        // 异步组件是否加载成功
        const loaded = ref(false)
        // 定义error，当错误发生时，用来存储错误对象
        const error = shallowRef(null)

        // 执行加载器函数，返回一个Promise实例
        // 加载成功后，将加载成功的组件赋值给InnerComp，并将loaded标记为true，代表加载成功
        loader().then(c => {
          InnerComp = c
          loaded.value = true
        }).catch((err) => error.value = err)
        let timer = null

        if (options.timeout) {
          timer = setTimeout(() => {
            const err = new Error('Async componet timed out after' + options.timeout + 'ms.')
            error.value = err
          }, options.timeout);
        }
        // 包装组件被卸载时清除定时器
        onUmounted(() => clearTimeout(timer))

        const placeholder = { type: Text, children: '' }
        return () => {
          if (loaded.value) {
            return { type: InnerComp }
          } else if (error.value && options.errorComponent) {
            return { type: options.errorComponent, props: { error: error.value } }
          }
          return placeholder
        }
      }
    }
  }

```

### 延迟与Loading组件

用户接口设计

```js
defineAsyncComponent({
  loader: () => new Promise(r => {}),
  delay: 200,
  tineout: 2000,
  errorComponent: MyErrorComp,
  loadingComponent: {
    setup() {
      return () => {
        return {
          type: 'div',
          children: 'loading'
        }
      }
    }
  }
})
```

```js
 function defineAsyncComponent(options) {
    // options可以是配置项，也可以是加载器
    if (typeof options === 'function') {
      options = {
        loader: options
      }
    }
    const { loader } = options
    let InnerComp = null
    return {
      name: 'AsyncComponentWrapper',
      setup() {
        // 异步组件是否加载成功
        const loaded = ref(false)
        // 定义error，当错误发生时，用来存储错误对象
        const error = shallowRef(null)

        // 是否正在加载 默认为false
        const loading = ref(false)
        const loadingTimer = null
        
        if(options.delay) {
          loadingTimer = setTimeout(() => {
            loading.value = true
          }, options.delay)
        } else {
          loading.value = true
        }

        // 执行加载器函数，返回一个Promise实例
        // 加载成功后，将加载成功的组件赋值给InnerComp，并将loaded标记为true，代表加载成功
        loader().then(c => {
          InnerComp = c
          loaded.value = true
        }).catch((err) => error.value = err)
        .finally(() => {
          loading.value = false
          // 加载完成后，无论成功与否都要清楚延时定时器
          clearTimeout(loadingTimer)
        })
        let timer = null

        if (options.timeout) {
          timer = setTimeout(() => {
            const err = new Error('Async componet timed out after' + options.timeout + 'ms.')
            error.value = err
          }, options.timeout);
        }
        // 包装组件被卸载时清除定时器
        onUmounted(() => clearTimeout(timer))

        const placeholder = { type: Text, children: '' }
        return () => {
          if (loaded.value) {
            return { type: InnerComp }
          } else if (error.value && options.errorComponent) {
            return { type: options.errorComponent, props: { error: error.value } }
          } else if (loading.value && options.loadingComponent) {
            // 如果异步组件正在加载，并且用户指定了Loading组件，则渲染Loading组件
            return { type: options.loadingComponent}
          }
          return placeholder
        }
      }
    }
  }
```

卸载Loading组件并渲染异步加载的组件，兼容Loading组件的卸载
```js
  function unmount(vnode) {
    if (vnode.type === Fragment) {
      vnode.children.forEach(c => unmount(c))
      return
    } else if (typeof vnode.type === 'object') {
      unmount(vnode.component.subTree)
      return
    }
    const parent = vnode.el.parentNode
    if (parent) {
      parent.removeChild(vnode.el)
    }
  }
```

### 重试机制

重试指的是当加载出错时，有能力重新发起加载组件的请求。

模拟
```js
function fetch() {
  return new Promise ((resolve, reject) => {
    setTimout(() => {
      resolve('err')
    }, 2000)
  })
}

function load(onError) {
  const p = fetch()
  return p.catch(err => {
    return new Promise((resolve, reject) => {
      const retry = () => resolve(load(onError))
      const fail = () => reject(err)
      onError(retry, fail)
    })
  })
}

load((retry) => {
  retry()
}).then(res => {
  console.log(res)
})
```

```js
function defineAsyncComponent(options) {
    // options可以是配置项，也可以是加载器
    if (typeof options === 'function') {
      options = {
        loader: options
      }
    }
    const { loader } = options
    let InnerComp = null

    // 记录重试次数 // [!code ++]
    let retries = 0 // [!code ++]
    // 封装load函数用来加载异步组件 // [!code ++]
    function load() { // [!code ++]
      return loader() // [!code ++]
        // 捕获加载器的错误 // [!code ++]
        .catch((err) => { // [!code ++]
          if (options.onError) { // [!code ++]
            return new Promise((resolve, reject) => { // [!code ++]
              const retry = () => { // [!code ++]
                resolve(load()) // [!code ++]
                retries++ // [!code ++]
              } // [!code ++]
              const fail = () => reject(err) // [!code ++]

              options.onError(retry, fail, retries) // [!code ++]
            }) // [!code ++]
          } else { // [!code ++]
            throw error // [!code ++]
          } // [!code ++]
        }) // [!code ++]
    } // [!code ++]

    return {
      name: 'AsyncComponentWrapper',
      setup() {
        // 异步组件是否加载成功
        const loaded = ref(false)
        // 定义error，当错误发生时，用来存储错误对象
        const error = shallowRef(null)

        // 是否正在加载 默认为false
        const loading = ref(false)
        const loadingTimer = null

        if (options.delay) {
          loadingTimer = setTimeout(() => {
            loading.value = true
          }, options.delay)
        } else {
          loading.value = true
        }

        // 执行加载器函数，返回一个Promise实例
        // 加载成功后，将加载成功的组件赋值给InnerComp，并将loaded标记为true，代表加载成功
        load().then(c => {
          InnerComp = c
          loaded.value = true
        }).catch((err) => error.value = err)
          .finally(() => {
            loading.value = false
            // 加载完成后，无论成功与否都要清楚延时定时器
            clearTimeout(loadingTimer)
          })
        let timer = null

        if (options.timeout) {
          timer = setTimeout(() => {
            const err = new Error('Async componet timed out after' + options.timeout + 'ms.')
            error.value = err
          }, options.timeout);
        }
        // 包装组件被卸载时清除定时器
        onUmounted(() => clearTimeout(timer))

        const placeholder = { type: Text, children: '' }
        return () => {
          if (loaded.value) {
            return { type: InnerComp }
          } else if (error.value && options.errorComponent) {
            return { type: options.errorComponent, props: { error: error.value } }
          } else if (loading.value && options.loadingComponent) {
            // 如果异步组件正在加载，并且用户指定了Loading组件，则渲染Loading组件
            return { type: options.loadingComponent }
          }
          return placeholder
        }
      }
    }
  }

```

## 函数式组件

函数式组件本质上就是一个普通函数，该函数的返回值是虚拟DOM。

Vuejs3中使用函数式组件，主要是因为它的简单性，而不是因为它的性能好。这是因为在Vuejs3中，即使是有状态组件，其初始化性能消耗非常小。

在用户接口层面，一个函数式组件就是一个返回虚拟DOM的函数
```js
function MyFuncComp(props) {
  return { type: 'h1', children: props.title}
}
```
函数式组件没有自身状态，但他仍然可以接收由外部传入的props。为了给函数式组件定义props，需要在组件函数上添加静态的props属性。

```js
function MyFuncComp(props) {
  return { type: 'h1', children: props.title}
}
MyFuncComp.props = {
  title: String
}

```

在有状态的组件基础上，实现函数式组件将变得非常简单，因为挂载组件的逻辑可以复用mountComponent函数。

```js
function patch(n1, n2, container, anchor) {
    // 如果n1存在，则对比n1和n2的类型
    if (n1 && n1.type !== n2.type) {
      // 如果新旧vnode的类型不同，则直接将旧的vnode卸载
      unmount(n1)
      n1 = null
    }
    const { type } = n2
    if (typeof type === 'string') {
      // 如果 n1 不存在，意味着挂载，则调用mountElement 函数完成挂载
      // n1 代表旧的vnode， n2 代表新的vnode，当n1不存在时，意味着没有旧的vnode，
      // 这时只需要挂载
      if (!n1) {
        mountElement(n2, container, anchor)
      } else {
        console.log(n1, n2)
        // n1 存在，意味着打补丁，
        patchElement(n1, n2)
      }
    } else if (type === Text) {
      // 如果新的vnode的类型是Text，则说明该vnode描述的是文本节点

      // 如果没有旧节点，则进行挂载
      if (!n1) {
        // 使用createTextNode 创建文本节点
        const el = n2.el = createText(n2.children)
        // 将文本节点插入到容器中
        insert(el, container)
      } else {
        // 如果旧vnode存在，只需要使用新文本节点的文本内容更新旧文本节点即可
        const el = n2.el = n1.el
        if (n2.children !== n1.children) {
          setText(el, n2.children)
        }
      }
    } else if (type === Comment) {
      if (!n1) {
        const el = n2.el = createComment(n2.children)
        insert(el, container)
      } else {
        const el = n2.el = n1.el
        if (n2.children !== n1.children) {
          setComment(el, n2.children)
        }
      }
    } else if (type === Fragment) {
      if (!n1) {
        // 如果旧vnode不存在，则只需要将Fragment的children逐个挂载即可
        n2.children.forEach(c => patch(null, c, container))
      } else {
        // 如果旧vnode存在，则只需要更新Fragment的children即可
        patchChildren(n1, n2, container)
      }
    }
    else if (typeof type === 'object') { // [!code --]
    else if (typeof type === 'object' || typeof type === 'function') { // [!code ++]
      // 组件
      if (!n1) {
        mountComponent(n2, container, anchor)
      } else {
        patchComponent(n1, n2, anchor)
      }
    } else if (type === 'xxx') {
      // 其他类型的vnode
    }

  }

  function mountComponent(vnode, container, anchor) {

    const isFunctional = typeof vnode.type === 'function' // [!code ++]

    const componentOptions = vnode.type

    if(isFunctional) { // [!code ++]
      componentOptions = { // [!code ++]
        render: vnode.type, // [!code ++]
        props: vnode.type.props // [!code ++]
      } // [!code ++]
    } // [!code ++]

    const { render, data, beforCreate, create, props: propOptions, beforeMount, mounted, beforeUpdate, updated } = componentOptions

    beforCreate && beforCreate()

    // 解析出最终的props数据 attrs数据
    const [props, attrs] = resolveProps(propOptions, vnode.props)

    const state = data ? reactive(data()) : null

    const instance = {
      state,
      //将解析出的props 数据包装为shalloReactive并定义到组件实例上
      props: shallowReactive(props),
      isMounted: false,
      subTree: null,
      // 将插槽添加到组件实例上
      slots,
      // 在组件实例中添加mounted数组，用来储存通过onMounted函数注册的生命周期钩子函数
      mounted: []
    }
    // 定义emit函数，它接收两个参数
    // event：事件名称
    // payload： 传递给事件处理函数的参数

    function emit(event, ...payload) {
      // 根据约定对事件名称进行处理
      const eventName = `on${event[0].toUpperCase() + event.slice(1)}`
      // 根据处理后的事件名称去props中寻找对应的事件处理函数
      const handler = instance.props[eventName]
      if (handler) {
        // 调用事件处理函数并传递参数
        handler(...payload)
      } else {
        console.log('事件不存在')
      }
    }

    // 直接使用编译好的vnode.children对象作为slots对象即可
    const slots = vnode.children || {}


    // setupContext
    const setupContext = { attrs, emit, slots }

    // 在调用setup函数之前，设置当前组件实例
    setCurrentInstance(instance)

    // 调用setup函数，将只读版本的props作为第一个参数传递，避免用户意外地修改props值
    // 将setupContext作为第二个参数传递
    const setupResult = setup(shollowReadonly(instance.props), setupContext)

    // 在setup函数执行完毕之后，重置当前组件实例
    setCurrentInstance(null)

    // setupState 用来储存由setup放回的数据
    let setupState = null
    // 如果setup函数的返回值是函数，则将其作为渲染函数
    if (typeof setupResult === "function") {
      if (render) console.log('setup 函数返回渲染函数，render 选项将被忽略')
      // 将setupResult 作为渲染函数
      render = setupResult
    } else {
      // 如果setup 的返回值不是函数，则作为数据状态赋值给setupState
      setupState = setupContext
    }

    vnode.component = instance

    /** 由于props数据与组件自身的状态数据都需要暴露到渲染函数中，
     * 并使得渲染函数能够通过this访问它们，因此需要分装一个渲染上下午对象
     * */
    const renderContext = new Proxy(instance, {
      get(t, k, r) {
        const { state, props } = t
        // 当k当值为$slots时，直接返回组件实例上的slots
        if (k === '$slots') return slots
        if (state && k in state) {
          return state[k]
        } else if (k in props) {
          return props[k]
        } else if (setupState && k in setupState) {
          // 渲染上下文需要增加对setupState的支持
          return setupState[k]
        } else {
          console.log('不存在')
        }
      },
      set(t, k, v, r) {
        const { state, props } = t
        if (state && k in state) {
          state[k] = v
        } else if (k in props) {
          props[k] = v
        } else if (setupState && k in setupState) {
          setupState[k] = v
        } else {
          console.log('不存在')
        }
      }
    })


    create && create.call(renderContext)
    effect(() => {
      const subTree = render.call(renderContext, renderContext)
      if (!instance.isMounted) {
        beforeMount && beforeMount.call(renderContext)
        patch(null, subTree, container, anchor)
        instance.isMounted = true
        // 遍历instance.mounted数组并逐个执行即可
        instance.mounted && instance.mounted.forEach(hook => hook.call(renderContext))
      } else {
        beforeUpdate && beforeUpdate.call(renderContext)
        patch(instance.subTree, subTree, container, anchor)

        // 在这里调用updated钩子
        updated && updated.call(renderContext)
      }
      instance.subTree = subTree
    }, { scheduler: queueJob })
  }
```

如果是函数式组件，mountComponent函数直接将组件函数作为组件选项对象的render选项，并将组件函数的静态props属性作为组件的props选项。
函数式组件它无须初始化data以及生命周期钩子。