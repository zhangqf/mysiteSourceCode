---
editLink:false
---
# 组件的实现原理

## 渲染组件
从用户的角度看，一个有状态的组件就是一个选项对象

```js
const MyComponent = {
  name: "MyComponent",
  data() {
    return { foo: 1 }
  }
}
```

从渲染器内部实现来看，一个组件则是一个特殊类型的虚拟DOM节点

```js
const vnode = {
  type: 'div'
  //...
}
```

渲染器会使用虚拟节点的type属性来区分其类型。对于不同类型的节点，需要采用不同的处理方法来完成挂载和更新。

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
    else if (typeof type === 'object') {
      // 组件
      if (!n1) { // [!code ++]
        // 挂载组件 // [!code ++]
        mountComponent(n2, container, anchor) // [!code ++]
      } else { // [!code ++]
        // 更新组件 // [!code ++]
        patchComponent(n1, n2, anchor) // [!code ++]
      } // [!code ++]
    } else if (type === 'xxx') {
      // 其他类型的vnode
    }

  }

  function mountComponent(vnode, container, anchor) { // [!code ++]
    // 通过vnode 获取组件的选项对象，即vnode.type // [!code ++]
    const componentOptions = vnode.type // [!code ++]
    // 获取组件的渲染函数render // [!code ++]
    const { render } = componentOptions // [!code ++]
    // 执行渲染函数，获取组件要渲染的内容，即render函数返回的虚拟DOM // [!code ++]
    const subTree = render() // [!code ++]
    // 最后调用patch 函数来挂载组件所描述的内容 // [!code ++]
    patch(null, subTree, container, anchor) // [!code ++]
  }
```

## 组件状态与自更新

为组件设计自身的状态

```js
const MyComponent = {
  name: 'MyComponent',
  data() {
    return {
      foo: 'hell world'
    }
  },
  render() {
    return {
      type: 'div',
      children: 'foo 的值是' + this.foo
    }
  }
}


 function mountComponent(vnode, container, anchor) {
    // 通过vnode 获取组件的选项对象，即vnode.type
    const componentOptions = vnode.type
    // 获取组件的渲染函数render
    const { render } = componentOptions // [!code --]
    const { render, data } = componentOptions // [!code ++]

    // 调用data函数得到原始数据，并调用reactive函数将其包装为响应式数据 // [!code ++]
    const state = reactive(data()) // [!code ++]

    // 执行渲染函数，获取组件要渲染的内容，即render函数返回的虚拟DOM 
    // 调用render函数时，将其this设置为state，// [!code ++]
    // 从而render函数内部可以通过this访问组件自身状态数据 // [!code ++]
    const subTree = render.call() // [!code --]
    const subTree = render.call(state, state) // [!code ++]
    // 最后调用patch 函数来挂载组件所描述的内容
    patch(null, subTree, container, anchor)
  }
```

用户必须使用data函数来定义组件自身的状态，同时可以在渲染函数中通过this访问由data函数返回的状态数据

当组件自身的状态发生变化时，需要有能力出发组件更新。

```js
function mountComponent(vnode, container, anchor) {
    // 通过vnode 获取组件的选项对象，即vnode.type
    const componentOptions = vnode.type
    // 获取组件的渲染函数render
    const { render, data } = componentOptions

    // 调用data函数得到原始数据，并调用reactive函数将其包装为响应式数据
    const state = reactive(data())

    // 执行渲染函数，获取组件要渲染的内容，即render函数返回的虚拟DOM // [!code --]
    // 调用render函数时，将其this设置为state，从而render函数内部可以通过this访问组件自身状态数据 // [!code --]
    const subTree = render.call(state, state) // [!code --]
    // 最后调用patch 函数来挂载组件所描述的内容 // [!code --]
    patch(null, subTree, container, anchor) // [!code --]

    effect(() => { // [!code ++]
      const subTree = render.call(state, state) // [!code ++]
      patch(null, subTree, container, anchor) // [!code ++]
    }) // [!code ++]
  }
