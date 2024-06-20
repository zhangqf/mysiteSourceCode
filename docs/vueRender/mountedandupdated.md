---
editLink: false
---
# 挂载与更新

## 挂载子节点和元素的属性

### 挂载子节点

```js
const vnode = {
  type: 'div',
  children: [
    {
      type: 'p',
      children: 'hello'
    }
  ]
}
function mountElement(vnode, container) {
    // 创建DOM元素
    const el = createElement(vnode.type)
    // 处理子节点，如果子节点是字符串，代表元素具有文本节点
    if (typeof vnode.children === 'string') {
      setElementText(el, vnode.children)
    } else if(Array.isArray(vnode.children)) { // [!code ++]
      // 如果childern是数组，则遍历每一个子节点，并调用patch函数挂载它们 // [!code ++]
      vnode.children.forEach(child => { // [!code ++]
        patch(null, child, el) // [!code ++]
      }) // [!code ++]
    }
    // 将元素添加到容器中
    insert(el, container)
  }
```

- 传递给`patch` 函数的第一个参数是`null`。因为是挂载阶段，没有旧`vnode` ，所以只需要传递`null` 即可。当`patch`函数执行时，就会递归地调用`mountElement`函数完成挂载。
- 传递给`patch`函数的第三个参数是挂载点。由于正在挂载点子元素是`div` 标签的子节点，所以需要把刚刚创建的`div` 元素作为挂载点，这样才能保证这些子节点挂载到正确位置。

### 挂载元素属性

```js
const vnode1 = {
  type: 'div',
  props: {
    id: foo
  },
  children:[
    {
      type: 'p',
      children: 'hello'
    }
  ]
}
function mountElement(vnode, container) {
    // 创建DOM元素
    const el = createElement(vnode.type)
    // 处理子节点，如果子节点是字符串，代表元素具有文本节点
    if (typeof vnode.children === 'string') {
      setElementText(el, vnode.children)
    } else if(Array.isArray(vnode.children)) {
      // 如果childern是数组，则遍历每一个子节点，并调用patch函数挂载它们
      vnode.children.forEach(child => {
        patch(null, child, el)
      })
    }

    if(vnode.props) {  // [!code ++]
      for(const key in vnode.props) { // [!code ++]
        el.setAttribute(key, vnode.props[key]) // [!code ++]
      } // [!code ++]
    } // [!code ++]
    // 将元素添加到容器中
    insert(el, container)
  }
```

### HTML Attributes 与 DOM Properties

`HTML Attributes` 指的就是定义在`HTML` 标签上的属性。当浏览器解析HTML代码后，会创建一个与之相符的`DOM`元素对象，这个`DOM`对象会包含很多属性，这些属性就是所谓的`DOM Properties`。

很多`HTML Attributes` 在`DOM`对象上有与之同名的`DOM Properties`。但`DOM Proterties` 与`HTML Attributes` 的名字不总是一模一样的。

```js
<input value = 'foo' />
// 这时将文本内容修改为 bar
console.log(el.value) // 'bar'
console.log(el.getAttribute('value')) // foo
console.log(el.value) // 'bar'
console.log(el.defaultValue) // foo
```

实际上，**`HTML Attributes` 的作用是设置与之对应的`DOM Properties` 的初始值**。一旦值改变，那么`DOM Properties` 始终存储着当前值，而通过`getAttribute` 函数得到的仍然是初始值。

说明一个`HTML Attributes` 可能关联多个`DOM Properties` 。

### 正确的设置元素属性

```js
function mountElement(vnode, container) {
    // 创建DOM元素
    const el = createElement(vnode.type)
    // 处理子节点，如果子节点是字符串，代表元素具有文本节点
    if (typeof vnode.children === 'string') {
      setElementText(el, vnode.children)
    } else if (Array.isArray(vnode.children)) {
      // 如果childern是数组，则遍历每一个子节点，并调用patch函数挂载它们
      vnode.children.forEach(child => {
        patch(null, child, el)
      })
    }

    if (vnode.props) {
      for (const key in vnode.props) {
        // 用in操作符判断key是否存在对应的DOM Properties
        if (key in el) { // [!code ++]
          // 获取该DOM Properties的类型 // [!code ++]
          const type = typeof el[key] // [!code ++]
          const value = vnode.props[key] // [!code ++]
          // 如果是布尔类型，并且value是空字符串，则将值矫正为true // [!code ++]
          if (type === 'boolean' && value === '') { // [!code ++]
            el[key] = true // [!code ++]
          } else { // [!code ++]
            el[key] = value // [!code ++]
          } // [!code ++]
        } else { // [!code ++]
          el.setAttribute(key, vnode.props[key]) // [!code ++]
        } // [!code ++]
        el.setAttribute(key, vnode.props[key]) // [!code --]
      }
    }
    // 将元素添加到容器中
    insert(el, container)
  }
```

