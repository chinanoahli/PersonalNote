---
title: "Linux 使用技巧"
type: docs
draft: false
notHomePage: true
bookHidden: true
description: "Linux Tweaks"
summary: "Linux 使用技巧"
---

# Linux 使用技巧

## Debian Wi-Fi 网络正常但任务栏无法显示 Wi-Fi 图标

Debian 有时会默认安装多个网络管理器，多个网络管理器之间冲突，就会导致 Wi-Fi 图标无法显示

例如 ifupdown 、 wicd 和 NetworkManager 都自动安装了

解决办法:

1. 卸载不需要的网络管理器<br />`sudo apt purge ifupdown wicd`
2. 确保 `/etc/network/interfaces` 没有配置 Wi-Fi<br />否则 NetworkManager 会忽略该接口

   ```text
   auto lo                   # 一般来说仅需保留此行
   iface lo inet loopback
   ```

## 一条命令调整文件与目录的权限 [^1]

> 背景:
>
> 偶尔会接受到来自 Windows 系统的目录与文件，但是这些文件的权限经常全部都是 `0777`，这是让人难以接受的
>
> 以前会考虑写个脚本来遍历目录调整权限，但是脚本都没有保留，所以这次就直接谷歌了

有两个办法：

1. 通过 *find* 命令

   ```shell
   # for directories
   find /path/to/dir -type d -print0 | xargs -0 chmod 0755

   # for files
   find /path/to/dir -type f -print0 | xargs -0 chmod 0644
   ```

2. 通过 *chmod* 命令本身的参数控制

   ```shell
   chmod -R u+rwX,go+rX,go-w /path/to/dir
   ```

   这里主要是用到了 `-X` 参数，这个参数可以为 *目录* 自动加入 **可执行** 权限

   但是对于文件，它会检查文件是否符合下列条件，只有符合条件的文件才会被赋予 **可执行** 权限

   1. 文件本身是 *可执行文件*

   2. 能 *被当前用户(组)* (取决于你这个 `-X` 放在命令中的哪一段) 检索到

## LightDM 开机自动登陆用户账户 [^2]

修改文件 `/etc/lightdm/lightdm.conf`

在 `[Seat:*]` 下方跟添加

```
autologin-user=chinanoahli    # 以 chinanoahli 用户作为例子，请修改为你自己的用户名
autologin-user-timeout=60     # 先等待 60 秒，若误操作，再进行自动登陆
```

> ⚠ 注意:
>
> LightDM 的配置文件内容相同的注释比较多，如果用搜索功能进行搜索的话，务必要看清楚自己修改的必须是 `[Seat:*]` 段落里面的内容，而不是其他注释说明中的内容！！

## 重建 GUI 的字体缓存

以 **<i>root</i>** 身份运行 `fc-cache -r -v`

## 重建 GUI 的图标缓存

以 **<i>root</i>** 身份运行 `update-icon-caches /usr/share/icons/*`


## 检查 ext4 文件系统错误，并进行碎片整理 [^3] [^4]

> 这些操作都需要 **<i>root</i>** 权限

```shell
# umount 你需要操作的<分区>
fsck.ext4 -y -f -v /dev/<分区>     # 检查文件系统是否有错误
fsck.ext4 -y -f -v -D /dev/<分区>  # 优化目录结构
# mount 你需要操作的<分区>
e4defrag -v /dev/<分区>            # 对文件进行碎片整理
fsck.ext4 -y -f -v /dev/<分区>     # 检查到底优化了多少(非必要)
```

## 引用来源

[^1]: [Change all files and folders permissions of a directory to 644/755](https://stackoverflow.com/questions/18817744/change-all-files-and-folders-permissions-of-a-directory-to-644-755)
[^2]: [Enabling Auto Login](https://forums.linuxmint.com/viewtopic.php?t=286267)
[^3]: [How to defrag an ext4 filesystem](https://askubuntu.com/questions/221079/how-to-defrag-an-ext4-filesystem)
[^4]: [How to optimize / defrag ext4 filesystem](https://gist.github.com/rmi1974/108c58cdeaa4c1f8b29a2af68f6ca698)
