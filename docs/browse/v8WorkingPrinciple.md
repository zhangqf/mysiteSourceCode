---
editLink: false
---


# 编译器（Compiler）和 解释器（Interpreter）

编译型语言在程序执行之前，需要经过编译器的编译过程，并且编译之后会直接保留机器能读懂的二进制文件，这样每次运行程序时，都可以直接运行该二进制文件，而不需要再次重新编译 c c++ Go等

解释型语言编写的程序，在每次运行时都需要通过解释器对程序进行动态解释和执行 javascript python等

![1720001190604](images/v8WorkingPrinciple/1720001190604.png)

1. 在编译型语言的编译过程中，编译器首先会依次对源代码进行词法分析、语法分析、生成抽象语法树、优化代码、最后生成处理器可执行的机器码。编译成功会生成一个可执行的文件。后续运行这个可执行的文件即可。
2. 在解释型语言的解释过程中，解释器会对源码依次进行词法分析、语法分析、生成抽象树，基于抽象树生成字节码，根据字节码执行程序，输出结果。

# 抽象语法树（AST）

将源代码转化为抽象树，并执行上下文，

Bable是一个被广泛使用的代码转码器，可以将ES6代码转为ES5代码。

Bable的工作原理就是先将ES6源码转换为AST，然后再将ES6语法的AST转换为ES5语法的AST，最后利用ES5的AST生成javascript源代码

ESLint是一个用来检查javascript编写规范的插件，其检测流程也是需要将源码转换为AST，然后再利用AST来检查代码规范化的问题

生成AST需要两个阶段：

* 分词——词法分析：

将一行行的源码拆解成一个个token——语法上不可再分的最小单个字符或字符串。 将标识符 变量 运算符 字符串等 处理成不同的token

* 解析——语法分析：

将生成的token数据，根据语法规则转为AST。源码存在语法错误，到这会被终止，并抛出一个 语法错误

有了AST后，v8就会生成该段代码的执行上下文。

# 字节码（Bytecode）

有了AST和执行上下文，解释器Ignition会根据AST生成字节码，并解释执行字节码。

在最开始v8是直接将AST转换为机器码，由于执行机器码的效率是非常高效的，所以效果一直很好。但随着chrome在手机上的广泛普及，机器码占用内存的问题暴露出来了，v8需要消耗大量的内存来存放转换后的机器码。为了解决这个问题v8团队重构了引擎架构，引入了字节码，并抛弃了之前的编译器。

**字节码是介于****AST****和机器码之间的一种代码。但是与特定类型的机器码无关，字节码需要通过****解释器****将其转换为机器码后才能执行**

如果有一段第一次执行的字节码，解释器Ignition会逐条解释执行。在执行字节码的过程中，如果发现有热代码（HotSpot）（一段代码被重复多次执行），后台编译器TurboFan就会把该段热点的字节码编译成高效的机器码，然后当再次执行到这段被优化的代码时，只需要执行编译后的机器码就可以，大大提升了代码的执行效率

# 即时编译器（JIT）

字节码配合解释器和编译器的技术，就叫即时编译

在v8中，指的是解释器Ignition在解释执行字节码的同时，收集代码信息，当发现某一部分代码变热后，TurboFan编译器就会将这些热代码转换为机器码，并把转换后的机器码保存起来，用于后续使用。



