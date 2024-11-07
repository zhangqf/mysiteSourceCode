---
editLink: false
outline: deep
outlineText: "33"
---

# 绘制和变换三角形

已经了解了如何获取`WebGL上下文`，清空`<canvas>`为2D/3D绘图作准备，探究了顶点着色器与片元着色器的功能与特征，以及使用着色器进行绘图的方法。

本章学习内容：

1. 三角形在三维图形学中的重要地位，以及WebGL如何绘制三角形
2. 使用多个三角形绘制其他类型的基本图形
3. 利用简单的方程对三角形做基本地变换，如移动、旋转和缩放
4. 利用矩阵简化变换

**三维模型的基本单位是三角形**

## 绘制多个点

上一章中的方式只能绘制一个点。对于那些由多个顶点组成的图形，比如三角形、矩形和立方体来说，我们需要一次性地将图形的顶点全部传出顶点着色器，然后才能把图形画出来。

WebGL提供了提供了一种很方便的机制，即缓冲区对象（buffer object），他可以一次性地向着色器传入多个顶点的数据。缓冲区对象是`WebGL`系统中的一块内存区域，
我们可以一次性地向缓冲区对象中填充大量的顶点数，然后将这些数据保存在其中供`顶点着色器`使用。

```js
const VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'void main() {\n' +
        'gl_Position = a_Position;\n' +
        'gl_PointSize = 10.0;\n' +
    '}\n'
const FSHADER_SOURCE =
   ' void main() {\n'+
        'gl_FragColor = vec4(1.0, 1.0, 0.0,1.0);\n'+
    '}\n'


function main() {
    var canvas = document.getElementById('webgl')
    var gl = getWebGLContext(canvas)
    if(!gl) {
        console.error('Failed to get the rendering context for WebGL')
        return;
    }

    // 初始化着色器
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('Failed to initialize shaders.')
        return;
    }

    // 设置顶点着色器
    var n = initVertexBuffers(gl); // [!code ++]

    if(n < 0) {
        console.error('Failed to set the positions of the vertices')
        return;
    }

    // // 获取attribut变量的存储位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    //
    // var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')
    if(a_Position < 0) {
        console.error('Failed to get the storage location of a_Position')
        return;
    }
    //

    // 设置canvas背景色
    gl.clearColor(0.0,0.0,0.0,1.0)

    // 清空canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制三个点
    gl.drawArrays(gl.POINTS, 0, 1) // [!code --]
    gl.drawArrays(gl.POINTS, 0, n) // [!code ++]


}

function initVertexBuffers(gl) { // [!code ++]
    var vertices = new Float32Array([ // [!code ++]
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5 // [!code ++]
    ]) // [!code ++]
    var n = 3 // 点的个数 // [!code ++]

    // 创建缓冲区对象 // [!code ++]
    var vertexBuffer = gl.createBuffer(); // [!code ++]
    if(!vertexBuffer) { // [!code ++]
        console.error('Failed to create the buffer object') // [!code ++]
        return -1; // [!code ++]
    } // [!code ++]

    // 将缓冲区对象绑定到目标 // [!code ++]
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer) // [!code ++]

    // 向缓冲区对象中写入数据 // [!code ++]
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // [!code ++]

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position'); // [!code ++]

    // 将缓冲区对象分配给a_Position变量 // [!code ++]
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0) // [!code ++]

    // 连接a_Position变量与分配给它的缓冲对象 // [!code ++]
    gl.enableVertexAttribArray(a_Position) // [!code ++]
    return n // [!code ++]
}

```

流程：

1. 获取WebGL绘图上下文
2. 初始化着色器
3. 设置点的坐标信息
4. 设置`<canvas>`背景色
5. 清空`<canvas>`
6. 绘制

`initVertexBuffers()`函数的任务是创建顶点缓冲区对象，并将多个顶点的数据保存在缓冲区中，然后将缓冲区传入给顶点着色器。

`gl.drawArrays(gl.POINTS, 0, n)`, 这里的n为要画的顶点数，因为在`initVertexBuffers()`函数中利用缓冲区对象向顶点着色器传输了多个顶点数据，所以需要通过第3个参数告诉`gl.drawArrays()`函数需要绘制多少个顶点。

