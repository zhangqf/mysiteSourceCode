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

### 如何使用webpack来优化前端性能
优化手段：
- js代码压缩
  使用`terser-webpack-plugin` 插件，来处理js代码压缩
  ```js
  const TerserPlugin = require('terser-webpack-plugin')
  module.exports = {
    ...
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          
        })
      ]
    }
  }
  ```
  - extractComments：默认值为true，表示会将注释抽取到一个单独的文件中，开发阶段，我们可设置为 false ，不保留注释
  - parallel：使用多进程并发运行提高构建的速度，默认值是true，并发运行的默认数量： os.cpus().length - 1
  - terserOptions：设置我们的terser相关的配置：
    - compress：设置压缩相关的选项，mangle：设置丑化相关的选项，可以直接设置为true
    - mangle：设置丑化相关的选项，可以直接设置为true
    - toplevel：底层变量是否进行转换
    - keep_classnames：保留类的名称
    - keep_fnames：保留函数的名称
      
- css代码压缩
  CSS压缩通常是去除无用的空格等，因为很难去修改选择器、属性的名称、值等

  CSS的压缩我们可以使用另外一个插件：css-minimizer-webpack-plugin
  ```js
  const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
  module.exports = {
      // ...
      optimization: {
          minimize: true,
          minimizer: [
              new CssMinimizerPlugin({
                  parallel: true
              })
          ]
      }
  }
  ```

- Html文件代码压缩
  使用HtmlWebpackPlugin插件来生成HTML的模板时候，通过配置属性minify进行html优化
  ```js
  module.exports = {
      ...
      plugin:[
          new HtmlwebpackPlugin({
              ...
              minify:{
                  minifyCSS:false, // 是否压缩css
                  collapseWhitespace:false, // 是否折叠空格
                  removeComments:true // 是否移除注释
              }
          })
      ]
  }
  ```
  
- 文件大小压缩
  compression-webpack-plugin

  ```js
  new ComepressionPlugin({
      test:/\.(css|js)$/,  // 哪些文件需要压缩
      threshold:500, // 设置文件多大开始压缩
      minRatio:0.7, // 至少压缩的比例
      algorithm:"gzip", // 采用的压缩算法
  })
  ```
- 图片压缩
  一般来说在打包之后，一些图片文件的大小是远远要比 js 或者 css 文件要来的大，所以图片压缩较为重要
  ```js
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash].[ext]',
              outputPath: 'images/',
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              // 压缩 jpeg 的配置
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              // 使用 imagemin**-optipng 压缩 png，enable: false 为关闭
              optipng: {
                enabled: false,
              },
              // 使用 imagemin-pngquant 压缩 png
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              // 压缩 gif 的配置
              gifsicle: {
                interlaced: false,
              },
              // 开启 webp，会把 jpg 和 png 图片压缩为 webp 格式
              webp: {
                quality: 75
              }
            }
          }
        ]
      },
    ]
  } 
  ```
- Tree shaking
  依赖于ES Module的静态语法分析（不执行任何的代码，可以明确知道模块的依赖关系）
  
  在webpack实现Trss shaking有两种不同的方案：

  - usedExports：通过标记某些函数是否被使用，之后通过Terser来进行优化的
  - sideEffects：跳过整个模块/文件，直接查看该文件是否有副作用
  两种不同的配置方案， 有不同的效果
  ```js
  module.exports = {
      ...
      optimization:{
          usedExports
      }
  }
  ```
  sideEffects用于告知webpack compiler哪些模块时有副作用，配置方法是在package.json中设置sideEffects属性

  如果sideEffects设置为false，就是告知webpack可以安全的删除未用到的exports
  
  如果有些文件需要保留，可以设置为数组的形式

  ```js
  "sideEffecis":[    "./src/util/format.js",    "*.css" // 所有的css文件]
  ```
- 代码分离
  将代码分离到不同的bundle中，之后我们可以按需加载，或者并行加载这些文件

  默认情况下，所有的JavaScript代码（业务代码、第三方依赖、暂时没有用到的模块）在首页全部都加载，就会影响首页的加载速度
  
  代码分离可以分出出更小的bundle，以及控制资源加载优先级，提供代码的加载性能
  
  这里通过splitChunksPlugin来实现，该插件webpack已经默认安装和集成，只需要配置即可
  
  默认配置中，chunks仅仅针对于异步（async）请求，我们可以设置为initial或者all
  ```js
  module.exports = {
      ...
      optimization:{
          splitChunks:{
              chunks:"all"
          }
      }
  }
  ```
  splitChunks主要属性有如下：

  - Chunks，对同步代码还是异步代码进行处理
  - minSize： 拆分包的大小, 至少为minSize，如何包的大小不超过minSize，这个包不会拆分
  - maxSize： 将大于maxSize的包，拆分为不小于minSize的包
  - minChunks：被引入的次数，默认是1
