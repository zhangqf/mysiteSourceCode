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