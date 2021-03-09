#!/usr/bin/env bash

set -e

# vuepress dist folder
cd $GITHUB_WORKSPACE/blog/.vuepress/dist

git init
git config user.name "HugoHuang" --local
git config user.email "hugohuang1111@gmail.com" --local

# Generate a CNAME file
# echo $CNAME > CNAME

DEPLOY_REPO="https://x-access-token:${ACCESS_TOKEN}@github.com/hugohuang1111/Blog.git"

git branch -m gh-pages
git add .
git commit -m "Deploy"
git push --force $DEPLOY_REPO gh-pages
rm -fr .git

cd $GITHUB_WORKSPACE

echo "Successfully deployed!"
