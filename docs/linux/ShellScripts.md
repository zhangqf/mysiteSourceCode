# Shell Scripts
将一些指令汇整起来一次执行。可以进行类似程序的撰写，并且不需要经过编译就能够执行。Linux环境中，一些服务的启动都是透过shell script的。

程序化脚本： BASH 是一个文字接口底下让我们与系统沟通的一个工具接口，script是 脚本。 shell script 是针对shell所写的 剧本

shell script是利用shell的功能所写的一个 程序， 这个程序是使用纯文本文件， 将一些shell的语法与指令（含外部指令）写在里面，搭配正则表示法、管线命令与数据流重导向等功能，以达到我们所想要的处理目的。

## shell scripts 认识
### shell scripts 优点
- 自动化管理的重要依据
- 追踪与管理系统的重要工作
- 简单入侵检测功能
- 连续指令单一化
- 简单的数据处理
- 跨平台支持与学习里程较短

### script 的执行与撰写

shell script其实就是纯文本，我们可以编辑这个文件，然后让这个文件来帮我们一次执行多个指令，或者是利用一些运算与逻辑判断来帮我们达成某些功能。编辑这个文件内容时，就需要具备bash指令下达的相关认识。
注意事项：

1. 指令的执行是从上而下、从左而右的分析与执行
2. 指令的下达：指令、选项与参数间的多个空白都会被忽略掉
3. 空白行也将被忽略掉，并且 tab 按键所推开的空白同样视为空格键
4. 如果读取到一个Enter符合（CR），就尝试开始执行改行（或该串）命令
5. 至于如果一行的内容太多，则可以使用 \ [Enter] 来延伸至下一行
6. \# 可作为批注， 任何加载 # 后面的资料将全部被视为批注文字而被忽略
```shell
# !/bin/bash       # 宣告这个script使用的shell名称，使用bash就必须要以 #!/bin/bash 来宣告文件内的语法使用bash语法，那么当这个程序被执行时，他就能够加载bash的相关环境配置文件（一般就是 non-login shell 的 ~/.bashrc）,并且执行bash来使我们底下的指令能够执行。
# Program:      
#  This program shows "Hello World!" in your screen
# History:
# 2024/08/20     VBrid     First release
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~bin
export PATH
echo -e "Hello World! \a \n"
exit 0      # 利用exit这个指令来让程序中断，并且回传一个数值给系统。 代表离开script并且回传一个0给系统，执行完这个script后，若接着下达echo $?则可得到0的值。可以利用这个exit n 的功能，自定义错误信息
```

```shell
[az@iZbp13op1xah7j3j1x457dZ bin]$ sh hello.sh
Hello World!  

[az@iZbp13op1xah7j3j1x457dZ bin]$
```
### shell script 的良好习惯建立
自行先定义好一些一定会被用到的环境变量
在每个script的文件头处记录好：
- script的功能
- script的版本信息
- script的作者与联络方式
- script的版权宣告方式
- script的History（历史纪录）
- script内较特殊的指令，使用 绝对路径 的方式来下达
- script运作时需要的环境变量预先宣告与设定


## 练习shell script
### 对谈式脚本：变量内容由用户决定
  
```shell
#!/bin/bash
# Program
#       User inputs his first name and last name. Program shows his full name.
# History:
# 2024/08/20    az      First release
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

read -p "Please input your first name: " firstname      # 提示使用者输入
read -p "Please input your last name:" lastname         # 提示使用者输入
echo -e "\nYour full name is :" ${firstname} ${lastname}
~                                                                                                                                                                                                                            
~                                                                   
```
### 随日期变化：利用date进行文件的建立

```shell
#!/bin/bash
# Program
#       Program create three files. which named by user`s input and date command
# History
# 2024/08/20    az      First release
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

# 1 让使用者输入文件名，并取得fileuser这个变量
echo -e "I will use 'toch' command to create 3 files."
read -p "Please input your filename: " fileuser

# 2 为了避免使用者随意按Enter， 利用变量功能分析档名是否有设定

