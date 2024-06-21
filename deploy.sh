#!/usr/bin/env sh

# 忽略错误
set -e  #有错误抛出错误

# 构建
yarn run docs:build  #然后执行打包命令

# 进入待发布的目录
cd docs/.vitepress/dist  #进到dist目录
git config --global init.defaultBranch main
git init  #执行这些git命令

 git config --global user.email "15893652937@163.com"
 git config --global user.name "yinian"


git add -A
git commit -m 'deploy'

# ssh-agent -a "$SSH_AUTH_SOCK"
# ssh-add - <<< "$MYSITE"

git push -f git@github.com:zhangqf/mysite.git main:gh-pages  #提交到这个分支

cd -

rm -rf docs/.vitepress/dist  #删除dist文件夹