### 改进

有些`DOM Properties` 是只读的，因此只能够通过`setAttribute` 函数来设置它。

如：

```html
<form id='form1'></form>
<input form='form1' />
```

```js
function shouldSetAsProps(el, key, value) { // [!code ++]
  if(key === "form" && el.tagName === 'INPUT') return false // [!code ++]
  return key in el // [!code ++]
} // [!code ++]

function mountElement(vnode, container) {
    // 创建DOM元素
    const el = createElement(vnode.type)
    // 处理子节点，如果子节点是字符串，代表元素具有文本节点
    if (typeof vnode.children === 'string') {
      setElementText(el, vnode.children)
    } else if (Array.isArray(vnode.children)) {
      // 如果childern是数组，则遍历每一个子节点，并调用patch函数挂载它们
      vnode.children.forEach(child => {
        patch(null, child, el)
      })
    }

    if (vnode.props) {
      for (const key in vnode.props) {
        // 用in操作符判断key是否存在对应的DOM Properties
        if (key in el) { // [!code --]
        if (shouldSetAsProps(el, key, value)) { // [!code ++]
          // 获取该DOM Properties的类型 
          const type = typeof el[key]
          const value = vnode.props[key]
          // 如果是布尔类型，并且value是空字符串，则将值矫正为true 
          if (type === 'boolean' && value === '') {
            el[key] = true
          } else {
            el[key] = value
          }
        } else {
          el.setAttribute(key, vnode.props[key])
        }
      }
    }
    // 将元素添加到容器中
    insert(el, container)
  }

```

抽离

```js
const renderer = createRenderer({
  createElement(tag) {
    return document.createElement(tag)
  },
  setElementText(el, text) {
    el.textContent = text
  },
  insert(el, parent, anchor = null) {
    parent.insertBefore(el, anchor)
  },
  patchProps(el, key, preValue, nextValue) { // [!code ++]
    if (shouldSetAsProps(el, key, nextValue)) { // [!code ++]
      const type = typeof el[key] // [!code ++]
      if (type === 'boolean' && nextValue === '') { // [!code ++]
        el[key] = true // [!code ++]
      } else { // [!code ++]
        el[key] = nextValue // [!code ++]
      } // [!code ++]
    } else { // [!code ++]
      el.setAttribute(key, nextValue) // [!code ++]
    } // [!code ++]
  } // [!code ++]
})

function mountElement(vnode, container) {
    // 创建DOM元素
    const el = createElement(vnode.type)
    // 处理子节点，如果子节点是字符串，代表元素具有文本节点
    if (typeof vnode.children === 'string') {
      setElementText(el, vnode.children)
    } else if (Array.isArray(vnode.children)) {
      // 如果childern是数组，则遍历每一个子节点，并调用patch函数挂载它们
      vnode.children.forEach(child => {
        patch(null, child, el)
      })
    }

    if (vnode.props) {
      for (const key in vnode.props) {
        patchProps(el, key, null, vnode.props[key]) // [!code ++]
        // 用in操作符判断key是否存在对应的DOM Properties // [!code --]
        if (shouldSetAsProps(el, key, value)) { // [!code --]
          // 获取该DOM Properties的类型  // [!code --]
          const type = typeof el[key] // [!code --]
          const value = vnode.props[key] // [!code --]
          // 如果是布尔类型，并且value是空字符串，则将值矫正为true  // [!code --]
          if (type === 'boolean' && value === '') { // [!code --]
            el[key] = true // [!code --]
          } else { // [!code --]
            el[key] = value // [!code --]
          } // [!code --]
        } else { // [!code --]
          el.setAttribute(key, vnode.props[key]) // [!code --]
        } // [!code --]
      }
    }
    // 将元素添加到容器中
    insert(el, container)
  }
```

