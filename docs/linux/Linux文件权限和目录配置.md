# 文件权限和目录配置

文件可存取的身份分为三个类别 owner/group/others，这三种身份各有read/write/execute的权限。

linux中每个目录/文件代表的意义

## 使用者和群组

- 文件拥有者
  linux是个多用户多任务的系统，通常会有很多人同时操作这个主机来进行工作。文件拥有者是为了考虑每个人的隐私权以及每个人喜好的工作环境。
  如果一个文件设置成只有拥有者才能查看和修改，其同时操作这个主机的人则就没有权限操作这个文件
- 群组概念
  团队开发资源时，防止团队外的其他人查看修改团队的数据，只有属于这个团队的群组才能操作共同操作这些数据。
  每个账号可以拥有多个群组
- 其他人概念
  不属于当前这个群组之外的人

### Linux使用者身份与群组记录的文件

默认情况下，所有的系统上的账号与一般身份使用者，还有root的相关信息，都是记录在`ect/passwd`这个文件内的。至于每个人的密码则是记录在`ect/shodow`这个文件下。此外，linux所有的群组名称都是记录在`etc/group`内。这三个文件是Linux系统里面账号、密码、群组信息的集中地。

## Linux文件权限概念

文件的权限如何针对 `使用者` `群组` 来设置呢

### linux文件属性

```shell
linux % ls -al
total 384
drwxr-xr-x  11 zhangfeng  staff     352  7  9 17:56 .
drwxr-xr-x@ 13 zhangfeng  staff     416  7  5 14:45 ..
drwxr-xr-x  12 zhangfeng  staff     384  7  8 17:38 .git
-rw-r--r--   1 zhangfeng  staff  139805  6 27 00:08 Linux该如何学习呢.xmind
-rw-r--r--@  1 zhangfeng  staff    1377  7  9 17:56 Linux文件权限和目录配置.md
drwxr-xr-x  10 zhangfeng  staff     320  7  5 14:43 assets
-rw-r--r--@  1 zhangfeng  staff       0  6 28 14:15 index.html
-rw-r--r--@  1 zhangfeng  staff     213  6 28 14:19 index1.html
-rw-r--r--@  1 zhangfeng  staff   32782  7  8 17:37 linux01.md
-rw-r--r--@  1 zhangfeng  staff      63  7  1 17:32 test.md
-rw-r--r--   1 zhangfeng  staff      21  7  8 17:20 text.txt 
```


| -rw-r--r-- | 1    | zhangfeng | staff | 21   | 7  8 17:20 | text.txt |
| ---------- | ---- | --------- | :---- | :--- | :--------- | :------- |
| 权限       | 链接 | 拥有者    | 群组  | 大小 | 修改日期   | 文件名   |

- 权限
  第一个字符代表这个文件是“目录”还是“文件”或“链接文件”

  - 当为[d]时，则是目录
  - 当为[-]时，则是文件
  - 当为[i]时，则表示为链接文件（link file）
  - 当为[b]时，则表示为设备文件里面的可供存储的周边设备
  - 当为[c]时，则表示为设备文件里面的序列端口设备

  下面的9个字符 每三个一组 均为xwr组合 [r]代表可读、[w]代表可写、[x]代表可执行。这三个字符的位置不会改变始终是xwr，如果没有对应的权限，就会出现[-]
  第一组为 文件拥有者可具备的权限
  第二组为 加入此群组的账号具备的权限
  第三组为 非本人且没有加入此群组的账号的权限

  以上权限都是针对账号来设计的。
- 链接
  表示有多少个文件名链接到此节点（i-node）
- 拥有者
  表示文件或目录的 拥有者账号
- 群组
  表示文件或目录的 群组
- 容量大小
  默认单位为Bytes
- 修改日期
  文件或目录的创建日期或最近修改日期
- 文件名
  文件或目录的名称

### 文件属性和权限的变更

一个文件的属性与权限有很多，常用于群组、拥有者、各种身份的权限的修改指令如下

- chgrp：改变文件所属群组
- chown：改变文件拥有者
- chmod：改变文件的权限，SUID，SGID，SBIT等等等特性

#### 添加用户

