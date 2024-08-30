# Linux 账号管理与ACL权限设定
## Linux 的账号与群组
### 使用者标识符：UID与GID
每一个文件都具有 拥有人和拥有群组 的属性。每个登入的使用者至少都会取得两个ID，一个是使用者ID（UserID，简称UID），一个是群组ID（Group ID，简称GID）

文件如何判别他的拥有者与群组呢，其实就是利用UID与GID。每一个文件都会有所谓的拥有者ID与拥有群组ID，当我们要显示文件属性的需求时，系统会依据/etc/passwd与/etc/group的内容，找到UID/GID对应的账号与组名再显示出来。

```shell

[az@iZbp13op1xah7j3j1x457dZ bin]$ id az
uid=1000(az) gid=1000(az) groups=1000(az),0(root)

[az@iZbp13op1xah7j3j1x457dZ bin]$ ll -d /home/az
drwx------ 3 az az 4096 Aug 29 21:58 /home/az

[az@iZbp13op1xah7j3j1x457dZ bin]$ vim /etc/passwd

[az@iZbp13op1xah7j3j1x457dZ bin]$ cat /etc/passwd
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
sync:x:5:0:sync:/sbin:/bin/sync
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
operator:x:11:0:operator:/root:/sbin/nologin
games:x:12:100:games:/usr/games:/sbin/nologin
ftp:x:14:50:FTP User:/var/ftp:/sbin/nologin
nobody:x:99:99:Nobody:/:/sbin/nologin
systemd-network:x:192:192:systemd Network Management:/:/sbin/nologin
dbus:x:81:81:System message bus:/:/sbin/nologin
polkitd:x:999:998:User for polkitd:/:/sbin/nologin
sshd:x:74:74:Privilege-separated SSH:/var/empty/sshd:/sbin/nologin
postfix:x:89:89::/var/spool/postfix:/sbin/nologin
chrony:x:998:996::/var/lib/chrony:/sbin/nologin
nscd:x:28:28:NSCD Daemon:/:/sbin/nologin
tcpdump:x:72:72::/:/sbin/nologin
rpc:x:32:32:Rpcbind Daemon:/var/lib/rpcbind:/sbin/nologin
rpcuser:x:29:29:RPC Service User:/var/lib/nfs:/sbin/nologin
nfsnobody:x:65534:65534:Anonymous NFS User:/var/lib/nfs:/sbin/nologin
nginx:x:997:995:Nginx web server:/var/lib/nginx:/sbin/nologin
gitlab-www:x:996:993::/var/opt/gitlab/nginx:/bin/false
git:x:995:992::/var/opt/gitlab:/bin/sh
gitlab-redis:x:994:991::/var/opt/gitlab/redis:/bin/false
gitlab-psql:x:993:990::/var/opt/gitlab/postgresql:/bin/sh
gitlab-prometheus:x:992:989::/var/opt/gitlab/prometheus:/bin/sh
az:x:1000:1000::/home/az:/bin/bash
alex:x:1001:1002::/home/alex:/bin/bash
arod:x:1002:1001::/home/arod:/bin/bash
[az@iZbp13op1xah7j3j1x457dZ bin]$ 


[root@iZbp13op1xah7j3j1x457dZ ~]# vim /etc/passwd
# 将az 中的1000 修改为2000
az:x:2000:1000::/home/az:/bin/bash
alex:x:1001:1002::/home/alex:/bin/bash
arod:x:1002:1001::/home/arod:/bin/bash





# 这里显示的是ID，而不是用户名，是因为id为1000没有找到的对应的用户名
[root@iZbp13op1xah7j3j1x457dZ ~]# ll -d /home/az
drwx------ 3 1000 az 4096 Aug 30 10:56 /home/az

[root@iZbp13op1xah7j3j1x457dZ ~]# 

```

### 使用者账号
linux系统上的用户如果需要登入主机取得shell的环境来工作时，他需要如何进行呢，首先，他必须要在计算机前面利用tty1~tty6的终端机提供的login接口，并输入账号与密码后才能够登入。如果是透过网络的话，那么至少使用者就的要学习ssh这个功能。那么输入账号密码后，系统帮你处理了什么

1. 先寻找/etc/passwd里面是否有你输入的账号，如果没有则跳出，如果有的话，则将该账号对应的UID与GID（/etc/group中）读出来，另外，该账号的家目录与shell设定也一并读出
2. 再来则是核对密码表了，这是Linux会进入/etc/shadow里面找出对应的账号与UID，然后核对一下你刚刚输入的密码与里头的密码是否相符
3. 如果都OK，就进入shell控管阶段

