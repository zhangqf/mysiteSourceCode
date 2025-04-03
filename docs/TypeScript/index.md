# 类型基础

## 静态类型语言

  在编译阶段确定所有变量的类型

## 动态类型语言

  在执行阶段确定所有变量的类型

|静态类型语言|动态类型语言|
|---|---|
|对类型极度严格|对类型非常宽松|
|立即发现错误|Bug可能隐藏很久|
|运行时性能较好|运行时性能差|
|自文档化|可读性差|

## 强类型语言

  不允许程序在发生错误后继续执行

```mermaid
  quadrantChart
  title 语言类型象限
  quadrant-1 "静态类型 强类型"
  quadrant-2 "动态类型 强类型"
  quadrant-3 "动态类型 弱类型"
  quadrant-4 "静态类型 弱类型"
  "Java": [0.7, 0.8]
  "C#": [0.7, 0.7]
  "C": [0.6, 0.5]
  "C++": [0.9, 0.5]
  "Python": [0.25, 0.8]
  "JavaScript": [0.25, 0.25]
  "PHP": [0.25, 0.35]
```

## 数据类型

|ES6 数据类型|TypeScript数据类型|
|---|---|
|Boolean|Boolean|
|Number|Number|
|String|String|
|Array|Array|
|Function|Function|
|Object|Object|
|Symbol|Symbol|
|undefiend|undefined|
|null|null|
||void|
||any|
||never|
||元组|
||枚举|
||高级类型|

## 类型注解

作用：相当于强类型语言中的类型声明
语法：（变量/函数）：type

```ts
// 原始类型
let bool: boolean = true
let num: number = 10
let str: string = 'dataType'

// 数组

let arr1: number[] = [1, 2, 3]
let arr2: Array<number> = [1, 2, 3]

// 元组

let tuple: [number, string] = [0, '1']

// 函数

let add = (x: number, y: number): number => x + y
// 定义函数类型
let fn: (x: number, y: number) => number
fn = (x, y) => x + y

// 对象

let obj: object = { x: 1, y: 1 }

// symbol

let s1: symbol = Symbol()
let s2 = Symbol()

// undefined, null

let un: undefined = undefined
let nu: null = null

// void

let noR = () => { }

// any

let x

// never 永远不会有返回值的类型

let error = () => {
  throw new Error('error')
}

let endless = () => {
  while (true) {

  }
}
```

## 枚举

枚举成员的值是个只读属性。

### 数字枚举

```ts
enum Role {
  Reporter,
  Developer,
  Maintainer,
  Owner,
  Guest
}
```

数字枚举的实现原理 -- 反向映射
枚举的正向映射（通过名称访问其值）和反向映射（通过值访问其名称）

Role.Reporter = 0
Role.0 = "Reporter"

```js
"use strict";
var Role;
(function (Role) {
    Role[Role["Reporter"] = 0] = "Reporter";
    Role[Role["Developer"] = 1] = "Developer";
    Role[Role["Maintainer"] = 2] = "Maintainer";
    Role[Role["Owner"] = 3] = "Owner";
    Role[Role["Guest"] = 4] = "Guest";
})(Role || (Role = {}));

```

### 字符串枚举

```ts

enum Message {
  Success = '成功了',
  Fail = '失败了'
}

```

字符串枚举不能够进行反映映射

```js
"use strict";
var Message;
(function (Message) {
    Message["Success"] = "\u6210\u529F\u4E86";
    Message["Fail"] = "\u5931\u8D25\u4E86";
})(Message || (Message = {}));
```

### 异构枚举

```ts
enum Answer {
  N,
  Y = 'Yes'
}
```

```js
"use strict";
var Answer;
(function (Answer) {
    Answer[Answer["N"] = 0] = "N";
    Answer["Y"] = "Yes";
})(Answer || (Answer = {}));

```

### 枚举成员

