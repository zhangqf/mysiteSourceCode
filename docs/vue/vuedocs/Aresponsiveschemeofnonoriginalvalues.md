---
editLink: false
---
# 非原始值的响应式方案

proxy 只能够代理对象的基本语义

```js
const fn = (name) => {
  console.log(name)
}

const obj = { foo: 1 }
const p1 = new Proxy(obj, {
  get(target, key) {
    return target[key] * 2
  },
  set(target, key, value) {
    target[key] = value
  }
})
console.log(p1.foo) // 2
p1.foo++
console.log(p1.foo) // 6
const p = new Proxy(fn, {
  apply(target, thisArg, argArray) {
    target.call(thisArg, ...argArray)
  }
})

p('ywszrsqx') //  ywszrsqx
```

Reflect是一个全局对象

```js
console.log(obj.foo) // 3
console.log(Reflect.get(obj, 'foo')) //3
// Reflect.get 的第三个参数，如果target对象中指定了getter，receiver则为getter调用时的this值。
```

如何区分一个对象时普通对象还是函数呢

通过内部方法和内部槽来区分对象，函数对象会部署内部方法 `[[Call]]`,而普通对象则不会。


| 内部方法              | 签名                                            | 描述                                                                                                                                                                                             |
| --------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [[GetPrototypeOf]]    | () -> Object｜Null                              | 查明为该对象提供继承的对象，null代表没有继承属性                                                                                                                                                 |
| [[SetPrototypeOf]]    | （Object｜Null）-> Boolean                      | 该对象与提供继承属性的另一对象相关联。传递null表示没有属性，返回true表示操作成功完成，返回false表示操作失败                                                                                      |
| [[IsExtensible]]      | () -> Boolean                                   | 查明是否允许向该对象添加其他属性                                                                                                                                                                 |
| [[PreventExtensions]] | () -> Boolean                                   | 控制能否向该对象添加新属性。如果操作成功则返回true，如果操作失败则返回false                                                                                                                      |
| [[GetOwnProperty]]    | (propertyKey) -> Undefined｜Property Descriptor | 返回该对象自身属性的描述符，其键为propertyKey，如果不存在这样的属性，则返回undefined                                                                                                             |
| [[DefineOwnProperty]] | (propertyKey, PropertyDescriptor) -> Boolean    | 创建或更改自己的属性，其键为propertyKey，以具有由PropertyDescriptor描述的状态。如果该属性已成功创建或更新，则返回true；如果无法创建或更新该属性，则返回false                                     |
| [[HasProperty]]       | (propertyKey) -> Boolean                        | 返回一个布尔值，指示该对象是否已经拥有键为propertyKey的自己的或继承的属性                                                                                                                        |
| [[Get]]               | (propertyKey, Receiver) -> any                  | 从该对象返回键为propertyKey的属性的值。如果必须运行ECMAScript代码来检索属性值，则在运行代码时使用Receiver作为this值                                                                              |
| [[Set]]               | (propertyKey, value, Receiver) -> Boolean       | 将键值为propertyKey的属性的值设置为value。如果必须运行ECMAscript代码来射设置属性值，则在运行代码时使用Receiver作为this值。如果成功设置了属性值，则返回true；如果无法设置，则返回false            |
| [[Delete]]            | (propertyKey) -> Boolean                        | 从该对象中删除属于自身的键为propertyKey的属性。如果该属性未被删除并且仍然存在，则返回false；如果该属性已被删除或不存在，则返回true                                                               |
| [[OwnPropertyKeys]]   | () -> List of propertyKey                       | 返回一个List，其元素都是对象自身的属性键                                                                                                                                                         |
| [[Call]]              | (any, a list of any) -> any                     | 将运行的代码与this对象关联。由函数调用触发。该内部方法的参数是一个this值和参数列表                                                                                                               |
| [[Construct]]         | (a list of any, Object) -> Object               | 创建一个对象。通过new运算符或super调用触发。该内部方法的第一个参数是一个List，该List的元素是构造函数调用或super调用的参数，第二个参数是最初应用new运算符的对象。实现该内部方法的对象称为构造函数 |

内部方法具有多态性。不同类型的对象可能部署相同的内部方法，但却具有不同的逻辑。

**常规对象**

- 表中的内部方法，必须使用ECMA规范10.1.x节给出的定义实现
- 内部方法[[Call]],必须使用ECMA规范10.2.1节给出的定义实现
- 内部方法[[Construct]], 必须使用ECMA规范10.2.2节给出定义实现

**异质对象**

除常规对象之外的对象都是异质对象。

proxy对象就是一个异质对象

**Proxy对象部署的所有内部方法**