- /etc/passwd 文件结构
  每一行都代表一个账号，有几行就代表有几个账号在系统中。不过需要特别留意的是，里头很多账号本来就是系统正常运作所必须要的，我们可以简称它为系统账号，如 bin，daemon，adm，nobody等等，这些账号不能用随意删除。

  ```shell
  [root@iZbp13op1xah7j3j1x457dZ ~]# head -n 4 /etc/passwd
  root:x:0:0:root:/root:/bin/bash
  bin:x:1:1:bin:/bin:/sbin/nologin
  daemon:x:2:2:daemon:/sbin:/sbin/nologin
  adm:x:3:4:adm:/var/adm:/sbin/nologin
  [root@iZbp13op1xah7j3j1x457dZ ~]# 
  ```
  1. 账号名称：用来提供给对数字不太敏感的人类使用来登录系统的，需要用来对应UID
  2. 密码：早期Unix系统的密码就是放在这个字段上的。但是因为这个文件的特性是所有程序都能够读取，这样一来很容易造成密码数据被窃取，因此后来就将这个字段的密码数据给他该放到/etc/shadow中了。
  3. UID：这个就是使用者标识符，通常Linux对应UID有几个限制

  |id范围|该ID使用者特性|
  |---|---|
  |0<br>系统管理员|当UID是0时，代表这个账号是 系统管理员 所以当你要让其他账号名称也具有root的权限时，将改账号的UID改为0即可。也就是说，一部系统上面的系统管理员不见得只有root。不建议有多个账号的UID是0，容易让系统管理员混乱|
  |1~999<br>系统账号|保留给系统使用的ID，除了0之外，其他的UID权限与特性并没有不一样。默认1000 以下的数字让给系统作保留账号只是一个习惯。<br> 由于系统上面启动的网络服务或背景服务希望使用较小的权限去运作，因此不希望使用root的身份去执行这些服务，所以我们就要提供这些运作中程序的拥有者账号才行。这些系统账号通常是不可登入的，所以 才会有 /sbin/nologin 这个特殊的shell存在<br> 根据系统账号的由来，通常这类账号又被区分为两种<br> 1~200： 由distributions 自行建立的系统账号<br> 201~999: 若用户有系统账号需求时，可以使用的账号UID|
  |1000~60000<br> 可登入账号|给一般使用者用的。事实上，目前的linux核心（3.10.x 版）已经可以支持到4294967295（2^32-1）这么大的UID号码|

  4. GID：这个与/etc/group有关，其实/etc/group的观念与/etc/passwd差不多，只是他是用来规范组名与GID的
  5. 用户信息说明栏：这个字段基本上并没有什么重要用途，只是用来解释这个账号的意义而已。不过，如果提供使用finger的功能时，这个字段可以提供很多的信息
  6. 家目录：这是用户的家目录。当用户登录后，会进入对应的家目录中，这个家目录可以更改。默认在 /home/yourIDname
  8. shell：当用户登入系统后就会取得一个shell来与系统的核心沟通以进行用户的操作任务。那为什么预设的shell会使用bash呢？就是在这个字段指定的。有一个shell可以用来替代成让账号无法取得shell环境的登入动作，如：/sbin/nologin 这个东西。这也可以用来制作纯pop邮件账号者的数据
  
- /etc/shadow 文件结构



## 账号管理
### 新增与移除使用者： useradd，相关配置文件，passwd，usermod，userdel
### 用户功能
### 新增与移除群组
### 账号管理实例
### 使用外部身份认证系统
## 主机的细部权限规划：ACL的使用
### 什么是ACL 与如何支持启动ACL
### ACL的设定技巧：getfacl， setfacl

## 使用者身份切换
### su 
### sudo

## 用户的特殊shell与PAM模块
### 特殊的shell，/sbin/nologin
### PAM模块简介
### PAM模块设定语法
### 常用模块简介
### 其他相关文件

## Linux主机上的用户信息传递
### 查询使用者：w，who，last，lastlog
### 使用者对谈：write，mesg，wall
### 使用者邮件信箱：mail

## CentOS7 环境下大量建置账号的方法
### 一些账号相关的检查工具
### 大量建置账号模板（适用 passwd --stdin选项）