枚举成员分为两类

  1. 常量枚举 （会在编译时，计算出结果，以常量的形式出现在运行时环境）
     1. 没有初始值
     2. 对已有枚举成员的引用
     3. 常量表达式
  2. 需要被计算的枚举成员（非常量表达式：不会在编译阶段计算，会保留到程序执行阶段）

`在需要计算的枚举成员后的 枚举成员一定要赋一个初始值`

```ts
enum Char {
  a,
  b = Char.a,
  c = 1 + 3,
  d = Math.random(),
  e = '123'.length

}
```

TypeScript 允许不同枚举成员有相同的值，但反向映射时只会返回第一个匹配的键

```js
"use strict";
var Char;
(function (Char) {
    Char[Char["a"] = 0] = "a";
    Char[Char["b"] = 0] = "b";
    Char[Char["c"] = 4] = "c";
    Char[Char["d"] = Math.random()] = "d";
    Char[Char["e"] = '123'.length] = "e";
})(Char || (Char = {}));

```

也就是说 `char[0] = "a"`

### 常量枚举

常量枚举是在枚举声明前加上`const`关键字的枚举类型，主要特点是在编译阶段会被完全删除，不会生成实际的JavaScript代码，而是直接替换为对应的值。这样做的优势是减少代码体积，提升性能，因为不需要在运行时保留枚举的结构

常量枚举适用于那些不需要运行时访问枚举成员的场景，比如单纯的数值替换。

```ts
const enum Week {
  Sun,
  Mon,
  Tues,
  Wednes,
  Thurs,
  Fri,
  Satur
}
let week = [Week.Sun, Week.Mon, Week.Tues] 

```

```js
"use strict";
let week = [0 /* Week.Sun */, 1 /* Week.Mon */, 2 /* Week.Tues */];
```

- 特性
  - 编译时内联
  - 无法通过索引访问
  - 只能包含常量成员
- 作用
  - 优化性能
  - 减少代码体积
  - 类型安全

```ts
// 枚举类型

enum E { a, b }
enum F { a = 0, b = 1 }
enum G { a = "apple", b = "banana" }

let e: E = 1
let f: F = 0

let e1: E.a
let e2: E.b
let e3: E.a

let g1: G
let g2: G.a
```

## 接口

### 鸭式辨型

在 TypeScript 中，"鸭式辨型"（Duck Typing）是一种基于结构类型系统的类型匹配原则，其核心思想是：
`“如果它走起来像鸭子，叫起来像鸭子，那么它就是鸭子”`
`if it walks like a duck and quacks like a duck, then it must be a duck`

TypeScript 的结构类型系统（Structural Typing）不关心类型的名称（名义类型），只关注类型的实际结构是否匹配。这与 Java/C# 等语言的名义类型系统（Nominal Typing）有本质区别。

#### 核心概念与示例

##### 1.基本结构匹配

```ts
interface Duck {
  walk: () => void;
  quack: () => void
}

class FakeDuck {
  walk() { console.log('走路') }
  quack() { console.log('叫声') }
}

// 结构匹配，即使没有显示实现 Duck 接口

const duck: Duck = new FakeDuck()
```

##### 2.函数参数兼容性

  只要参数结构匹配，类型就兼容

```ts
interface Point2D {
  x: number,
  y: number
}

interface Point3D {
  x: number,
  y: number,
  z: number
}

function logPoint2D(point: Point2D) {
  console.log(`(${point.x}, ${point.y})`)
}

const point3D: Point3D = { x: 2, y: 3, z: 4 }

// 允许传入Point3D（包含 Point2D的所有属性）
logPoint2D(point3D)

```

##### 3.类型推断与超集规则

  TypeScript 允许包含额外属性的对象

```ts
interface BasicUser {
  name: string,
  age: number
}

// 包含额外属性 email，但结构兼容 BasicUser

const userWithEmail = { name: 'Alice', age: 30, email: 'alice@cloud.com' }

const basicUser: BasicUser = userWithEmail

```

