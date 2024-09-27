# vite

## vite vs webpack

### vite 解决了哪些webpack解决不了的问题呢？

当我们开始构建越来越大型的应用时，需要处理的 JavaScript 代码量也呈指数级增长。包含数千个模块的大型项目相当普遍。我们开始遇到性能瓶颈 —— 使用 JavaScript 开发的工具通常需要很长时间（甚至是几分钟！）才能启动开发服务器，即使使用 HMR，文件修改后的效果也需要几秒钟才能在浏览器中反映出来。如此循环往复，迟钝的反馈会极大地影响开发者的开发效率和幸福感。

Vite 旨在利用生态系统中的新进展解决上述问题：浏览器开始原生支持 ES 模块，且越来越多 JavaScript 工具使用编译型语言编写

#### 缓慢的服务器启动
当冷启动开发服务器时，基于打包器（webpack）的方式启动必须优先抓取并构建你的整个应用，然后才能提供服务。

vite 通过在一开始将应用中的模块区分我**依赖**和**源码**两类，改进了开发服务器启动时间
- 依赖： 大多为在开发时不会变动的纯 JavaScript。一些较大的依赖处理代价也很高。依赖也通常会存在多种模块化格式（ESM或者CommonJS）。
  vite将会使用esbuild预构建依赖。Esbuild 使用GO编写，并且比以JavaScript编写的打包器预构建依赖块10-100倍
- 源码：通常包含一些并非直接是JavaScript的文件，需要转换（如JSX，CSS或者Vue/Svelte组件），时常会被编辑。同时，并不是所有的源码都需要同时被加载（如基于路由拆分的代码模块）

vite以原生ESM方式提供源码。这实际上是让浏览器接管了打包程序的部分工作：vite只需要在浏览器请求源码时进行转换并按需提供源码。根据情景动态导入代码，即只在当前屏幕上实际使用时才会被处理。

#### 缓慢的更新
基于打包器启动时，重建整个包的效率很低。原因：这样更新速度会随着应用体积增长而直线下降，即使引入了HMR，其热更新速度也会随着应用规模的增长而显著下降

Vite中，HMR是在原生的ESM执行的。当编辑一个文件时，Vite只需要精确地使已编辑的模块与其最近的HMR边界之间的链接失活。使得无论应用大小如何，HMR始终能保持快速更新。
vite同时利用了HTTP头来加载整个页面的重新加载（再次让浏览器为我们做很多事情）：源码模块的请求会根据 304 not Modified 进行协商缓存，而依赖模块请求则会通过 Cache-control： max-age=31536000，immutable 进行强缓存，因此一旦被缓存它们将不需要再次请求

#### 为什么生产环境需要打包
原生ESM已得到广泛支持，但是由于嵌套导入导出会导致额外的网络往返，在生产环境中发布未打包的ESM仍然效率底下。为了在生产环境中获得最佳的加载性能，最好还是将代码进行tree-shaking、懒加载和chunk分割（以获得更好的缓存）

#### 为什么不用ESBulid打包
因为没有代码分割和对css方面的处理


### vite是vue官方团队出品，vue的生态强大，且他是vue的‘亲兄弟’，vue后面会主动推vite

### 构建工具：
1. 模块化开发的支持： 支持直接从node_modules引入代码， 支持多种模块化支持
2. 处理代码兼容性：babel语法降级，less，ts 语法转换
3. 提高项目性能：压缩文件，代码分割
4. 优化开发体验：
   - 构建工具自动监听文件的变化，当文件变化时，自动调用对应的集成工具进行重新打包，然后在浏览器重新运行（hot replacement）
   - 开发服务器：跨域问题，vue-cli 解决跨域问题


构建工具它让我们不用每次都关心我们的代码在浏览器如何运行，只需要首次给构建工具提供一个配置文件（这个配置文件也不是必须的，如果不给他，他会有默认值），有了这个集成的配置文件以后，就可以在下次需要更新的时候调用一次对应的命令就好了。


#### create-vite 和 vite  create-vite内置了vite

#### 依赖预构建
不同的第三方包会有不同的导出格式
对路径的处理上可以直接使用.vite/deps,方便路径重写
网络多包传输的性能问题（也是元素ESM规范不敢支持node_modules的原因之一），有了依赖预构建以后，无论他有多少额外的export和import vite都会尽可能的将它们进行集成最后生成一个或几个模块
