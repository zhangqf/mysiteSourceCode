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