```shell
useradd -m [username]
# 为[username]设置密码
passwd [username]
# [username] 添加sudo 权限
usermod -aG sudo [username]

[root@iZbp13op1xah7j3j1x457dZ ~]# usermod -aG sudo az
usermod: group 'sudo' does not exist
[root@iZbp13op1xah7j3j1x457dZ ~]# usermod -aG root az
# 查看用户是否创建
[root@iZbp13op1xah7j3j1x457dZ ~]# id az
uid=1000(az) gid=1000(az) groups=1000(az),0(root)

# 查看用户群组
[root@iZbp13op1xah7j3j1x457dZ ~]# groups az
az : az root

# 切换用户
[root@iZbp13op1xah7j3j1x457dZ ~]# su - az
[az@iZbp13op1xah7j3j1x457dZ ~]$ 

```

#### 更改群组 chgrp [gp] [dirname/filename]

```shell
[root@iZbp13op1xah7j3j1x457dZ ~]# ls -al
total 72
dr-xr-x---.  6 root root  4096 Jul 10 19:04 .
dr-xr-xr-x. 19 root root  4096 Apr 20 12:01 ..
-rw-------   1 root root 10055 Jun 26 20:05 .bash_history
-rw-r--r--.  1 root root    18 Dec 29  2013 .bash_logout
-rw-r--r--.  1 root root   176 Dec 29  2013 .bash_profile
-rw-r--r--.  1 root root   176 Dec 29  2013 .bashrc
drwx------   3 root root  4096 Mar 22 11:30 .cache
-rw-r--r--.  1 root root   100 Dec 29  2013 .cshrc
drwxr-xr-x   2 root root  4096 Mar 22 11:30 .pip
drwxr-----   3 root root  4096 Jun 20 22:26 .pki
-rw-r--r--   1 root root   206 Apr 19 09:29 .pydistutils.cfg
drwx------   2 root root  4096 Mar 22 11:31 .ssh
-rw-r--r--.  1 root root   129 Dec 29  2013 .tcshrc
-rw-r--r--   1 root root    12 Jul 10 19:04 text.txt
-rw-------   1 root root  5182 Jun 26 17:51 .viminfo
[root@iZbp13op1xah7j3j1x457dZ ~]# chgrp az text.txt
[root@iZbp13op1xah7j3j1x457dZ ~]# ls -al
total 72
dr-xr-x---.  6 root root  4096 Jul 10 19:04 .
dr-xr-xr-x. 19 root root  4096 Apr 20 12:01 ..
-rw-------   1 root root 10055 Jun 26 20:05 .bash_history
-rw-r--r--.  1 root root    18 Dec 29  2013 .bash_logout
-rw-r--r--.  1 root root   176 Dec 29  2013 .bash_profile
-rw-r--r--.  1 root root   176 Dec 29  2013 .bashrc
drwx------   3 root root  4096 Mar 22 11:30 .cache
-rw-r--r--.  1 root root   100 Dec 29  2013 .cshrc
drwxr-xr-x   2 root root  4096 Mar 22 11:30 .pip
drwxr-----   3 root root  4096 Jun 20 22:26 .pki
-rw-r--r--   1 root root   206 Apr 19 09:29 .pydistutils.cfg
drwx------   2 root root  4096 Mar 22 11:31 .ssh
-rw-r--r--.  1 root root   129 Dec 29  2013 .tcshrc
-rw-r--r--   1 root az      12 Jul 10 19:04 text.txt
-rw-------   1 root root  5182 Jun 26 17:51 .viminfo
```

#### 更改文件拥有者

```shell
# 该变拥有者
[root@iZbp13op1xah7j3j1x457dZ ~]# ls -l
total 4
-rw-r--r-- 1 root az 12 Jul 10 19:04 text.txt
[root@iZbp13op1xah7j3j1x457dZ ~]# chown az text.txt
[root@iZbp13op1xah7j3j1x457dZ ~]# ls -l
total 4
-rw-r--r-- 1 az az 12 Jul 10 19:04 text.txt


# 改变拥有者
[root@iZbp13op1xah7j3j1x457dZ ~]# vi text.md
[root@iZbp13op1xah7j3j1x457dZ ~]# ls -l
total 8
-rw-r--r-- 1 root root 20 Jul 10 19:29 text.md
-rw-r--r-- 1 az   az   12 Jul 10 19:04 text.txt
[root@iZbp13op1xah7j3j1x457dZ ~]# chown az text.md
[root@iZbp13op1xah7j3j1x457dZ ~]# ls -l
total 8
-rw-r--r-- 1 az root 20 Jul 10 19:29 text.md
-rw-r--r-- 1 az az   12 Jul 10 19:04 text.txt


# 改变拥有者和群组
[root@iZbp13op1xah7j3j1x457dZ ~]# vi text1.md
[root@iZbp13op1xah7j3j1x457dZ ~]# ls -l
total 12
-rw-r--r-- 1 root root 109 Jul 10 19:32 text1.md
-rw-r--r-- 1 az   root  20 Jul 10 19:29 text.md
-rw-r--r-- 1 az   az    12 Jul 10 19:04 text.txt
[root@iZbp13op1xah7j3j1x457dZ ~]# chown az:az text1.md
[root@iZbp13op1xah7j3j1x457dZ ~]# ls -l
total 12
-rw-r--r-- 1 az az   109 Jul 10 19:32 text1.md
-rw-r--r-- 1 az root  20 Jul 10 19:29 text.md
-rw-r--r-- 1 az az    12 Jul 10 19:04 text.txt
[root@iZbp13op1xah7j3j1x457dZ ~]# 
```