### class 的处理

vue中设置类名的几种方式

- 指定class为一个字符串

  ```html
  <p class='foo bar'></p>
  ```
- 指定class为一个对象值

  ```html
  <p :class='cls'></p>
  ```

  ```js
  const cls = {foo: true, bar: false}
  ```

  ```js
  //对应的vnode
  const vnode = {
    type: 'p',
    props: {
      class: { foo: true, bar: false}
    }
  }
  ```
- class是包含上述两种类型的数组

  ```html
  <p :class='arr'></p>
  ```

  ```js
  const arr = [
    'foo bar',
    {
      baz: true
    }
  ]
  ```

  ```js
  // 对应的vnode
  const vnode ={
    type: 'p',
    props: {
      class: [
        'foo bar',
        {baz: true}
      ]
    }
  }
  ```

class的值可以是多种类型，必须在设置元素的class之前将值归一化为统一的字符串形式，再把该字符串作为元素的class值去设置。

在浏览器中设置class的三种方式

- setAttribute 性能最差
- el.className 性能最优
- el.classList 性能中等

```js
// 创建一个渲染器
const renderer = createRenderer({
  createElement(tag) {
    return document.createElement(tag)
  },
  setElementText(el, text) {
    el.textContent = text
  },
  insert(el, parent, anchor = null) {
    parent.insertBefore(el, anchor)
  },
  patchProps(el, key, preValue, nextValue) { 
    if(key === 'class') { // [!code ++]
      el.className = nextValue || '' // [!code ++]
    } else if (shouldSetAsProps(el, key, nextValue)) { 
      const type = typeof el[key] 
      if (type === 'boolean' && nextValue === '') { 
        el[key] = true 
      } else { 
        el[key] = nextValue 
      } 
    } else { 
      el.setAttribute(key, nextValue) 
    } 
  } 
})
```

### 卸载操作

卸载操作发生在更新阶段。在初次挂载完成后，后续渲染会触发更新。

```js
// 首次挂载
renderer.render(vnode, document.querySelector('#app'))
// 再次挂载，触发更新
renderer.render(newVnode, document.querySelector('#app'))
```

更新的几种情况：

- 首次挂载完成后，后续调用render函数渲染空内容

```js
renderer.render(vnode, document.querySelector('#app'))
// 新vnode内容为null， 意味着卸载之前渲染的内容
renderer.render(null, document.querySelector('#app'))
```

```js
 function render(vnode, container) {
   if (vnode) {
     patch(container._vnode, vnode, container)
   } else {
     if (container._vnode) {
       container.innerHTML = ''
     }
   }
   container._vnode = vnode
 }
```

当内容为空时，通过container.innerHTMl 清空容器。不严谨

- 容器的内容可能是由某个或多个组件渲染的，当卸载操作发生时，应该正确地调用这些组件的 `beforeUnmount` 、`unmounted`等生命周期函数
- 即使内容不是由组件渲染的，有的元素存在自定义指令，我们应该在卸载操作发生时正确的执行对应的指令钩子函数
- 使用innerHTML清空容器元素内容的另一个缺陷，它不会移除绑定的DOM元素上的事件处理函数

正确的卸载方式是，根据`vnode`对象获取与其相关联的真实`DOM`元素，然后使用原生`DOM`操作方法将该`DOM`元素移除。

```js
function mountElement(vnode, container) {
   // 创建DOM元素
   const el = createElement(vnode.type) // [!code --]
   const el = vnode.el = createElement(vnode.type) // [!code ++]
   // 处理子节点，如果子节点是字符串，代表元素具有文本节点
   if (typeof vnode.children === 'string') {
     setElementText(el, vnode.children)
   } else if (Array.isArray(vnode.children)) {
     // 如果childern是数组，则遍历每一个子节点，并调用patch函数挂载它们
     vnode.children.forEach(child => {
       patch(null, child, el)
     })
   }

   if (vnode.props) {
     for (const key in vnode.props) {
       patchProps(el, key, null, vnode.props[key])
     }
   }
   // 将元素添加到容器中
   insert(el, container)
 }

  function render(vnode, container) {
   if (vnode) {
     patch(container._vnode, vnode, container)
   } else {
     if (container._vnode) {
       container.innerHTML = '' // [!code --]
        // 根据vnode获取要卸载的真实DOM元素 // [!code ++]
       const el = container._vnode.el // [!code ++]
       // 获取el的父元素 // [!code ++]
       const parent = el.parentNode // [!code ++]
       // 调用removeChild移除元素 // [!code ++]
       if(parent) { // [!code ++]
         parent.removeChild(el) // [!code ++]
       } // [!code ++]
     }
   }
   container._vnode = vnode
 }
```