### 使用缓冲区对象

使用缓冲区对象需要遵循五个步骤：

1. 创建缓冲区对象（gl.createBuffer()）
2. 绑定缓冲区对象（gl.bindBuffer()）
3. 将数据写入缓冲区对象（gl.bufferData()）
4. 将缓冲区对象分配给一个attribute变量（gl.vertexAttribPointer()）
5. 开启attribute变量（gl.enableVertexAttribArray()）

#### 创建缓冲区对象 （gl.createBuffer()）

使用`gl.createBuffer()`方法来创建缓冲区对象

![原理图](./images/createBuffer.png)

| 返回值   | 描述        |
|-------|-----------|
| 非null | 新创建的缓冲区对象 |
| null  | 创建缓冲区对象失败 |
| 错误    | 无         |

可以使用`gl.deleteBuffer(buffer)`函数，删除被`gl.createBuffer()`创建出来的缓冲区对象

| 参数     | 描述        |
|--------|-----------|
| buffer | 待删除的缓冲区对象 |
| 返回值    | 无         |
| 错误     | 无         |

#### 绑定缓冲区 （gl.bindBuffer()）

将创建好的缓冲区对象绑定到`WebGL`系统中以及存在的目标上。这个目标表示缓冲区对象的用途，这样`WebGL`才能够正确处理其中的内容。

![原理图](./images/bindBuffer.png)

gl.bindBuffer(target, buffer)

| 参数                      | 描述                                                         |
|-------------------------|------------------------------------------------------------|
| target                  |                                                            |
| gl.ARRAY_BUFFER         | 表示缓冲区对象中包含了顶点的数据                                           |
| gl.ELEMENT_ARRAY_BUFFER | 表示缓冲区对象中包含了顶点的索引值                                          |
| buffer                  | 指定之前由gl.createBuffer()返回的待绑定的缓冲区对象，如果指定为null，则禁用对target的绑定 |
| 返回值                     | 无                                                          |

| 错误           | 描述                           |
|--------------|------------------------------|
| INVALID_ENUM | target不是上述值之一，这时将保持原有的绑定情况不变 |

#### 向缓冲区对象中写入数据（gl.bufferData()）

开辟空间，并向缓冲区中写入数据。

![原理图](./images/bufferData.png)

gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

将第2个参数`vertices`中的数据写入了绑定到第1个参数gl.ARRAY_BUFFER上的缓冲对象。我们不能直接向缓冲对象区写入数据，而只能向“目标”写入数据，所以要向缓冲区写入数据，必须先绑定。

`gl.bufferData(target, data, usage)`

开辟存储空间，向绑定在`target`上的缓冲区对象写入数据`data`

| 参数              | 描述                                                                         |
|-----------------|----------------------------------------------------------------------------|
| target          | gl.ARRAY_BUFFER 或 gl.ELEMENT_ARRAY_BUFFER                                  |
| data            | 写入缓冲区对象的数据（类型化数组）                                                          |
| usage           | 表示程序将如何使用存储在缓冲区对象中的数据。该参数将帮助WebGL优化操作，但是就算传入错误的值，也不会终止程序（仅降低程序运行效率）        |
| gl.STATIC_DRAW  | 只会向缓冲区对象中写入一次数据，但需要绘制很多次；表示缓冲区的数据不会或几乎不会改变。在数据上传后，绘制操作会频繁使用这些数据，但不会对它们进行修改 |
| gl.STREAM_DRAW  | 只会向缓冲区对象中写入一次数据，然后绘制若干次；表示缓冲区的数据会快速改变，通常在每次绘制之前都会更新                        |
| gl.DYNAMIC_DRAW | 会向缓冲区对象中多次写入数据，并绘制很多次；表示缓冲区的数据会频繁改变，但不一定在每次绘制时都更新。适合在多个绘制调用之间修改数据的情况       |

### 类型化数组

`javascript`中常见的`Array`对象，是一种通用的类型，既可以存储数字，也可以存错字符串，而并没有对“大量元素都是同一类型”这种情况进行优化。为了解决这个问题，`WebGL`引入了类型化数组。