| 内部方法              | 处理器函数               |
| --------------------- | ------------------------ |
| [[GetPrototypeOf]]    | getPrototypeOf           |
| [[SetPrototypeOf]]    | setPrototypeOf           |
| [[IsExtensible]]      | isExtensible             |
| [[PreventExtensions]] | PreventExtensions        |
| [[GetOwnProperty]]    | getOwnPropertyDescriptor |
| [[DefineOwnProperty]] | defineProperty           |
| [[HasProperty]]       | has                      |
| [[Get]]               | get                      |
| [[Set]]               | set                      |
| [[Delete]]            | deleteProperty           |
| [[OwnPropertyKeys]]   | ownKeys                  |
| [[Call]]              | apply                    |
| [[Construct]]         | construct                |

```js
const obj2 = { foo: 3 }
const p2 = new Proxy(obj2, {
  deleteProperty(target, key) {
    return Reflect.deleteProperty(target, key)
  },
  has(target, key) {
    return key in target
  }
})
// 这个实际上调用的是对象内部的方法[[hasProperty]] 包括自己的或者是继承的
console.log('foo' in p2) 
// 这个只能查找自身是否有对应的属性
console.log(obj2.hasOwnProperty('foo'))
console.log(p2.foo) // 3
delete p2.foo
console.log(p2.foo) // undefined
```

## 如何代理Object

使用内部方法`[[HasProperty]]`，这个内部方法对应的拦截函数为`has`

一个普通对象的所有可能的读取操作：

- 访问属性
- 判读对象或原型上是否存在给定的key： key in obj
- 使用`for ... in ` 循环遍历对象： for (const key in obj){}

### 拦截--访问属性

```js
const obj = { foo: 1 }
const p = new Proxy(obj, {
  get(target, key, receiver) {
    track(target, key)
    return Reflect.get(target, key, receiver)
  }
})

console.log(p.foo)
```

### 拦截 -- in 操作符

```js
const obj = { foo: 1 }
const p = new Proxy(obj, {
  get(target, key, receiver) {
    track(target, key)
    return Reflect.has(target, key)
  }
})

effect(() => {
  console.log('foo' in p)
})
```

### 拦截 for ... in

```js
const obj = { foo: 1 }
const ITERATE_KEY = Symbol()
const p = new Proxy(obj, {
  ownKeys(target) {
    track(target, ITERATE_KEY)
    return Reflect.ownKeys(target)
  }
})

effect(() => {
  for (const key in p) {
    console.log(key)
  }
})
p.bar = 6
p.fnNum = 99
```

`for...in` 的实现

当执行 `for (const key in p)` 时，JavaScript 引擎会先调用 `p` 的内部 `[[OwnPropertyKeys]]` 方法,以获取对象自身的所有属性键，所以使用`ownKeys`拦截。

`ownKeys`拦截函数与`get/set`拦截函数不同，在`ownkeys`中只能拿到目标对象`target`。不能够知道当前操作哪一个属性，也就不能与副作用函数之间建立联系。所以，就构造一个唯一的key`ITERATE_KEY`。这里使用`ITERATE_KEY`来代替`get/set`中使用属性作为`key`与副作用函数建立联系。

#### 添加属性

```js
function trigger(target, key) {
  const depsMap = bucket.get(target)
  console.log(bucket)
  if (!depsMap) return
  // 取得与key相关联的副作用函数
  const effects = depsMap.get(key)
  // 取得与INTERATE_KEY相关联的副作用函数 // [!code ++]
  const iterateEffects = depsMap.get(ITERATE_KEY) // [!code ++]

  const effectToRun = new Set()
  effects && effects.forEach(effectFn => {
    if (effectFn !== activeEffect) {
      effectToRun.add(effectFn)
    }
  })
  // 将与ITERATE_KEY相关联的副作用函数也添加到effectsToRun // [!code ++]
  iterateEffects && iterateEffects.forEach(effectFn => { // [!code ++]
    if (effectFn != activeEffect) { // [!code ++]
      effectToRun.add(effectFn) // [!code ++]
    } // [!code ++]
  }) // [!code ++]

  effectToRun.forEach(effectFn => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn)
    } else {
      effectFn()
    }
  })

  // 如果在枚举（遍历）集合的过程中,除了通过迭代器自身的 remove 方法之外,有其他元素被添加到集合或从集合中删除,则枚举的行为是未定义的。
  // 下面代码会造成无限循环执行，
  // effects && effects.forEach(fn => fn())
}
```

#### 修改已有属性，不需要触发副作用函数

当设置属性操作时，在拦截函数内能够区分操作的类型

