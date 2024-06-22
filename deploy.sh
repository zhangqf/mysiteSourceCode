#!/usr/bin/env sh

export GITHUB_TOKEN=${{ secrets.PERSONAL_ACCESS_TOKEN }}

# 忽略错误
set -e  #有错误抛出错误

# 构建
yarn run docs:build  #然后执行打包命令
# 进入待发布的目录
cd docs/.vitepress/dist  #进到dist目录
git config --global init.defaultBranch main
git init  #执行这些git命令

git config user.email "15893652937@163.com"
git config user.name "zhangqf"


git add -A
git commit -m 'deploy'

git push -f https://github.com/zhangqf/mysite.git main:gh-pages  #提交到这个分支

cd -

rm -rf docs/.vitepress/dist  #删除dist文件夹