#### 改变权限

- 数字类型改变文件权限
  r:4  w:2  x:1  ==> 7

  更改text.txt为

  - 文件拥有者可读可写可执行
  - 群组可读可写可执行
  - others可读可写可执行

```shell
[root@iZbp13op1xah7j3j1x457dZ ~]# ls -l
total 12
-rw-r--r-- 1 az az   109 Jul 10 19:32 text1.md
-rw-r--r-- 1 az root  20 Jul 10 19:29 text.md
-rw-r--r-- 1 az az    12 Jul 10 19:04 text.txt
[root@iZbp13op1xah7j3j1x457dZ ~]# chomd 777 text.txt
-bash: chomd: command not found
[root@iZbp13op1xah7j3j1x457dZ ~]# chmod 777 text.txt
[root@iZbp13op1xah7j3j1x457dZ ~]# ls -l
total 12
-rw-r--r-- 1 az az   109 Jul 10 19:32 text1.md
-rw-r--r-- 1 az root  20 Jul 10 19:29 text.md
-rwxrwxrwx 1 az az    12 Jul 10 19:04 text.txt
[root@iZbp13op1xah7j3j1x457dZ ~]# 
```

更改text.md
* 文件拥有者可读可写可执行
* 群组 可读可执行
* others 可读
```shell
[root@iZbp13op1xah7j3j1x457dZ ~]# chmod 754 text.md
[root@iZbp13op1xah7j3j1x457dZ ~]# ls -l
total 12
-rw-r--r-- 1 az az   109 Jul 10 19:32 text1.md
-rwxr-xr-- 1 az root  20 Jul 10 19:29 text.md
-rwxrwxrwx 1 az az    12 Jul 10 19:04 text.txt
[root@iZbp13op1xah7j3j1x457dZ ~]# 
```
- 符合类型改变文件权限
  使用 u g o 代表user group others 三种身份

更改 text1.md 为 rwxr-xr-x

```shell
[root@iZbp13op1xah7j3j1x457dZ ~]# ls -l
total 12
-rw-r--r-- 1 az az   109 Jul 10 19:32 text1.md
-rwxr-xr-- 1 az root  20 Jul 10 19:29 text.md
-rwxrwxrwx 1 az az    12 Jul 10 19:04 text.txt
[root@iZbp13op1xah7j3j1x457dZ ~]# chmod u=rwx,go=rx text1.md
[root@iZbp13op1xah7j3j1x457dZ ~]# ls -l
total 12
-rwxr-xr-x 1 az az   109 Jul 10 19:32 text1.md
-rwxr-xr-- 1 az root  20 Jul 10 19:29 text.md
-rwxrwxrwx 1 az az    12 Jul 10 19:04 text.txt
[root@iZbp13op1xah7j3j1x457dZ ~]# 
```
添加或取消所有的（r/w/x）权限； a-[r/w/x] 取消； a+[r/w/x] 添加

```shell
[root@iZbp13op1xah7j3j1x457dZ ~]# ls -l
total 12
-rwxr-xr-x 1 az az   109 Jul 10 19:32 text1.md
-rwxr-xr-- 1 az root  20 Jul 10 19:29 text.md
-rwxrwxrwx 1 az az    12 Jul 10 19:04 text.txt
[root@iZbp13op1xah7j3j1x457dZ ~]# chmod a-x text1.md
[root@iZbp13op1xah7j3j1x457dZ ~]# ls -l
total 12
-rw-r--r-- 1 az az   109 Jul 10 19:32 text1.md
-rwxr-xr-- 1 az root  20 Jul 10 19:29 text.md
-rwxrwxrwx 1 az az    12 Jul 10 19:04 text.txt
[root@iZbp13op1xah7j3j1x457dZ ~]# chmod a+x text1.md
[root@iZbp13op1xah7j3j1x457dZ ~]# ls -l
total 12
-rwxr-xr-x 1 az az   109 Jul 10 19:32 text1.md
-rwxr-xr-- 1 az root  20 Jul 10 19:29 text.md
-rwxrwxrwx 1 az az    12 Jul 10 19:04 text.txt
[root@iZbp13op1xah7j3j1x457dZ ~]# 
```
### 目录与文件的权限意义

