---
template: post
title: Configuring MacOS with Nix
slug: configuring-macos-with-nix
date: "2020-12-22T23:46:37.121Z"
category: MacOS 
tags: ["nix", "macos"]
---
I had planned to do an Advent of Terminal Tools, but unfortunately I found Nix and completely missed every single day. However, I have come through enlightened.

The problem I was looking to solve was the ability to setup a system with. my personal config with minimal effort. The only way to do this was to first expend all the effort on learning Nix.

## What is Nix?

"Nix is a tool that takes a unique approach to package management and system configuration. Learn how to make reproducible, declarative and reliable systems."

So it builds everything in isolation,

On top of this it also provides useful things like
- nix-env
    - Want to run something but dont want to install it? run it in a nix-env and just close it.
    - Setup a developer environment that has all the tools you need for the specific task with no chance of dependency coliisions!
- just installed something to your system and its broke? just rollback!


## Going Further

For a full MacOS setup you need two things
1. [Nix-Darwin](https://github.com/LnL7/nix-darwin)

Nix is the packmanager, Nixpkgs are the packages. So whats nix-darwin?

nix-darwin extends this by allowing configuration and service management. Think setting up daemons, installing applications and configuring them (on a system level), and doing things like configuring Dock.


2. [home-manager](https://github.com/nix-community/home-manager)

Home manager provides the a system for managing user specific things like their environment, this overlaps with nix-darwin a bit since you can configure applications in both places. But home-manager brings in xdg.confgFile which lets you import in your dotfiles that you haven't configured in Nix.


## Getting Started

This step will vary depending the the OS version and whether or not it has a T2 chip. These steps are what I had to do to get it to work on Apple Silicon.

1. Install Nix
    - `sh <(curl -L https://nixos.org/nix/install) --darwin-use-unencrypted-nix-store-volume`
    - this gives you single user mode (which is what is currently most tested for MacOS)
2. Install nix-darwin
    - `nix-build https://github.com/LnL7/nix-darwin/archive/master.tar.gz -A installer
    ./result/bin/darwin-installer`
    - these are two lines, it drops a `result` folder into whatever directory youre in.

3. Install home-manager
    - `nix-channel --add https://github.com/nix-community/home-manager/archive/master.tar.gz home-manager`
    - `nix-channel --update`
4. Import home-manager into your darwin config
    - now add `imports = [ <home-manager/nix-darwin> ];` to your ~/.nixpkgs/darwin-configuration.nix
    ```
{ config, pkgs, ... }:
{
  # List packages installed in system profile. To search by name, run:
  # $ nix-env -qaP | grep wget
  imports = [ <home-manager/nix-darwin> ];
...
    ```

   this gives you access to home manager things like setting up a user


   ```
  users.users.xanderle.name = "xanderle";
  users.users.xanderle.home = "/Users/xanderle";
  home-manager.users.xanderle = (import /Users/xanderle/.nixpkgs/xanderle.nix);
  ```

  where I've seperated out my user config into a different file which looks like this...


  ```
  { pkgs, ... }: {
  imports = [
    ./applications/alacritty
    ./applications/zsh
    ./applications/neovim
    ./applications/git
    ./applications/tmux ];
	
    home.packages = with pkgs; [
 	atool
	httpie
	weechat
	exa
	bat
	lazygit
	lazydocker
	nodejs
	yarn
    ];
}
```

5. Go forth and configure! I've included my [config](https://github.com/xanderle/config) incase someone needs a reference.
I won't claim its perfect but its my starting point