```js
function trigger(target, key, type) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  // 取得与key相关联的副作用函数
  const effects = depsMap.get(key)
  // 取得与INTERATE_KEY相关联的副作用函数 // [!code --]
  const iterateEffects = depsMap.get(ITERATE_KEY) // [!code --]

  const effectToRun = new Set()
  effects && effects.forEach(effectFn => {
    if (effectFn !== activeEffect) {
      effectToRun.add(effectFn)
    }
  })
  if (type === "ADD") { // [!code ++]
    const iterateEffects = depsMap.get(ITERATE_KEY) // [!code ++]
    // 将与ITERATE_KEY相关联的副作用函数也添加到effectsToRun //[!code ++]
    iterateEffects && iterateEffects.forEach(effectFn => {
      if (effectFn != activeEffect) {
        effectToRun.add(effectFn)
      }
    })
  } // [!code ++]


  effectToRun.forEach(effectFn => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn)
    } else {
      effectFn()
    }
  })
}
```

#### 删除属性

```js
const p = new Proxy(obj, {
  ownKeys(target) {
    track(target, ITERATE_KEY)
    return Reflect.ownKeys(target)
  },
  set(target, key, newVal, receiver) {
    // 判读目标的这个key 是否是自身拥有的，若是，则为set，不是则为 add
    const type = Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : "ADD"
    const res = Reflect.set(target, key, newVal, receiver)
    trigger(target, key, type)
    return res
  },
  deleteProperty(target, key) { // [!code ++]
    const hadkey = Object.prototype.hasOwnProperty.call(target, key) // [!code ++]
    const res = Reflect.defineProperty(target, key) // [!code ++]
    if(res && hadkey) { // [!code ++]
      trigger(target, key, 'DELETE') // [!code ++]
    } // [!code ++]
  } // [!code ++]
})
function trigger(target, key, type) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  // 取得与key相关联的副作用函数
  const effects = depsMap.get(key)
  const effectToRun = new Set()
  effects && effects.forEach(effectFn => {
    if (effectFn !== activeEffect) {
      effectToRun.add(effectFn)
    }
  })
  if (type === "ADD" || type === "DELETE") { // [!code ++]
    const iterateEffects = depsMap.get(ITERATE_KEY) 
    // 将与ITERATE_KEY相关联的副作用函数也添加到effectsToRun 
    iterateEffects && iterateEffects.forEach(effectFn => {
      if (effectFn != activeEffect) {
        effectToRun.add(effectFn)
      }
    })
  } 


  effectToRun.forEach(effectFn => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn)
    } else {
      effectFn()
    }
  })
}

effect(() => {
  for (const key in p) {
    console.log(key)
  }
})

p.foo = 8
p.bar = 88
p.ds = 99
delete p.ds
```

### 合理触发响应

- 当值没有发生变化时，不需要触发响应

  ```js
  set(target, key, newVal, receiver) {

      const oldVal = target[key] // [!code ++]

      // 判读目标的这个key 是否是自身拥有的，若是，则为set，不是则为 add
      const type = Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : "ADD"
      const res = Reflect.set(target, key, newVal, receiver)
      if (oldVal !== newVal) { // [!code ++]
        trigger(target, key, type) // [!code ++]
      } // [!code ++]
      return res
    },const p = new Proxy(obj, {
    ownKeys(target) {
      track(target, ITERATE_KEY)
      return Reflect.ownKeys(target)
    },
    set(target, key, newVal, receiver) {

      const oldVal = target[key] // [!code ++]

      // 判读目标的这个key 是否是自身拥有的，若是，则为set，不是则为 add
      const type = Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : "ADD"
      const res = Reflect.set(target, key, newVal, receiver)
      if (oldVal !== newVal) { // [!code ++]
        trigger(target, key, type) // [!code ++]
      } // [!code ++]
      return res
    },
    deleteProperty(target, key) {
      const hadkey = Object.prototype.hasOwnProperty.call(target, key)
      const res = Reflect.deleteProperty(target, key)
      if (res && hadkey) {
        trigger(target, key, 'DELETE')
      }
    }
  })
  ```
- NaN 情况 （NaN === NaN // false  NaN !== NaN // true）

  ```js
  set(target, key, newVal, receiver) {

      const oldVal = target[key] 

      // 判读目标的这个key 是否是自身拥有的，若是，则为set，不是则为 add
      const type = Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : "ADD"
      const res = Reflect.set(target, key, newVal, receiver)
      if (oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) { // [!code ++]
        trigger(target, key, type) 
      } 
      return res
    },
  ```