- 权限对文件的意义
  文件是存放数据的地方
  windows系统判断一个文件是否具有执行的能力是根据 扩展名 来判断的，而linux中的文件是否能被执行，则是由 权限 “x” 来决定的，跟文件名没有绝对的关系
- 权限对目录的意义
  目录是记录文件名清单的，文件名与目录有强烈的关联性


| 元件 | 内容         | 叠代物件   | r            | w            | x                       |
| ---- | ------------ | ---------- | :----------- | :----------- | :---------------------- |
| 文件 | 详细数据data | 文件数据夹 | 读到文件内容 | 修改文件内容 | 执行文件内容            |
| 目录 | 文件名       | 可分类抽屉 | 读到文件名   | 修改文件名   | 进入该目录的权限（key） |

- 对于文件 rwx 主要针对 “文件的内容” 来设计权限
- 对于目录 rwx 主要针对 “目录内的文件名列表” 来设计权限

能不能进入某一个目录，只与该目录的x权限有关，如果在某目录下不具有x的权限，就无法切换到该目录下，也无法执行该目录下的任何指令，即使具有该目录的r或w的权限

使用root的身份创建所需要的文件与目录环境

```shell
[root@iZbp13op1xah7j3j1x457dZ /]# cd /tmp
[root@iZbp13op1xah7j3j1x457dZ tmp]# ls
aliyun_assist_service.sock
systemd-private-bc591917886f4234b038068d870ce742-chronyd.service-pz5zFc
systemd-private-bc591917886f4234b038068d870ce742-nginx.service-tIjyZz
[root@iZbp13op1xah7j3j1x457dZ tmp]# ls -al
total 36
drwxrwxrwt.  9 root root 4096 Jul 12 16:27 .
dr-xr-xr-x. 19 root root 4096 Apr 20 12:01 ..
srwxr-xr-x   1 root root    0 Jun 22 23:25 aliyun_assist_service.sock
drwxrwxrwt.  2 root root 4096 Mar 22 11:16 .font-unix
drwxrwxrwt.  2 root root 4096 Mar 22 11:16 .ICE-unix
drwx------   3 root root 4096 Jun 22 23:25 systemd-private-bc591917886f4234b038068d870ce742-chronyd.service-pz5zFc
drwx------   3 root root 4096 Jun 23 01:54 systemd-private-bc591917886f4234b038068d870ce742-nginx.service-tIjyZz
drwxrwxrwt.  2 root root 4096 Mar 22 11:16 .Test-unix
drwxrwxrwt.  2 root root 4096 Mar 22 11:16 .X11-unix
drwxrwxrwt.  2 root root 4096 Mar 22 11:16 .XIM-unix
[root@iZbp13op1xah7j3j1x457dZ tmp]# ls -l
total 8
srwxr-xr-x 1 root root    0 Jun 22 23:25 aliyun_assist_service.sock
drwx------ 3 root root 4096 Jun 22 23:25 systemd-private-bc591917886f4234b038068d870ce742-chronyd.service-pz5zFc
drwx------ 3 root root 4096 Jun 23 01:54 systemd-private-bc591917886f4234b038068d870ce742-nginx.service-tIjyZz
[root@iZbp13op1xah7j3j1x457dZ tmp]# mkdir testing
[root@iZbp13op1xah7j3j1x457dZ tmp]# ls -l
total 12
srwxr-xr-x 1 root root    0 Jun 22 23:25 aliyun_assist_service.sock
drwx------ 3 root root 4096 Jun 22 23:25 systemd-private-bc591917886f4234b038068d870ce742-chronyd.service-pz5zFc
drwx------ 3 root root 4096 Jun 23 01:54 systemd-private-bc591917886f4234b038068d870ce742-nginx.service-tIjyZz
drwxr-xr-x 2 root root 4096 Jul 12 16:29 testing
[root@iZbp13op1xah7j3j1x457dZ tmp]# chmod 744 testing
[root@iZbp13op1xah7j3j1x457dZ tmp]# ls -l
total 12
srwxr-xr-x 1 root root    0 Jun 22 23:25 aliyun_assist_service.sock
drwx------ 3 root root 4096 Jun 22 23:25 systemd-private-bc591917886f4234b038068d870ce742-chronyd.service-pz5zFc
drwx------ 3 root root 4096 Jun 23 01:54 systemd-private-bc591917886f4234b038068d870ce742-nginx.service-tIjyZz
drwxr--r-- 2 root root 4096 Jul 12 16:29 testing
[root@iZbp13op1xah7j3j1x457dZ tmp]# touch testing/testing
[root@iZbp13op1xah7j3j1x457dZ tmp]# chmod 600 testing/testing
[root@iZbp13op1xah7j3j1x457dZ tmp]# ls -l
total 12
srwxr-xr-x 1 root root    0 Jun 22 23:25 aliyun_assist_service.sock
drwx------ 3 root root 4096 Jun 22 23:25 systemd-private-bc591917886f4234b038068d870ce742-chronyd.service-pz5zFc
drwx------ 3 root root 4096 Jun 23 01:54 systemd-private-bc591917886f4234b038068d870ce742-nginx.service-tIjyZz
drwxr--r-- 2 root root 4096 Jul 12 16:30 testing
[root@iZbp13op1xah7j3j1x457dZ tmp]# ls -ald testing testing/testing
drwxr--r-- 2 root root 4096 Jul 12 16:30 testing
-rw------- 1 root root    0 Jul 12 16:30 testing/testing
[root@iZbp13op1xah7j3j1x457dZ tmp]#
```
一般用户的读写权限