#### 应用场景

##### 1.灵活的函数传参

```ts
function printCoordinates(point: { x: number, y: number }) {
  console.log(`X: ${point.x}, Y:${point.y}`)
}

printCoordinates({ x: 10, y: 20 })

printCoordinates(new DOMRect())
```

##### 2. 动态对象处理

```ts
function hasName(obj: unknown): obj is { name: string } {
  return typeof obj === 'object' && obj !== null && 'name' in obj
}

const data = JSON.parse('{"name":"Bob"}')

if (hasName(data)) {
  console.log(data.name.toLocaleUpperCase())
}
```

##### 3.与泛性结合

```ts
function merge<T extends object, U extends object>(a: T, b: U): T & U {
  return { ...a, ...b }
}

// 自动推断为 { name: string; age: number }
const result = merge({ name: 'Alice' }, { age: 30 })

```

#### 注意事项

##### 1. 多余属性检查

  直接传递对象字面量时，TypeScript会严格检查额外属性

```ts
interface Cat {
  name: string,
  age: number
}


// 对象字面量只能指定已知属性，并且“color”不在类型“Cat”中。

// const tom: Cat = {
//   name: 'Tom',
//   age: 2,
//   color: 'white'
// }


// 通过中间变量绕过检查
const temp = {
  name: 'Tom',
  age: 3,
  color: 'black'
}

const tom1: Cat = temp
```

##### 2. 方法签名匹配

  方法参数和返回值需要满足协变/逆变规则

```ts
interface A {
  run(value: string): void
}

interface B {
  run(value: string | number): void
}

let a: A = {
  run: (val: string) => { }
}

let b: B = {
  run: (val: string | number) => { }
}

a = b //不安全（B.run 允许更宽泛的参数）
b = a //允许（A.run 参数更严格）
```

##### 3. 私有属性破坏结构兼容性

  如果类包含私有属性，会破坏结构兼容性

```ts
class C {
  private secret = 123;
  value = 1
}


class D {
  private secret = 555;
  value = 2
}

// 不能将类型“D”分配给类型“C”。  类型具有私有属性“secret”的单独声明。
// const c:C = new D()

```

### 可索引类型的接口

```ts
// 数字索引的接口
interface StringArray {
  [index: number]: string
}

let chars: StringArray = ['A', 'B']


console.log(chars[0])
// 字符串索引的接口

interface Names {
  [x: string]: string
  [z: number]: string
}

```

### 函数类型的接口

- 用变量定义一个函数类型

```ts
let addF: (x: number, y: number) => number
```

- 用接口定义一个函数类型

```ts
interface AddF {
  (x: number, y: number): number
}
```

以上两种定义方式是等价的

- 使用类型别名定义

```ts
type AddF = (x:number, y:number) => number

let addF: AddF = (a, b) => a + b

```

- 使用混合方法定义一个类库

```ts
// 定义
interface Lib {
  ():void;
  version:string;
  doSomething():void;
}

// 实现
function getLib() {
  let lib: Lib = (() => { }) as Lib
  lib.version = '2.0.0'
  lib.doSomething = () => { }
  return lib
}

let lib1 = getLib()
lib1()
lib1.doSomething()

let lib2 = getLib()
lib2()
```

### 逆变 协变

在 TypeScript 中，协变（Covariance） 和 逆变（Contravariance） 是描述类型系统如何处理子类型关系的核心概念，尤其在函数参数和返回值中表现明显。它们是类型安全的基石。

#### 协变（Covariance）

- 概念：若`A`是`B`的子类型（A extends B），则 `T<A>`是`T<B>`的子类型
- 子类型关系与父类型方向一致
- 经典场景：返回值类型

  ```ts
  class Animal {}

  class Dog extends Animal {}

  // 协变：返回值的子类型兼容性
  type GetAnimal = () => Animal;
  type GetDog = () => Dog

  // Dog 是 Animal 的子类型 → GetDog 可以赋值给 GetAnimal
  const getDog: GetDog = () => new Dog()
  const getAnimal: GetAnimal = getDog // 允许协变
  ```