- 从原型继承的问题
  当修改执行child.bar 时，会打印两个2。
  当读取child.bar 属性时，child代理对象obj没有bar属性，所以它会获取对象obj的原型，即parent对象，最终得到的实际上时parent.bar的值。parent也是响应式数据，所以在副作用函数中访问parent.bar的值时，会导致副作用函数被收集。child.bar 与parent.bar都与副作用函数建立了响应联系

  **代理对象可以通过`raw`属性访问原始数据**

  ```js
  const obj1 = {}
  const proto = { bar: 1 }
  const child = reactive(obj1)
  const parent = reactive(proto)

  Object.setPrototypeOf(child, parent)

  console.log(child.raw === obj1)
  console.log(parent.raw === proto)

  ...
  set(target, key, newVal, receiver) {

        const oldVal = target[key]

        // 判读目标的这个key 是否是自身拥有的，若是，则为set，不是则为 add
        const type = Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : "ADD"
        const res = Reflect.set(target, key, newVal, receiver)
        if (target === receiver.raw) { // [!code ++]
          if (oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
            trigger(target, key, type)
          }
        } // [!code ++]
        return res
      },
  ...
  effect(() => {
    console.log(child.bar)
  })


  child.bar = 2
  ```

## 浅响应与深响应

深响应，读取属性值时，先检测该值是否是对象，如果是对象，则递归调用reactive函数将其包装成响应式数据并返回。

```js
get(target, key, receiver) {
      if (key === 'raw') {
        return target
      }
      track(target, key)
      const res = Reflect.get(target, key, receiver)
      if (typeof res === 'object' && res != null) { // [!code ++]
        // 调用reactive将结果包装成响应式数据并返回 // [!code ++]
        return reactive(res) // [!code ++]
      } // [!code ++]
      return res
    },
```

浅响应 、深响应 封装

```js
function createReactive(obj, isShallow = false) {
  return new Proxy (obj,{
    // 拦截读取操作
    get(target, key, receiver) {
      if(key === 'raw') {
        return target
      }
      const res = Reflect.get(target, key, receiver)
      track(target, key)
  
      if(isShallow) {
        return res
      }
      if(typeof res === 'object' && res !== null) {
        return reactive(res)
      }
    }
  })
}

function reactive(obj) {
  return createReactive(obj)
}

function shallowReactive(obj) {
  return createReactive(obj, true)
}
```

## 只读和浅只读

```js
function createReactive(obj, isShallow = false, isReadonly = false) {
  return new Proxy(obj, {
    // 拦截读取操作
    get(target, key, receiver) {
      if (key === 'raw') {
        return target
      }
      const res = Reflect.get(target, key, receiver)
      if (!isReadonly) { // [!code ++]
        track(target, key)
      }// [!code ++]

      if (isShallow) {
        return res
      }
      if (typeof res === 'object' && res !== null) {
        return isReadonly ? readonly(res) :reactive(res) // [!code ++]
      }
    },
    set(target, key, newVal, receiver) {
      if (isReadonly) { // [!code ++]
        console.warn(`属性${key}是只读的`) // [!code ++]
        return true // [!code ++]
      } // [!code ++]
      const oldVal = target[key]
      const type = Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'
      const res = Reflect.set(target, key, newVal, receiver)

      if (target === receiver.raw) {
        if (oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
          trigger(target, key, type)
        }
      }
      return res
    },
    deleteProperty(target, key) {
      if (isReadonly) { // [!code ++]
        console.warn(`属性${key}是只读的`) // [!code ++]
        return true // [!code ++]
      } // [!code ++]
      const hadkey = Object.prototype.hasOwnProperty.call(target, key)
      const res = Reflect.deleteProperty(target, key)
      if (res && hadkey) {
        trigger(target, key, 'DELETE')
      }
      return res
    }
  })
}

function readonly(obj) { // [!code ++]
  return creaeteReactive(obj, false, true) // [!code ++]
} // [!code ++]

function shallowReadonly(obj) { // [!code ++]
  return createReactive(obj, true, true) // [!code ++]
} // [!code ++]

```

## 代理数组

数组是特殊的对象，它有多特殊呢？

**数组是一个异质对象**
因为`[[DefineOwnProperty]]`内部方法与常规对象不同。
数组对象除了`[[DefineOwnProperty]]`这个内部方法之外，其他内部方法的逻辑都与常规对象相同。

```js
const arr = reactive(['foo'])

effect(() => {
  console.log(arr[0])
})

arr[0] = 'bar'
```

当通过索引读取或设置数组元素的值时，代理对象的`get/set`拦截函数也会执行。

### 数组的读取操作

- 通过索引访问数组元素值：arr[0]
- 访问数组的长度：arr.length
- 把数组作为对象，使用for...in循环遍历
- 使用for...of迭代遍历数组
- 数组的原型方法，`concat` `join` `every` `some` `find` `findIndex` `includes`等，以及其他所有**不改变原数组**的原型方法

### 数组元素的设置操作

