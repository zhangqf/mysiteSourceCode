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