浏览器事先知道数组中的数据类型，所以处理起来更加有效率

WebGL使用的各种类型化数组

| 数组类型         | 每个元素所占字节数 | 描述（c语言中的数据类型）            |
|--------------|-----------|--------------------------|
| Int8Array    | 1         | 8位整型数（signed char）       |
| UInt8Array   | 1         | 8位无符号整型数（unsigned char）  |
| Int16Array   | 2         | 16位整型数（signed char）      |
| UInt16Array  | 2         | 16位无符号整型数（unsigned char） |
| Int32Array   | 4         | 32位整型数（signed char）      |
| UInt32Array  | 4         | 32位无符号整型数（unsigned char） |
| Float32Array | 4         | 单精度32位浮点数（float）         |
| Float64Array | 8         | 双精度64位符点数（double）        |

类型化数组的方法、属性和常量

| 方法、属性和常量           | 描述                           |
|--------------------|------------------------------|
| get(index)         | 获取第index个元素值                 |
| set(index, value)  | 设置第index个元素的值为value          |
| set(array, offset) | 从第offset个元素开始将数组array中的值填充进去 |
| length             | 数组的长度                        |
| BYTES_PER_ELEMENT  | 数组中每个元素所占的字节数                |

**创建类型化数组的唯一方法就是使用`new`运算符**

```js
var vertices = new Float32Array([
    0.0, 0.5, -0.5, -0.5, 0.5, -0.5
])

// 指定数组元素的个数来创建一个空的类型化数组
var vertices = new Float32Array(4)
```

**以上就是建立和使用缓冲区的前三个步骤（在WebGL系统中创建缓冲区， 绑定缓冲区对象到目标，向缓冲区对象中写入数据）**

### 将缓冲区对象分配给attribute变量（gl.vertexAttribPointer()）

可以使用`gl.vertexAttrib[1234]f系列函数为attribute变量分配值。但是，这些方法一次只能向attribute变量分配一个值。而现在，需要将整个数组中的所有值，一次性第分配给一个attribute变量。

gl.vertexAttribPointer()方法解决了这个问题，他可以将整个缓冲区对象分配个attribute变量。

`gl.vertexAttribPointer(location, size, type, normalized, stride, offset)`

将绑定到`gl.ARRAY_BUFFER`的缓冲区对象分配给由`location`指定的`attribute`变量

| 参数                | 描述                                                                                     |
|-------------------|----------------------------------------------------------------------------------------|
| location          | 指定待分配attribute变量的存储位置                                                                  |
| size              | 指定缓冲区中每个顶点的分量个数（1到4）。若size比attribute变量需要的分量数小，缺失分量将按照与gl.vertexAttrib[1234]f()相同的规则不全。 |
| type              | 用以下类型之一来指定数据格式                                                                         |
| gl.UNSIGNED_BYTE  | 无符号字节，Uint8Array                                                                       |
| gl.SHORT          | 短整型， Int16Array                                                                        |
| gl.UNSIGNED_SHORT | 无符号短整型， Uint16Array                                                                    |
| gl.INT            | 整型，Int32Array                                                                          |
| gl.UNSIGNED_INT   | 无符号整型， Unit32Array                                                                     |
| gl.FLOAT          | 符点型，Float32Array                                                                       |
| normalize         | 传入true或false，表明是否将非符点型的数据归一化到[0,1]或[-1,1]区间                                            |
| stride            | 指定相邻两个顶点间的字节数，默认为0                                                                     |
| offset            | 指定缓冲区对象中的偏移量（以字节为单位），即attribute变量从缓冲区中的何处开始存储。如果是从起始位置开始的，offset设为0                    |
| 返回值               | 无                                                                                      |

| 错误                | 描述                                                     |
|-------------------|--------------------------------------------------------|
| INVALID_OPERATION | 不存在当前程序                                                |
| INVALID_VALUE     | location大于等于attribute变量的最大数目（默认为8）。或者stride或offset是负值› |

![原理图](./images/bufferObjectToAttribute.png)

### 开启attribute变量（gl.enableVertexAttribArray()）

为了是顶点着色器能够访问缓冲区内的数据，需要使用`gl.enableVertexAttribArray()`方法来开启`attribute`变量

`gl.enableVertexAttribArray(a_Position);` 这个函数是处理的缓冲区，而不是 顶点数组

| 参数            | 描述                                 |
|---------------|------------------------------------|
| location      | 指定attribute变量的存储位置                 |
| 返回值           | 无                                  |
| 错误            | 描述                                 |
| INVALID_VALUE | location大于等于attribute变量的最大数目（默认为8） |

![原理图](./images/enableVertexAttribArray.png)

也可以使用 `gl.disableVertexAttribArray()`来关闭分配

| 参数            | 描述                                  |
|---------------|-------------------------------------|
| location      | 指定attribute变量的存储位置                  |
| 返回值           | 无                                   |
| 错误            | 描述                                  |
| INVALID_VALUE | location 大于等于attribute变量的最大数量（默认为8） |

### 绘制点

`gl.drawArrays(mode, first, count)`

| 参数    | 描述                                                                                                                    |
|-------|-----------------------------------------------------------------------------------------------------------------------|
| mode  | 指定绘制的方式，可以接收以下常量符号：gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, gl.TRIANGLES, gl.TRIANGLE_STRIP, gl.TRIANGLE_FAN |
| first | 指定从哪个顶点开始绘制（整型数）                                                                                                      |
| count | 指定绘制需要用到多少个顶点（整型数）                                                                                                    |

**`gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)`完整流程图**

![效果图](./images/completeProcess.png)

## 绘制三角形

```js
const VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'void main() {\n' +
        'gl_Position = a_Position;\n' +
        'gl_PointSize = 10.0;\n' + // [!code --]
    '}\n'
