# vim 程序编辑器

## vi 与 vim
>所有的Unix Like系统都会内建vi文本编辑器，其他的文本编辑器则不一定会存在
>
>很多个别软件的编辑接口都会主动呼叫vi
>
>vim具有程序编辑的能力，可以主动的以字体颜色辨别语法的正确性，方便程序设计
>
>因为程序简单，编辑速度相当快速

## 按键说明

<table>
  <capital>按键说明</capital>
  <tr>
    <td colspan='2' align='center'>移动光标的方法</td>
  </tr>
  <tr>
    <td>h（ $\leftarrow$ ）</td> <td>光标向左移动一个字符</td>
  </tr>
   <tr>
    <td>j （ $\downarrow$ ）</td> <td>光标向下移动一个字符</td>
  </tr>
  <tr>
    <td>k （ $\uparrow$ ）</td> <td>光标向上移动一个字符</td>
  </tr>
   <tr>
    <td>l （ $\rightarrow$）</td> <td>光标向右移动一个字符</td>
  </tr>
  <tr>
    <td colspan='2'> 如果要进行多次移动的话可以使用 30j 或 30 $\downarrow$ 即可，其他类似</td>
  </tr>
  <tr>
    <td bgcolor="Hotpink">[ctrl] + f</td><td>向下移动一个页</td>
  </tr>
   <tr>
    <td bgcolor="Hotpink">[ctrl] + b</td><td>向上移动一个页</td>
  </tr>
   <tr>
    <td>[ctrl] + d</td><td>向下移动半页</td>
  </tr>
  <tr>
    <td>[ctrl] + u</td><td>向上移动半页</td>
  </tr>
  <tr>
    <td>+</td><td>光标移动到非空格符的下一列</td>
  </tr>
  <tr>
    <td>-</td><td>光标移动到非空格符的上一列</td>
  </tr>
  <tr>
    <td>n\<span\></td><td>光标向右移动这一列的n个字符</td>
  </tr>
  <tr>
    <td bgcolor="Hotpink">0 [home]</td><td>移动到这一列的最前面字符处</td>
  </tr>
  <tr>
    <td bgcolor="Hotpink">\$ [end]</td><td>移动到这一列的最后字符处</td>
  </tr>
  <tr>
    <td>H</td><td>光标移动到这个屏幕的最上方那一列的第一个字符</td>
  </tr>
  <tr>
    <td>M</td><td>光标移动到这个屏幕的中央那一列的第一个字符</td>
  </tr>
  <tr>
    <td>L</td><td>光标移动到这个屏幕的最下方那一列的第一个字符</td>
  </tr>
  <tr>
    <td bgcolor="Hotpink">G</td><td>移动到这个文件的最后一列</td>
  </tr>
  <tr>
    <td>nG</td><td>移动到这个文件的第n列</td>
  </tr>
  <tr>
    <td bgcolor="Hotpink">gg</td><td>移动到这个文件的第一列，相当于1G</td>
  </tr>
  <tr>
    <td bgcolor="Hotpink">n\<Enter\></td><td>光标向下移动n列</td>
  </tr>
</table>