将移除操起提取到 `unmount` 中

```js
function createRenderer(options) {
 const {
   createElement,
   insert,
   setElementText,
   patchProps
 } = options
 function patch(n1, n2, container) {
   // 如果 n1 不存在，意味着挂载，则调用mountElement 函数完成挂载
   // n1 代表旧的vnode， n2 代表新的vnode，当n1不存在时，意味着没有旧的vnode，
   // 这时只需要挂载
   if (!n1) {
     mountElement(n2, container)
   } else {
     // n1 存在，意味着打补丁，
   }
 }

 function unmount(vnode) { // [!code ++]
   const parent = vnode.el.parentNode // [!code ++]
   if(parent) { // [!code ++]
     parent.removeChild(vnode.el) // [!code ++]
   } // [!code ++]
 } // [!code ++]

 function render(vnode, container) {
   if (vnode) {
     patch(container._vnode, vnode, container)
   } else {
     if (container._vnode) {
       unmount(vnode) // [!code ++]
       // 根据vnode获取要卸载的真实DOM元素 // [!code --]
       const el = container._vnode.el // [!code --]
       // 获取el的父元素 // [!code --]
       const parent = el.parentNode // [!code --]
       // 调用removeChild移除元素 // [!code --]
       if(parent) { // [!code --]
         parent.removeChild(el) // [!code --]
       } // [!code --]
     }
   }
   container._vnode = vnode
 }

 function mountElement(vnode, container) {
   // 创建DOM元素
   const el = vnode.el = createElement(vnode.type)
   // 处理子节点，如果子节点是字符串，代表元素具有文本节点
   if (typeof vnode.children === 'string') {
     setElementText(el, vnode.children)
   } else if (Array.isArray(vnode.children)) {
     // 如果childern是数组，则遍历每一个子节点，并调用patch函数挂载它们
     vnode.children.forEach(child => {
       patch(null, child, el)
     })
   }

   if (vnode.props) {
     for (const key in vnode.props) {
       patchProps(el, key, null, vnode.props[key])
     }
   }
   // 将元素添加到容器中
   insert(el, container)
 }

 return {
   render
 }
}

```

### 区分vnode的类型

```js
function patch(n1, n2, container) {
   // 如果n1存在，则对比n1和n2的类型 // [!code ++]
   if(n1 && n1.type !== n2.type) { // [!code ++]
     // 如果新旧vnode的类型不同，则直接将旧的vnode卸载 // [!code ++]
     unmount(n1) // [!code ++]
     n1 = null // [!code ++]
   } // [!code ++]
   // 如果 n1 不存在，意味着挂载，则调用mountElement 函数完成挂载 // [!code --]
   // n1 代表旧的vnode， n2 代表新的vnode，当n1不存在时，意味着没有旧的vnode， // [!code --]
   // 这时只需要挂载 // [!code --]
   if (!n1) { // [!code --]
     mountElement(n2, container) // [!code --]
   } else { // [!code ++]
     // n1 存在，意味着打补丁， // [!code --]
   } // [!code --]
    const { type } = n2 // [!code ++]
   if (typeof type === 'string') { // [!code ++] 
     // 如果 n1 不存在，意味着挂载，则调用mountElement 函数完成挂载 // [!code ++]
     // n1 代表旧的vnode， n2 代表新的vnode，当n1不存在时，意味着没有旧的vnode，  // [!code ++]
     // 这时只需要挂载 // [!code ++]
     if (!n1) { // [!code ++]
       mountElement(n2, container) // [!code ++]
     } else { // [!code ++]
       // n1 存在，意味着打补丁， // [!code ++]
       patch(n1, n2) // [!code ++]
     } // [!code ++]
   } else if (typeof type === 'object') { // [!code ++]
     // 组件 // [!code ++]
   } else if (type === 'xxx') { // [!code ++]
     // 其他类型的vnode // [!code ++]
   } // [!code ++]
 }
```

