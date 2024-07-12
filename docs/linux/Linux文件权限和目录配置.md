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
| -rw-r--r--  | 1  | zhangfeng | staff | 21 | 7  8 17:20 |text.txt |
|---|---|---|:--|:--|:--|:--|
| 权限 | 链接 | 拥有者 | 群组 | 大小 | 修改日期 | 文件名 |

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
    
    
| 元件 | 内容 | 叠代物件 | r | w | x |
|---|---|---|:--|:--|:--|
| 文件 | 详细数据data | 文件数据夹 | 读到文件内容 | 修改文件内容 | 执行文件内容 |
| 目录 | 文件名 | 可分类抽屉 | 读到文件名 | 修改文件名 | 进入该目录的权限（key） |

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


| 操作动作 | /dir1 | /dir1/file1 | /dir2 | 重点 |
|---|---|---|:--|:--|
| 读取file1的内容 | x | r | - | 要能够进入/dir1才能读取到里面的文件数据 |
| 修改file1的内容 | x | rw | - | 进入/dir1且修改file1才行 |
| 执行file1的内容 | x | rx | - | 进入/dir1 且file1能运行 |
| 删除dile1文件 | wx | - | - | 进入/dir1具有目录修改的权限 |
| 将file1复制到/dir2 | x | r | wx | 能够读file1且能够修改/dir2内的数据 |

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