```

一旦组件自身的响应式数据发生变化，组件就会自动重新执行渲染函数，从而完成更新。但是，由于effect的执行是同步的，当响应式数据发生多次变化时，与之关联的副作用函数会执行多次。 故需使用调度器，但副作用函数需要重新执行时，不会立即执行，而是将它缓冲到一个微任务队列中，等到执行栈清空后，再将它从微任务队列中取出并执行。有了缓存机制，我们就有机会对任务进行去重，从而避免多次执行副作用函数带来的性能开销。

```js
// 任务缓存队列，用一个Set数据结构来表示，这样就可以自动对任务进行去重了
  const queue = new Set()
  // 一个标志，代表是否正在刷新任务队列
  let isFlushing = false
  // 创建一个立即resolve的Promis实例
  const p = Promise.resolve()
  // 调度器的主要函数，用来将一个任务添加到缓冲队列中，并开始刷新队列
  function queueJob(job) {
    // 将job 添加到任务队列queue中
    queue.add(job)
    // 如果还没有开始刷新队列，则刷新
    if (!isFlushing) {
      // 将标志设置为true， 以避免重复刷新
      isFlushing = true
      // 在微任务中刷新缓冲队列
      p.then(() => {
        try {
          // 执行任务队列中的任务
          queue.forEach(jon => job())
        } finally {
          // 重置状态
          isFlushing = false
          queue.length = 0
        }
      })
    }
  }
  function mountComponent(vnode, container, anchor) {
    // 通过vnode 获取组件的选项对象，即vnode.type
    const componentOptions = vnode.type
    // 获取组件的渲染函数render
    const { render, data } = componentOptions

    // 调用data函数得到原始数据，并调用reactive函数将其包装为响应式数据
    const state = reactive(data())
    effect(() => {
      const subTree = render.call(state, state)
      patch(null, subTree, container, anchor)
    }, { // [!code ++]
      scheduler: queueJob // [!code ++]
    }) // [!code ++]
  }
```


## 组件实例与组件的生命周期

组件实例本质上就是一个状态集合（或一个对象），它维护着组件运行过程中的所有信息。注册到组件的生命周期、组件渲染的子树、组件是否已经被挂载、组件自身的状态。

```js
function mountComponent(vnode, container, anchor) {
    // 通过vnode 获取组件的选项对象，即vnode.type
    const componentOptions = vnode.type
    // 获取组件的渲染函数render
    const { render, data } = componentOptions

    // 调用data函数得到原始数据，并调用reactive函数将其包装为响应式数据
    const state = reactive(data())

    // 定义组件实例，一个组件实例本质上就是一个对象，它包含与组件有关的状态信息 // [!code ++]
    const instance = { // [!code ++] 
      // 组件自身的状态数据，即data // [!code ++]
      state, // [!code ++]
      // 一个布尔值，用来表示组件是否已经被挂载，初始值为false // [!code ++]
      isMounted: false, // [!code ++]
      // 组件所渲染的内容，即子树 // [!code ++]
      subTree: null // [!code ++]
    } // [!code ++]

    // 将组件实例设置到vnode上，用于后续更新 // [!code ++]
    vnode.component = instance // [!code ++]

    effect(() => {
      // 调用组件的渲染函数，获得子树
      const subTree = render.call(state, state)
      // 检查组件是否已经被挂载
      if(!instance.isMounted) { // [!code ++]
        // 初次挂载，调用patch函数第一个参数传递null // [!code ++]
        patch(null, subTree, container, anchor) // [!code ++]
        // 将组件实例的isMounted设置为true，这样当更新发生时就不会再次进行挂载操作 // [!code ++]
        // 而是会执行更新 // [!code ++]
        instance.isMounted = true // [!code ++]
      } else { // [!code ++]
        // 当isMounted为true时，说明组件已经被挂载，只需要完成更新即可， // [!code ++]
        // 所以在调用patch函数时，第一个参数为组件上一次渲染的子树 // [!code ++]
        // 使用新的子树与上一次渲染的子树进行打补丁操作 // [!code ++]
        patch(instance.subTree, subTree, container, anchor) // [!code ++]
      }
      patch(null, subTree, container, anchor) // [!code --]
      // 更新组件实例的子树  // [!code ++]
      instance.subTree = subTree // [!code ++]
    }, {
      scheduler: queueJob
    })
  }
```

使用一个对象来表示组件实例，该对象有三个属性
- state： 组件自身的状态数据，即data
- isMounted：一个布尔值，用来表示组件是否被挂载
- subTree：存储组件的渲染函数返回的虚拟DOM，即组件的子树（subTree）

实际上，我们可以在需要的时候，任意地在组件实例instance上添加需要的属性。但需要注意的是，我们应该尽可能保持组件实例轻量，以减少内存占用

组件实例的instance.isMounted属性可以用来区分组件的挂载和更新。因此，可以在合适的时机调用组件对应的生命周期钩子

```js
function mountComponent(vnode, container, anchor) {
    // 通过vnode 获取组件的选项对象，即vnode.type
    const componentOptions = vnode.type
    // 获取组件的渲染函数render
    const { render, data, beforeCreate, created, beforeMount, mounted, beforeUpdate, updated } = componentOptions // [!code ++]

    // 在这里调用beforeCreate钩子  // [!code ++]
    beforeCreate && beforeCreate()  // [!code ++]

    // 调用data函数得到原始数据，并调用reactive函数将其包装为响应式数据
    const state = reactive(data())

    // 定义组件实例，一个组件实例本质上就是一个对象，它包含与组件有关的状态信息
    const instance = {
      // 组件自身的状态数据，即data
      state,
      // 一个布尔值，用来表示组件是否已经被挂载，初始值为false
      isMounted: false,
      // 组件所渲染的内容，即子树
      subTree: null
    }

    // 将组件实例设置到vnode上，用于后续更新
    vnode.component = instance

    // 在这里调用created钩子  // [!code ++]
    created && created()  // [!code ++]

    effect(() => {
      // 调用组件的渲染函数，获得子树
      const subTree = render.call(state, state)
      // 检查组件是否已经被挂载
      if (!instance.isMounted) {

        // 在这里调用beforeMount钩子  // [!code ++]
        beforeMount && beforeMount.call(state)  // [!code ++]

        // 初次挂载，调用patch函数第一个参数传递null
        patch(null, subTree, container, anchor)
        // 将组件实例的isMounted设置为true，这样当更新发生时就不会再次进行挂载操作
        // 而是会执行更新
        instance.isMounted = true

        // 在这里调用mounted钩子  // [!code ++]
        mounted && mounted()  // [!code ++]
      } else {

        // 在这里调用beforeUpdate钩子  // [!code ++]
        beforeUpdate && beforeUpdate.call(state) v

        // 当isMounted为true时，说明组件已经被挂载，只需要完成更新即可，
        // 所以在调用patch函数时，第一个参数为组件上一次渲染的子树
        // 使用新的子树与上一次渲染的子树进行打补丁操作
        patch(instance.subTree, subTree, container, anchor)

        // 在这里调用updated钩子  // [!code ++]
        updated && updated.call(state)  // [!code ++]
      }
      // 更新组件实例的子树
      instance.subTree = subTree
    }, {
      scheduler: queueJob
    })
  }
