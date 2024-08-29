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

```shell
/path/to/scriptname  opt1  opt2  opt3  opt4
      $0              $1    $2    $3    $4
```
- \$#: 代表后接的参数 个数 ， 上面显示为4个
- \$@: 代表 "$1" "$2" "$3" "$4"
- \$*: 代表 "$1 $2 $3 $4"


```shell
[az@iZbp13op1xah7j3j1x457dZ ~]$ vim how_paras.sh

#!/bin/bash
#Program:
#       Program shows the script name, parameters...
#History:
# 2024/08/28    az      First release
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

echo "The script name is        ===> ${0}"
echo "Total parameter number is         ===> $#"
[ "$#" -lt 2 ] && echo "The number of parameter is less than 2. Stop here." && exit 0
echo "Your whole parameter is   ===>'$@'"
echo "The 1st parameter         ===>${1}"
echo "The 2nd parameter         ===>${2}"


# 程序的文件名是什么
# 共有几个参数
# 若参数的个数小于2则告知使用者参数数量太少
# 全部的参数内容是什么
# 第一个参数是什么
# 第二个参数是什么

[az@iZbp13op1xah7j3j1x457dZ ~]$ sh how_paras.sh theone haha quot
The script name is      ===> how_paras.sh
Total parameter number is       ===> 3
Your whole parameter is ===>'theone haha quot'
The 1st parameter               ===>theone
The 2nd parameter               ===>haha
[az@iZbp13op1xah7j3j1x457dZ ~]$ 

```
- shift： 造成参数变量号码偏移

```shell
[az@iZbp13op1xah7j3j1x457dZ ~]$ vim shift_paras.sh
#!/bin/bash
#Program:
#       Program shows the effect of shift function.
#History:
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~bin
export PATH

echo "Total parameter number is ==>$#"
echo "Your whole parameter is ==> '$@'"

shift  # 进行第一次 一个变量的shift
echo "Total parameter number is ==> $#"
echo "Your whole parameter is ==> '$@'"

shift 3 # 进行第二次 三个变量的shift

echo "Total parameter number is ==> $#"
echo "Your whole parameter is ==> '$@'"



[az@iZbp13op1xah7j3j1x457dZ ~]$ sh shift_paras.sh one two three four five six
Total parameter number is ==>6
Your whole parameter is ==> 'one two three four five six'
Total parameter number is ==> 5
Your whole parameter is ==> 'two three four five six'
Total parameter number is ==> 2
Your whole parameter is ==> 'five six'
[az@iZbp13op1xah7j3j1x457dZ ~]$ 

```

## 条件判断
### if...then

- 单层、判断条件判断

```shell
if [ 条件判断 ]; then
        当条件判断成立时，可以进行的指令工作内容
fi
```

```shell
[az@iZbp13op1xah7j3j1x457dZ bin]$ vim ans_yn-2.sh
#!/bin/bash
#Program:
#       This program shows the user's choice
#History:
# 2024/08/29    az      First release
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

read -p "Please input (Y/N):" yn
if [ "${yn}" == "Y" ] || [ "${yn}" == "y" ];  then
        echo "OK, continue"
        exit 0
fi

if [ "${yn}" == "N" ] || [ "${yn}" == "n" ]; then
        echo "Oh, interrupt!"
        exit 0
fi
echo "I don't know what your choice is" && exit 0


[az@iZbp13op1xah7j3j1x457dZ bin]$ sh ans_yn-2.sh 
Please input (Y/N):y
OK, continue
[az@iZbp13op1xah7j3j1x457dZ bin]$ sh a
sh: a: No such file or directory
[az@iZbp13op1xah7j3j1x457dZ bin]$ sh ans_yn-2.sh 
Please input (Y/N):n
Oh, interrupt!
[az@iZbp13op1xah7j3j1x457dZ bin]$ 


```
  
- 多重、复杂条件判断
```shell
if [ 条件判断 ]; then
        当条件判断成立时，可以进行指令工作内容
else
        当条件判断不成立时，可以进行的指令工作内容
fi


if [ 条件判断 ]; then
        当条件判断成立时，可以进行指令工作内容
elif [条件判断 ]; then
        当条件判断成立时，可以进行的工作内容
else
        当条件判断都不成立时，可以进行的指令工作内容
fi

```

