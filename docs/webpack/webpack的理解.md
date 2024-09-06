# webpack的理解

## webpack的目的
webpack 是为实现前端项目的模块化，更高效地管理和维护项目中的每一个资源

### 为什么要模块化呢

最初，实现模块化是通过文件划分的。也就是每个功能及其状态数据各自单独放到不同的`js`文件中，约定每个文件都是一个独立的模块，然后通过`script`标签引入这些文件，
每个文件对应一个模块。调用模块化的成员。 这种方式的弊端十分明显，模块都是在全局中工作，大量的模块成员会污染环境，模块与模块之间并没有依赖关系，维护困难、没有私有空间。

### webpack是什么
`webpack`是一个用于现代 `JavaScript` 应用程序的静态模块打包工具。当webpack处理应用程序时，他会在内部从一个或多个入口点构建一个依赖图，然后将项目中所需的每一个模块组合成一个或多个bundles，它们均为静态资源

### webpack原理
webpack的运行流程是一个串行的过程，从启动到结束会依次执行：
1. 会从配置文件和 `shell`语句中读取与合并参数，并初始化需要使用的插件和配置插件等执行环境所需要的参数
2. 初始化完成后会调用`compiler`的`run`来启动`webpack`编译构建过程，`webpakc`的构建流程包括`compile`、`make`、`build`、`seal`、`emit`阶段，执行完这些阶段就完成了构建过程

### 初始化
- entry-options启动
- run实例化

### 编译构建
- entry 确定入口：根据配中的 `entry` 找出所有入口文件
- make 编译模块： 从入口文件出发，调用所有配置的`loader`对模块进行翻译，再找出该模块依赖的模块，再递归此步骤直到所有入口依赖的文件都经过了此步骤的处理
- build module 完成模块编译：通过`loader`翻译完所有模块后，得到每个模块被翻译后的最终内容以及它们之间的依赖关系
- seal 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的`chunk`，再把每一个`chunk`转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
- emit 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

### loader
loader 用于对模块的 源代码 进行格式转换，在import 或 加载 模块时预处理文件
webpack 仅仅是分析出各种模块的依赖关系，然后形成资源列表，最终打包生成到指定的文件中
在webpack内部中，任何文件都是模块，不仅仅是js文件
默认情况下，在遇到 import 或者 load加载模块的时候，webpack只支持对js文件打包
如css sass png 等这些类型的文件，webpack没有能力，这个时候就需要配置对应的loader 进行文件内容的解析

加载模块的顺序：
entry --> loaders --> output

当`webpack`碰到不识别的模块的时候，`webpack`会在配置中查找该文件解析规则
关于配置`loader`的方式有三种：
1. 配置方式：在webpack.config.js文件中指定loader
2. 内联方式：在每个import语句中显示指定loader
3. CLI方式：在shell命令中指定它们

### 常见的loader
- style-loader：将css添加到DOM的内联样式标签style里
- css-loader：允许将css文件通过require的方式引入，并返回css代码
- less-loader：处理less
- sass-loader：处理sass
- postcss-loader：用postcss来处理css
- autoprefixer-loader：处理css3属性前缀，已被弃用，建议直接使用postcss
- file-loader：分发文件到output目录并返回相对路径
- url-loader：和file-loader类似，当时文件小于设定的limit时返回一个Data url
- html-minify-loader：压缩HTML
- babel-loader：用babel来转换ES6文件到ES

### Plugin
计算机应用程序，他和主应用程序互相交互，以提供特定的功能
他是一种遵循一定规范的应用程序接口编写出来的程序，只能运行在程序规定的系统下，因为其需要调用原纯净系统提供的函数库或者数据
plugin赋予webpack各种灵活的功能，包括打包优化、资源管理、环境变量注入等，它们会运行在webpack的不同阶段，贯穿了webpack的整个编译周期

**目的** 解决loader无法实现的事情

### 特性
它本质是一个具有`apple`方法的`JavaScript` 对象
`apple`方法会被`webpack compiler`调用，并且在整个编译生命周期都可以访问`compiler`对象
- entry-option ：初始化 option
- run
- compile： 真正开始的编译，在创建 compilation 对象之前
- compilation ：生成好了 compilation 对象
- make 从 entry 开始递归分析依赖，准备对每个模块进行 build
- after-compile： 编译 build 过程结束
- emit ：在将内存中 assets 内容写到磁盘文件夹之前
- after-emit ：在将内存中 assets 内容写到磁盘文件夹之后
- done： 完成所有的编译过程
- failed： 编译失败的时候

### 常见的plugin
- AggressiveSplittingPlugin：将原来的chunk分成更小的chunk
- BabelMinifyWebpackPlugin：使用babel-minify进行压缩
- BannerPlugin：在每个生成的chunk顶部添加bannner
- HtmlWebpackPlugin：简单创建HTML文件，用于服务器访问
- LimitChunkCountPlugin：设置chunk的最小、最大限制，以微调和控制chunk

### loader和plugin的区别
-loader：是文件加载器，能够加载资源文件并对这些文件进行一些处理，如编译，压缩等，最终打包到指定文件中
-plugin：赋予webpack各种灵活的功能，如打包优化、资源管理、环境变量注入等，目的解决loader无法实现的事情
运行时的区别：
- loader运行在打包文件之前
- plugins在整个编译周期都起作用

在webpack运行的生命周期中会广播出许多事件，Plugin可以监听这些事件，在合适的时机通过webpack提供的API改变输出结果

对应loader，实质是一个转换器，将A文件进行编译形成B文件，操作的是文件，单纯的文件转换过程

### webpack的热更新如何实现的
HMR 即 Hot Module Replacement，模块热替换，指在应用程序运行过程中，替换、添加、删除模块，而无需重新刷新整个应用

使用webpack Dev server，webpack Dev Server 中有 webpack Compile、 HMR Server 、Bundle Server
webpack compile：将js源码编译成bundle.js
HMR Server: 用来将热更新的文件输出给 HMR Runtime
HMR Runtime：socket服务器，会被注入到浏览器，更新文件的变化
bundle.js：构建输出的文件
在HMR Runtime 和 HMR Server之间建立 websocket，用于实时更新文件变化

- 启动阶段： 保存好代码 webpack compile 将源代码和HMR Runtime 一起编译成bundle文件，传输给Bundle Server 静态资源服务器
- 更新阶段： 当一个文件被改变是，webpack监听到文件变化，便会对文件重新编译打包，编译生成唯一的 hash值，这个hash值用来作为下一次更新的标识
  根据变化的内容生成两个补丁文件：manifest（包含了hash和chundId，用来说明变化的内容）和chunk.js模块

  由于socket服务器在HRM Runtime 和HRM Server 之间建立了websocket链接，当文件发生变化是，服务端会向浏览器推送一条消息，消息包含文件改动后生成的hash值，

  浏览器接受到这条消息之前，已经在上一次socket消息中已经记住了此时的hash标识，这是会创建一个ajax去服务端请求获取变化内容的manifest文件
  
  浏览器根据这个manifest文件获取模块变化的内容后，会触发render流程，从而实现局部模块更新
  ![屏幕截图 2024-09-06 180025](https://github.com/user-attachments/assets/60532e4f-ec37-4e96-928d-e93b5d3c4da4)