#### 逆变（Contravariance）

- 概念：若`A`是`B`的子类型（A extends B），则`T<B>`是`T<A>`的子类型
- 子类型关系与父类型方向相反
- 经典场景：函数参数类型

```ts

type HandleAnimal = (animal: Animal) => void
type HandleDog = (dog: Dog) => void

//逆变：参数的父类型兼容性
const handleAnimal: HandleAnimal = (animal) => { }

const handleDog: HandleDog = handleAnimal //Animal 是 Dog 的父类型 → 允许逆变

// 错误示例（协变参数会不安全）
const handleDogUnsafe: HandleDog = (dog: Dog) => { }
const handleAnimalUnsafe: HandleAnimal = handleDogUnsafe;

handleAnimalUnsafe(new Animal()) // 运行时可能出错（参数类型不匹配）
```

## 函数

### 定义函数的四种方式

```ts
// 通过function 关键字定义
function add1(x:number,y:number) {
  return x + y
}

// 通过变量定义函数类型
let add2:(x:number,y:number) => number

// 通过别名定义函数类型
type add3 = (x:number, y:number) => number

// 通过接口定义函数类型
interface add4{
  (x:number,y:number):number
}
```

`函数的参数 必须要和定义的形成类型个数一致`

### 可选参数

```ts
function add5(x: number, y?: number) {
  return y ? x + y : x
}
```

`可选参数必须位于必选参数之后`

### 函数参数的默认值

```ts
function add6(x: number, y = 0, z: number, q = 1) {
  return x + y + z + q
}

// x + z + q
add6(1,undefined,1)

// x + z

add6(1, undfiend,0)

// x + y

add(1, 1, 0, 0)

```

`在必选参数前，默认参数是不可省略的`

```ts
function add7(x: number, ...rest: number[]) {
  return x + rest.reduce((pre, cur) => pre + cur)
}

console.log(add7(1, 2, 4, 6))
```

### 函数重载

- 根据参数类型返回不同结果

```ts
// 重载签名（类型声明）
function add8(...rest: number[]): number;
function add8(...rest: string[]): string;

// 实现签名（具体实现）
function add8(...rest: any): any {
  let first = rest[0]
  if (typeof first === 'string') {
    return rest.join('')
  }
  if (typeof first == "number") {
    return rest.reduce((pre: number, cur: number) => pre + cur)
  }
}


console.log(add8(1, 2, 4, 6))
console.log(add8('sp', 'ee', 'd'))
```

- 参数数量不同的重载

```ts
//重载签名
function createDate(timestamp: number): Date
function createDate(year: number, month: number, day: number): Date

// 实现签名
function createDate(monthOrTimestamp: number, day?: number, year?: number): Date {
  if(day !== undefined && year !== undefined) {
    return new Date(year, monthOrTimestamp, day)
  } else {
    return new Date(monthOrTimestamp)
  }
}

```

- 联合类型与重载对比
当需要**精确控制返回类型**时，重载比联合类型更合适：

```ts
function process1(input: string| number):string|number {
  return typeof input === 'string'? input.toUpperCase() : input.toFixed(2)
}

const result1 = process1('hello') // 类型为 string ｜ number 需要类型断言

// 使用函数重载（精确返回类型）

function process2(input:string):string
function process2(input: number):number
function process2(input: string|number):string|number {
  return typeof input === 'string'? input.toUpperCase() : input.toFixed(2)

}

process2('hello') // 类型明确为string
```

- 复杂类型匹配

```ts

function parseInput(input: string): string[]
function parseInput(input: number): number[]

function parseInput(input:string | number): string[] | number[] {
  if (typeof input === "string") {
    return input.split(",");
  } else {
    return [input, input * 2, input * 3];
  }
}
const arr1 = parseInput('a,bc,cc')
const arr2 = parseInput(5)
```

