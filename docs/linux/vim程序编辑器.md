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
    <td colspan='2' align='center'> 如果要进行多次移动的话可以使用 30j 或 30 $\downarrow$ 即可，其他类似</td>
  </tr>
  <tr>
    <td bgcolor="#ffffcc">[ctrl] + f</td><td bgcolor="#ffffcc">向下移动一个页</td>
  </tr>
   <tr>
    <td bgcolor="#ffffcc">[ctrl] + b</td><td bgcolor="#ffffcc">向上移动一个页</td>
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
    <td>n &lt;space&gt;</td><td>光标向右移动这一列的n个字符</td>
  </tr>
  <tr>
    <td bgcolor="#ffffcc">0 [home]</td><td bgcolor="#ffffcc">移动到这一列的最前面字符处</td>
  </tr>
  <tr>
    <td bgcolor="#ffffcc">$ [end]</td><td bgcolor="#ffffcc">移动到这一列的最后字符处</td>
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
    <td bgcolor="#ffffcc">G</td><td bgcolor="#ffffcc">移动到这个文件的最后一列</td>
  </tr>
  <tr>
    <td>nG</td><td>移动到这个文件的第n列</td>
  </tr>
  <tr>
    <td bgcolor="#ffffcc">gg</td><td bgcolor="#ffffcc">移动到这个文件的第一列，相当于1G</td>
  </tr>
  <tr>
    <td bgcolor="#ffffcc">n &lt;Enter&gt;</td><td bgcolor="#ffffcc">光标向下移动n列</td>
  </tr>
  <tr>
    <td colspan='2' align='center'>搜寻与取代</td>
  </tr>
  <tr>
    <td bgcolor="#ffffcc">/word</td><td bgcolor="#ffffcc">向光标下面查找一个名称为word的字符串</td>
  </tr>
  <tr>
    <td>?word</td><td>向光标上面查询一个名称为word的字符串</td>
  </tr>
  <tr>
    <td>n</td><td>重复前面的一个查询动作</td>
  </tr>
  <tr>
    <td>N</td><td>与n相反，反向查询前一个查询动作</td>
  </tr>
  <tr>
    <td bgcolor="#ffffcc">:n1, n2s/word1/word2/g</td><td bgcolor="#ffffcc">在n1与n2列之间查询word1这个字符串，并将它替换为word2</td>
  </tr>
  <tr>
    <td bgcolor="#ffffcc">:1,$s/word1/word2/g</td><td bgcolor="#ffffcc">从第一列到最后一列查询word1字符串，并将它替换为word2</td>
  </tr>
  <tr>
    <td bgcolor="#ffffcc">:1,$s/word1/word2/gc</td><td bgcolor="#ffffcc">从第一列到最后一列查询word1字符串，并将它替换为word2，且在替换前显示提示字符给用户确认是要替换</td>
  </tr>
  <tr>
    <td colspan='2' align='center'><font size='30'>删除、复制、粘贴</font></td>
  </tr>
  <tr>
    <td bgcolor="#ffffcc">x,X</td><td bgcolor="#ffffcc">x向后删除一个字符，X为向前删除一个字符，相当于Backspace</td>
  </tr>
  <tr>
    <td bgcolor="#ffffcc">nx</td><td bgcolor="#ffffcc">连续向后删除n个字符</td>
  </tr>
  <tr>
    <td bgcolor="#ffffcc">dd</td><td bgcolor="#ffffcc">删除光标所在行</td>
  </tr>
  <tr>
    <td bgcolor="#ffffcc">ndd</td><td bgcolor="#ffffcc">删除光标所在的向下n行</td>
  </tr>
  <tr>
    <td>d1G</td><td>删除光标所在到第一行的所有数据</td>
  </tr>
  <tr>
    <td>dG</td><td>删除光标所在到最后一行的所有数据</td>
  </tr>
  <tr>
    <td>d$</td><td>删除光标所在到这一行的最后一个字符</td>
  </tr>
  <tr>
    <td>d0</td><td>删除光标所在到这一行的第一个字符</td>
  </tr>
  <tr>
    <td bgcolor="#ffffcc">yy</td><td bgcolor="#ffffcc">复制光标所在行</td>
  </tr>
  <tr>
    <td bgcolor="#ffffcc">nyy</td><td bgcolor="#ffffcc">复制光标所在行到之后向下n行</td>
  </tr>
  <tr>
    <td>y1G</td><td>复制光标所在行到第一行的所有数据</td>
  </tr>
  <tr>
    <td>yG</td><td>复制光标所在行到最后一行的所有数据</td>
  </tr>
  <tr>
    <td>y0</td><td>复制光标所在行到该行首的所有数据</td>
  </tr>
  <tr>
    <td>y$</td><td>复制光标所在行到该行尾的所有数据</td>
  </tr>
  <tr>
    <td bgcolor="#ffffcc">p, P</td><td bgcolor="#ffffcc">将以复制的数据在光标的下一行粘贴，P则为贴在光标所在行的上一行进行粘贴。</td>
  </tr>
  <tr>
    <td>J</td><td>将光标所在行与下一行的数据结合成同一行</td>
  </tr>
  <tr>
    <td>c</td><td>重复删除多个数据，如向下删除10行 10cj</td>
  </tr>
  <tr>
    <td bgcolor="#ffffcc">u</td><td bgcolor="#ffffcc">撤销前一个动作</td>
  </tr>
  <tr>
    <td bgcolor="#ffffcc">[ctrl] + r</td><td bgcolor="#ffffcc">重做前一个动作</td>
  </tr>
   <tr>
    <td bgcolor="#ffffcc">.</td><td bgcolor="#ffffcc">重复前一个动作</td>
  </tr>
</table>