```shell
[az@iZbp13op1xah7j3j1x457dZ bin]$ vim ans_yn-3.sh
#!/bin/bash
#Program:
#       This program shows the user's choice
#History:
# 2024/08/29    az      First release
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

read -p "Please input (Y/N):" yn
if [ "${yn}" == "Y" ] || [ "${yn}" == "y" ];  then
        echo "OK, continue"
elif [ "${yn}" == "N" ] || [ "${yn}" == "n" ]; then
        echo "Oh, interrupt!"
else
        echo "I don't know what your choice is"

fi


[az@iZbp13op1xah7j3j1x457dZ bin]$ sh ans_yn-3.sh 
Please input (Y/N):y
OK, continue
[az@iZbp13op1xah7j3j1x457dZ bin]$ sh ans_yn-3.sh 
Please input (Y/N):n
Oh, interrupt!
[az@iZbp13op1xah7j3j1x457dZ bin]$ 

```

```shell
# 判断$1是否为hello，如果是的话，就显示“Hello，How are you？”
# 如果没有加任何参数，就提示使用者必须要使用的参数下达法
# 而如果加入的参数不是hello，就提醒使用者仅能使用hello为参数

[az@iZbp13op1xah7j3j1x457dZ bin]$ vim hello-2.sh

#!/bin/bash
#Program:
#       Check $1 is equal to "hello"
#History:
#2024/08/29     az      First release
PATH=/bin:/sbin:/usr/bin/:usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

if [ "${1}" == "hello" ]; then
        echo "Hello, how are you?"
elif [ "${1}" == "" ]; then
        echo "You MUST input parameters, ex> {${0} someword}"
else
        echo "The only parameter is 'hello', ex> {${0} hello}"
fi

[az@iZbp13op1xah7j3j1x457dZ bin]$ sh hello-2.sh 
You MUST input parameters, ex> {hello-2.sh someword}
[az@iZbp13op1xah7j3j1x457dZ bin]$ sh hello-2.sh  hello
Hello, how are you?
[az@iZbp13op1xah7j3j1x457dZ bin]$ sh hello-2.sh  world
The only parameter is 'hello', ex> {hello-2.sh hello}
[az@iZbp13op1xah7j3j1x457dZ bin]$ 


# 目前主机有启动的服务
[az@iZbp13op1xah7j3j1x457dZ bin]$ netstat -tuln
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State      
tcp        0      0 0.0.0.0:111             0.0.0.0:*               LISTEN     
tcp        0      0 127.0.0.1:46096         0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN     
tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:8099            0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:9099            0.0.0.0:*               LISTEN     
tcp6       0      0 :::111                  :::*                    LISTEN     
tcp6       0      0 :::80                   :::*                    LISTEN     
tcp6       0      0 ::1:25                  :::*                    LISTEN     
tcp6       0      0 :::8099                 :::*                    LISTEN     
tcp6       0      0 :::9099                 :::*                    LISTEN     
udp        0      0 0.0.0.0:68              0.0.0.0:*                          
udp        0      0 0.0.0.0:111             0.0.0.0:*                          
udp        0      0 127.0.0.1:323           0.0.0.0:*                          
udp        0      0 0.0.0.0:712             0.0.0.0:*                          
udp6       0      0 :::111                  :::*                               
udp6       0      0 ::1:323                 :::*                               
udp6       0      0 :::712                  :::*                               
[az@iZbp13op1xah7j3j1x457dZ bin]$ 

# 12.0.0.1 仅针对本机开发
# 0.0.0.0 或 ::: 代表对整个Internet 开放
```

```shell
[az@iZbp13op1xah7j3j1x457dZ bin]$ vim netstat.sh
#!/bin/bash
#Program:
#       Using netstat and grep to detect WWW，SSH，FTP and Mail services.
#History：
# 2024/08/29    az      First release
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH


echo "Now, I will detect your Linux server's services!"
echo -e "The www, ftp, ssh, and mail（smtp）will be detect ! \n"

testfile=/dev/shm/netstat_checking.txt
netstat -tuln > ${testfile}
testing=$(grep ":80 " ${testfile})
if [ "${testing}" != "" ]; then
        echo "WWW is running in your system."
fi

testing=$(grep ":22" ${testfile})
if [ "${testing}" != "" ]; then
        echo "SSH is running in your system."
fi

testing=$(grep ":21 " ${testfile})
if [ "${test}" != "" ]; then
        echo "FTP is running in your system."
fi

testing=$(grep ":25" ${testfile})
if [ "${testing}" != "" ]; then
        echo "Mail is running in your system."
fi


[az@iZbp13op1xah7j3j1x457dZ bin]$ sh netstat.sh 
Now, I will detect your Linux server's services!
The www, ftp, ssh, and mail（smtp）will be detect ! 

WWW is running in your system.
SSH is running in your system.
Mail is running in your system.
[az@iZbp13op1xah7j3j1x457dZ bin]$ 

```