- 最佳实践

  - 优先使用联合类型

  ```ts
  function simpleExample(input:string | number):string | number {
    ...
  }
  ```

  - 需要精确输入输出匹配时用重载

  ```ts
  interface User {
    name: string
  }

  interface Error {
    code: number
  }

  function fetchData(id:string):User
  function fetchData(id: number):Error
  function fetchData(id:string | number):User|Error {
    ...
  }
  ```

  - 限制重载数量
  过多的重载会降低可读性，建议不超过5个

## 类

```ts
class Cat {
  constructor(name: string) {
    this.name = name
  }
  name: string
  run() { }
}

console.log(Dog1.prototype)

const dog = new Dog1("平安")
console.log(dog)
```

类成员的属性都是实例属性，不是原型属性。类成员的方法都是实例方法。

### 类的继承

```ts
class Husk extends Dog1 {
  constructor(name: string, color: string) {
    super(name)
    this.color = color
  }
  color: string
}

```

### 类的成员修饰符

```ts
class Dog1 {
  constructor(name: string) {
    this.name = name
  }
  public name: string
  run() { }
  private pri() {}
}

console.log(Dog1.prototype)

const dog = new Dog1("平安")
console.log(dog)

class Husk extends Dog1 {
  constructor(name: string, color: string) {
    super(name)
    this.color = color
  }
  color: string
}
```

- public : 公有成员。 默认都是这个修饰符
- private: 私有成员。只能在类中访问，实例和他的子类都不可被访问。给构造函数添加这个修饰符，表示这个类，既不能被实例化，也不能被继承。
- protected: 受保护成员。只能在类或子类中方问。不能在实例中调用。给构造函数添加这个修饰符。表示这类，只能被继承，不能被实例化。
- readonly: 只读属性。一定要被初始化。
- static: 类的静态成员。只能通过类名来调用，而不能通过实例调用。也可以被子类继承。

## 抽象类和多态

抽象类是只能被继承不能被实例化的类

`抽象类可以抽离出事物的共性,有利于代码的复用和扩展`

`多态，是指在父类中定义一个抽象方法，在多个子类中对这个方法有不同的实现，在程序运行时，会根据不同的对象进行不同的操作，这样就出现了运行时的绑定`

```ts
class Pig extends Animals {
  constructor(name: string) {
    super()
    this.name = name
  }
  name: string
  sleep(): void {
    console.log(this.name + " of pig is sleeping")
  }
}

let pig = new Pig('yangyang')

pig.sleep()

let animal: Animals[] = [pig, cat]

animal.forEach(i => {
  i.sleep()
})
```

### this类型

```ts
class WorkFlow {
  step1(){
    return this
  }
  step2(){
    return this
  }
}

new WorkFlow().step1().step2()

class MyFlow extends WorkFlow {
  next() {
    return this
  }
}

new MyFlow().next().step1().next().step2()
```

## 类和接口的关系

- 类实现接口的时候，必须实现接口中声明的所有属性

- 接口只能约束类的公有成员

- 接口也不能约束类的构造函数

```ts
interface Human {
  name: string;
  eat(): void;
}

class Asian implements Human {
  constructor(name: string) {
    this.name = name
  }
  name: string
  eat() {
  }
}
```

### 接口的继承

- 接口继承多个接口

```ts
interface Man extends Human {
  run():void
}

interface Child {
  cry():void
}

interface Boy extends Man, Child {}

let boy:Boy = {
  run() {
    
  },
  name: '',
  eat() {
    
  },
  cry(){}
}

```

- 接口继承类

相当于接口把类的成员抽象了出来
  
`接口抽离类的成员的时候，不仅抽离了类的公共成员，也抽离了类的私有成员，受保护的成员`