const FSHADER_SOURCE =
   ' void main() {\n'+
        'gl_FragColor = vec4(1.0, 1.0, 0.0,1.0);\n'+
    '}\n'


function main() {
    var canvas = document.getElementById('webgl')
    var gl = getWebGLContext(canvas)
    if(!gl) {
        console.error('Failed to get the rendering context for WebGL')
        return;
    }

    // 初始化着色器
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('Failed to initialize shaders.')
        return;
    }

    // 设置顶点着色器
    var n = initVertexBuffers(gl);

    if(n < 0) {
        console.error('Failed to set the positions of the vertices')
        return;
    }

    // // 获取attribut变量的存储位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    //
    // var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')
    if(a_Position < 0) {
        console.error('Failed to get the storage location of a_Position')
        return;
    }
    //
    // canvas.onmousedown = function (ev) {click(ev, gl, canvas, a_Position, u_FragColor)}



    // gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0)

    // 设置canvas背景色
    gl.clearColor(0.0,0.0,0.0,1.0)

    // 清空canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制
    gl.drawArrays(gl.POINTS, 0, n) // [!code ++]
    gl.drawArrays(gl.TRIANGLES, 0, n) // [!code --]


}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ])
    var n = 3 // 点的个数

    // 创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer) {
        console.error('Failed to create the buffer object')
        return -1;
    }

    // 将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

    // 向缓冲区对象中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    // 将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)

    // 连接a_Position变量与分配给它的缓冲对象
    gl.enableVertexAttribArray(a_Position)
    return n
}