### 事件的处理

```js
 patchProps(el, key, preValue, nextValue) {
   // 匹配以on开头的属性，视其为事件 // [!code ++]
   if(/^on/.test(key)) {  // [!code ++]
     const name = key.slice(2).toLowerCase() // [!code ++]
      // 移除上一次绑定 的事件处理函数 // [!code ++]
     preValue && el.removeEventListener(name, preValue) // [!code ++]
     // 绑定新的事件处理函数 // [!code ++]
     el.addEventListener(name, nextValue) // [!code ++]
   } else if (key === 'class') {
     el.className = nextValue || ''
   } else if (shouldSetAsProps(el, key, nextValue)) {
     const type = typeof el[key]
     if (type === 'boolean' && nextValue === '') {
       el[key] = true
     } else {
       el[key] = nextValue
     }
   } else {
     el.setAttribute(key, nextValue)
   }
 }
```

#### 优化

伪造一个事件处理函数 `invoker`, 把真正的事件处理函数设置为`invoker.value`属性的值。这样，当更新事件的时候，将不在需要调用`removeEventListener`函数来移除上一次绑定的事件，只需更新`invoker.value`的值即可

```js
patchProps(el, key, preValue, nextValue) {
   // 匹配以on开头的属性，视其为事件
   if(/^on/.test(key)) {
     // 获取为该元素伪造的事件处理函数 invoker
     let invoker = el._vei // [!code ++]
     const name = key.slice(2).toLowerCase()
     if(!invoker) { // [!code ++]
       // 如果没有invoker，则将一个伪造的invoker缓存到el._vei中 // [!code ++]
       // vei是vue event invoker的首字母缩写 // [!code ++]
       invoker = el._vei = (e) => { // [!code ++]
         // 当伪造的事件处理函数执行时，会执行真正的事件处理函数 // [!code ++]
         invoker.value(e) // [!code ++]
       } // [!code ++]
       // 将真正的事件处理函数赋值给invoker.value // [!code ++]
       invoker.value = nextValue // [!code ++]
       // 绑定invoker作为事件处理函数 // [!code ++]
       el.addEventListener(name, invoker) // [!code ++]
     } // [!code ++]
     // 移除上一次绑定 的事件处理函数 // [!code --]
     preValue && el.removeEventListener(name, preValue) // [!code --]
     // 绑定新的事件处理函数 // [!code --]
     el.addEventListener(name, nextValue) // [!code --]
   } else if (key === 'class') {
     el.className = nextValue || ''
   } else if (shouldSetAsProps(el, key, nextValue)) {
     const type = typeof el[key]
     if (type === 'boolean' && nextValue === '') {
       el[key] = true
     } else {
       el[key] = nextValue
     }
   } else {
     el.setAttribute(key, nextValue)
   }
 }


const vnode1 = {
 type: 'div',
 props: {
   id: foo,
   onClick: () => {
     alert('clicked')
   }
 },
 children: [
   {
     type: 'p',
     children: 'hello'
   }
 ]
}
```

#### 改进2

当一个元素同时绑定多种事件时，将会出现事件覆盖。同一类型的事件，还可以绑定多个事件处理函数。

```js
const vnode1 = {
 type: 'div',
 props: {
   id: foo,
   onClick: () => {
     alert('clicked')
   },
   onContextmenu: () => { // [!code ++]
     alert('contextmenu') // [!code ++]
   } // [!code ++]
 },
 children: [
   {
     type: 'p',
     children: 'hello'
   }
 ]
}
```

需要重新设计`el._vei`的数据结构。 将`el._vei`设计为一个对象，它的键是事件名称，值则是对应的事件处理函数。

