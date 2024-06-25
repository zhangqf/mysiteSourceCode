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

## 响应丢失问题

普通对象不具有任何的响应式能力。

解决思路：将响应式数据转换成类似于`ref` 结构的数据。

```js
const obj = reactive({foo:1, bar:2})
// newObj对象具有与obj对象同名的属性，并且每个属性值都是一个对象
// 该对象具有一个访问属性value，当读取value的值时，其实读取的时obj对象下相应的属性值
const newObj = {
  foo: {
    get value() {
      return obj.foo
    }
  },
  bar: {
    get value() {
      return obj.bar
    }
  }
}
```

```js
function toRef(obj, key) {
  const wrapper = {
    get value() {
      return obj[key]
    }，
    set value(val) {
      obj[key] = val
    }
  }
  Object.defineProperty(wrapper, '__v_isRef', {
    value: true
  })
  return wrapper
}

function toRefs(obj) {
  const ret = {}
  for (const key in obj) {
    ret[key] = toRef(obj, key)
  }
  return ret
}


```

## 自动脱ref

虽然`toRefs`函数解决了响应丢失问题。但是`toRefs` 会把响应式数据的第一层属性值转换为`ref`， 因此必须通过`value`属性访问值。

```js
const obj1 = reactive({foo:2, bar:4})

console.log(obj1.foo)
console.log(obj1.bar)

const newObj1 = {...toRefs(obj1)}

console.log(newObj1.foo.value)
console.log(newObj1.bar.value)
```

每次使用都需要`foo.value`，自动脱`ref` ，指的是属性的访问行为。即如果读取一个属性是一个ref，则直接将该ref对应的`value`属性值返回

```js
function proxyRefs(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver)
      return value.__v_isRef ? value.value : value
    },
    set(target, ket, newValue, receiver) {
      const value = target[key]
      if(value.__v_isRef) {
        value.value = newValue
        return true
      }
      return Reflect.set(target, key, newValue, receiver)
    }
  })
}

const newObj2 = proxyRefs({ ...toRefs(obj1) })
```