filename=${fileuser:-"filename"}          # 开始判断是否有配置文件名

# 3 开始利用date指令来取得所需要的档名
date1=$(date --date='2 days ago' +%Y%m%d)    # 前两天的日期
date2=$(date --date='1 days ago' +%Y%m%d)    # 前一天的日期
date3=$(date +%Y%m%d)                        # 当天的日期
file1=${filename}${date1}
file2=${filename}${date2}
file3=${filename}${date3}

# 4 建立档名
touch "${file1}"
touch "${file2}"
touch "${file3}"



[az@iZbp13op1xah7j3j1x457dZ bin]$ vim create_3_filename.sh
[az@iZbp13op1xah7j3j1x457dZ bin]$ sh create_3_filename.sh 
I will use 'touch' command to create 3 files.
Please input your filename: test
[az@iZbp13op1xah7j3j1x457dZ bin]$ ls
create_3_filename.sh  filename20240818  filename20240819  filename20240820  hello.sh  showname.sh  test20240818  test20240819  test20240820
[az@iZbp13op1xah7j3j1x457dZ bin]$ 
```
### 数值运算： 简单的加减乘除
```shell
#!/bin/bash
# Program
#       User inputs 2 integer numbers; program will cross these two numbers.
# History:
# 2024/08/20    az      First release
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

echo -e "Your SHOULD input 2 numbers, I will multiplying them! \n"
read -p "first number:" firstnumber
read -p "second number:" secondnumber
total=$((${firstnumber}*${secondnumber}))
echo -e "\nThe result of ${firstnumber} x ${secondnumber} is ==> ${total}"
~

[az@iZbp13op1xah7j3j1x457dZ bin]$ sh multiplying.sh 
Your SHOULD input 2 numbers, I will multiplying them! 

first number:10
second number:20

The result of 10 x 20 is ==> 200
[az@iZbp13op1xah7j3j1x457dZ bin]$ 



```
var=$((运算内容))

```shell
[az@iZbp13op1xah7j3j1x457dZ bin]$ echo $((15 % 4))
3
[az@iZbp13op1xah7j3j1x457dZ bin]$
```
计算含有小数点的数据时，可以使用bc这个指令

```shell
[az@iZbp13op1xah7j3j1x457dZ bin]$ echo "123.555*59.99" | bc
7412.064
[az@iZbp13op1xah7j3j1x457dZ bin]$ 
```
### 数值运算：透过bc计算 pi

bc是Linux和类Unix操作系统中的一个命令行计算器程序。他代表 基本计算器 （basic calculate），并提供一个交互式环境来执行数学计算
bc 中的scale变量控制结果显示的小数位数。默认是0。

4*a(1) 是bc提供的一个计算pi的函数

|选项|解释|
|---|---|
|-l或--mathlib|加载数学函数库，提供更多的数学运算支持，如三角函数、指数函数等|
|-i或--interactive|进入交互模式，可以直接在命令行输入计算表达式并获得结果。只是bc默认值|
|-w或--warn|启用警告信息输出，如除以零、变量重复定义等|
|-s或--standard|使用标准的POSIX兼容模式，不加载任何扩展库|
|-v或--version|显示bc版本信息|
|-h或--help|显示bc命令的帮助信息|
|-e"expression"|在命令行直接执行给定的计算表达式，而不进入交互模式|
|-f"filename"|从指定的文件中读取并执行计算表达式|
|-q或--quiet|静默模式，不显示版权信息等|
|-l"library"|加载指定的数学函数库文件|
```shell
#!/bin/bash
# Program
#       User input a scale number to calculate pi number.
# History
# 2024/08/20    az      First release
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH
echo -e "This program will calculate pi value. \n"
echo -e "Your should input a float number to calculate pi value. \n"
read -p "The scale number (10~10000)?" checking
num=${checking:-'10'}   # 开始判断是否有输入数值
echo -e "Starting calculate pi value. Be patient."
time echo "scale=${num}; 4*a(1)" | bc -l