```ts
class Auto {
  state = 1
}

interface AutoInterface extends Auto {

}

class GG implements AutoInterface {
  state = 1
}


class Bus extends Auto implements AutoInterface {
  
}
```

|特性|接口(interface)|类(class)|
|---|---|---|
|实现|仅定义结构，无实现|包含属性和方法的具体实现|
|实例化|❌ 不可实例化|✅ 可通过`new`实例化|
|编译后存在性|❌ 编译后不存在|✅ 保留为JS代码|
|访问修饰符|仅`public`|支持`public`、`private`、`protected`|
|继承|多继承(`extends`多个接口)|单继承(`extends`一个类)|
|静态成员|❌ 不支持|✅ 支持|
|类型检查重点|结构兼容性|实例类型（可能受私有成员影响）|

**注意：**

- 访问修饰符（`public`、`private`、`protected`）:控制成员的**可见性**（谁能访问）
- 静态修饰符（`static`）:控制成员的**归属层级** (属于类本身还是实例对象)

|特性|静态成员（`static`）|实例成员（`无static`）|
|---|---|---|
|归属层级|属于类本身（通过`类名.成员`访问）|属于实例对象（通过`对象.成员`访问|
|内存分配|类加载时分配，全局唯一|实例化时分配，每个对象独立|
|生命周期|与类共存亡|与对象共存亡|
|访问限制|可单独配合`public`/`private`使用|可单独配合`public`/`private`使用|

## 泛型

不预先确定的数据类型，具体的类型在使用的时候才能确定

- 泛型函数

```ts
function log(value: string | number): string|number {
  console.log(value)
  return value
}

// 改造后
function log<T>(value: T): T {
  console.log(value)
  return value
}

log<string[]>(['value'])

log(['a'])

log<string>('value')

log('a')

log<number>(500)

log(500)

log<number[]>([500,300,59])
```

- 泛型函数类型

```ts
type Log = <T>(value:T)=>T

let myLog:Log = log
```

- 泛型接口

```ts
// 等价于类型别名定义的方式, 这里的泛型仅仅约束了一个函数
interface Log {
  <T>(value: T):T
}
let mylog:Log = log


// 泛型约束了接口的其他成员
interface Log<T> {
  (value: T):T
}
// 泛型接口约束了整个接口后，在实现的时候必须指定一个类型
let mylog:Log<number> = log

// 泛型接口定义时指定默认类型
interface Log<T = string> {
  (value: T):T
}

let mylog:Log = log
```

## 泛型类和泛型约束

### 泛型类

`泛型不能应用于类的静态成员`

```ts
class Log<T> {
  run(value: T) {
    console.log(value)
    return value
  }
}

let log1 = new Log()

let log2 = new Log<number>()

// 参数可以是任意类型的值
log1.run('go go go')
log1.run(1212)
log1.run({})

// 只能是number
log2.run(23)
```

### 泛型约束

```ts
interface Length {
  length:number
}

function log<T extends Length>(value: T): T {
  console.log(value, value.length)
  return value
}

// 参数为有length属性的值
log([])

log('s')

log({length:4})
```

### 泛型的好处

- 函数和类可以轻松地支持多种类型，增强程序的扩展性
- 不必写多条函数重载，冗长的联合类型声明，增强代码可读性
- 灵活控制类型之间的约束

## 泛型（Generics）、联合类型（Union Types）和函数重载（Function Overloads）三者的关系

### 泛型（Generics）

- 设计目的
泛型的核心是**类型参数化**，允许在定义函数、接口或类时**不指定具体类型**，而是通过参数动态传递类型。
泛型的核心价值是**保持类型一致性**（如输入和输出类型一致）
- 适用场景
  - 需要**处理多种类型但逻辑相同的**情况
  - 需要**保留类型信息**（如返回值的类型与输入值一致）

```ts
function identify<T>(arg:T):T{
  return arg
}

const num = identify(2) // 自动推断为number
const str = identify<string>('hello') //类型为 string
```

### 联合类型（Union Types）