```shell
[az@iZbp13op1xah7j3j1x457dZ tmp]$ ls -l
total 12
srwxr-xr-x 1 root root    0 Jun 22 23:25 aliyun_assist_service.sock
drwx------ 3 root root 4096 Jun 22 23:25 systemd-private-bc591917886f4234b038068d870ce742-chronyd.service-pz5zFc
drwx------ 3 root root 4096 Jun 23 01:54 systemd-private-bc591917886f4234b038068d870ce742-nginx.service-tIjyZz
drwxr--r-- 2 root root 4096 Jul 12 16:30 testing
[az@iZbp13op1xah7j3j1x457dZ tmp]$ ls -l testing/
ls: cannot access testing/testing: Permission denied
total 0
-????????? ? ? ? ?            ? testing
[az@iZbp13op1xah7j3j1x457dZ tmp]$ 
```
只有r可以让使用者读取目录的文件名列表，但是读取不到详细的信息，也不能将该目录变成工作目录。

修改此目录权限的拥有者为az

```shell
[root@iZbp13op1xah7j3j1x457dZ tmp]# chown az /tmp/testing
[root@iZbp13op1xah7j3j1x457dZ tmp]# ls -ld /tmp/testing
drwxr--r-- 2 az root 4096 Jul 12 16:30 /tmp/testing
[root@iZbp13op1xah7j3j1x457dZ tmp]# 
```
然后进入testing目录，这个目录下的又有个testing目录，它的拥有者是root ，而不是az，但是它可是被az这个账号删除

```shell
[az@iZbp13op1xah7j3j1x457dZ tmp]$ cd /testing
-bash: cd: /testing: No such file or directory
[az@iZbp13op1xah7j3j1x457dZ tmp]$ cd /tmp/testing
[az@iZbp13op1xah7j3j1x457dZ testing]$ ls -l
total 0
-rw------- 1 root root 0 Jul 12 16:30 testing
[az@iZbp13op1xah7j3j1x457dZ testing]$ rm testing
rm: remove write-protected regular empty file ‘testing’? y
[az@iZbp13op1xah7j3j1x457dZ testing]$ ls -l
total 0
[az@iZbp13op1xah7j3j1x457dZ testing]$ 
```
所以 x 在目录当中是与 “能否进入该目录” 有关 w 具有相当重要的权限，它可以让使用者删除、更新、新建文件或目录。


| 操作动作           | /dir1 | /dir1/file1 | /dir2 | 重点                                    |
| ------------------ | ----- | ----------- | :---- | :-------------------------------------- |
| 读取file1的内容    | x     | r           | -     | 要能够进入/dir1才能读取到里面的文件数据 |
| 修改file1的内容    | x     | rw          | -     | 进入/dir1且修改file1才行                |
| 执行file1的内容    | x     | rx          | -     | 进入/dir1 且file1能运行                 |
| 删除dile1文件      | wx    | -           | -     | 进入/dir1具有目录修改的权限             |
| 将file1复制到/dir2 | x     | r           | wx    | 能够读file1且能够修改/dir2内的数据      |