- 通过索引修改数组元素的值： arr[1] = 2
- 修改数组长度：arr.length = 0
- 数组的栈方法：`push` `pop` `shift` `unshift`
- 修改原数组的原型方法：`splice` `fill` `sort`

### 数组的索引与length

通过索引设置数组的元素值与设置对象的属性值仍然存在根本的不同，数组对象部署的内部方法`[[DefineOwnProperty]]`不同与常规对象。

当通过索引设置数组元素时，会执行数组对象所部署的内部方法`[[Set]]`。但是在`[[DefineOwnProperty]]`的逻辑定义规范中，当设置的索引值大于数组当前的长度，那么要更新数组的`length`属性。所以当通过索引设置元素值时，可能会隐式地修改`length`属性。因此在触发响应时，应该触发与`length`属性相关联的副作用函数重新执行。

```js
function createReactive(obj, isShallow = false, isReadonly = false) {
  return new Proxy(obj, {
    // 拦截读取操作
    get(target, key, receiver) {
      if (key === 'raw') {
        return target
      }
      if (!isReadonly) {
        track(target, key)
      }
      const res = Reflect.get(target, key, receiver)

      if (isShallow) {
        return res
      }
      if (typeof res === 'object' && res !== null) {
        return isReadonly ? readonly(res) : reactive(res)
      }
      return res
    },
    set(target, key, newVal, receiver) {
      if (isReadonly) {
        console.warn(`属性${key}是只读的`)
        return true
      }
      const oldVal = target[key]
      const type = Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD' // [!code --]
      // 如果属性不存在，则是添加属性，否则是设置已有属性 // [!code ++]
      // 如果代理目标是数组，则检测被设置的索引值是否小于数组长度，如果是，则为SET，否则为ADD  // [!code ++]
      const type = Array.isArray(target)   // [!code ++] 
      ? Number(key) < target.length ? 'SET' : 'ADD'  // [!code ++]
      : Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'  // [!code ++]
      const res = Reflect.set(target, key, newVal, receiver)

      if (target === receiver.raw) {
        if (oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
          trigger(target, key, type)
        }
      }
      return res
    },
    deleteProperty(target, key) {
      if (isReadonly) {
        console.warn(`属性${key}是只读的`)
        return true
      }
      const hadkey = Object.prototype.hasOwnProperty.call(target, key)
      const res = Reflect.deleteProperty(target, key)
      if (res && hadkey) {
        trigger(target, key, 'DELETE')
      }
      return res
    }
  })
}
function trigger(target, key, type) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  // 取得与key相关联的副作用函数
  const effects = depsMap.get(key)
  const effectToRun = new Set()
  effects && effects.forEach(effectFn => {
    if (effectFn !== activeEffect) {
      effectToRun.add(effectFn)
    }
  })
  if (type === "ADD" || type === "DELETE") { 
    const iterateEffects = depsMap.get(ITERATE_KEY)
    // 将与ITERATE_KEY相关联的副作用函数也添加到effectsToRun 
    iterateEffects && iterateEffects.forEach(effectFn => {
      if (effectFn != activeEffect) {
        effectToRun.add(effectFn)
      }
    })
  }

// 当操作类型为ADD并且目标对象是数组时，应该取出并执行那些与length属性相关的副作用函数 // [!code ++]
  if (type === 'ADD' && Array.isArray(target)) {  // [!code ++]
    // 取出与length相关联的副作用函数 // [!code ++]
    const lengthEffects = depsMap.get('length') // [!code ++]
    lengthEffects && lengthEffects.forEach(effectFn => { // [!code ++]
      if (effectFn !== activeEffect) { // [!code ++]
        effectToRun.add(effectFn) // [!code ++]
      } // [!code ++]
    }) // [!code ++]
  } // [!code ++]

  effectToRun.forEach(effectFn => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn)
    } else {
      effectFn()
    }
  })
}

const arr = reactive(['foo'])

effect(() => {
  console.log(arr.length)
})
arr[1] = 'bar'
```

修改`length`属性，也会隐式地影响数组的元素

只有那些索引值大于或等于新的`length` 属性值的元素才需要触发响应。

