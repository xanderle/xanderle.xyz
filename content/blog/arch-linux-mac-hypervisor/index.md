---
template: post
title: Installing Arch Linux on Mac Hypervisor
slug: installing-arch-linux-on-mac-hypervisor
date: "2020-05-04T23:46:37.121Z"
category: linux
tags: ["linux", "hypervisor"]
---
## Situation

So you love your shiny Apple build quality computers, but you also love telling people "I use Arch btw".

Solution: Install Arch Linux via xhyve and then remote into it via NoMachine.

THIS IS A GENERAL GUIDE ASSUMING A LEVEL OF DIFFICULTY BECAUSE THIS IS OVERKILL.


## Steps:

Prerequisites:  

- You're going to need Homebrew (go google that I'm not telling you)
- Arch Linux ISO

```
brew install xhyve
```

- Make a directory you're going to do this in

```
mkdir Arch
```

- Wacky work around for making the ISO useable for you

```
dd if=/dev/zero of=/tmp/tmp.iso bs=$[4*1024] count=1                                               

```
- Write the ISO into this tmp.iso

```
dd if=/Your/Download/Path/archlinux-2020.02.01-x86_64.iso bs=$[4*1024] skip=1 >> tmp.iso
```
- Mount the tmp.iso you just made

```
hdiutil attach /tmp/tmp.iso
```

- Now you need two files, vmlinuz and archiso.img so you are going to copy them into your Arch dir you made earlier. (Your ARCH_202002 might be different)

```
cd Arch
cp /Volumes/ARCH_202002/arch/boot/x86_64/vmlinuz .
cp /Volumes/ARCH_202002/arch/boot/x86_64/archiso.img .

```

- Create a HD for the guest operating system. Adjust from 50G to whatever you want.

```
mkfile -n 50G Arch.img
```
- Generate a UUID
```
uuidgen
```
Now paste into a start.sh file this script. 
Remember to 
- replace <UUID> with the output of uuidgen.
- set the path to the ARCH iso in IMG_CD
- Set archisolabel=<Whatever the volume is called>

(also chmod +x it)

```
KERNEL="vmlinuz"
INITRD="archiso.img"
CMDLINE="earlyprintk=serial console=ttyS0 root=<UUID> archisobasedir=arch archisolabel=ARCH_202002 rw loglevel=3 quiet"

MEM="-m 4G" #RAM
SMP="-c 2" #NUMBEROFCORES
NET="-s 2:0,virtio-net"
IMG_CD="-s 3,ahci-cd,/THE/PATH/TO/archlinux-2020.02.01-x86_64.iso"
IMG_HDD="-s 4,virtio-blk,Arch.img"
PCI_DEV="-s 0:0,hostbridge -s 31,lpc"
LPC_DEV="-l com1,stdio"
ACPI="-A"
UUID="-U <UUID>"

xhyve $ACPI $MEM $SMP $PCI_DEV $LPC_DEV $NET $IMG_CD $IMG_HDD $UUID -f kexec,$KERNEL,$INITRD,"$CMDLINE"


```
Run the script with sudo (you need it for networking) and go through your normal install procedure using the hard drive is located at /dev/vda
create a /boot /dev/vda1 of type vfat (type W95 FAT b) and your / in /dev/vda2

add the virtio_blk to /etc/mkinitcpio.conf
```
MODULES=(virtio_blk)
```

Right before you quit you are going to want to copy two files off.

Now get an SSH server going so you can SCP two files off. 

```
scp root@192.168.64.5:/mnt/boot/initramfs-linux.img .
scp root@192.168.64.5:/mnt/boot/vmlinuz-linux .
scp root@192.168.64.5:/mnt/boot/grub/grub.cfg .
```

Armed with these new files make a new script called run.sh (or edit the old one)

Look into the grub.cfg file to find any extra cmdline arguments you might need. 
```
KERNEL="vmlinuz-linux"
INITRD="initramfs-linux.img"
CMDLINE="earlyprintk=serial console=ttyS0 root=<UUID> archisobasedir=arch archisolabel=ARCH_202002 rw loglevel=3 quiet"

MEM="-m 4G"
SMP="-c 2"
NET="-s 2:0,virtio-net"
IMG_HDD="-s 4,virtio-blk,Arch.img"
PCI_DEV="-s 0:0,hostbridge -s 31,lpc"
LPC_DEV="-l com1,stdio"
ACPI="-A"
UUID="-U <UUID>

# shellcheck disable=SC2086
xhyve $ACPI $MEM $SMP $PCI_DEV $LPC_DEV $NET $IMG_CD $IMG_HDD $UUID -f kexec,$KERNEL,$INITRD,"$CMDLINE"
```

As some final steps, install NoMachine, i3-gaps, Nerd Fonts (Fira Code variant obviously) and use NoMachine to RDP into your shiny new VM!