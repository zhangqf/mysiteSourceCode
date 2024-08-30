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
  |1\~999<br>系统账号|保留给系统使用的ID，除了0之外，其他的UID权限与特性并没有不一样。默认1000 以下的数字让给系统作保留账号只是一个习惯。<br> 由于系统上面启动的网络服务或背景服务希望使用较小的权限去运作，因此不希望使用root的身份去执行这些服务，所以我们就要提供这些运作中程序的拥有者账号才行。这些系统账号通常是不可登入的，所以 才会有 /sbin/nologin 这个特殊的shell存在<br> 根据系统账号的由来，通常这类账号又被区分为两种<br> 1\~200： 由distributions 自行建立的系统账号<br> 201\~999: 若用户有系统账号需求时，可以使用的账号UID|
  |1000~60000<br> 可登入账号|给一般使用者用的。事实上，目前的linux核心（3.10.x 版）已经可以支持到4294967295（2^32-1）这么大的UID号码|

  4. GID：这个与/etc/group有关，其实/etc/group的观念与/etc/passwd差不多，只是他是用来规范组名与GID的
  5. 用户信息说明栏：这个字段基本上并没有什么重要用途，只是用来解释这个账号的意义而已。不过，如果提供使用finger的功能时，这个字段可以提供很多的信息
  6. 家目录：这是用户的家目录。当用户登录后，会进入对应的家目录中，这个家目录可以更改。默认在 /home/yourIDname
  8. shell：当用户登入系统后就会取得一个shell来与系统的核心沟通以进行用户的操作任务。那为什么预设的shell会使用bash呢？就是在这个字段指定的。有一个shell可以用来替代成让账号无法取得shell环境的登入动作，如：/sbin/nologin 这个东西。这也可以用来制作纯pop邮件账号者的数据
  
- /etc/shadow 文件结构
  很多程序的运作都与权限有关，而权限与UID/GID有关。因此各程序当然需要读取/etc/passwd来了解不同账号的权限

  ```shell
  [root@iZbp13op1xah7j3j1x457dZ ~]# head -n 4 /etc/shadow
  root:$6$zwuInQeQ$u6.Loifs73Fyc8OdP9V1xRIg0.gfmEUvCPQxhShyvCiFiYI94UM3WDT/szMMctv3Oy.9XMUi8FY3/fiMOkaUp/:19914:0:99999:7:::
  bin:*:18353:0:99999:7:::
  daemon:*:18353:0:99999:7:::
  adm:*:18353:0:99999:7:::
  [root@iZbp13op1xah7j3j1x457dZ ~]# 

  ```
  1. 账号名称：密码也需要与账号对应，这个文件的第一栏就是账号，必须要与/etc/passwd相同才行
  2. 密码：这个字段内的数据才是真正的密码，而且是经过编码的密码。虽然这个密码经过了加密，但是这个文件的预设权限是 -rw------- 或者是 ----------，只有root才可以读写，因为即使是加密的密码，也有被破解的可能。
  3. 最近改动的日期：距1970年开始到多少天，修改了
  4. 密码不可被改动的天数：这个账号的密码在最近一次被更改后需要经过几天才可以再被更改。0 表示密码随时可以改动的意思。这个限制是为了怕密码被某些人一改再改而设计的。如果设定为20天的话，那么当你设定了密码后，20天内都无法更改这个密码
  5. 密码需要重新变更的天数：强制用户变更密码，这个字段可以指定在最近一次更改密码后，在多少天数内需要再次的变更密码才行。必须在在这个天数内重新设定你的密码，否则这个账号的密码将会 变为过期特性。 99999 为 273年 即没有强制性的意思
  6. 密码需要变更期限前的警告天数：当账号的密码有效期快要到的时候（第5个字段），系统会依据这个字段的设定，发出 警告 给这个账号，提醒它 再过 n 天你的密码就要过期了，请尽快重新设定你的密码。 如上，则是密码到期7天之内，系统警告该用户
  7. 密码过期后的账号宽限时间（密码失效日）：（第5个字段相比）密码有效日期为 【更新日期（第3个字段） + 重新变更日期（第5个字段） 】，过了该期限后用户依旧没有更新密码，那改密码就算过期了。 虽然密码过期但是该账号还是可以用来进行其他工作的，包括登录系统取得bash。 不过如果密码过期了，那当你登入系统时，系统会强制要求你必须要重新设定密码才能登入继续使用，这就是密码过期特性
  8. 账号失效日期：这个日期跟第三个字段一样，都是使用1970年以来的总日数设定。这个字段表示：这个账号在此字段规定的日期之后，将无法再使用。就是所谓的 账号失效，此时不论密码是否过期，这个账号都不能再被使用。这个字段会被使用通常应该是在 收费服务的系统中， 可以规定一个日期让该账号不能在使用了
  9. 保留：最后一个字段是保留的，看以后有没有新功能加入

### 关于群组： 有效与初始群组、groups，newgrp
- /etc/group 文件结构
  ```shell
  [root@iZbp13op1xah7j3j1x457dZ ~]# head -n 4 /etc/group
  root:x:0:az
  bin:x:1:
  daemon:x:2:
  sys:x:3:
  [root@iZbp13op1xah7j3j1x457dZ ~]# 

  ```
  1. 组名：与GID对应
  2. 群组密码：通常不需要设定，这个设定通常是给 群组管理员 使用的，目前很少有这个机会设定群组管理员。同样，密码已经移动到 /etc/gshadow中去了。因此这个字段只会存在一个 x
  3. GID：就是群组的ID。
  4. 此群组支持的账号名称：一个账号可以加入多个群组，那某个账号想要加入此群组时，将改账号填入这个字段即可。如，想要让az也加入到root这个群组，那么在第一行的最后面加上az，如果是多个用户吗，则使用 ， 分隔