```shell
# 先让使用者输入它们的退伍日期
# 再由现在日期比对退伍日期
# 由两个日期的比较来显示 还需要几天 才能够退伍的字样

[az@iZbp13op1xah7j3j1x457dZ bin]$ vim cal_retired.sh
#!/bin/bash
#Program
#       You input your demobilization date. I calculate how many days before you demobilize.
#History:
#2024/08/29     az      First release
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

# 告知用户这个程序的用途，并且告知应该如何输入日期格式
echo "This program will try to calculate :"
echo "How many days before your demobilization date..."
read -p "Please input your demobilization date (YYYYMMDD ex>20240829): " date2

# 测试一下，这个输入的内容是否正确。
date_d=$(echo ${date2} | grep '[0-9]\{8\}') 
if [ "${date_d}" == "" ]; then
        echo "You input the wrong date format..."
        exit 1
fi

# 开始计算日期
declare -i date_dem=$(date --date="${date2}" +%s)       # 退伍日期秒数
declare -i date_now=$(date +%s)                         # 现在日期秒数
declare -i date_total_s=$((${date_dem}-${date_now}))    # 剩余描述统计
declare -i date_d=$((${date_total_s}/60/60/24))         # 转为日数

if [ "${date_total_s}" -lt "0" ]; then
        echo "You had been demobilization before: " $((-l*${date_d})) " ago"
else
        declare -i date_h=$(($((${date_total_s}-${date_d}*60*60*24))/60/60))
        echo "You will demobilize after ${date_d} days and ${date_h} hours."
fi



[az@iZbp13op1xah7j3j1x457dZ bin]$ sh cal_retired.sh 
This program will try to calculate :
How many days before your demobilization date...
Please input your demobilization date (YYYYMMDD ex>20240829): 20241010
You will demobilize after 41 days and 7 hours.
[az@iZbp13op1xah7j3j1x457dZ bin]$ 
```

### case...esac判断

```shell
case $变量名称 in      # 关键词case， 还有变数前有钱字号
  "第一个变量内容")    # 每个变量内容建议用双引号括起来，关键词为小括号
        程序段
        ;;        # 每个类别结尾使用两个连续的分号来处理
  "第二个变量内容")
        程序段
        ;;
  *)          # 最后一个变量内容都会用到* 来代表所有其他值
        不包含第一个变量内容与第二个变量内容的其他程序执行段
        exit 1
        ;;
esac        # 最终的case 结尾
```

```shell
[az@iZbp13op1xah7j3j1x457dZ bin]$ vim hello-3.sh
#!/bin/bash
#Program
#       Show "Hello" from $1... by using case ... esac
# History
# 2024/08/29    az      First release
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

case ${1} in
        "hello")
                echo "Hello, how are you ?"
                ;;
        "")
                echo "You MUST input parameters. ex> {${0} someword}"
                ;;
        *)
                echo "Usage ${0} {hello}"
                ;;
esac


[az@iZbp13op1xah7j3j1x457dZ bin]$ sh hello-3.sh 
You MUST input parameters. ex> {hello-3.sh someword}
[az@iZbp13op1xah7j3j1x457dZ bin]$ sh hello-3.sh hello
Hello, how are you ?
[az@iZbp13op1xah7j3j1x457dZ bin]$ sh hello-3.sh helloWorld
Usage hello-3.sh {hello}
[az@iZbp13op1xah7j3j1x457dZ bin]$ 
```

使用 case $变量in 这个语法中，当中的那个 $变量 大致有两种取得的方式

- 直接下达式：利用 script.sh variable 的方式来直接给予 $1 这个变量的内容，这也是在 /etc/init.d 目录下大多数程序的设计方式
- 交互式： 透过read 这个指令来让用户输入变量的内容


### function 

```shell
funtion fname() {
        程序段
}
```

