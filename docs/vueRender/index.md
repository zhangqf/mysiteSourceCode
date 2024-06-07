# 渲染器的设计

首次调用`renderer.render`函数时，只需要创建新的`DOM`元素即可，这个过程只涉及挂载。

而当多次在同一个`container`上调用`renderer.render`函数进行渲染时，渲染器除了要执行挂载动作外，还要执行更新动作。

```js
const renderer = createRenderer()
// 首次渲染
renderer.render(oldVnode, document.querySelector('#app'))
// 第二次渲染
renderer.render(newVnode, document.querySelector('#app'))
```

首次渲染时已经把`oldVnode`渲染到`container`内了，再次调用`renderer.render`函数并尝试渲染`newVnode`时，就不能简单地执行挂载动作。

在这种情况下，渲染器会使用`newVnode`与上一次渲染的`oldVnode`进行比较，试图找到并更新变更点。这个过程叫作“打补丁” （patch）。实际上，挂载动作本身也可以看作一种特殊的打补丁，它特殊之处在于旧的`vnode`是不存在的。

```js
function createRenderer(){
  function render(vnode, container) {
    if(vnode){
      // 新vnode存在，将其与旧vnode一起传递给patch函数，进行打补丁
      patch(container._vnode, vnode, container)
    } else {
      if(container._vnode) {
        // 旧vnode存在，且新vnode不存在，说明是卸载（unmount）操作
        // 只需要将container内的DOM清空即可
        container.innerHTML = ''
      }
    }
    // 把vnode存储到container._vnode 下，即后续渲染中的旧vnode
    container._vnode = vnode
  }
  return {
    render
  }
}
```

### 自定义渲染器

```js
// 创建一个渲染器
const renderer = createRenderer()

// 调用render函数渲染该vnode

renderer.render(vnode, document.querySelector('#app'))

function createRenderer() {
  function patch(n1,n2,container) {
    // 如果 n1 不存在，意味着挂载，则调用mountElement 函数完成挂载
    // n1 代表旧的vnode， n2 代表新的vnode，当n1不存在时，意味着没有旧的vnode，
    // 这时只需要挂载
    if(!n1) {
      mountElement(n2, container)
    } else {
      // n1 存在，意味着打补丁，
    }
  }
  function render(vnode, container) {
    if(vnode) {
      patch(container._vnode, vnode, container)
    } else {
      if(container._vnode) {
        container.innerHTML = ''
      }
    }
    container._vnode = vnode
  }
  
  function mountElement(vnode, container) {
    // 创建DOM元素
    const el = document.createElement(vnode.type)
    // 处理子节点，如果子节点是字符串，代表元素具有文本节点
    if(typeof vnode.children === 'string') {
      el.textContent = vnode.children
    }
    // 将元素添加到容器中
    container.appendChild(el)
  }

  return {
    render
  }
}

```

将浏览器特有的API抽离（设计通用渲染器）

```js
// 创建一个渲染器
const renderer = createRenderer() // [!code --]
const renderer = createRenderer({ // [!code ++]
  createElement(tag) { // [!code ++]
    return document.createElement(tag) // [!code ++]
  }, // [!code ++]
  setElementText(el, text) { // [!code ++]
    el.textContent = text // [!code ++]
  }, // [!code ++]
  insert(el, parent, anchor = null) { // [!code ++]
    parent.insertBefore(el, anchor) // [!code ++]
  } // [!code ++]
}) // [!code ++]


// 调用render函数渲染该vnode

renderer.render(vnode, document.querySelector('#app'))

function createRenderer(options) { // [!code --]
function createRenderer(options) { // [!code ++]
  const { // [!code ++]
    createElement, // [!code ++]
    insert, // [!code ++]
    setElementText // [!code ++]
  } = options // [!code ++]
  function patch(n1,n2,container) {
    // 如果 n1 不存在，意味着挂载，则调用mountElement 函数完成挂载
    // n1 代表旧的vnode， n2 代表新的vnode，当n1不存在时，意味着没有旧的vnode，
    // 这时只需要挂载
    if(!n1) {
      mountElement(n2, container)
    } else {
      // n1 存在，意味着打补丁，
    }
  }
  
  function render(vnode, container) {
    if(vnode) {
      patch(container._vnode, vnode, container)
    } else {
      if(container._vnode) {
        container.innerHTML = ''
      }
    }
    container._vnode = vnode
  }

  function mountElement(vnode, container) {
    // 创建DOM元素
    const el = document.createElement(vnode.type) // [!code --]
    const el = createElement(vnode.type) // [!code ++]
    // 处理子节点，如果子节点是字符串，代表元素具有文本节点
    if(typeof vnode.children === 'string') { 
      el.textContent = vnode.children // [!code --]
      setElementText(el, vnode.children) // [!code ++]
    }
    // 将元素添加到容器中
    container.appendChild(el) // [!code --]
    insert(el, container) // [!code ++]
  }

  return {
    render
  }
}

```

```js
const renderer1 = createRenderer({
  createElement(tag) {
    console.log(`创建元素${tag}`)
    return { tag }
  },
  setElementText(el, text) {
    console.log(`设置${JSON.stringify(el)}的文本内容：${text}`)
    el.text = text
  },
  insert(el, parent, anchor = null) {
    console.log(`将${JSON.stringify(el)}添加到${JSON.stringify(parent)}下`)
    parent.children = el
  }
})

const container = { type: 'root' }

renderer1.render(vnode, container)
```

---

渲染器与响应系统的关系。利用响应系统的能力，可以做到，当响应式数据变化时自动完成页面更新（或重新渲染）。

渲染器的作用时把虚拟的DOM渲染为特定平台的真实元素。

渲染器会执行挂载和打补丁操作，对应新的元素，渲染器会将它挂载到容器内；对于新旧vnode都存在的情况，渲染器则会执行打补丁操作，即对比新旧vnode，只更新变化的内容。