```

由于可能存在多个同样的组件生命周期钩子，例如来自mixins中生命周期钩子函数，因此我们通常需要将组件生命周期钩子序列化为一个数组。

## props与组件的被动更新

对于一个组件来说，有两部分关于props内容
- 为组件传递props数据， 即组件的vnode.props对象
- 组件选项对象中定义的props选项。

```js
function mountComponent(vnode, container, anchor) {
    // 通过vnode 获取组件的选项对象，即vnode.type
    const componentOptions = vnode.type
    // 获取组件的渲染函数render
    // 从组件选项对象中取出props 定义，即propsoption
    const { render, data, props: propOptions, created, beforeMount, mounted, beforeUpdate, updated } = componentOptions // [!code ++]

    // 在这里调用beforeCreate钩子
    beforeCreate && beforeCreate()

    // 解析出最终的prop数据 attr数据
    const [props, attr] = resolveProps(propOptions, vnode.props) // [!code ++]

    // 调用data函数得到原始数据，并调用reactive函数将其包装为响应式数据
    const state = reactive(data())

    // 定义组件实例，一个组件实例本质上就是一个对象，它包含与组件有关的状态信息
    const instance = {
      // 组件自身的状态数据，即data
      state,

      //将解析出的props 数据包装为shalloReactive并定义到组件实例上 // [!code ++]
      props: shallowReactive(props), // [!code ++]

      // 一个布尔值，用来表示组件是否已经被挂载，初始值为false
      isMounted: false,
      // 组件所渲染的内容，即子树
      subTree: null
    }

    // 将组件实例设置到vnode上，用于后续更新
    vnode.component = instance

    // 在这里调用created钩子
    created && created()

    effect(() => {
      // 调用组件的渲染函数，获得子树
      const subTree = render.call(state, state)
      // 检查组件是否已经被挂载
      if (!instance.isMounted) {

        // 在这里调用beforeMount钩子
        beforeMount && beforeMount.call(state)

        // 初次挂载，调用patch函数第一个参数传递null
        patch(null, subTree, container, anchor)
        // 将组件实例的isMounted设置为true，这样当更新发生时就不会再次进行挂载操作
        // 而是会执行更新
        instance.isMounted = true

        // 在这里调用mounted钩子
        mounted && mounted()
      } else {

        // 在这里调用beforeUpdate钩子
        beforeUpdate && beforeUpdate.call(state)

        // 当isMounted为true时，说明组件已经被挂载，只需要完成更新即可，
        // 所以在调用patch函数时，第一个参数为组件上一次渲染的子树
        // 使用新的子树与上一次渲染的子树进行打补丁操作
        patch(instance.subTree, subTree, container, anchor)

        // 在这里调用updated钩子
        updated && updated.call(state)
      }
      // 更新组件实例的子树
      instance.subTree = subTree
    }, {
      scheduler: queueJob
    })
  }

  function resolveProps(options, propsData) { // [!code ++]
    const props = {} // [!code ++]
    const attrs = {} // [!code ++]
    for (let key in propsData) { // [!code ++]
      if (key in options) { // [!code ++]
        // 如果为组件传递的 Props 数据在组件自身的props 选项中有定义，则将其视为合法的props // [!code ++]
        props[key] = propsData[key] // [!code ++]
      } else { // [!code ++]
        // 否则将其作为attrs // [!code ++]
        attrs[key] = propsData[key] // [!code ++]
      } // [!code ++]
    } // [!code ++]
    return [props, attrs] // [!code ++]
  } // [!code ++]
```