```shell
[az@iZbp13op1xah7j3j1x457dZ bin]$ vim show123-2.sh

#!/bin/bash
#Program
#       Use funtion to repeat information
#History:
#2024/08/29     az      first release
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

function printit() {
        echo -n "Your choice is " # 加上 -n 可以不断行继续在同一行显示
}

echo "This program will print your selection !"
case ${1} in  
        "one")
                printit; echo ${1} | tr 'a-z' 'A-Z'
                ;;  
        "two")
                printit; echo ${2} | tr 'a-z' 'A-Z'
                ;;  
        "three")
                printit; echo ${3} | tr 'a-z' 'A-Z'
                ;;  
        *)  
                echo "Usage ${0} {one|two|three}"
                ;;  
esac


[az@iZbp13op1xah7j3j1x457dZ bin]$ sh show123-2.sh 
This program will print your selection !
Usage show123-2.sh {one|two|three}
[az@iZbp13op1xah7j3j1x457dZ bin]$ sh show123-2.sh one
This program will print your selection !
Your choice is ONE
[az@iZbp13op1xah7j3j1x457dZ bin]$ 

```

## 循环 
### while do done, until do done(不定循环)

```shell
while [ condition ]   condition 是判断条件
do          # do 是循环的开始
      程序段落
done        # done是循环的结束


# 下面这个与while 相反，当条件成立时，就终止循环，否则就持续进行循环的程序段落
until [ condition ]
do
      程序段落
done
```

```shell
[az@iZbp13op1xah7j3j1x457dZ bin]$ vim yes_to_stop.sh

#!/bin/bash
#Program:
#       Repeat question until user input correct answer.
#History:
#2024/08/29     az      First release
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

while [ "${yn}" != "yes" -a "${yn}" != "YES" ]
do
        read -p "Please input yes/YES to stop this program: " yn
done
echo "OK! you input the correct answer."


[az@iZbp13op1xah7j3j1x457dZ bin]$ sh yes_to_stop.sh 
Please input yes/YES to stop this program: bhso
Please input yes/YES to stop this program: ashf 
Please input yes/YES to stop this program: oiweo
Please input yes/YES to stop this program: ahsfow
Please input yes/YES to stop this program: no
Please input yes/YES to stop this program: hasd;f
Please input yes/YES to stop this program: yes
OK! you input the correct answer.
[az@iZbp13op1xah7j3j1x457dZ bin]$ 

```

```shell
[az@iZbp13op1xah7j3j1x457dZ bin]$ vim yes_to_stop-2.sh
#!/bin/bash
#Program:
#       Repeat question until user input correct answer.
#History:
#2024/08/29     az      First release
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

until [ "${yn}" == "yes" -o "${yn}" == "YES" ]
do
        read -p "Please input yes/YES to stop this program: " yn
done
echo "OK! you input the correct answer."

[az@iZbp13op1xah7j3j1x457dZ bin]$ sh yes_to_stop-2.sh 
Please input yes/YES to stop this program: lsdk
Please input yes/YES to stop this program: lasdj
Please input yes/YES to stop this program: a
Please input yes/YES to stop this program: ye
Please input yes/YES to stop this program: yes
OK! you input the correct answer.
[az@iZbp13op1xah7j3j1x457dZ bin]$ 

```


### for...do...done(固定循环)
相对于while，until的循环方式是必须要 符合某个条件 的状态，而for循环 则是已经知道 要进行几次循环 的状态

```shell
for var in con1 con2 con3 ...
do
      程序段
done
```