```js
...
    set(target, key, newVal, receiver) {
      if (isReadonly) {
        console.warn(`属性${key}是只读的`)
        return true
      }
      const oldVal = target[key]
      // 如果属性不存在，则是添加属性，否则是设置已有属性 
      // 如果代理目标是数组，则检测被设置的索引值是否小于数组长度，如果是，则为SET，否则为ADD  
      const type = Array.isArray(target)   
        ? Number(key) < target.length ? 'SET' : 'ADD'  
        : Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'  
      const res = Reflect.set(target, key, newVal, receiver)

      if (target === receiver.raw) {
        if (oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
          trigger(target, key, type) // [!code --]
          //增加第四个参数，即触发响应的新值 // [!code ++]
          trigger(target, key, type, newVal) // [!code ++]
        }
      }
      return res
    },
...
function trigger(target, key, type, newVal) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  // 取得与key相关联的副作用函数
  const effects = depsMap.get(key)
  const effectToRun = new Set()
  effects && effects.forEach(effectFn => {
    if (effectFn !== activeEffect) {
      effectToRun.add(effectFn)
    }
  })
  if (type === "ADD" || type === "DELETE") {
    const iterateEffects = depsMap.get(ITERATE_KEY)
    // 将与ITERATE_KEY相关联的副作用函数也添加到effectsToRun 
    iterateEffects && iterateEffects.forEach(effectFn => {
      if (effectFn != activeEffect) {
        effectToRun.add(effectFn)
      }
    })
  }
  // 当操作类型为ADD并且目标对象是数组时，应该取出并执行那些与length属性相关的副作用函数 
  if (type === 'ADD' && Array.isArray(target)) {
    // 取出与length相关联的副作用函数 
    const lengthEffects = depsMap.get('length')
    lengthEffects && lengthEffects.forEach(effectFn => {
      if (effectFn !== activeEffect) {
        effectToRun.add(effectFn)
      }
    })
  }

  // 如果操作目标是数组，并且修改了数组的length属性  // [!code ++]
  if (Array.isArray(target) && key === 'length') { // [!code ++]
    // 对于索引大于或等于length值的元素，需要把所有相关联的副作用函数取出并添加到effectToRun中待执行 // [!code ++]
    depsMap.forEach((effects, key) => { // [!code ++]
      if (key >= newVal) { // [!code ++]
        effects.forEach(effectFn => { // [!code ++] 
          effectToRun.add(effectFn) // [!code ++]
        }) // [!code ++]
      } // [!code ++]
    }) // [!code ++]
  } // [!code ++]

  effectToRun.forEach(effectFn => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn)
    } else {
      effectFn()
    }
  })
}

const arr = reactive(['foo'])

effect(() => {
  console.log(arr[0])
})

arr.length = 0
```

### 遍历数组

数组也是对象，同样也可以使用`for...in`循环遍历。

对于一个普通对象来说，只有当添加或删除属性值时，才会影响`for...in`循环等结果。即当添加或删除属性操作时，需要取出与`ITERATE_KEY`相关联的副作用函数重新执行。对应数组来说，添加新元素或是修改数组长度会影响`for...in`循环遍历，即修改了数组的`length`属性，就会影响遍历的结果。

```js
const arr = reactive(['foo'])

effect(() => {
  for(const key in arr) {
    console.log(key)
  }
})
...
   ownKeys(target){
      // 如果操作目标targer是数组，则使用lenght属性作为key并建立响应联系
      track(target, Array.isArray(target) ? 'length': ITERATE_KEY)
      return Reflect.ownKeys(target)
    },
...
```

应避免使用`for...in`循环遍历数组

1. **不保证遍历顺序**:
   `for...in`循环主要是为遍历对象属性而设计的,它不能保证遍历数组元素的顺序,这可能会导致意料之外的结果。数组是有序集合,遍历顺序通常很重要。
2. **会遍历到原型链上的属性**:
   `for...in`循环会遍历对象自身的可枚举属性,以及其原型链上的可枚举属性。这意味着,如果数组的原型上有额外的属性,它们也会被遍历到,这可能会导致意外的行为。
3. **性能问题**:
   相比其他遍历方法,`for...in`循环通常性能较差。这是因为它需要检查原型链上的每个属性,而不是直接访问数组元素。
4. **无法遍历稀疏数组**:
   `for...in`循环无法正确处理数组中的空元素或删除的元素。它会跳过这些元素,这可能会导致问题。


### 遍历可迭代的对象

`for...of`是用来遍历可迭代对象的。

根据ES2015为Javascript定义的迭代协议，

一个对象能否被迭代，取决于该对象或者该对象的原型是否实现了`@@iterator`方法。`@@iterator`指的是`Symbol.iterator`这个值。如果一个对象实现了`Symbol.iterator`方法，那么这个对象就是可迭代的。

```js
const obj4 = {
  val: 0,
  [Symbol.iterator]() {
    return {
      next() {
        return {
          value: obj4.val++,
          done: obj4.val > 10 ? true : false
        }
      }
    }
  }
}
for (const value of obj4) {
  console.log(value)
}
const arr1 = [1, 2, 3, 4]
const itr = arr1[Symbol.iterator]()
console.log(itr.next().value)
arr[Symbol.iterator] = function() {
  const target = this
  const len = target.length
  let index = 0
  return {
    next() {
      return {
        value: index < len ? target[index] : undefined,
        done: index++ >= len
      }
    }
  }
}
```