- 内联chunk
  可以通过InlineChunkHtmlPlugin插件将一些chunk的模块内联到html，如runtime的代码（对模块进行解析、加载、模块信息相关的代码），代码量并不大，但是必须加载的
  ```js
  const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin')
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  module.exports = {
      ...
      plugin:[
          new InlineChunkHtmlPlugin(HtmlWebpackPlugin,[/runtime.+\.js/])
      ]
  }
  ```

  ### 提高webpack的构建速度
  - 优化loader设置
    在使用loader时，可以通过配置include、exclude、test属性来匹配文件，接触include、exclude规定哪些匹配应用loader
    ```js
    module.exports = {
      module: {
        rules: [
          {
            // 如果项目源码中只有 js 文件就不要写成 /\.jsx?$/，提升正则表达式性能
            test: /\.js$/,
            // babel-loader 支持缓存转换出的结果，通过 cacheDirectory 选项开启
            use: ['babel-loader?cacheDirectory'],
            // 只对项目根目录下的 src 目录中的文件采用 babel-loader
            include: path.resolve(__dirname, 'src'),
          },
        ]
      },
    };
    ```
  - 合理使用 resolve.extensions
    在开发中我们会有各种各样的模块依赖，这些模块可能来自于自己编写的代码，也可能来自第三方库， resolve可以帮助webpack从每个 require/import 语句中，找到需要引入到合适的模块代码
    ```js
    module.exports = {
        ...
        extensions:[".warm",".mjs",".js",".json"]
    }
    ```
    当我们引入文件的时候，若没有文件后缀名，则会根据数组内的值依次查找

    当我们配置的时候，则不要随便把所有后缀都写在里面，这会调用多次文件的查找，这样就会减慢打包速度
  - 优化resolve.modules
    resolve.modules 用于配置 webpack 去哪些目录下寻找第三方模块。默认值为['node_modules']，所以默认会从node_modules中查找文件
    当安装的第三方模块都放在项目根目录下的 ./node_modules 目录下时，所以可以指明存放第三方模块的绝对路径，以减少寻找，配置如下：
    ```js
    module.exports = {
      resolve: {
        // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
        // 其中 __dirname 表示当前工作目录，也就是项目根目录
        modules: [path.resolve(__dirname, 'node_modules')]
      },
    };
    ```
  - 优化resolve.alias
    alias给一些常用的路径起一个别名，特别当我们的项目目录结构比较深的时候，一个文件的路径可能是./../../的形式

    通过配置alias以减少查找过程
    ```js
    module.exports = {
        ...
        resolve:{
            alias:{
                "@":path.resolve(__dirname,'./src')
            }
        }
    }
    ```
  - 使用DLLPlugin插件
    DLL全称是 动态链接库，是为软件在winodw种实现共享函数库的一种实现方式，而Webpack也内置了DLL的功能，为的就是可以共享，不经常改变的代码，抽成一个共享的库。这个库在之后的编译过程中，会被引入到其他项目的代码中
    - 打包一个DLL库
      webpack内置了一个DllPlugin可以帮助我们打包一个DLL的库文件
      ```js
      module.exports = {
          ...
          plugins:[
              new webpack.DllPlugin({
                  name:'dll_[name]',
                  path:path.resolve(__dirname,"./dll/[name].mainfest.json")
              })
          ]
      }
      ```
    - 引入DLL库
      使用 webpack 自带的 DllReferencePlugin 插件对 mainfest.json 映射文件进行分析，获取要使用的DLL库

      然后再通过AddAssetHtmlPlugin插件，将我们打包的DLL库引入到Html模块中
      ```js
      module.exports = {
          ...
          new webpack.DllReferencePlugin({
              context:path.resolve(__dirname,"./dll/dll_react.js"),
              mainfest:path.resolve(__dirname,"./dll/react.mainfest.json")
          }),
          new AddAssetHtmlPlugin({
              outputPath:"./auto",
              filepath:path.resolve(__dirname,"./dll/dll_react.js")
          })
      }
      ```
  - 使用cache-loader
    在一些性能开销较大的 loader 之前添加 cache-loader，以将结果缓存到磁盘里，显著提升二次构建速度

    保存和读取这些缓存文件会有一些时间开销，所以请只对性能开销较大的 loader 使用此 loader
    ```js
    module.exports = {
        module: {
            rules: [
                {
                    test: /\.ext$/,
                    use: ['cache-loader', ...loaders],
                    include: path.resolve('src'),
                },
            ],
        },
    };
    ```
  - terser启动多线程
    使用多进程并行运行来提高构建速度
    ```js
    module.exports = {
      optimization: {
        minimizer: [
          new TerserPlugin({
            parallel: true,
          }),
        ],
      },
    };
    ```
  - 合理使用sourceMap

### 与webpack类似的工具还有哪些
- Rollup
  Rollup是一款 ES module 打包器，从作用上来看，Rollup与webpack非常类似。不过相比于 webpack， Rollup要小巧的多。如Vue React three.js 等都是Rollup打包的
  Rollup默认开始 Tree-shaking优化输出结果
  优点：
    - 代码更简洁、效率更高
    - 默认支持tree-shaking
 
  缺点：
    - 加载其他类型的资源文件 或者支持导入 commonjs模块 或者 编译ES新特性，这些额外的需要Rollup 需要使用插件去完成。

  Rollup不适合开发应用，因为需要使用第三方模块，而目前第三方模块大多数使用Commonjs方式导出，并且Rollup不支持HMR，使开发效率降低
  如果仅仅是打包Js时，Rollup比webpack更有优势，因为其打包出来的代码更小、更快。
        
- Parcel
- Snowpack
- Vite