```shell
[az@iZbp13op1xah7j3j1x457dZ bin]$ vim show_animal.sh

#!/bin/bash
#Program:
#       Using for ... loop to print 3 animals
#History:
#2024/08/29     az      First release
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

for animal in dog cat elephant
do
        echo "There are ${animal}s ..."
done


[az@iZbp13op1xah7j3j1x457dZ bin]$ sh show_animal.sh 
There are dogs ...
There are cats ...
There are elephants ...
[az@iZbp13op1xah7j3j1x457dZ bin]$


[az@iZbp13op1xah7j3j1x457dZ bin]$ vim userid.sh
#!/bin/bash
#Program
#       Use id, finger command to check system account's information.
#History
#2024/08/29     az      First release
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH
users=$(cut -d ':' -f1 /etc/passwd)  # 撷取账号名称
for username in ${users}
do
        id ${username}
done


[az@iZbp13op1xah7j3j1x457dZ bin]$ sh userid.sh 
uid=0(root) gid=0(root) groups=0(root)
uid=1(bin) gid=1(bin) groups=1(bin)
uid=2(daemon) gid=2(daemon) groups=2(daemon)
uid=3(adm) gid=4(adm) groups=4(adm)
uid=4(lp) gid=7(lp) groups=7(lp)
uid=5(sync) gid=0(root) groups=0(root)
uid=6(shutdown) gid=0(root) groups=0(root)
uid=7(halt) gid=0(root) groups=0(root)
uid=8(mail) gid=12(mail) groups=12(mail)
uid=11(operator) gid=0(root) groups=0(root)
uid=12(games) gid=100(users) groups=100(users)
uid=14(ftp) gid=50(ftp) groups=50(ftp)
uid=99(nobody) gid=99(nobody) groups=99(nobody)
uid=192(systemd-network) gid=192(systemd-network) groups=192(systemd-network)
uid=81(dbus) gid=81(dbus) groups=81(dbus)
uid=999(polkitd) gid=998(polkitd) groups=998(polkitd)
uid=74(sshd) gid=74(sshd) groups=74(sshd)
uid=89(postfix) gid=89(postfix) groups=89(postfix),12(mail)
uid=998(chrony) gid=996(chrony) groups=996(chrony)
uid=28(nscd) gid=28(nscd) groups=28(nscd)
uid=72(tcpdump) gid=72(tcpdump) groups=72(tcpdump)
uid=32(rpc) gid=32(rpc) groups=32(rpc)
uid=29(rpcuser) gid=29(rpcuser) groups=29(rpcuser)
uid=65534(nfsnobody) gid=65534(nfsnobody) groups=65534(nfsnobody)
uid=997(nginx) gid=995(nginx) groups=995(nginx)
uid=996(gitlab-www) gid=993(gitlab-www) groups=993(gitlab-www)
uid=995(git) gid=992(git) groups=992(git)
uid=994(gitlab-redis) gid=991(gitlab-redis) groups=991(gitlab-redis)
uid=993(gitlab-psql) gid=990(gitlab-psql) groups=990(gitlab-psql)
uid=992(gitlab-prometheus) gid=989(gitlab-prometheus) groups=989(gitlab-prometheus)
uid=1000(az) gid=1000(az) groups=1000(az),0(root)
uid=1001(alex) gid=1002(alex) groups=1002(alex),1001(project)
uid=1002(arod) gid=1001(project) groups=1001(project),1003(arod)
[az@iZbp13op1xah7j3j1x457dZ bin]$


[az@iZbp13op1xah7j3j1x457dZ bin]$ vim pingip.sh
#!/bin/bash
#Program
#       Use ping command to check the network's PC state.
#History
# 2024/08/29    az      First release
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

network='192.168.1'
for sitenu in $(seq 1 100) # seq 为 sequence（连续）的所写之意
do
        ping -c 1 -w 1 ${nework}.${sitenu} $> /dev/null && result=0 || result=1
        if [ "${result}" == 0 ]; then
                echo "Server ${network}.${sitenu} is UP."
        else
                echo "Server ${network}.${sitenu} is DOWN."
        fi
done
~


[az@iZbp13op1xah7j3j1x457dZ bin]$ sh pingip.sh 
ping: $: Name or service not known
Server 192.168.1.1 is DOWN.
ping: $: Name or service not known
Server 192.168.1.2 is DOWN.
ping: $: Name or service not known
Server 192.168.1.3 is DOWN.
ping: $: Name or service not known
Server 192.168.1.4 is DOWN.
ping: $: Name or service not known
Server 192.168.1.5 is DOWN.
ping: $: Name or service not known
Server 192.168.1.6 is DOWN.
ping: $: Name or service not known
Server 192.168.1.7 is DOWN.
ping: $: Name or service not known
Server 192.168.1.8 is DOWN.
ping: $: Name or service not known
Server 192.168.1.9 is DOWN.
ping: $: Name or service not known
Server 192.168.1.10 is DOWN.
ping: $: Name or service not known
Server 192.168.1.11 is DOWN.
ping: $: Name or service not known
Server 192.168.1.12 is DOWN.
ping: $: Name or service not known
Server 192.168.1.13 is DOWN.
ping: $: Name or service not known
Server 192.168.1.14 is DOWN.
ping: $: Name or service not known
Server 192.168.1.15 is DOWN.
ping: $: Name or service not known
Server 192.168.1.16 is DOWN.
ping: $: Name or service not known
Server 192.168.1.17 is DOWN.
ping: $: Name or service not known
Server 192.168.1.18 is DOWN.
ping: $: Name or service not known
Server 192.168.1.19 is DOWN.
ping: $: Name or service not known
Server 192.168.1.20 is DOWN.
ping: $: Name or service not known
Server 192.168.1.21 is DOWN.
ping: $: Name or service not known
Server 192.168.1.22 is DOWN.
ping: $: Name or service not known
Server 192.168.1.23 is DOWN.
ping: $: Name or service not known
Server 192.168.1.24 is DOWN.
ping: $: Name or service not known
Server 192.168.1.25 is DOWN.
ping: $: Name or service not known
Server 192.168.1.26 is DOWN.
ping: $: Name or service not known
Server 192.168.1.27 is DOWN.   
```