```js
patchProps(el, key, preValue, nextValue) {
    // 匹配以on开头的属性，视其为事件
    if (/^on/.test(key)) {
      const invokers = el._vei || (el._vei = {})
      // 获取为该元素伪造的事件处理函数 invoker
      let invoker = invokers[key]
      const name = key.slice(2).toLowerCase()
      if (nextValue) {
        if (!invoker) {
          // 如果没有invoker，则将一个伪造的invoker缓存到el._vei中
          // vei是vue event invoker的首字母缩写
          invoker = el._vei[key] = (e) => {
            // 当伪造的事件处理函数执行时，会执行真正的事件处理函数
            // 如果invoker.value 是数组，则遍历它并逐个调用事件处理函数
            if(Array.isArray(invoker.value)){
              invoker.value.forEach(fn => fn(e))
            } else {
              invoker.value(e)
            }
          }
          // 将真正的事件处理函数赋值给invoker.value
          invoker.value = nextValue
          // 绑定invoker作为事件处理函数
          el.addEventListener(name, invoker)
        } else {
          invoker.value = nextValue
        }
      } else if(invoker) {
        el.removeEventListener(name, invoker)
      }
    } else if (key === 'class') {
      el.className = nextValue || ''
    } else if (shouldSetAsProps(el, key, nextValue)) {
      const type = typeof el[key]
      if (type === 'boolean' && nextValue === '') {
        el[key] = true
      } else {
        el[key] = nextValue
      }
    } else {
      el.setAttribute(key, nextValue)
    }
  }
```

### 事件冒泡与更新时机的问题

**绑定事件处理函数发生在事件冒泡之前**

事件触发的时间要早于事件处理函数被绑定的时间。当一个事件触发时，目标元素上还没有绑定相关的事件处理函数，可以根据这个特点来解决问题：**屏蔽所有绑定时间晚于事件触发时间的事件处理函数的执行**。

```js
patchProps(el, key, preValue, nextValue) {
    // 匹配以on开头的属性，视其为事件
    if (/^on/.test(key)) {
      const invokers = el._vei || (el._vei = {})
      // 获取为该元素伪造的事件处理函数 invoker
      let invoker = invokers[key]
      const name = key.slice(2).toLowerCase()
      if (nextValue) {
        if (!invoker) {
          // 如果没有invoker，则将一个伪造的invoker缓存到el._vei中
          // vei是vue event invoker的首字母缩写
          invoker = el._vei[key] = (e) => {
            if (e.timeStamp < invoker.attached) return // [!code ++]
            // 当伪造的事件处理函数执行时，会执行真正的事件处理函数
            // 如果invoker.value 是数组，则遍历它并逐个调用事件处理函数
            if (Array.isArray(invoker.value)) {
              invoker.value.forEach(fn => fn(e))
            } else {
              invoker.value(e)
            }
          }
          // 将真正的事件处理函数赋值给invoker.value
          invoker.value = nextValue
          invoker.attached = performance.now() // [!code ++]
          // 绑定invoker作为事件处理函数
          el.addEventListener(name, invoker)
        } else {
          invoker.value = nextValue
        }
      } else if (invoker) {
        el.removeEventListener(name, invoker)
      }
    } else if (key === 'class') {
      el.className = nextValue || ''
    } else if (shouldSetAsProps(el, key, nextValue)) {
      const type = typeof el[key]
      if (type === 'boolean' && nextValue === '') {
        el[key] = true
      } else {
        el[key] = nextValue
      }
    } else {
      el.setAttribute(key, nextValue)
    }
  }
```

### 更新子节点

新旧节点分别有一下三种类型

- 没有子节点
- 文本子节点
- 一组子节点

```js
function patchElement(n1, n2) {
  const el = n2.el = n1.el
  const oldProps = n1.props
  const newProps = n2.props
  for (const key in newProps) {
    if (newProps[key] !== oldProps[key]) {
      patchProps(el, key, oldProps[key], newProps[key])
    }
  }
  for (const key in oldProps) {
    if (!(key in newProps)) {
      patchProps(el, key, oldProps[key], null)
    }
  }

  patchChildren(n1, n2, el)
}

function patchChildren(n1, n2, container) {
  // 判断新子节点的类型是否是文本节点
  if (typeof n2.children === 'string') {
    // 旧子节点的类型有三种可能：没有子节点、文本子节点以及一组子节点
    // 只有当旧子节点为一组子节点时，才需要逐个卸载，其他情况下什么都不需要做
    if (Array.isArray(n1.children)) {
      n1.children.forEach((c) => unmount(c))
    }
    // 最后将新的文本节点内容设置给容器元素
    setElementText(container, n2.children)
  } else if (Array.isArray(n2.children)) {
    // 新子节点是一组子节点

    // 判断旧子节点是否也是一组子节点
    if (Array.isArray(n1.children)) {
      // 新旧节点都是一组子节点，diff算法
      // 将旧的一组子节点全部卸载
      n1.children.forEach(c => unmount(c))
      // 再将新的一组子节点全部挂载到容器中
      n2.children.forEach(c => patch(null, c, container))
    } else {
      // 旧子节点要么是文本子节点，要不不存在
      // 无论哪种情况，都需要将容器清空，然后将新的一组子节点逐个挂载
      setElementText(container, '')
      n2.children.forEach(c => patch(null, c, container))
    }
  } else {
    // 新子节点不存在
    // 旧子节点是一组子节点，只需逐个卸载即可
    if(Array.isArray(n1.children)) {
      n1.children.forEach(c => unmount(c))
    } else if(typeof n1.children === 'string') {
      // 旧子节点是文本子节点，清空内容即可
      setElementText(container, '')
    }
    // 若没有旧子节点，什么都不需要做
  }
}

```

