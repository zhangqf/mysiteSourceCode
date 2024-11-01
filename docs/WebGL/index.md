---
editLink: false
outline: deep
outlineText: "33"
---

# WebGL

## 最短的WebGL程序

使用背景色清空canvas标签的绘图区


1. 获取`<canvas>`元素
2. 获取WebGL绘图上下文
3. 设置背景色
4. 清空`<canvas>`

### getWebGLContext(canvas) 是WebGL编程有用的辅助函数之一
获取WebGL绘图上下文，如果开启了debug属性，遇到错误时将在控制台显示错误消息

getWebGLContext(element, [, debug])

| 参数        | 描述                                                  |
|-----------|-----------------------------------------------------|
| element   | 指定 canvas 元素                                        |
| debug(可选) | 默认为false，如果设置为true，javascript中发生的错误将被显示在控制台上。它会影响性能 |
| 返回值       | 描述                                                  |
| non-null  | WebGL绘制上下文                                          |
| null      | WebGL 不可用                                           |

### gl.clearColor 指定绘图区的背景色
`gl.clearColor(red,green,blue,alpha)`

一旦指定了背景色之后，背景色就会驻存在WebGL系统中，在下一次调用gl.clearColor()方法前不会改变。

这个函数用于定义清空画布时的背景色。

### gl.clear(gl.COLOR_BUFFER_BIT)

函数的参数是`gl.COLOR_BUFFER_BIT`,而不是表示绘图区域的`<canvas>`。因为WebGL中的gl.clear()方法实际上继承自OpenGL，它基于多基本缓冲区模型，和清除二维绘图上下文不一样。
清空绘图区域，实际上是在清空颜色缓冲区（color buffer），传递参数`gl.COLOR_BUFFER_BIT`就是在告诉WebGL清空颜色缓冲区。除了颜色缓冲区，WebGL还会使用其他种类的缓冲区，比如`深度缓冲区`和`模版缓冲区`。


当调用gl.clear时，它会用之前设置的背景色来填充整个画布。也就是说，清空画布并不会导致背景色消失，而是将画布填充为你在gl.clearColor中定义的颜色。



| 参数                    | 描述                           |
|-----------------------|------------------------------|
| buffer                | 指定待清空的缓冲区，为操作符 （｜）可用来指定多个缓冲区 |
| gl.COLOR_BUFFER_BIT   | 指定颜色缓存                       |
| gl.DEPTH_BUFFER_BIT   | 指定深度缓冲区                      |
| gl.STENCIL_BUFFER_BIT | 指定模版缓冲区                      |
| 返回值                   | 无                            |
| 错误                    | 描述                           |
| INVALID_VALUE         | 缓冲区不是以上三种类型                  |

若没有指定背景色，则使用默认值

| 缓冲区名称 | 默认值               | 相关函数                                |
|-------|-------------------|-------------------------------------|
| 颜色缓存区 | （0.0，0.0，0.0，0.0） | gl.clearColor(red,green,blue,alpha) |
| 深度缓冲区 | 1.0               | gl.clearDepth(depth)                |
| 模版缓冲区 | 0                 | gl.clearStencil(s)                  |


![主页效果](./images/17.35.00.png)

## drawPoint

### 着色器（shader）
WebGL依赖于一种新的称为着色器的绘图机制。着色器提供了灵活且强大的绘制二维和三维图形的方法。WebGL程序必须使用它。着色器不仅强大，而且更复杂，仅仅通过一条简单的绘图命令是不能操作它的。

在代码中，着色器程序是以字符串的形式“嵌入”在`javascript`文件中的，在程序真正开始运行前他就设置好了。

WebGL需要两种着色器：
- 顶点着色器（Vertex shader）

    顶点着色器是用来描述顶点特性（位置、颜色等）的程序。

    顶点（vertex）是指二维或三维空间中的一个点
- 片元着色器（Fragment shader）

    进行逐片元处理过程（光照）的程序。

    片元（fragment）是一个WebGL术语。可以理解为像素（图像的单元）

在三维场景中，仅仅用线条和颜色把图形画出来是远远不够的。必须考虑，如光线照上去之后，或者观察者的视角发生变化，对场景会有什么影响，着色器可以高度灵活的完成这些工作，提供各种渲染效果。

 
着色器使用类似于C的`OpenGL ES 着色器语言`来编写。因为着色器程序代码必须预先处理成单个字符串的形式。

### 初始化着色器

1. 获取`<canvas>`元素
2. 获取WebGL绘图上下文
3. 初始化着色器
4. 设置`<canvas>`背景色
5. 清空`<canvas>`
6. 绘图

### initShaders(gl, vshader, fshader)

在WebGL系统内部`建立`和`初始化`着色器

| 参数      | 描述               |
|---------|------------------|
| gl      | 指定渲染上下文          |
| vshader | 指定顶点着色器程序代码（字符串） |
| fshader | 指定片元着色器程序代码（字符串） |
| 返回值     | 描述               |
| true    | 初始化着色器成功         |
| false   | 初始化着色器失败         |


**WebGL程序包括`运行在浏览器中的Javascript`和`运行在WebGl系统的着色器程序`这两部分**

![效果图](./images/17.34.42.png)