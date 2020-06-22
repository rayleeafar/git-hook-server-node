#!/bin/sh

repoName=$1
repoUrl=$2

cd ~
if [ ! -d $repoName ]; then
  git clone $repoUrl
fi
cd $repoName
git reset --hard
git pull
sh deploy.sh