---
editLink: false
---

# 内建组件和模块

## KeepAlive组件的实现原理
### 组件的激活与失活

KeepAlive借鉴于HTTP协议。 在HTTP协议中，KeepAlive 称为HTTP持久连接（HTTP persistent connection），其作用是允许多个请求或响应共用一个TCP连接。在没有KeepAlive的情况下，一个HTTP连接会在每次请求/响应结束后关闭，当下一次请求发生时，会建立一个新的HTTP连接。频繁地销毁、创建HTTP连接会带来额外的性能开销，KeepAlive就是为了解决这个问题而生的。

vuejs中的KeepAlive与HTTP中的KeepAlive类似，也是为了避免频繁的销毁/创建。

```js
// 会频繁的卸载和创建
<template>
  <Tab v-if="currentTab == 1"></Tab>
  <Tab v-if="currentTab == 2"></Tab>
  <Tab v-if="currentTab == 3"></Tab>
</template>
```

```js
// 会缓存
<template>
  <KeepAlive>
    <Tab v-if="currentTab == 1"></Tab>
    <Tab v-if="currentTab == 2"></Tab>
    <Tab v-if="currentTab == 3"></Tab>
  </KeepAlive>
</template>
```
KeepAlive本质上是缓存管理，和特殊的挂载/卸载逻辑 组件的生命周期 activated 和 deactivated

```js
const KeepAlive = {
    // KeepAlive 组件独有的属性，用作标识
    __isKeepAlive: true,
    setup(props, { slots }) {
      // 创建一个缓存对象
      // key: vnode.type
      // value: vnode
      const cache = new Map()
      // 当前KeepAlive组件的实例
      const instance = setCurrentInstance
      // 对于KeepAlive组件来说，它的实例上存在特殊的keepAliveCtx对象，该对象
      // 由渲染器注入该对象会暴露渲染器的一些内部方法，其中move函数用来将一段DOM
      // 移动到另一个容器中
      const { move, createElement } = instance.keepAliveCtx

      // 创建隐藏容器
      const storageContainer = createElement('div')
      // KeepAlive 组件的实例上会被添加两个内部方法，分别是_deActivate 和 _activate
      // 这两个函数会在渲染器中被调用

      instance._deActivate = (vnode) => {
        move(vnode, storageContainer)
      }
      instance._activate = (vnode, container, anchor) => {
        move(vnode, container, anchor)
      }

      return () => {
        // KeepAlive 的默认插槽就是要被KeepAlive的组件
        let rawVNode = slots.default()
        // 如果不是组件，直接渲染即可，因为非组件的虚拟节点无法被KeepAlive
        if (typeof rawVNode.type !== 'object') {
          return rawVNode
        }
        // 在挂载时先获取缓存的组件vnode
        const cacheVNode = cache.get(rawVNode.type)

        if (cacheVNode) {
          // 如果有缓存的内容，则说明不应该执行挂载，而应该执行激活
          // 继承组件实例
          rawVNode.component = cacheVNode.component
          // 在vnode上添加keptAlive属性，标记为true，避免渲染器重新挂载它
          rawVNode.keptAlive = true
        } else {
          // 如果没有缓存，则将其添加到缓存中，这样下次激活组件时就不会执行新的挂载动作了
          cache.set(rawVNode.type.rawVNode)
        }
        // 在组件vnode上添加shouldKeepAlive属性，并标记为true，避免渲染器真的将组件卸载
        rawVNode.shouldKeepAlive = true
        // 将KeepAlive组件的实例也添加到vnode上，以便在渲染器中访问
        rawVNode.keepAliveInstance = instance
        // 渲染组件vnode
        return rawVNode
      }
    }
  }

```

- shouldKeepAlive: 该属性会被添加到“内部组件”的vnode对象上，这样渲染器卸载“内部组件” 时，可以通过检查该属性得知 “内部组件” 需要被 KeepAlive。于是渲染器不会真正卸载“内部组件”，而是会调用_deActive函数完成搬运工作
```js
  function unmount(vnode) {
    if (vnode.type === Fragment) {
      vnode.children.forEach(c => unmount(c))
      return 
    } else if (typeof vnode.type === 'object') {
      if(vnode.shouldKeepAlive) { // [!code ++]
        vnode.keepAliveInstance._deActivate(vnode) // [!code ++]
      } else { // [!code ++]
        unmount(vnode.component.subTree) // [!code ++]
      } // [!code ++]
      unmount(vnode.component.subTree) // [!code --]
      return
    }
    const parent = vnode.el.parentNode
    if (parent) {
      parent.removeChild(vnode.el)
    }
  }
```
- keepAliveInstance：“内部组件”的vnode对象会持有KeepAlive组件实例，在unmount函数中通过keepAliveInstance来访问_deActive函数
- keptAlive：“内部组件”如果已经这缓存，则还会为其添加一个keptAlive标记。这样当“内部组件”需要重新渲染时，渲染器并不会重新挂载它，而是将其激活

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
    else if (typeof type === 'object' || typeof type === 'function') {
      // 组件
      if (!n1) {
        if(n2.keptAlive) { // [!code ++]
          n2.keepAliveInstance._activate(n2, container, anchor) // [!code ++]
        } else { // [!code ++]
          mountComponent(n2, container, anchor) // [!code ++]
        } // [!code ++]
        mountComponent(n2, container, anchor) // [!code --]
      } else {
        patchComponent(n1, n2, anchor)
      }
    } else if (type === 'xxx') {
      // 其他类型的vnode
    }

  }