[az@iZbp13op1xah7j3j1x457dZ bin]$ ./cal_pi.sh 
This program will calculate pi value. 

Your should input a float number to calculate pi value. 

The scale number (10~10000)?10
Starting calculate pi value. Be patient.
3.1415926532

real    0m0.002s
user    0m0.001s
sys     0m0.001s
```
## script的执行方式差异（source，sh script， ./script）

不同的script执行方式会造成不一样的结果
### 利用直接执行的方式来执行script
不论是绝对路径/相对路径还是${PATH}内，或者是利用bash或sh 来下达脚本，该script都会使用一个新的bash环境来执行脚本内的指令。当子程序完成后，在子程序内的各项变量或动作将会结束而不会传回到父程序中
```shell
[az@iZbp13op1xah7j3j1x457dZ bin]$ echo ${firstname} ${lastname}

[az@iZbp13op1xah7j3j1x457dZ bin]$ sh showname.sh 
Please input your first name: zhang
Please input your last name:qian

Your full name is : zhang qian
[az@iZbp13op1xah7j3j1x457dZ bin]$ echo ${firstname} ${lastname}

[az@iZbp13op1xah7j3j1x457dZ bin]$ 
```

### 利用source来执行脚本：在父程序中执行

使用source对script的执行方式，会使脚本在父程序中执行，因此各项动作都会在原本的bash内生效。这也是为什么不用注销系统而让某些写入~/.bashrc的设定生效。 是使用`source ~/.bashrc` 而不是`bash ~/.bashrc`   

```shell
[az@iZbp13op1xah7j3j1x457dZ bin]$ source showname.sh 
Please input your first name: zhang
Please input your last name:qian

Your full name is : zhang qian
[az@iZbp13op1xah7j3j1x457dZ bin]$ echo ${firstname} ${lastname}
zhang qian
[az@iZbp13op1xah7j3j1x457dZ bin]$ 
```
## 善用判断式  
### 利用test指令的测试功能

|测试的标志|代表意义|
|---|---|
|关于某个档名的 文件类型 判断， test -e filename 表示是否存在||
|-e|该 档名 是否存在|
|-f|该 档名 是否存在且为文件（file）|
|-d|该 文件名 是否存在且为目录（directory）|
|-b|该 档名 是否存在且为一个block device 装置|
|-c|该 档名 是否存在且为一个 character device 装置|
|-S|该 档名 是否存在且为一个 Socket 文件|
|-p|该 档名 是否存在且为一个FIFO（pipe）文件|
|-L|该 档名 是否存在且为一个连接档|
|关于文件的权限侦测，如 test -r filename 表示是否可读||
|-r|侦测该档名是否存在且具有 可读 的权限|
|-w|侦测该档名是否存在且具有 可写 的权限|
|-x|侦测该档名是否存在且具有 可执行 的权限|
|-u|侦测该文件是否存在且具有 SUID 的属性|
|-g|侦测该文件名是否存在且具有 SGID 的属性|
|-k|侦测该文件名是否存在且具有 Sticky bit 的属性|
|-s|侦测该档名是否存在且为 非空白文件|
|两个文件之间的比较，如： test file1 -nt file2||
|-nt|（newer than）判断file1 是否比file2 新|
|-ot|（older than）判断file1 是否比file2 旧|
|-ef|判断file1与file2是否为同一文件，可用在判断hard link的判断上。主要意义在判定，两个文件是否均指向同一个inode|
|关于两个整数之间的判定，如 test n1 -eq n2||
|-eq|两数值相等（equal）|
|-ne|两数值不等（not equal）|
|-gt|n1 大于 n2（greater than）|
|-lt|n1 小于 n2（less than）|
|-ge|n1 大于等于 n2 （greater than or equal）|
|-le|n1 小于等于 n2 （less than or equal）|
|判断字符串的数据||
|test -z string|判断字符串是否为0。 若string 为空字符串，则为true|
|test -n string|判断字符串是否非为0。若string为空字符，则为false。 -n 也可省略|
|test str1==str2|判断str1是否等于str2，若相等，则回传true|
|test str1!=str2|判断str1是否不等于str2，若相等，则回传false|
|多重条件判定 如 test -r filename -a -x filename||
|-a|and 两状况同时成立。如 test -r file -a -x file，则file 同时具有r与x权限时，才回传true|
|-o|or 两状况任何一个成立。如 test -r file -o -x file，则file具有r或x权限时，就回传true|
|!|反相状态，如 test ! -x file，当file 不具有x时，回传true|


**判断一个文件或目录是否存在，并判断拥有者对这个文件或目录所拥有的权限，将其输出**
```shell
[az@iZbp13op1xah7j3j1x457dZ ~]$ vim file_perm.sh 
#!/bin/bash
#Program
#       User input a filename, program will check the flowing:
#       1.exist?
#       2.file/directory
#       3.file permissions
#History:
# 2024/08/23    az      First release
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