### 文件种类与扩展名

- 文件种类
  - [-]为一般文件
    - 纯文本文件（ASCII）
      人类可以直接读到的数据，数据、字母等
    - 二进制文件（binary）
      系统仅认识且可以执行二进制文件，linux中的可执行文件
    - 数据格式文件（data）
      程序运行过程当中会读取某些特定的格式的文件。Linux在使用者登陆时，都会将登录的数据记录在 /var/log/wtmp那个文件内，该文件是一个data file，他能够通过last这个指令读出来！ 但是使用cat时，会读出乱码～因为他是属于一种特殊格式的文件
  - [d]为目录文件
  - 链接文件（link）
    [lrwxrwxrwx]
  - 设备与设备文件（device）
    与系统周边及存储相关的一些文件，通常集中在/dev目录下。
    - 区块（block）设备文件
      一些存储数据，以提供系统随机存取的周边设备，硬盘软盘等，它的第一个字符为[b]
    - 字符（character）设备文件
      一些序列端口设备，键盘鼠标等，第一字符为[c]
  - 数据接口文件（sockets）
    通常被用在网络上的数据承接。可以启动一个程序来监听用户的要求，而用户端可以通过这个socket来进行数据的沟通。 第一个字符为[s],常在/run或/tmp这些目录中看到这种文件类型
  - 数据输送档（FIFO， pipe）
    特殊的文件类型。主要目的在解决多个程序同时存取一个文件所造成的错误问题
- 扩展名
  文件有被执行的权限，不一定它就是可执行的文件，这要看它是否具有可执行的程序码

## linux 目录配置

目录配置依据--FHS（Filesystem Hierarchy Standard）,FHS的主要目的是希望使用者可以了解到已安装软件通常放置在那个目录下。

目录的四种交互作用


|                             | 可分享的（shareabe）        | 不可分享的（unshareable） |
| --------------------------- | --------------------------- | ------------------------- |
| 不变的（static）            | /usr（软件放置处）          | /etc（配置文件）          |
| /opt（第三方协力软件）      | /boot（开机与核心档）       |                           |
| 可变动的（variable）        | /var/main（使用者邮件信箱） | /var/run（程序相关）      |
| /var/spool/news（新闻群组） | /var/lock（程序相关）       |                           |

FHS针对目录树架构仅定义出三层目录

### /（root，根目录）：与开机系统有关


