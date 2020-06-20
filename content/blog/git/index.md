---
template: post
title: Useful Git
slug: git-commands
date: "2020-06-20T23:46:37.121Z"
category: git
tags: ["git"]
---

Git is a really useful tool which can save you from almost every single situation... but it's also something that you can shoot yourself in the foot with.

Today I thought I'd just run through some useful git commands that can save ALMOST every situation.

## Every line I have written is wrong, this was a terrible idea

So you want to remove every single change you've made and pretend that nothing ever happened
well short of rm -rf theentireproject, it might be a bit easier if you just :

```
git reset --hard HEAD # evaporates all tracked changes
git clean -fd # delete untracked files and directories
```

## THAT WAS THE WRONG COMMIT MESSAGE

Self explanatory...

```
git commit --amend
```

lets you change the last commit message!

## I only want to commit this one bit in a file...

```
git add -p
```

then you go though saying yay/nay to if you want to stage each hunk.

## And I've just commited to the main branch.

ezpz

```
git reset HEAD~ --soft
git stash

git checkout actualbranch
git stash pop
git add .
git commit
```
