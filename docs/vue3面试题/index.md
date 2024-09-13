# vue3 面试题

## vue2 与 vue3 的区别
### 响应式系统重新配置，使用代理（proxy）替换对象的defineproperty属性，
使用代理的优势：
- 可直接监控阵列类型的数据变化
- 监听的目标是对象本身，不需要Object.defineProperty那样遍历每个属性，性能有一定的提升
- 直接添加/删除对象属性。 （vue2 直接操作对象新增属性或删除属性，界面不会更新，vue无法监听到，可以使用this.$set()或 vue.set()来实现对对象类型的属性新增，使用this.$delete来删除对象类型中的属性）、vue3重写了底层响应式原理，能够直接监听到对于对象的新增属性或删除属性，同时还能直接通过数组下标来操作数组，或通过length属性直接改变数组长度，而不依赖与$set方法 、$delete方法或splice 方法

>vue2 响应式：
>通过Object.defineProperty()实现对数据每个属性的劫持，通过get和set实现了响应式
>对于数组数据无法通过数组下标直接操作，无法通过length直接设置数组长度，无法直接给对象或数组添加属性
>可以通过this.$set()来对对象或数组进行操作

### 新增组合API，更好的逻辑重用和代码组织
### 重构虚拟DOM
### 模版编译时间优化，将一些静态节点编译成常量
### 代码结构调整，更方便tree-shaking，使其更小

## vue3带来了什么改变
### 性能提升
- 打包大小减少
- 初次渲染快55%,更新渲染快133%
- 内存减少了一半
### 源码的升级
-使用proxy替代Object.defineProperty实现响应式
- 重写了虚拟DOM的实现和Tree-shaking

### vue3内置支持Typescript

### 新的特性
- Composition API
  - setup 配置
  - ref与reactive
  - watch与effectWatch
  - provide与inject
- 新的内置组件
  - Fragment
  - Teleport
  - Suspense
- 其他改变
  - 新的生命周期钩子
  - data选项应始终被声明为一个函数
  - 移除keyCode支持作为v-on的修饰符
  - 移除了filter
  - 移除了v-on.native修饰符

### 生命周期
将2中的两个生命周期更名 beforeDestory ===> beforeUnmount、 destroyed ===> unmounted
vue3也提供了Composition API形式的生命周期钩子，与2中的钩子对应
beforeCreate ===> setup()
created ===> setup()
beforeMount ===> onBeforeMount
Mounted ===> onMounted
beforeUpdate ===> onBeforeUpdate
updated ===> onUpdated
beforeUnmount ===> onBeforeUnmount
unmounted ===> onUnmounted

## vue3常用的Composition API有哪些
### setup
setup值为一个函数
setup是所有Composition API 的表演舞台，组件中所用到的：数据、方法等，均要配置在setup中
setup函数的有两种返回值：
- 返回一个对象。对象中的属性、方法、在模版中均可以直接使用
- 返回一个渲染函数。自定义渲染内容
setup是在beforeCreated之前执行一次，this是undefined
setup的参数
- props： 值为对象，包含组件外部传递过来，且组件内部声明接受了的属性
- context：上下文对象
- attrs： 值为对象，包含：组件外部传递过来，但是没有props配置中声明的属性
- slots：收到的插槽内容
- emit：分发自定义事件的函数
setup不能是一个async函数，因为返回值不再是return的对象，而是promise，模版看不到return对象中的属性