| 目录                            | 应放置文件内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FHS要求必须要存放的mul          |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| /bin                            | 系统有很多放置可执行文件的目录，但/bin比较特殊。因为/bin放置的是单人维护模式下还能够被操作的指令。在/bin下面的指令可以被root与一般账户所使用，主要有：cat、chmod、chown、date、mv、mkdir、cp、bash等常用的指令                                                                                                                                                                                                                                                                                                  |
| /boot                           | 放置开机会使用的文件，包括Linux核心文件以及开机菜单与开机所需配置文件等等。Linux kernel常用的文件名为：vmlinuz，如果使用的是grub2这个开机管理程序，则还会在/boot/grub2/这个目录                                                                                                                                                                                                                                                                                                                                 |
| /dev                            | 任何设备与周边设备都是以文件的形态存在于这个目录当中。只要通过存取这个目录下面的某个文件，就等于存取某个设备，比较重要的文件有/dev/null,/dev/zero, /dev/tty, /dev/loop, /dev/sd等等                                                                                                                                                                                                                                                                                                                             |
| /etc                            | 系统主要的配置文件，一般情况下，这个目录下的各文件属性是可以让一般使用者查阅的，但只要root有权利更改。FHS建议不要放置可执行文件（birary）在这个目录中。比较重要的文件有：/etc/modprobe.d,/etc/passwd,/etc/fstab,/etc/issue等等。FHS还规范几个重要的目录最好要存在/etc/目录下：/etc/opt,这个目录在放置第三方协议软件/opt的相关配置文件/etc/X11，与X window有关的各种配置文件都在这里，尤其是xorg.conf这个X Server的配置文件；/etc/sgml/建议：与SGML格式有关的各项配置文件；/etc/xml：与XML格式有关的各项配置文件 |
| /lib                            | 放置的是开机时会用到的函数库，以及在/bin或/sbin下面的指令会调用的函数库而已。某些指令必须要有这些“外挂”才能顺利完成程序的执行。FSH要求下面的目录必须要存在：/lin/modules：这个目录主要放置可抽换式的核心相关模块（驱动程序）                                                                                                                                                                                                                                                                                  |
| /media                          | 媒体，可以移除的设备。如软盘、光盘、DVD等等设备都暂挂于此。常见的文件名有：/media/floppy、/media/cdrom等等                                                                                                                                                                                                                                                                                                                                                                                                      |
| /mnt                            | 暂时挂载某些额外的设备，一般建议放置在这个目录中。这个目录的用途与/media相同，只是有了/media之后，这个目录就用来暂时挂载用了                                                                                                                                                                                                                                                                                                                                                                                    |
| /opt                            | 第三方协力软件放置的目录                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| /run                            | 系统开机后所产生的的各项信息放置的地方                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| /sbin                           | 为开机过程中所需要的文件，包括了开机、修复、还原系统所需要的指令。设置系统环境的。服务器软件程序放置在/usr/sbin当中。本机自行安装的软件所产生的系统可执行文件（system binary）放置在/usr/local/sbin/当中，常见的指令包括：fdisk、fsck、ifconfig、mkfs等等                                                                                                                                                                                                                                                       |
| /srv                            | service的缩写。是一些网络服务启动之后，这些服务所需取用的数据目录。常见的服务如WWW，FTP等等。如果系统的服务数据尚未要提供给网际网路任何人浏览的话，默认还是建议放置到/var/lib下面即可                                                                                                                                                                                                                                                                                                                           |
| /tmp                            | 让一般使用者或者式正在执行的程序暂时放置文件的地方。这个目录时任何人都能够存取的，所以需要定期的清理一下。重要数据不可放置在此目录，因为FHS建议在开机时，应该要将/tmp/下的数据都删除                                                                                                                                                                                                                                                                                                                            |
| 第二部分：FHS建议可以存在的目录 |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| /home                           | 系统默认的使用者主文件夹。在新增一个一般使用者账号时，默认的使用者主文件夹都会规范到这里来。比较重要的是，主文件夹有两种代号 ～：代表目前这个使用者的主文件夹， ～az：代表az的主文件夹                                                                                                                                                                                                                                                                                                                          |
| /lib\<qual\>                      | 用来存放与/lib不同的格式的二进制函数库，如支持64位的/lib64函数库等                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| /root                           | 系统管理员的主文件夹。之所以放在这里，是因为如果进入单人维护模式而仅挂载根目录时，该目录就能够拥有root的主文件夹，所以会希望root的主文件夹与根目录放置在同一个分区中                                                                                                                                                                                                                                                                                                                                            |
| /lost+found                     | 这个目录是使用标准的ext2/ext3/ext4文件系统格式才会产生的一个目录，目的在于当文件系统发生错误时， 将一些遗失的片段放置到这个目录下。不过如果使用的是 xfs 文件系统的话，就不会存在这个目录了                                                                                                                                                                                                                                                                                                                      |
| /proc                           | 这个目录本身是一个“虚拟文件系统（virtual filesystem）”，他放置的数据都是在内存当中， 例如系统核心、行程信息（process）、周边设备的状态及网络状态等等。因为这个目录下的数据都是在内存当中， 所以本身不占任何硬盘空间啊！比较重要的文件例如：/proc/cpuinfo, /proc/dma, /proc/interrupts, /proc/ioports, /proc/net/* 等等。                                                                                                                                                                                      |
| /sys                            | 这个目录其实跟/proc非常类似，也是一个虚拟的文件系统，主要也是记录核心与系统硬件信息较相关的信息。 包括目前已载入的核心模块与核心侦测到的硬件设备信息等等。这个目录不占用任何硬盘容量                                                                                                                                                                                                                                                                                                                            |

### /usr（unix software resource）：与软件安装/执行有关
  安装时会占用较大硬盘容量的目录
  FHS的基本定义，/usr里面放置的数据属于可分享的与不可变动的
  usr即Unix Software Resource，Unix操作系统软件资源 所放置的目录


| 目录               | 应放置文件的内容                                                                                                                                                                                                                                                           |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 必须存在的目录     |                                                                                                                                                                                                                                                                            |
| /usr/bin/          | 所有一般用户能够使用的指令。新版本中已将所有的使用者指令放置于此，使用链接文件的方式将/bin链接至此，/bin与/usr/bin 内容一模一样。另外此目录下不应该有子目录                                                                                                                |
| /usr/lib/          | 与/lib功能相同。/lib链接至此目录中                                                                                                                                                                                                                                         |
| /usr/local/        | 系统管理员在本机自行安装自己下载的软件                                                                                                                                                                                                                                     |
| /usr/sbin/         | 非系统正常运行所需的系统指令。 /sbin链接至此目录                                                                                                                                                                                                                           |
| /usr/share/        | 主要放置只读架构的数据文件。当然也包括共享文件。在这个目录下放置的数据几乎是不分硬件架构均可读取的数据， 因为几乎都是文字文件嘛！在此目录下常见的还有这些次目录：/usr/share/man：线上说明文档 /usr/share/doc：软件杂项的文件说明 /usr/share/zoneinfo：与时区有关的时区文件 |
| 建议可以存在的目录 |                                                                                                                                                                                                                                                                            |
| /usr/games/        | 与游戏比较相关的数据放置处                                                                                                                                                                                                                                                 |
| /usr/include/      | c/c++等程序语言的文件开始（header）与包含档（include）放置处，当我们以tarball方式 （*.tar.gz 的方式安装软件）安装某些数据时，会使用到里头的许多包含档                                                                                                                      |
| /usr/libexec/      | 某些不被一般使用者惯用的可执行文件或脚本（script）等等，都会放置在此目录中。例如大部分的 X 窗口下面的操作指令， 很多都是放在此目录下的                                                                                                                                     |
| /usr/lib\<qual\>/    | 与 /lib\<qual\>/功能相同，因此目前 /lib\<qual\> 就是链接到此目录中                                                                                                                                                                                                             |
| /usr/src/          | 一般源代码建议放置到这里，src有source的意思。至于核心源代码则建议放置到/usr/src/linux/目录下|                                                                                                                                                                               |

### /var （variable）： 与系统运行过程有关
  在系统运行后才会渐渐占用硬盘容量的目录
  因为/var目录主要针对常态性变动的文件，包括高速缓存（cache）、登录文件（log file）以及某些软件运行所产生的文件， 包括程序文件（lock file, run file）


| 目录        | 应放置文件的内容                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| /var/cache/ | 应用程序本身运行过程中会产生的一些暂存盘                                                                                                                                                                                                                                                                                                                                                                                                                              |
| /var/lib/   | 程序本身执行的过程中，需要使用到的数据文件放置的目录。在此目录下各自的软件应该要有各自的目录。 举例来说，MySQL的数据库放置到/var/lib/mysql/而rpm的数据库则放到/var/lib/rpm去                                                                                                                                                                                                                                                                                          |
| /var/lock/  | 某些设备或者是文件资源一次只能被一个应用程序所使用，如果同时有两个程序使用该设备时， 就可能产生一些错误的状况，因此就得要将该设备上锁（lock），以确保该设备只会给单一软件所使用。 举例来说，烧录机正在烧录一块光盘，你想一下，会不会有两个人同时在使用一个烧录机烧片？ 如果两个人同时烧录，那片子写入的是谁的数据？所以当第一个人在烧录时该烧录机就会被上锁， 第二个人就得要该设备被解除锁定（就是前一个人用完了）才能够继续使用啰。目前此目录也已经挪到 /run/lock 中 |
| /var/log/   | 登录文件放置的目录！里面比较重要的文件如/var/log/messages, /var/log/wtmp（记录登陆者的信息）等                                                                                                                                                                                                                                                                                                                                                                        |
| /var/mail/  | 放置个人电子邮件信箱的目录，不过这个目录也被放置到/var/spool/mail/目录中！ 通常这两个目录是互为链接文件啦                                                                                                                                                                                                                                                                                                                                                             |
| /var/run/   | 某些程序或者是服务启动后，会将他们的PID放置在这个目录下。与 /run 相同，这个目录链接到 /run 去了                                                                                                                                                                                                                                                                                                                                                                       |
| /var/spool/ | 这个目录通常放置一些伫列数据，所谓的“伫列”就是排队等待其他程序使用的数据啦！ 这些数据被使用后通常都会被删除。举例来说，系统收到新信会放置到/var/spool/mail/中， 但使用者收下该信件后该封信原则上就会被删除。信件如果暂时寄不出去会被放到/var/spool/mqueue/中， 等到被送出后就被删除。如果是工作调度数据（crontab），就会被放置到/var/spool/cron/目录中                                                                                                              |
