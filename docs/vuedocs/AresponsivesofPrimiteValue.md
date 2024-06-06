---
editLink: false
---
# 原始值的响应式方案

指的是`Boolean` `Number` `BigInt` `String` `Symbol` `undefined` `null` 等类型的值。原始值是按值传递的，而非引用传递。如果一个函数接收原始值作为参数，这个形参与实参之间没有引用关系，是两个完全独立的值。

Javascript中的Proxy无法提供对原始值的代理，因此想要将原始值变成响应式数据，就必须对其做一层包裹。

## ref

```js
function ref(val) {
  const wrapper = {
    value: val
  }
  return reactive(wrapper)
}

const refVal = ref(1)
effect(() => {
  console.log(refVal.value)
})

refVal.value = 2
```

### 自动脱ref

如何区分一个值到底是原始值的包裹对象，还是一个非原始值的响应式数据。

```js
function ref(val) {
  const wrapper = {
    value: val
  }
  Object.defineProperty(wrapper, '__v_isRef', { // [!code ++]
    value: true // [!code ++]
  }) // [!code ++]
  return reactive(wrapper)
}
```

使用`Object.defineProperty` 为包裹对象`wrapper` 定义一个不可枚举且不可读写的属性`__v_isRef`，只为`true` ，代表这个对象是一个`ref`，而非普通对象。 后续可以通过检查`__v_isRef`属性来判断一个数据是否是`ref`。

- **Object.defineProperty定义的属性其默认值如下**


  不可读写、不可枚举、不可配置、没有`getter` 和`setter`

  * `value`: `undefined`
  * `writable`: `false`
  * `enumerable`: `false`
  * `configurable`: `false`
  * `get`: `undefined`
  * `set`: `undefined`
