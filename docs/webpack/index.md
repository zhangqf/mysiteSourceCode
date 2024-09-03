# webpack

## 为什么要使用webpack
## 打包工具出现之前，浏览器运行javaScript
- 引用一些脚步来存放每个功能；
  - 缺点：很难扩展，加载太多脚步会导致网络瓶颈
- 使用一个包含所有项目代码的大型 .js文件
  - 缺点： 会导致作用域、文件大小、可读性和可维护性方面的问题

## 立即调用函数表达式（IIFE)
解决大型项目的作用域问题；当脚本文件被封装在IIFE内部时，可以安全地拼接或安全的组合所有文件，不会有作用域冲突。 gulp、make、grunt等工具就是使用的IIFE方式。这些工具称为任务执行器，它们将所有项目文件拼接在一起。
- 缺点：修改一个文件意味着必须重新构建整个文件。拼接可以做到很容易地跨文件重用脚本，但是却使构建结果的优化变得更加困难。如何判断代码是否实际被使用？如何treeshake代码依赖？难以大规模地实现延迟加载代码块，需要开发人员手动地进行大量工作

## Npm + node.js + modules  大规模分发模块
commonJS没有浏览器支持。没有live binding 。循环引用存在问题。同步执行的模块解析加载器速度很慢。虽然commonjs是nodejs项目的绝佳解决方案，但浏览器不支持模块，因此就产生了啦Browserify,RequireJS和SystemJS等打包工具，允许我们编写能够在浏览器中运行的commonJS模块

## ESM-ECMAScript模块
ecmascript官方推出模块化，也就意味着javascript支持模块化（es6）

## 依赖自动收集
自动构建并基于你所引用或导出的内容推断出依赖的图谱（每当一个文件依赖另一个文件时，webpack都会将文件视为直接存在依赖关系。并会把它们作为依赖提供给应用程序）。 这个特性与其他的插件 或者是 加载器 都能让开发者的体验更加友好
webpack处理应用程序时，他会根据命令行参数中或配置文件中定义的模块列表开始处理。从入口开始，webpack会递归的构建一个依赖关系图，这个依赖关系图包含着应用程序中所需的每个模块，然后将所有的模块打包为少量的bundle。
他是一个工具，可以打包javascript应用程序（支持ESM 和CommonJS），可以扩展为支持许多不同的静态资源，webpack关心性能和加载时间；它始终在改进或添加新功能。异步地加载chunk和预取，以便为你的项目和用户提供最佳体检

## 概述
webpack是一个用于现代javascript应用程序的静态模块打包工具。当webpack处理应用程序时，他会在内部从一个或多个入口点构建一个依赖图，然后将项目中所需的每一个模块组合成一个或多个bundles，它们均为静态资源。
- 入口
- 输出
- Loader
- 插件 Plugin
- 模式 Mode
- 浏览器兼容性 Browser compatibility
- 环境 environment

## 入口
入口起点指示webpack应该使用哪个模块，来作为构建其内部依赖图的开始。进入起点后，webpack会找出有哪些模块和库是入口起点依赖的。

## 输出
output属性告诉webpack在哪里输出它所创建的bundle，以及如何命名这些文件。主要输出文件的默认值 `./dist/main.js`，其他生成文件默认默认放置在`./dist`文件夹中。

## Loader
webpack只能理解javascript和json文件，这是webpack开箱可用的自带能力。loader让webpack能够去处理其他类型的文件，并将它们转换为有效模块，以供程序使用，以及被添加到依赖图中

## 插件plugin
loader用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。优化打包，资源管理，注入环境变量

## 模式 mode
通过设置`mode`参数，来启用webpack内置在相应环境下的优化。默认值为`production`

## 浏览器兼容性
webpack支持所有符合es5标准的浏览器。不支持IE8及以下版本。webpack的`import()`和`require.ensure()`需要`Promise`。若想要支持旧版浏览器，还需要提前加载 `polyfill`

## 环境
webpack5运行于 Node.js v10.13.0+的版本

## 内部原理
打包，是指处理某些文件并将其输出为其他文件的能力
但是，在输入和输出之间，还包括有模块，入口起点，chunk，chunk组和许多其他中间部分

## 主要部分
项目中使用的每一个文件都是一个模块
通过互相引用，这些模块会形成一个图（ModuleGraph）数据结构
在打包过程中，模块会被合并成chunk。chunk合并成chunk组，并形成一个通过模块互相连接的图（ModuleGraph）
如何通过以上来描述一个入口起点：在其内部，会创建一个只有一个chunk的chunk组

## Chunk
chunk有两种形式：
- initial(初始化)是入口起点的main chunk。此chunk包含为入口起点指定的所有模块及其依赖项。
- non-initial是可以延迟加载的块。可能会出现使用动态导入dynamic imports或者SplitChunksPlugin 时。
默认情况下，使用non-initial chunk没有名称，因此会使用唯一ID来替代名称。可以通过使用magic comment（魔术注释）来显式指定chunk名称
```js
import（
/* webpackChunkName: "app" */
'./app.jsx'
).then((App) => {
    ReactDom.render(<App />, root)
}) 
```

## Manifest
webpack构建的应用程序或站点中，有三种主要的代码类型
1. 自己或团队编写的代码
2. 所依赖的第三方的library或vendor 代码
3. webpack的runtime 和 manifest ，管理所有模块的交互

## Runtime
Runtime 以及伴随的manifest数据，主要是指：在浏览器运行过程中，webpack用来连接模块化应用程序所需的所有代码。它包含：在模块交互时，连接模块所需的加载和解析逻辑。包括：已经加载到浏览器中的连接模块逻辑，以及尚未加载模块的延迟加载逻辑

## Manifest

当compiler开始执行、解析和映射应用程序时，它会保留所有模块的详细要点。这个数据集合称为"manifest",当完成打包并发送到浏览器时，runtime会通过manifest来解析和加载模块。无论选择哪种呢模块语法，那些import 或require 语句现在都已经转换为__webpack_require__方法，此方法指向模块标识符。通过使用manifest中的数据，runtime将能够检索这些标识符，找出每个标识符背后对应的模块。
主要用途：通过使用浏览器缓存来改善项目的性能
通过使用内容散列（content hash）作为bundle文件的名称，这样在文件内容修改时，会计算出新的hash，浏览器会使用新的名称加载文件，从而时缓存无效。即使某些内容明显没有修改，某些hash还是会改变。这是因为，注入的runtime和manifest在每次构建后都会发生变化