```

![效果图](./images/triangles.png)

`gl.drawArrays(gl.TRIANGLES, 0, n)`

gl.drawArrays()方法的第一个参数 mode 改为gl.TRIANGLES, 就相当于告诉WebGL， 从缓冲区中的第1个顶点开始，使顶点着色器执行3次，用这3个顶点绘制出一个三角形

gl.drawArrays() 即强大又灵活，通过给第一个参数指定不同的值，就能以7种不同的方式来绘制图形。

**WebGL可以绘制的基本图形**

| 基本图形  |        参数mode        | 描述                                                                                                                      |
|:------|:--------------------:|:------------------------------------------------------------------------------------------------------------------------|
| 点     |      gl.POINTS       | 一系列点，绘制在v0、v1、v2...处                                                                                                    |
| 线段    |       gl.LINES       | 一系列单独的线段，绘制在（v0, v1）、（v2， v3）、（v4，v5）...处，<br/> 如果点的个数是奇数，最好一个将被忽略                                                      |
| 线条    |    gl.LINE_STRIP     | 一系列连接的线段，被绘制在（v0，v1）、（v1、v2）、（v2，v3）...处，<br/>第一个点是第一条线段的起点，第二个点是第一条线段的终点和第二条线段的起点...<br/>一次类推。最后一个点是最后一条线段的终点          |
| 回路    |     gl.LINE_LOOP     | 一系列连接的线段。与gl.LINE_STRIP绘制的线条相比，增加了一条从最后一个<br/>点到第一个点的线段。                                                                |
| 三角形   |     gl.TRIANGLES     | 一系列单独的三角形，绘制在（v0，v1，v2）、（v3， v4，v5）...处。如果<br/>点的个数不是3的整数倍，最后剩下的一个或两个点将被忽略                                              |
| 三角带   |  gl.TRIANGLES_STRIP  | 一系列条带状的三角形，前三个点构成了第一个三角形，从第2个点开始的三个点<br/>‘成了第2个三角形，以此类推。这些三角形被绘制在（v0，v1，v2）、（v2，v1，v3）、<br/>（v2，v3、v4）...处              |
| 三角扇   |   gl.TRIANGLES_FAN   | 一系列三角形组成的类似与扇形的图形。前三个点构成了第一个三角形，接下来的<br/>一个点和前一个三角形的最后一条边组成接下来的一个三角形。这些三角形被绘制<br/>在（v0，v1，v2）、（v0，v2，v3）、（v0、v3、v4）...处 |

![示例图](./images/gl.drawArraysMode.png)

修改例中的`gl.drawArrays(gl.LINES, 0, n)`

![效果图](./images/line.png)

修改例中的`gl.drawArrays(gl.LINE_STRIP, 0, n)`

![效果图](./images/line_strip.png)

修改例中的`gl.drawArrays(gl.LINE_LOOP, 0, n)`

![效果图](./images/line_loop.png)

## Rectangle

```js
const VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'void main() {\n' +
        'gl_Position = a_Position;\n' +
        // 'gl_PointSize = 10.0;\n' +
    '}\n'
const FSHADER_SOURCE =
   ' void main() {\n'+
        'gl_FragColor = vec4(1.0, 1.0, 0.0,1.0);\n'+
    '}\n'


function main() {
    var canvas = document.getElementById('webgl')
    var gl = getWebGLContext(canvas)
    if(!gl) {
        console.error('Failed to get the rendering context for WebGL')
        return;
    }

    // 初始化着色器
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('Failed to initialize shaders.')
        return;
    }

    // 设置顶点着色器
    var n = initVertexBuffers(gl);

    if(n < 0) {
        console.error('Failed to set the positions of the vertices')
        return;
    }

    // // 获取attribut变量的存储位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    //
    // var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')
    if(a_Position < 0) {
        console.error('Failed to get the storage location of a_Position')
        return;
    }
    //
    // canvas.onmousedown = function (ev) {click(ev, gl, canvas, a_Position, u_FragColor)}



    // gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0)

    // 设置canvas背景色
    gl.clearColor(0.0,0.0,0.0,1.0)

    // 清空canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制三个点
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)


}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5 // [!code --]
        -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5 // [!code ++]
    ])
    var n = 3 // 点的个数 // [!code --]
    var n = 4 // 点的个数 // [!code ++]
    // 创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer) {
        console.error('Failed to create the buffer object')
        return -1;
    }

    // 将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

    // 向缓冲区对象中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    // 将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)

    // 连接a_Position变量与分配给它的缓冲对象
    gl.enableVertexAttribArray(a_Position)
    return n
}

```

![效果图](./images/Rectangle.png)

`gl.drawArrays(gl.TRIANGLE_FAN, 0, n)`

![效果图](./images/Triangle_fan.png)

### 移动、旋转和缩放

```js
const VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform vec4 u_Translation;\n' + // [!code ++]
    'void main() {\n' +
        'gl_Position = a_Position + u_Translation;\n' +
    '}\n'
