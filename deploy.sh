#!/usr/bin/env sh

# 忽略错误
set -e  #有错误抛出错误

# 检查 SSH 代理是否已启动
if ! ssh-add -l > /dev/null 2>&1; then
  eval $(ssh-agent -s)
fi

# 添加 SSH 密钥
ssh-add ~/.ssh/id_rsa


# 构建
yarn run docs:build  #然后执行打包命令

# 进入待发布的目录
cd docs/.vitepress/dist  #进到dist目录

git init  #执行这些git命令

git config --global user.email "15893652937@163.com"
git config --global user.name "yinian"

git add -A
git commit -m 'deploy'

git push -f git@github.com:zhangqf/mysite.git master:gh-pages  #提交到这个分支

cd -

rm -rf docs/.vitepress/dist  #删除dist文件夹