- 设计目的
联合类型的核心是**类型灵活性**，允许一个变量或参数是**多种类型中的一种**。它的价值在于**处理不确定性**（如一个参数可能是`string`或`number`）
- 适用场景
  - 需要**接受多种类型输入**，但逻辑可能不同（需要类型守卫处理）
  - 需要**明确限定类型范围**（如`string`|`number`）

```ts

function printValue(value:string|number):string|number {
  if(typeof value === 'string') {
    return value.toUpperCase()
  } else {
    return value * 4
  }
}
```

### 函数重载（Function Overloads）

- 设计目的
函数重载的核心是**精确描述函数的多态行为**，通过多个类型签名明确不同参数类型和返回值类型的对应关系。它的价值在于**提升类型提示的准确性**（如根据参数类型推断返回值类型）
- 适用场景
  - 需要**根据参数类型返回不同类型**（如`parseInt`返回`number`,`JSON.parse`返回泛型）
  - 需要**处理不同参数数量和类型组合**

```ts
function parse(input: string): number;
function parse(input: string[]): number[];
function parse(input: string | string[]): number | number[] {
  if (typeof input === 'string') {
    return parseFloat(input)
  } else {
    return input.map(Number)
  }
}

const num = parse("3.29")
console.log(num)

const arr = parse(['1', '4'])

console.log(arr)
```

### 三者对比

|特性|核心能力|经典场景|类型一致性|
|---|---|---|---|
|泛型|类型参数化|逻辑相同，类型可变|✅ 输入输出一致|
|联合类型|类型灵活性|输入类型不确定，需分支处理|❌ 类型可能变化|
|函数重载|多态行为精确描述|不同参数类型对应不同返回值类型|✅ 明确映射关系|

- 泛型 联合类型
  - 泛型解决的是**类型一致性问题**
  - 联合类型解决的是**类型多样性问题**
- 泛型 函数重载
  - 泛型适用于**类型参数化的逻辑复用**
  - 函数重载适用于**不同参数类型对应不同的返回类型的精确描述**
- 联合类型 函数重载
  - 联合类型允许**单个函数处理多种输入类型**，但需要类型守卫
  - 函数重载通过多个签名**显式声明类型映射**，提升代码可读性和类型推断能力

## 类型守卫

类型守卫是一种通过条件判断来缩小变量类型范围的技术，它让TypeScript编译器能够在特点代码块中更精确地推断变量的类型。类型守卫常用于处理联合类型或未知类型的场景，以提高代码的类型安全性

### 类型守卫的核心作用

- **缩小类型范围**：将宽泛的类型（如`string` `number`）缩小到具体类型（`string`）
- **避免运行时错误**：通过静态类型检查提前发现潜在的类型错误
- **启用类型专属方法**：在特定分支中安全调用类型专属的方法

### 常见类型守卫方式

1.**`typeof` 类型守卫：** 判断基本类型（`string`、`number`、`boolean`）
2.**`instanceof` 类型守卫：** 判断对象是否为某个类的实例
3.**`in`操作符守卫：** 判断对象是否包含某个属性
4.**字面量类型守卫：** 用于联合类型中的字面量

```ts

type Result = { status: 'success'; data:string} | {status:'error';code:number}

function handleResult(result:Result){
  if(result.status === 'success') {
    console.log(result.data)
  } else {
    console.log(result.code)
  }
}
```

5.**自定义类型守卫（类型谓词）**

通过函数返回`arg is Type` 明确类型断言：

```ts
function isString(value:unknown):value is string {
  return typeof value === 'string'
}

function process(input: string | number) {
  if(isString(input)) {
    console.log(input.trim())
  } else {
    console.log(input.toFixed(2))
  }
}
```

### 类型守卫与类型断言

类型守卫是通过逻辑判断让Typescript自动推断类型，安全可靠
类型断言是强制告诉Typescript变量的类型，绕过类型检查，有风险