const FSHADER_SOURCE =
   ' void main() {\n'+
        'gl_FragColor = vec4(1.0, 1.0, 0.0,1.0);\n'+
    '}\n'

// 在 x y z 方向上平移的距离

var Tx = 0.5, Ty = 0.5, Tz= 0.0; // [!code ++]

function main() {
    var canvas = document.getElementById('webgl')
    var gl = getWebGLContext(canvas)
    if(!gl) {
        console.error('Failed to get the rendering context for WebGL')
        return;
    }

    // 初始化着色器
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('Failed to initialize shaders.')
        return;
    }

    // 设置顶点着色器
    var n = initVertexBuffers(gl);


    var u_Translation = gl.getUniformLocation(gl.program, 'u_Translation'); // [!code ++]
    gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0) // [!code ++]

    if(n < 0) {
        console.error('Failed to set the positions of the vertices')
        return;
    }

    // // 获取attribut变量的存储位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    //
    // var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')
    if(a_Position < 0) {
        console.error('Failed to get the storage location of a_Position')
        return;
    }
    //
    // canvas.onmousedown = function (ev) {click(ev, gl, canvas, a_Position, u_FragColor)}



    // gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0)

    // 设置canvas背景色
    gl.clearColor(0.0,0.0,0.0,1.0)

    // 清空canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制三个点
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n)


}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5
    ])
    var n = 4 // 点的个数

    // 创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer) {
        console.error('Failed to create the buffer object')
        return -1;
    }

    // 将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

    // 向缓冲区对象中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    // 将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)

    // 连接a_Position变量与分配给它的缓冲对象
    gl.enableVertexAttribArray(a_Position)
    return n
}

```

![效果图](./images/translation.png)

```js

const VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform float u_CosB, u_SinB;\n' + // [!code ++]
    'void main() {\n' +
    'gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;\n' + // [!code ++]
    'gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;\n' + // [!code ++]
    'gl_Position.z = a_Position.z;\n' + // [!code ++]
    'gl_Position.w = 1.0;\n' + // [!code ++]
    '}\n'
const FSHADER_SOURCE =
    ' void main() {\n' +
    'gl_FragColor = vec4(1.0, 1.0, 0.0,1.0);\n' +
    '}\n'


var ANGLE = 90.0 // [!code ++]

function main() {
    var canvas = document.getElementById('webgl')
    var gl = getWebGLContext(canvas)
    if (!gl) {
        console.error('Failed to get the rendering context for WebGL')
        return;
    }

    // 初始化着色器
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('Failed to initialize shaders.')
        return;
    }

    // 设置顶点着色器
    var n = initVertexBuffers(gl);

    if (n < 0) {
        console.error('Failed to set the positions of the vertices')
        return;
    }

    var radian = Math.PI * ANGLE / 180.0; // [!code ++]
    var conB = Math.cos(radian); // [!code ++]
    var sinB = Math.sin(radian); // [!code ++]

    var u_CosB = gl.getUniformLocation(gl.program, 'u_CosB'); // [!code ++]
    var u_SinB = gl.getUniformLocation(gl.program, 'u_SinB'); // [!code ++]

    gl.uniform1f(u_CosB, conB) // [!code ++]
    gl.uniform1f(u_SinB, sinB) // [!code ++]



    // // 获取attribut变量的存储位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    //
    // var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')
    if (a_Position < 0) {
        console.error('Failed to get the storage location of a_Position')
        return;
    }
    //
    // canvas.onmousedown = function (ev) {click(ev, gl, canvas, a_Position, u_FragColor)}


    // gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0)

    // 设置canvas背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    // 清空canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制三个点
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n)


}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5
    ])
    var n = 4 // 点的个数

    // 创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.error('Failed to create the buffer object')
        return -1;
    }

    // 将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

    // 向缓冲区对象中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    // 将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)

    // 连接a_Position变量与分配给它的缓冲对象
    gl.enableVertexAttribArray(a_Position)
    return n
}

```

![效果图](./images/rotate.png)