```shell
[az@iZbp13op1xah7j3j1x457dZ bin]$ vim dir_perm.sh
#!/bin/bash
#Program
#       User input dir name. I find the permission of files.
#History
#2024/08/29     az      First release
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

read -p "Please input a directory: " dir
if [ "${dir}" == "" -o ! -d "${dir}" ]; then
        echo "The ${dir} is NOT exist in your system".
        exit 1
fi
 
filelist=$(ls ${dir})
for filename in ${filelist}
do
        perm=""
        test -r "${dir}/${filename}" && perm="${perm} readable"
        test -w "${dir}/${filename}" && perm="${perm} writable" 
        test -x "${dir}/${filename}" && perm="${perm} executable"
        echo "The file ${dir}/${filename}'s permission is ${perm}"
done

[az@iZbp13op1xah7j3j1x457dZ bin]$ sh dir_perm.sh 
Please input a directory: /bin
The file /bin/['s permission is  readable executable
The file /bin/2to3-3's permission is  readable executable
The file /bin/2to3-3.6's permission is  readable executable
The file /bin/a2p's permission is  readable executable
The file /bin/addr2line's permission is  readable executable
The file /bin/alias's permission is  readable executable
...

```

### for...do...done 的数值处理

```shell
for ((初始值；限制值；执行步阶))
do
        程序段
done
```

```shell
[az@iZbp13op1xah7j3j1x457dZ bin]$ vim cal_1_100-2.sh
#!/bin/bash
#Program
#       Try do calculate 1+2+...+${your_input}
#History
#2024/08/29     az      First release
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

read -p "Please input a number. I will count for 1+2+...+your_input: " nu

s=0
for(( i=1; i<=${nu}; i=i+1 ))
do
        s=$((${s}+${i}))
done
echo "The result of '1+2+...+${nu}' is ==> ${s}"


[az@iZbp13op1xah7j3j1x457dZ bin]$ sh cal_1_100-2.sh 
Please input a number. I will count for 1+2+...+your_input: 4
The result of '1+2+...+4' is ==> 10
[az@iZbp13op1xah7j3j1x457dZ bin]$ sh cal_1_100-2.sh 
Please input a number. I will count for 1+2+...+your_input: 100
The result of '1+2+...+100' is ==> 5050
[az@iZbp13op1xah7j3j1x457dZ bin]$ 

```


## shell script 的追踪与 debug

|选项|解释|
|---|---|
|-n|不要执行script，仅查询语法问题|
|-v|在执行script前，先将scripts的内容输出到屏幕上|
|-x|将使用到的script内容显示到屏幕上|

```shell
[az@iZbp13op1xah7j3j1x457dZ bin]$ sh -n dir_perm.sh 
[az@iZbp13op1xah7j3j1x457dZ bin]$ 
[az@iZbp13op1xah7j3j1x457dZ bin]$ 
[az@iZbp13op1xah7j3j1x457dZ bin]$ sh -x show_animal.sh 
+ PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:/home/az/bin
+ export PATH
+ for animal in dog cat elephant
+ echo 'There are dogs ...'
There are dogs ...
+ for animal in dog cat elephant
+ echo 'There are cats ...'
There are cats ...
+ for animal in dog cat elephant
+ echo 'There are elephants ...'
There are elephants ...
[az@iZbp13op1xah7j3j1x457dZ bin]$ 

```