# 让使用者输入档名，并且判断使用者是否真的有输入字符串？
echo -e "Please input a filename，I will check the filename's type and permission. \n\n"
read -p "Input a filename:" filename
test -z ${filename} && echo "You MUST input a filename." && exit 0

#2. 判断文件是否存在，若不存在则显示信息并结束脚本

test ! -e ${filename} && echo "The filename '${filename}' DO NOT exist" && exit 0

#3. 开始判断文件类型与属性
test -f ${filename} && filetype="regulare file"
test -d ${filename} && filetype="directory"
test -r ${filename} && perm="readable"
test -w ${filename} && perm="${perm} writable"
test -x ${filaname} && perm="${perm} executable"

#4.开始输出信息
echo "The filename：${filename} is a ${filetype}"
echo "And the permisssions for you are: ${perm}"




[az@iZbp13op1xah7j3j1x457dZ ~]$ sh file_perm.sh 
Please input a filename，I will check the filename's type and permission. 


Input a filename:testone
The filename 'testone' DO NOT exist
[az@iZbp13op1xah7j3j1x457dZ ~]$ sh file_perm.sh 
Please input a filename，I will check the filename's type and permission. 


Input a filename:printf.txt
The filename：printf.txt is a regulare file
And the permisssions for you are: readable writable executable
[az@iZbp13op1xah7j3j1x457dZ ~]$ 

```


### 利用判断符号 []

判断${HOME} 这个变量是否为空

```shell
[az@iZbp13op1xah7j3j1x457dZ ~]$ [ -z "${HOME}" ] ; echo $?
1
[az@iZbp13op1xah7j3j1x457dZ ~]$

[az@iZbp13op1xah7j3j1x457dZ ~]$ [ ${name} == "VBird" ]
bash: [: too many arguments
[az@iZbp13op1xah7j3j1x457dZ ~]$ [ "${name}" == "VBird" ]
[az@iZbp13op1xah7j3j1x457dZ ~]$ 
```

```shell
[az@iZbp13op1xah7j3j1x457dZ ~]$ vim ans_yn.sh
#!/bin/bash
#Program
#       This program shows the user's choice
#History:
#2024/08/23     az      First realse
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~bin
export PATH

read -p "Please Input(Y/N):" yn
[ "${yn}" == "Y" or "${yn}" == "y" ] && echo "OK, continue" && exit 0
[ "${yn}" == "N" or "${yn}" == "n" ] && echo "Oh, interrupt!" && exit 0

echo "I don't know what your choice is " && exit 0
~                                                                                                                         
~


[az@iZbp13op1xah7j3j1x457dZ ~]$ sh ans_yn.sh 
Please Input(Y/N):n
Oh, interrupt!
[az@iZbp13op1xah7j3j1x457dZ ~]$ sh ans_yn.sh 
Please Input(Y/N):y
OK, continue
[az@iZbp13op1xah7j3j1x457dZ ~]$                                                     
```

### Shell script 的默认变数（$0,$1...）