只有在副作用函数与数组的长度和索引之间建立响应联系，就能够实现响应式的`for...of`迭代。之前的代码中已经建立了数组长度和索引之间的响应联系，故可以实现此效果。

不应该在副作用函数与`Symbol.iterator`这类symbol值之间建立响应联系

```js
 // 拦截读取操作
    get(target, key, receiver) {
      if (key === 'raw') {
        return target
      }
      if (!isReadonly ) { // [!code --]
      if (!isReadonly && key !== 'symbol') { // [!code ++]
        track(target, key)
      }
      const res = Reflect.get(target, key, receiver)

      if (isShallow) {
        return res
      }
      if (typeof res === 'object' && res !== null) {
        return isReadonly ? readonly(res) : reactive(res)
      }
      return res
    },
```

### 数组的查找方法

`includes` 不按预期的工作，如下：

```js

const objarr = {}
const arrobj = reactive([objarr])

console.log(arrobj.includes(arrobj[0])) //false
```

这是因为`arrobj.includes(arrobj[0])`，`arrobj[0]`得到的是一个代理对象，`includes`方法内部也会通过arrobj访问数组元素，从而也得到一个代理对象，这两个代理对象是不同的。每次调用`reactive`函数时都会创建一个新的代理对象。

即使参数相同，每次调用`reactive`函数时，也都会创建新的代理对象。

```js
function reactive(obj) {
  const existionProxy = reactiveMap.get(obj) // [!code ++]
  if(existionProxy) return existionProxy // [!code ++]
  const proxy = createReactive(obj) // [!code ++]
  reactiveMap.set(obj, proxy) // [!code ++]
  return proxy // [!code ++]
  return createReactive(obj) // [!code --]
}

```

```js
const obj = {}
const arr = reactive([obj])
console.log(arr.includes(obj)) // false
```

在`includes`内部的`this`指向的是代理对象arr，并且在获取数组元素时得到的值也是代理对象，所以拿原始对象`obj`去查找肯定查不到，故放回`false`

```js
function createReactive(obj, isShallow = false, isReadonly = false) {
  return new Proxy(obj, {
    ownKeys(target) {
      // 如果操作目标targer是数组，则使用lenght属性作为key并建立响应联系
      track(target, Array.isArray(target) ? 'length' : ITERATE_KEY)
      return Reflect.ownKeys(target)
    },
    // 拦截读取操作
    get(target, key, receiver) {
      if (key === 'raw') {
        return target
      }
      // 如果操作的目标对象是数组，并且key存在与arrayInstrumentation上 // [!code ++]
      // 那么返回定义在arrayInstrumentation上的值 // [!code ++]
      if(Array.isArray(target) && arrayInstrumentations.hasOwnProperty(key)) { // [!code ++]
        return Reflect.get(arrayInstrumentations, key, receiver) // [!code ++]
      } // [!code ++]
      if (!isReadonly && typeof key !== 'symbol') {
        track(target, key)
      }
      const res = Reflect.get(target, key, receiver)

      if (isShallow) {
        return res
      }
      if (typeof res === 'object' && res !== null) {
        return isReadonly ? readonly(res) : reactive(res)
      }
      return res
    },
    set(target, key, newVal, receiver) {
      if (isReadonly) {
        console.warn(`属性${key}是只读的`)
        return true
      }
      const oldVal = target[key]
      // 如果属性不存在，则是添加属性，否则是设置已有属性 
      // 如果代理目标是数组，则检测被设置的索引值是否小于数组长度，如果是，则为SET，否则为ADD  
      const type = Array.isArray(target)
        ? Number(key) < target.length ? 'SET' : 'ADD'
        : Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'
      const res = Reflect.set(target, key, newVal, receiver)

      if (target === receiver.raw) {
        if (oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
          trigger(target, key, type) // [!code --]
          //增加第四个参数，即触发响应的新值 
          trigger(target, key, type, newVal)
        }
      }
      return res
    },
    deleteProperty(target, key) {
      if (isReadonly) {
        console.warn(`属性${key}是只读的`)
        return true
      }
      const hadkey = Object.prototype.hasOwnProperty.call(target, key)
      const res = Reflect.deleteProperty(target, key)
      if (res && hadkey) {
        trigger(target, key, 'DELETE')
      }
      return res
    }
  })
}
const originMethod = Array.prototype.includes // [!code ++]

const arrayInstrumentations = { // [!code ++]
  includes: function (...args) { // [!code ++]
    // this 是代理对象，先在代理对象中查找，将结果存储到res中 // [!code ++]
    let res = originMethod.apply(this, args) // [!code ++]
    if (res === false) { // [!code ++]
      // 没找到，则通过this.raw 拿到原始数组，再去其中查找并更新res值 // [!code ++]
      res = originMethod.apply(this.raw, args) // [!code ++]
    } // [!code ++]
    // 返回最终结果 // [!code ++]
    return res // [!code ++]
  } // [!code ++]
} // [!code ++]

```