```


```js

function mountComponent(vnode, container, anchor) {

    const isFunctional = typeof vnode.type === 'function'

    const componentOptions = vnode.type

    if (isFunctional) {
      componentOptions = {
        render: vnode.type,
        props: vnode.type.props
      }
    }

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
      mounted: [],
      // 只有KeepAlive组件的实例下会有KeepAliveCtx属性
      keepAliveCtx: null
    }

    // 检查当前要挂载的组件是否是KeepAlive组件 // [!code ++]
    const isKeepAlive = vnode.type.__isKeepAlive // [!code ++]
    if (isKeepAlive) { // [!code ++]
      // 在KeepAlive组件实例上添加keepAliveCtx对象 // [!code ++]
      instance.keepAliveCtx = { // [!code ++]
        // move 函数用来移动一段vnode // [!code ++]
        move(vnode, container, anchor) { // [!code ++]
          // 本质上是将组件渲染的内容移动到指定容器中，即隐藏容器中 // [!code ++]
          insert(vnode.component.subTree.el, container, anchor) // [!code ++]
        }, // [!code ++]
        createElement // [!code ++]
      } // [!code ++]
    } // [!code ++]


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

### include 和 exclude

KeepAlive组件会对所有“内部组件“进行缓存。如果用户期望只缓存特点组件。为了使用户能够自定义缓存规则，需要让KeepAlive组件支持两个props，分别是include和exclude。其中，include用来显式地配置应该被缓存组件，而exclude用来显式地配置不应该被缓存组件

```js
const KeepAlive = {
  __isKeepAlive: true,
  // 定义include 和 exclude
  props: {
    include: RegExp,
    exclude: RegExp
  },
  setup(props, { slots }){
    // ...
    return () => {
      let rawVNode = slots.default()
      if(typeof rawVNode.type !== 'object') {
        return rawVNode
      }
      // 获取 “内部组件” 的name
      const name = rawVNode.type.name
      // 对name进行匹配 如果name无法被include匹配 或者被exclude匹配
      if(name && ((props.include && !props.include.test(name))) || (props.exclude && props.exclude.test(name))) {
        // 则直接渲染 “内部组件”， 不对其进行后续的缓存操作
        return rawVNode
      }
    }
  }
}
```
### 缓存管理

```js
  const cache = new Map()

  const cachedVNode = cache.get(rawVNode.type)

  if(cachedVNode) {
    rawVNode.component = cachedVNode.component
    rawVNode.keptAlive = true
  } else {
    cache.set(rawVNode.type, rawVNode)
  }
```


## Teleport 组件的实现原理

可以将指定的内容渲染到特定的容器中，而不受DOM层级的限制


```js
// Overlay.vue
<template>
  <Teleport to='body'>
    <div class="overlay"></div>
  </Teleport> 

</template>
<style>
  .overlay {
    z-index: 999
  }
</style>
```
<Overlay/>组件要渲染的内容都包含在Teleport组件内。通过Teleport组件指定渲染目标body。

### 实现Teleport 组件

```js
function patch(n1, n2, container, anchor) {
  if(n1 && n1.type !== n2.type){
    unmount(n1)
    n1 = null
  }
  const {type} = n2
  if(typeof type === 'string') {

  }else if(typeof type ===Text) {

  } else if(typeof type === 'object' && type.__isTeleport) {
    type.process(n1, n2, container, anchor, {
      patch,
      patchChildren,
      unmount,
      move(vnode, container, anchor) {
        insert(vnode.component?vnode.component.subTree.el : vnode.el, container, anchor)
      }
    }) 
  }...
}

const Teleport = {
  __isTeleport: true,
  process(n1, n2, container, anchor, internals) {
    const {patch} = internals
    if(!n1) {
      const target = typeof n2.props.to === 'string' ? document.querySelector(n2.porps.to): n2.props.to
      n2.children.forEach(c => patch(null, c, target, anchor))
    } else {
      patchChildren(n1, n2, container)
      if(n2.props.to !== n1.props.to) {
        const newTarget = typeof n2.props.to === 'string' ? document.querySelector(n2.props.to): n2.props.to
        n2.children.forEach(c => move(c, newTarget))
      }
    }
  } 
}
```

### Transition组件的实现原理

- 当DOM元素被挂载时，将动效附加到该DOM元素uh
- 当DOM元素被卸载时，不要立即卸载DOM元素，而是等到附加到该DOM元素上的动效执行完成后再卸载它

```js
const Transition = {
  name: 'Transition',
  setup(props, { slots }) {
    return () => {
      const innerVNode = slots.default()
      innerVNode.transition = {
        beforeEnter(el){},
        enter(el){},
        leave(el, performaRemove) {}
      }
      return innerVnode
    }
  }
}
```