# 浏览器页面是由消息队列和事件循环驱动的
每个渲染进程都有一个主线程，用来处理各种计算（构建DOM树，计算styleSheet，生成布局树， 分层，图层绘制， 栅格化， 合成，显示），同时还要处理javascript任务以及各种输入事件。要让这么多不同类型的任务在主线程上有条不紊的执行，就需要一个系统统筹调度。
![屏幕截图 2024-09-02 181336](https://github.com/user-attachments/assets/c30a43af-4927-4945-868d-d664d5bfc68a)

消息队列是一种数据结构，可以存放要执行的任务，先进先出。
消息队列中的任务类型
- 输入事件（键盘事件、鼠标事件）等
- 微任务
- 文件读写
- WebSocket
- JavaScript定时器
- ...
主线程执行的任务，全部来自于消息队列。
所有的任务都是在单线程中执行的。每次只能执行一个任务，其他任务都处于等待状态。所以使用事件循环，从消息队列的头部取出要执行的任务，执行完毕再取下一个任务，直到消息队列为空。
假设渲染主线程正在渲染页面，同时又有鼠标事件，那该怎么处理呢。
1. 先处理鼠标事件，将会阻碍页面渲染，用户体验将会很差--怎么每次点下鼠标怎么就会卡呢
2. 排队？插入到消息队列中？——  这种方式虽然更差，像这种用户主动事件，需要立刻触发，要是从消息队列中排队到事件循环在执行，给用户感觉就是——无响应体验更差
解决方法：使用微任务，在当前宏任务结束，后调用微任务。

# setTimeOut
- 为了执行定时器的实现，浏览器增加了延时队列
- 由于消息队列排队和一些系统级别的限制，通过setTimeOut设置的回调任务并非总是可以实时地被执行
- 定时器中存在的陷阱
  - 当前任务执行时间过久，会影响延迟到期定时任务的执行（任务是单线程执行）
  - 如果setTimeOut存在嵌套调用，那么系统会设置最短时间间隔为4毫秒
  嵌套调用超过5次以上，后面每次的调用最小时间间隔是4毫秒。在chrome中，定时器被嵌套调用5次以上，系统会判断该函数方法被阻塞了，如果定时器的调用时间间隔小于4毫秒，浏览器会将每次调用的时间间隔设置为4毫秒。
  - 未激活的页面，setTimeOut执行最小间隔是1000毫秒
  未被激活的页面中定时器最小值大于1000毫秒，为了优化后台页面的加载损耗降低耗电量。
  - 延时执行时间有最大值（24.8天）
  浏览器以32个bit来存储延时值，大于32bit（2^32取正数）的值，大于这个值时，就会溢出，导致定时器会立即执行。
  - setTimeOut设置的回调函数中this指向全局
    - 可使用匿名函数或箭头函数
    - 使用bind方法
# XMLHttpRequest
回调函数 ：将一个函数作为参数传递给另一个函数，那个作为参数的函数就是回调函数。

回调函数在主函数返回之前执行——同步函数

回调函数没有在主函数内被调用——异步函数

系统调用栈的信息可以通过：chrome://tracing/来抓取

# 宏任务 微任务
-宏任务：
普通消息队列和延时队列中的任务都是宏任务

-微任务：
  - 把异步回调函数封装成一个宏任务，添加到消息队列尾部，当循环系统执行到该任务的时候执行回调函数。
  - 执行时机是在主函数执行结束之后，当前宏任务结束之前执行回调函数，微任务形式的体现。
微任务就是一个需要异步执行的函数，执行时机是在主函数执行结束之后，当前宏任务结束之前。
微任务，在v8创建全局执行上下文同时，v8也会在那部创建一个微任务队列。每个宏任务都关联一个微任务队列。
# 监听DOM变化方法
Mutation Event 采用了观察者的设计模式，当DOM有变动时就会立刻触发相应的事件——同步回调
这种方式有很严重的性能问题，每次DOM变动，渲染引擎都会去调用Javascript，会产生大量的性能开销。
为了解决Mutation Event 由于同步调用Javascript而造成的性能问题，引入了MutationObserver来替代Mutation Event。
MutationObserver将响应函数改为异步调用，可以不用在每次DOM变化都触发一般调用，而是等多长DOM变化后，一次触发异步调用，并且还会使用一个数据结构来记录这期间所有的DOM变化。这样即使频繁操作DOM，也不会对性能造成太大的影响。

# Promise
解决了什么问题：解决了异步编码风格的问题
异步编程的问题
- 代码逻辑不连续 - 异步回调
封装代码使用callback
- 回调地狱
  - 多层嵌套的问题
  - 每种任务的处理结果存在两种可能性，需要在每种任务执行结束后分别处理这两种可能性

使用promise 解决嵌套调用和多次错误处理
嵌套调用解决
- Promise 实现了回调函数的延时绑定
- 需要将回调函数onResolve的返回值穿透到最外层
多次错误处理
- promise对象的错误具有冒泡性质，会一直向后传递，直到被onReject函数处理或catch语句捕获为止。
```js
// 模拟promise的原理
funtion mypromise（fn）{
    var _onResolve = null
    var _onReject = null
    this.then = function(onResolve, onReject) {
        _onResolve = onResolve
    }
    function resolve(value) {
    //
        setTimeout(()=>{
        _onResolve(value)
        },0)
    }
    fn(resolve, null)
}
```
# async/await
ES7中引入了async/await，在不阻塞主线程的情况下使用同步代码实现异步访问资源的能力
### 生成器   协程
生成器函数是一个带星号函数，而且是可以暂停执行和恢复执行的
```js
function* dome(){
    console.log(1)
    yield 'generator 2'
    
    console.log(2)
    yield 'generator 2'
    
    console.log(3)
    yield 'generator 2'
    
    console.log(4)
    return 'generator 2'
}

console.log(0)

let dome1 = dome()
console.log(dome1.next().value)
console.log(11)
console.log(dome1.next().value)
console.log(12)
console.log(dome1.next().value)
console.log(13)
console.log(dome1.next().value)
console.log(14)


/*
0
 1
generator 2
 11
 2
generator 2
12
3
 generator 2
 13
 4
 generator 2
14

*/
```
生成器的具体使用方式：
- 在生成器函数内部执行一段代码，如果遇到yield关键字，javascript引擎将返回关键字后面的内容给外部，并暂停该函数的执行。
- 外部函数可以通过next方法恢复函数的执行
### 如何实现的暂停和恢复
协程是一种比线程更加轻量级的存在。跑在线程上的任务，一个线程上可以存在多个协程，但是在线程上同时只能执行一个协程。协程不是被操作系统内核控制的，而完全由程序所控制。不会消耗资源
协程的四点规则：
- 通过调用生成器函数来创建一个协程，创建之后，协程并没有立即执行
- 让协程执行，需要通过调用.next
- 当协程在执行的时候，可以通过yield关键字来暂停协程的执行，并返回主要信息给父协程
- 如果协程在执行期间，遇到了return关键字，javascript引擎会结束当前协程并将return后面的内容返回给父协程
### async
通过异步执行并隐式返回Promise作为结果的函数
### await
```js
async function foo() {
    console.log(1)
    let a = await 100
    console.log(a)
    console.log(3)
}
console.log(0)
foo()
console.log(3)

/*
0
1
3
100
2
*/
```

# 优化线上耗时（网络优化）

![屏幕截图 2024-09-03 114454](https://github.com/user-attachments/assets/d7c5a392-8b2d-46a2-9a60-66c92355c2c3)


## Queuing 排队
发起请求时不能被立即执行，需要排队等待
## Stalled 停滞
开始发起连接，由于其他原因导致连接过程被推迟 
## Request 
和服务器建立好连接之后，网络进程会准备请求数据，并发送给网络。通常这个阶段非常快，只需要把浏览器缓冲区的数据发送出去就结束了，并不需要判断服务器是否接受到了。
## Waiting for server response （TTFB）
等待接收服务器第一个字节的数据的阶段 **第一字节时间**

1. 排队时间过久（Queuing）
  - 域名分片
  浏览器会为每个域名最多维护6个TCP连接，如果超过了就会进入排队
  - 升级站点到HTTP2
  http2没有最多维护6个TCP连接到限制
2. 第一字节时间过久（TTFB）
  - 服务器生成页面数据的时间过久
    - 想办法提高服务器的处理速度，通过增加各种缓存的技术
  - 网络的原因
    - 使用CDN来缓存一些静态文件
  - 发送请求头时带上了多余的用户信息
    - 发送请求时尽量可能地减少一些不必要的Cookie数据信息
3. Content Download时间过久
单个请求的Content Download花费了大量的时间，有可能是字节数太多的原因造成的，减少文件大小，比如压缩、去掉源码中不必要的注释等

## 白屏优化（资源获取到后，渲染进程创建一个空白页面，解析白屏）
主要有：
- 解析HTML
- 下载CSS
- 下载Javascript
- 生成CSSOM
- 执行Javascript
- 生成布局树
- 绘制页面

**主要体现在下载CSS文件、下载Javascript文件和执行Javascript**
  
解决方法：
- 通过内联Javascript、内联CSS来移除这两种类型的文件下载，这样获取到HTML文件之后就可以直接开始渲染流程
- 可以尽量减少文件的大小。通过webpack等工具移除一些不必要的注释，压缩Javascript文件
- 将一些不需要在解析HTML阶段使用的Javascript标记上sync或者defer
- 大的css文件，可以通过媒体查询属性，将其拆分为多个不同用途的CSS文件，只有在特定场景下才会加载特定的CSS文件

## 交互优化
让单个帧的生成速度变快
- 减少Javascript脚本的执行时间（使用webworks，将一次执行的任务分解为多个任务，使得每次的执行时间不要太久）
- 避免强制同步布局
javascript强制计算样式和布局操作提前到当前的任务中
- 避免布局抖动
指在一次 JavaScript 执行过程中，多次执行强制布局和抖动操作
- 合理利用CSS合成动画
合成动画是直接在合成线程上执行的，这和在主线程上执行的布局、绘制等操作不同，如果主线程被Javascript或者一些布局任务占用，CSS动画依然能继续执行。尽量利用CSS合成动画，如果能让CSS处理动画，就尽量交给CSS操作。如果能提前知道对某个元素执行动画操作，最后将其标记为will-change，告诉渲染引擎需要将该元素单独生成一个图层。
- 避免频繁的垃圾回收
JavaScript 使用了自动垃圾回收机制，如果在一些函数中频繁创建临时对象，那么垃圾回收器也会频繁地去执行垃圾回收策略。这样当垃圾回收操作发生时，就会占用主线程，从而影响到其他任务的执行，严重的话还会让用户产生掉帧、不流畅的感觉。

## DOM的缺陷
每次操作DOM，javascript渲染引擎都需要进行重排、重绘或者合成等操作。如果DOM结构非常复杂，频繁的操作DOM，重排、重绘都非常耗时，会导致性能问题。

# HTTP性能优化

## 超文本传输协议 HTTP/0.9

采用了基于请求响应的模式，从客户端发出请求，服务器返回数据
- HTTP都是基于TCP协议的，所以客户端先要根据IP地址、端口和服务器建立TCP连接，而建立连接的过程就是TCP协议三次握手的过程
- 建立好连接之后，后发送一个GET请求行的信息，来获取index.html
- 服务器接收请求之后，读取对应的HTML文件，并将数据以ASCII字符流返回给客户端
- HTML文档传输完成后，断开连接


## HTTP/1.0
HTTP/1 除了对多文件提供了良好的支持还有一下特性
- 引入了状态码
- 提供了Cache机制
- 用户代理。服务器需要统计客户端的基础信息
随着技术的不断发展，需求也在不断迭代更新，HTTP/1.0 又加入了一下特性
- 改进持久连接
- 提供了虚拟主机的支持（增加了Host字段）
- 动态生成的内容提供了完美的支持（引入了Chunk transfer机制）
- 客户端Cookie、安全机制

### HTTP/1.1为网络效率做了大量的优化
- 增加了持久连接
- 浏览器为每个域名最多同时维护6个TCP持久连接
- 使用CDN的实现域名分片机制

### 主要问题
对宽带的利用率不理想
带宽是指每秒最大能发送或者接收的字节数
- TCP的慢启动
- 同时开启多条TCP连接，这些连接会竞争固定的带宽
- HTTP/1.1队头阻塞的问题

  
### HTTP/2的多路复用
一个域名只使用一个TCP长连接和消除队头阻塞问题

# 网络攻击
Cross Site Scripting  CSS 为了与样式css区分开，取名 XSS 跨站脚本
在HTML文件中或者DOM中注入恶意脚本，用户浏览页面利用注入恶意脚本对用户实施攻击的一种手段
- 窃取Cookie 信息
- 监听用户行为
- 修改DOM
- 在页面内生成浮窗广告
  
XSS主要有三种方式
- 存储XSS攻击
将恶意代码存储到存在漏洞的服务器上，浏览器访问服务器，用户浏览页面的时候，恶意脚本会将用户的信息上传到恶意服务器上
- 反射XSS攻击
- 基于DOM的XSS攻击

## 阻止xss攻击

### 服务器对输入脚本进行过滤或转码
### 充分利用 CSP
- 限制加载其他域下的资源文件，这样即使黑客插入了一个 JavaScript 文件，这个 JavaScript 文件也是无法被加载的；
- 禁止向第三方域提交数据，这样用户数据也不会外泄；
- 禁止执行内联脚本和未授权的脚本；
- 还提供了上报机制，这样可以帮助我们尽快发现有哪些 XSS 攻击，以便尽快修复问题。

### 使用 HttpOnly 属性
服务器可以将某些 Cookie 设置为 HttpOnly 标志，HttpOnly 是服务器通过 HTTP 响应头来设置的

## CSRF攻击
Cross-site request forgery 跨站请求伪造
CSRF攻击就是黑客利用了用户的登录状态，并通过第三方的站点来做一些事情

csrf与xss的不同，csrf攻击不需要将恶意代码注入用户页面，仅仅是利用服务器漏洞和用户的登录状态来实施攻击

### csrf攻击的三个必要条件：
- 目标站点一定要有csrf漏洞
- 用户要登录过目标站点，并且在浏览器上保持有该站点的登录状态
- 需要用户打开一个第三方站点，可以是黑客的站点，也可以是一些论坛

### 阻止csrf攻击
- 利用好cookie 的SameSite属性
  SameSite选项通常有
  - Strict 最为严格
  浏览器会完全禁止第三方Cookie。
  - Lax相对宽松一点
  在跨站的的情况下，从第三方站点的连接打开和从第三方站点提交Get方式的表单这两种方式都会携带Cookie。
  - None， 在任何情况下都会发送Cookie数据
- 验证请求的来源站点
在服务端验证请求来源的站点
  - Referer是HTTP请求头中的一个字段，记录了该HTTP请求的来源地址。可以通过Referer告诉服务器HTTP请求来源，但是有一些场景是不合适将来源URL暴露给服务器，因此浏览器提供给开发者一个选项，可以不用上传Referer值，Referrer Policy。
- CSRF token
  - 在浏览器向服务器发起请求时，服务器生成一个CSRF Token。
  - 在浏览器端如果要发起转账请求，需要带上页面中的CSRF Token，然后服务器会验证该Token是否合法。