### 隐式修改数组长度的原型方法

主要指的是数组的栈方法 `push` `pop` `shift` `unshift` `splice`

```js

const arrpush = reactive([])

effect(() => {
  arrpush.push(1)
})

effect(() => {
  arrpush.push(1)
})
```

- 第一个副作用函数执行。调用`arrpush.push` 方法向数组中添加一个元素。调用数组的`push` 方法会间接读取数组的`length` 属性。所以，第一个副作用函数执行完毕后，会与`length` 属性建立响应联系。
- 接着，第二个副作用函数执行。同样，它会与`length` 属性建立响应联系，`arrpush.push` 方法不仅会间接读取数组的`length` 属性，还会间接设置`length` 属性的值。
- 第二个函数内的`arrpush.push` 方法的调用设置了数组的`length`属性值。于是，响应系统尝试把与`length` 属性相关联的副作用函数 全部取出并执行，其中就包括第一个副作用函数。可以发现，第二个副作用函数还未执行完毕，就要再次执行第一个副作用函数了。
- 第一个副作用函数再次执行。同样，这会间接设置数组的`length` 属性。响应系统又尝试把所有与`length` 属性相关联的副作用函数取出并执行，其中就包含第二个副作用函数。
- 结果会导致栈溢出。

基于以上几点，只要屏蔽对`length` 属性的读取，就能避免在它与副作用函数之间建立响应联系。

```js
// 一个标记变量，代表是否进行追踪。默认值为true，允许追踪
let shouldTrack = true
// 重写数组的push pop shift unshift以及splice方法
  ;['push'].forEach(method => {
    // 取得原始的push方法
    const originMethod = Array.prototype[method]
    // 重写
    arrayInstrumentations[method] = function (...args) {
      // 在调用原始方法之前，禁止追踪
      shouldTrack = false
      // push 方法的默认行为
      let res = originMethod.apply(this, args)
      // 在调用原始方法之后，恢复原来的行为，即允许追踪
      shouldTrack = true
      return res
    }
  })
```

### 代理Set和Map

集合类型的响应式方案。集合类型包括`Map/Set`以及`WeakMap/WeakSet` 。

**Set类型的原型属性和方法**

- size：返回集合中的元素的数量
- add(value): 向集合中添加给定的值
- clear():清空集合
- delete(value): 从集合中删除给定的值
- has(value): 判断集合中是否存在给定的值
- keys(): 返回一个迭代对象。可以于`for...of`循环，迭代器对象产生的值为集合中的元素值
- values(): 对于Set集合类型来说，keys()与values()等价
- entries(): 返回一个迭代对象。迭代过程中为集合中的每一个元素产生的一个数组值[value, value]
- forEach(callback[, thisArg]): forEach函数会遍历集合中的所有元素，并对每一个元素调用`callback` 函数。forEach函数接收可选的第二个参数`thisArg` ，用于指定`callback` 函数执行时的`this` 值。

**Map类型的原型属性和方法**

- size：返回Map数据中的健值对数量
- clear(): 清空Map
- delete(key): 删除指定key的健值对
- has(key): 判断Map中是否存在指定key的健值对
- get(key): 读取指定key对应的值
- set(key, value): 为Map设置新的健值对
- keys()：返回一个迭代器对象。迭代过程中会产生健值对的key值
- values(): 返回一个迭代器对象。迭代过程中会产生健值对的value值
- entries(): 返回一个迭代器对象。迭代过程中会产生由[key, value]组成的数组值
- forEach(callback[, thisArg]): forEach函数会遍历Map数据的所有健值对，并对每一个健值对调用`callback`函数。forEach函数接收可选的第二个参数`thisArg`，用于指定`callback`函数执行时的`this`值

---

使用`Proxy`代理`Set`和`Map` 类型数据的注意事项

```js
const s = new Set([1, 2, 3])
const p = new Proxy(s, {
  get(target, key, receiver) {
    if (key === 'size') {
      return Reflect.get(target, key, target)
    }
    return Reflect.get(target, key, receiver)
  }
})

p.delete(1)
```

调用`p.delete()` 方法为什么会执行代理`get`函数呢。

这个行为是 JavaScript 语言规范的一部分。当您对一个对象使用 `delete` 操作时,JavaScript 引擎会首先尝试获取该对象的 `length` 属性,以确定要删除的元素是否存在于数组中。

....