### 文本节点和注释节点

如何用虚拟DOM描述更多类型的真实DOM。

```html
<div><!-- 注释节点 --> 我是文本节点</div>
```

注释节点和文本节点不同于普通标签节点，它们不惧有标签名称，所以需要人为创造一些唯一的标识，并将其作为注释节点和文本节点的type属性值。

```js
// 文本节点的type标识
const Text = Symbol()

const newVnode = {
  // 描述文本节点
  type: Text,
  children: '我是文本内容'
}

// 注释节点的type标识
const Comment = Symbol()

const newVnode = {
  // 描述注释节点
  type: Comment,
  children: '我是注释内容'
}
```

```js
function createRenderer(options) {
  const {
    createElement,
    insert,
    setElementText,
    patchProps,
    createText, // [!code ++]
    setText, // [!code ++]
    createComment, // [!code ++]
    setComment // [!code ++]
  } = options
  function patch(n1, n2, container) {
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
        mountElement(n2, container)
      } else {
        // n1 存在，意味着打补丁，
        patchElement(n1, n2)
      }
    } else if (type === Text) { // [!code ++]
      // 如果新的vnode的类型是Text，则说明该vnode描述的是文本节点 // [!code ++]

      // 如果没有旧节点，则进行挂载 // [!code ++]
      if (!n1) { // [!code ++]
        // 使用createTextNode 创建文本节点 // [!code ++]
        const el = n2.el = createText(n2.children) // [!code ++]
        // 将文本节点插入到容器中 // [!code ++]
        insert(el, container) // [!code ++]
      } else { // [!code ++]
        // 如果旧vnode存在，只需要使用新文本节点的文本内容更新旧文本节点即可 // [!code ++]
        const el = n2.el = n1.el // [!code ++]
        if (n2.children !== n1.children) { // [!code ++]
          setText(el, n2.children) // [!code ++]
        } // [!code ++]
      } // [!code ++]
    } else if (type === Comment) { // [!code ++]
      if (!n1) { // [!code ++]
        const el = n2.el = createComment(n2.children) // [!code ++]
        insert(el, container) // [!code ++]
      } else { // [!code ++]
        const el = n2.el = n1.el // [!code ++]
        if (n2.children !== n1.children) { // [!code ++]
          setComment(el, n2.children) // [!code ++]
        } // [!code ++]
      } // [!code ++]
    } // [!code ++]
    else if (typeof type === 'object') {
      // 组件
    } else if (type === 'xxx') {
      // 其他类型的vnode
    }

  }

  function unmount(vnode) {
    const parent = vnode.el.parentNode
    if (parent) {
      parent.removeChild(vnode.el)
    }
  }

  function render(vnode, container) {
    if (vnode) {
      patch(container._vnode, vnode, container)
    } else {
      if (container._vnode) {
        unmount(vnode)
        // 根据vnode获取要卸载的真实DOM元素
        const el = container._vnode.el
        // 获取el的父元素
        const parent = el.parentNode
        // 调用removeChild移除元素
        if (parent) {
          parent.removeChild(el)
        }
      }
    }
    container._vnode = vnode
  }

  function mountElement(vnode, container) {
    // 创建DOM元素
    const el = vnode.el = createElement(vnode.type)
    // 处理子节点，如果子节点是字符串，代表元素具有文本节点
    if (typeof vnode.children === 'string') {
      setElementText(el, vnode.children)
    } else if (Array.isArray(vnode.children)) {
      // 如果childern是数组，则遍历每一个子节点，并调用patch函数挂载它们
      vnode.children.forEach(child => {
        patch(null, child, el)
      })
    }

    if (vnode.props) {
      for (const key in vnode.props) {
        patchProps(el, key, null, vnode.props[key])
      }
    }
    // 将元素添加到容器中
    insert(el, container)
  }

  return {
    render
  }
}

// 创建一个渲染器
const renderer = createRenderer({
  createElement(tag) {
    return document.createElement(tag)
  },
  setElementText(el, text) {
    el.textContent = text
  },
  insert(el, parent, anchor = null) {
    parent.insertBefore(el, anchor)
  },
  patchProps(el, key, preValue, nextValue) {
    // 匹配以on开头的属性，视其为事件
    if (/^on/.test(key)) {
      const invokers = el._vei || (el._vei = {})
      // 获取为该元素伪造的事件处理函数 invoker
      let invoker = invokers[key]
      const name = key.slice(2).toLowerCase()
      if (nextValue) {
        if (!invoker) {
          // 如果没有invoker，则将一个伪造的invoker缓存到el._vei中
          // vei是vue event invoker的首字母缩写
          invoker = el._vei[key] = (e) => {
            if (e.timeStamp < invoker.attached) return
            // 当伪造的事件处理函数执行时，会执行真正的事件处理函数
            // 如果invoker.value 是数组，则遍历它并逐个调用事件处理函数
            if (Array.isArray(invoker.value)) {
              invoker.value.forEach(fn => fn(e))
            } else {
              invoker.value(e)
            }
          }
          // 将真正的事件处理函数赋值给invoker.value
          invoker.value = nextValue
          invoker.attached = performance.now()
          // 绑定invoker作为事件处理函数
          el.addEventListener(name, invoker)
        } else {
          invoker.value = nextValue
        }
      } else if (invoker) {
        el.removeEventListener(name, invoker)
      }
    } else if (key === 'class') {
      el.className = nextValue || ''
    } else if (shouldSetAsProps(el, key, nextValue)) {
      const type = typeof el[key]
      if (type === 'boolean' && nextValue === '') {
        el[key] = true
      } else {
        el[key] = nextValue
      }
    } else {
      el.setAttribute(key, nextValue)
    }
  },
  createText(text) { // [!code ++]
    return document.createTextNode(text) // [!code ++]
  }, // [!code ++]
  setText(el, text) { // [!code ++]
    el.nodeValue = text // [!code ++]
  }, // [!code ++]
  createComment(text) { // [!code ++]
    return document.createComment(text) // [!code ++]
  }, // [!code ++]
  setComment(el, comment) { // [!code ++]
    el.nodeValue = comment // [!code ++]
  } // [!code ++]
})

```