- 有效群组（effective group）与初始群组（initial group）
  每个使用者在他的/etc/passwd里面的第四栏有所谓的GID，这个GID就是所谓的 初始群组（initial group）。也就是说，档用户一登入系统，就立刻拥有这个群组的的相关权限的意思。如，az这个使用者的/etc/passwd与/etc/gshadow相关的内容如下
  ```shell
  [root@iZbp13op1xah7j3j1x457dZ ~]# usermod -a -G users az
  [root@iZbp13op1xah7j3j1x457dZ ~]# grep az /etc/passwd /etc/group /etc/gshadow
  /etc/passwd:az:x:1000:1000::/home/az:/bin/bash
  /etc/group:root:x:0:az            # 次要群组设定，安装时指定
  /etc/group:users:x:100:az            # 次要群组设定，安装时指定
  /etc/group:az:x:1000:            # 初始群组，所以第四个字段不需要填入账号
  /etc/gshadow:root:::az            # 次要群组设定
  /etc/gshadow:users:::az            # 次要群组设定
  /etc/gshadow:az:!::
  [root@iZbp13op1xah7j3j1x457dZ ~]# 
  ```
  上面例子中，az账号同时支持az root users 这三个群组，因此，在读取/写入/执行文件时，针对群组部分，只要时users，root， az这三个群组拥有的功能，az这个账号的使用这都能够拥有。**不过，这是针对已经存在的文件而言，如果今天要建立一个新的文件或者时目录，新文件的群组时az，root，还是users呢** ，这就要检查一下当时有效群组了
- groups：有效与支持群组的观察
  如果以az这个账号登入，该如何知道所有支持的群组呢。
  ```shell
  [az@iZbp13op1xah7j3j1x457dZ root]$ groups
  az root users
  [az@iZbp13op1xah7j3j1x457dZ root]$ 
  ```
  上面信息中可以知道az这个用户同时属于az root users这三个群组，第一个输出的群组即为有效群组（effective group）。即当前账号az的有效群组为az。若此时以touch去建立一个新档，那么新建的这个文件拥有者为az，群组为az
  ```shell
  [az@iZbp13op1xah7j3j1x457dZ ~]$ touch test
  [az@iZbp13op1xah7j3j1x457dZ ~]$ ll test
  -rw-rw-r-- 1 az az 0 Aug 30 22:14 test
  [az@iZbp13op1xah7j3j1x457dZ ~]$ 
  ```
- newgrp：有效群组切换
  变更有效群组，使用newgrp时，想要变更的群组必须是你已经支持的群组。az 可以在az root users这三个群组之间切换有效群组。但是无法切换有效群组为其他群组
  ```shell
  [az@iZbp13op1xah7j3j1x457dZ ~]$ groups
  users root az
  [az@iZbp13op1xah7j3j1x457dZ ~]$
  
  [az@iZbp13op1xah7j3j1x457dZ ~]$ touch test2
  [az@iZbp13op1xah7j3j1x457dZ ~]$ ll test2
  -rw-r--r-- 1 az users 0 Aug 30 22:21 test2
  [az@iZbp13op1xah7j3j1x457dZ ~]$ 

  ```
  这个指令可以变更当前用户的有效群组，而且是**另外以一个shell来提供这个功能的**，所以，上面的列子来说，az这个使用者目前是以另一个shell登入的，而且新的shell给予az有效GID为users。虽然用户的环境设定不会有影响，但是使用者的 群组权限 将会重新被计算。需要注意，由于是新取得一个shell，因此如果想要回到原本环境中，请输入 exit 来回到原本shell
- /etc/gshadow
  ```
  [root@iZbp13op1xah7j3j1x457dZ ~]# head -n 4 /etc/gshadow
  root:::az
  bin:::
  daemon:::
  sys:::
  [root@iZbp13op1xah7j3j1x457dZ ~]# 
  ```
  1. 组名
  2. 密码栏，开头为！表示无合法密码，所有无群组管理员
  3. 群组管理员账号
  4. 有加入该群组支持的所属账号
     
  gshadow最大的功能就是建立群组管理员。什么是群组管理员？由于系统上面的账号可能会很多，root可以忙不过来，所以当有使用者想要加入某些群组时，root或许会没有空管理。此时如果能建立群组管理员的话，那么该群组管理员就能够将那个账号加入自己管理的群组中。免去root的操作。

## 账号管理
### 新增与移除使用者： useradd，相关配置文件，passwd，usermod，userdel

-useradd

|选项|解释|
|---|---|
|-u|后面接的是UID，是一组数字。直接指定一个特定的UID给这个账号|
|-g|后面接的那个组名就是我们上面提到的initial group|
|-G|后面接的组名则是这个账号还可以加入的群组<br>这个选项与参数会修改/etc/group内的相关资料|
|-M|强制！不要建立用户家目录（系统账号默认值）|
|-m|强制！要建立用户家目录（一般账号默认值）|
|-c|这个就是/etc/passwd的第五栏的说明内容|
|-d|指定某个目录成为家目录，而且不要使用默认值。务必使用绝对路径|
|-r|建立一个系统的账号，这个账号的UID会有限制（参考/etc/login.defs）|
|-s|后面接一个shell，若没有指定则预设是/bin/bash|
|-e|后面接一个日期，格式为 YYYY-MM-DD 此项目可写入shadow 第八个字段，即账号失效日的设定项目|
|-f|后面接shadow的第七个字段项目，指定密码是否会失效。0为立刻失效，-1为永远不失效（密码只会过期而强制登入时重新设定）|

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