### Fragment (片断)

```js
const Fragment = Symbol()

const vnode = {
  type: Fragment,
  children: [
    { type: 'li', children: 'text1' },
    { type: 'li', children: 'text2' },
    { type: 'li', children: 'text3' },
  ]
}
```

片段也没有所谓的标签名称，所以也需要为片段创建唯一的标识，即Fragment。对于Fragment类型的vnode来说，它的children存储的内容就是模版中所有跟节点。

```js
function patch(n1, n2, container) {
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
        mountElement(n2, container)
      } else {
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
    } else if (type === Fragment) { // [!code ++]
      if (!n1) { // [!code ++]
        // 如果旧vnode不存在，则只需要将Fragment的children逐个挂载即可 // [!code ++]
        n2.children.forEach(c => patch(null, c, container)) // [!code ++]
      } else { // [!code ++]
        // 如果旧vnode存在，则只需要更新Fragment的children即可 // [!code ++]
        patchChildren(n1, n2, container) // [!code ++]
      }
    }
    else if (typeof type === 'object') {
      // 组件
    } else if (type === 'xxx') {
      // 其他类型的vnode
    }

  }

  function unmount(vnode) {
    if (vnode.type === Fragment) { // [!code ++]
      vnode.children.forEach(c => unmount(c)) // [!code ++]
      return // [!code ++]
    } // [!code ++]
    const parent = vnode.el.parentNode
    if (parent) {
      parent.removeChild(vnode.el)
    }
  }
```
