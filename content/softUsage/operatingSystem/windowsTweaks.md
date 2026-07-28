---
title: "Windows 使用技巧"
type: docs
draft: false
notHomePage: true
bookHidden: true
description: "Windows Tweaks"
summary: "Windows 使用技巧"
---

# Windows 使用技巧

## 修复文件或路径无权访问的情况

我曾经在我电脑上用两个不同的硬盘安装了相同版本的 Windows 10 系统，并且使用了一个相同的用户名 `chinanoahli`

但是不久后，我发现，每次当我换不同的硬盘启动时，系统完成用户账户登录并进入桌面后，总会提示 **某分区的回收站损坏**

起初我不以为意，认为是不同系统的用户UID不一样，所以造成了这个盘的回收站出现了一些问题

所以我总是根据系统提示，把该盘符里面的回收站重建

但是渐渐地，我发现事情不太对劲，这个盘符出现了以下情况

+ 应用程序可以创建文件却无法写入<br />例如：用 **OBS Studio** 录屏，生成的文件始终是 `0 KB` 大小
+ 应用程序无法读取文件<br />例如：用 **VLC Player** 播放某些 mkv 文件，VCL 总是提示文件无法读取，可能是权限问题

经过长时间搜索无果后，偶然看到了[cfan上的一篇文章](https://www.cfan.com.cn/2020/1013/134391.shtml)，才确定是 *<i>盘符根目录的权限出错</i>* 所致

因为盘符根目录是它里面所有子目录的父目录，所以 *<i>盘符根目录</i>* 的权限出错将会被继承到所有的子目录中，但是你在 Explorer 中却不能看出问题所在，而且一般来说，也不能一下子就想到竟然是 *<i>盘符根目录</i>* 的权限出现了错误

为了修复这个错误，你可以通过拥有 *<i>管理员权限</i>*  的终端运行以下命令解决：

```batch
takeown /f X: /A /R /D Y
REM        ^ 将 `X` 改为你出错的盘符
```

## 禁用新网络位置提示

当电脑连接到一个新的网络环境时，Windows 总会提示：

> [!NOTE] 想要允许你的电脑被此网络上的其他电脑和设备发现吗?
>
> 我们建议你在家庭和工作网络而非公共网络上启用此功能。

> [!NOTE] Do you want to allow your PC to be discoverable by other PCs and devices on this network?
>
> We recommend allowing this on your home and work networks, but not public ones.

如果你在某些虚拟机上使用 Windows ，那么很有可能，这个提示每次开机都会遇到

你可以通过创建下面一个注册表 *项*，来禁用这个烦人的提示

```
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Network\NewNetworkWindowOff]
```

## 将硬件时间设定为 UTC

Windows 默认将主板 RTC 模块的时间识别为当地时间，而 \*UNIX 则是识别为 UTC 时间

这样会导致 Windows 和 \*UNIX 双系统使用时，总会有一个系统产生很大时差

为了解决这个问题，可以通过新增下面的注册表 *键值* 来解决

```
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\TimeZoneInformation]
"RealTimeUniversal"=dword:00000001
```

## 自动卸载在内存中的DLL

**DLL** 是 Windows 系统的动态链接库文件，在一般情况下，Windows 不会主动卸载已经装载在内存中的 DLL

你可以通过新增下面的注册表值来强制 Windows 自动卸载当前没有被程序调用的DLL

```
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer]
"AlwaysUnloadDLL"=dword:00000001
```

## 禁用幽灵\&熔断漏洞的微码补丁

众所周知，禁用这两个漏洞的补丁，会导致安全问题

但是总有希望尽可能发挥电脑全部性能的时候，这时你可以选择通过新增下面的注册表值来禁用该补丁

```
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management]
"FeatureSettingsOverride"=dword:00000003
"FeatureSettingsOverrideMask"=dword:00000003
```

## 通过注册表进行映像劫持

映像劫持，可以让用户在运行一个可执行文件的时候，被注入的另一个程序所代替

下面以安装在 `C:\Program Files\7-Zip\7zFM.exe` 的 7Zip 注入到  `Explorer.exe` 作为例子讲解

首先需要在 `[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options]` 下创建一个名为 `explorer.exe` 的键

然后再其内创建一个名为 `Debugger` 的值，类型为 `字符串值 (REG_SZ)`， 值则为 7Zip 的可执行文件完整路径

```
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\explorer.exe]
"Debugger"="C:\\Program Files\\7-Zip\\7zFM.exe"
```

设置完成后，重启电脑，即可发现这时系统不再在登入用户账户后，自动启动 `explorer.exe` 所自带的桌面环境，转而启动了 7Zip

## 通过命令行工具管理服务项

1. 列出所有服务

   ```batch
   sc query type= service state= all
   ```

2. 只列出所有服务名称

   ```batch
   sc query type= service state= all | find /i "SERVICE_NAME:"
   ```

3. 查找特定的服务

   ```batch
   sc query type= service state= all | find /i "SERVICE_NAME: 要查找的服务名称"
   ```

4. 显示特定服务的详细情况

   ```batch
   sc query 服务名称
   ```

5. 查找正在运行的服务

   + `sc query type= service`
   + `net start`

6. 查找所有停止的服务

   ```batch
   sc query type= service state= inactive
   ```

7. 启动一项服务

   > [!IMPORTANT]
   >
   > 这里需要用的是 **<i>服务名称 (SERVICE_NAME)</i>** ，而非显示名称 (DISPLAY_NAME)

   ```batch
   net start 服务名称
   ```

8. 停止一项服务

   > [!IMPORTANT]
   >
   > 这里需要用的是 **<i>服务名称 (SERVICE_NAME)</i>** ，而非显示名称 (DISPLAY_NAME)

   ```batch
   net stop 服务名称
   ```

9. 禁用一项服务

   > [!IMPORTANT]
   >
   > 这里需要用的是 **<i>服务名称 (SERVICE_NAME)</i>** ，而非显示名称 (DISPLAY_NAME)

   ```batch
   sc config 服务名称 start= disabled
   ```

10. 启用一项服务

    > [!IMPORTANT]
    >
    > 这里需要用的是 **<i>服务名称 (SERVICE_NAME)</i>** ，而非显示名称 (DISPLAY_NAME)

    ```batch
    REM delayed-auto = 自动(延迟启动)
    REM auto         = 自动
    REM demand       = 手动

    sc config 服务名称 start= auto
    ```

11. 删除一项服务

    > [!IMPORTANT]
    >
    > 这里需要用的是 **<i>服务名称 (SERVICE_NAME)</i>** ，而非显示名称 (DISPLAY_NAME)

    > [!WARNING]
    >
    > 本操作不可逆，在删除一项系统自带的服务之前，你可以导航到注册表的 `HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services` 路径下，导出与服务名相同的注册表项作为备份

    ```batch
    REM 需要管理员权限，若管理员权限仍然不够，那么你可能需要 TrustedInstaller 权限
    sc delete 服务名称
    ```

## 通过命令行工具管理计划任务

1. 列出所有计划任务

   ```batch
   schtasks /query
   ```

   示例输出:

   ```text
   文件夹: \Microsoft\Windows\RecoveryEnvironment
   任务名            下次运行时间       模式
   ================ ================ ================
   VerifyWinRE      N/A              已禁用
   ```

2. 删除特定计划任务<br />本例中使用上一条命令的输出作为示例，删除时需要提供 **<i>完整</i>** 的任务计划名（即文件夹 + 任务名）

   ```batch
   REM /f 参数不是必须的，如果不加这个参数，删除时就会弹出确认选项

   schtasks /delete /tn "\Microsoft\Windows\RecoveryEnvironment\VerifyWinRE" /f
   ```

3. 禁用特定的计划任务

   ```batch
   schtasks /change /tn "完整的任务计划名" /disable
   ```

4. 启用特定的计划任务

   ```batch
   schtasks /change /tn "完整的任务计划名" /enable
   ```

## 启用或禁用「基于虚拟化的安全性」

> [!WARNING]
> 
> 关闭后可能会影响某些虚拟机的使用，也会影响部分网络游戏需要的内核级反作弊插件

以管理员身份运行下面的命令

```batch
REM 关闭
bcdedit /set hypervisorlaunchtype off

REM 打开
bcdedit /set hypervisorlaunchtype auto
```

查询方法

运行 `msinfo32` 打开 *系统信息* 工具，在 *系统摘要* 下找到 *基于虚拟化的安全性*

## 通过注册表降低网络延迟

![通过注册表降低网络延迟](https://attachments.chinanoahli.info/softUsage/operatingSystem/windowsTweaks/img0001.png)

打开 **注册表编辑器** 然后定位到以下键 `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces`，这时你应该能在左边的窗格中看到很多由UUID命名的子键

逐个打开并确认这些子键其中的 `DhcpServer` 值是否跟你的网络环境相互，如果相符，则添加下列两个 `DWORD(32位)值`，两个值的数据均为 `1`

+ `TcpAckFrequency`
+ `TCPNoDelay`

## 删除 *此电脑* 里面的 *3D 对象*

> 其他的 *文件夹* 也是同理，但这里不展开说，因为我习惯会保留住方便快捷访问，对于我个人来说，只有 *3D 对象* 是用不到的

打开 **注册表编辑器** 然后定位到以下键  `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace`

然后删除名为 `{0DB7E03F-FC29-4DC6-9020-FF41B59E513A}` 的键

## Microsoft Store 应用安装失败，无法为 App 创建 AppContainer 配置文件 [^1]

错误截图如下：

![AppContainerError](https://attachments.chinanoahli.info/softUsage/operatingSystem/windowsTweaks/img0002.png)

详细错误原因：

```text
应用安装失败，错误消息: 错误 0x80070005: Windows 无法为 AppleInc.iCloud_14.2.108.0_x64__nzyj5cx40ttqa 程序包创建 AppContainer 配置文件。 (0x80070005)
```

用 **<i>管理员身份</i>** 的 *PowerShell* 运行下方的命令即可：

```powershell
Get-AppXPackage -AllUsers -Name AppleInc.iCloud | Foreach {Add-AppxPackage -DisableDevelopmentMode -Register "$($_.InstallLocation)\AppXManifest.xml" -Verbose}
#                               ^ 替换成你要的 PackageName
```

示例输出：

```text
详细信息: 正在目标“C:\Program Files\WindowsApps\AppleInc.iCloud_14.2.108.0_x64__nzyj5cx40ttqa\AppXManifest.xml”上执行操作“注册程序包”。
详细信息: 操作完成: C:\Program Files\WindowsApps\AppleInc.iCloud_14.2.108.0_x64__nzyj5cx40ttqa\AppXManifest.xml
```

## DISM 命令速查

> 请注意将映像文件 `\WIMFilePath.wim` 、和挂载路径 `\MountPoint` 按照你的实际情况修改
> 
> 请注意将 `<Package.Name~xxxxx>` Package包名按照实际情况修改
> 
> `{ | }` 代表可选项目，如 `Package.{cab | msu}` 可被展开为 `Package.cab` 或 `Package.msu`

### 挂载/卸载 保存映像

1. 挂载映像

   ```batch
   Dism /Mount-Image /ImageFile:\WIMFilePath.wim /Index:1 /MountDir:\MountPoint
   ```

2. 清理映像SP更新包备份文件

   ```batch
   Dism /Image:\MountPoint /Cleanup-Image /SPSuperseded /HideSP
   ```

3. 清理映像WinSxS

   ```batch
   Dism /Image:\MountPoint /Cleanup-Image /StartComponentCleanup /ResetBase
   ```

4. 最佳化映像

   ```batch
   Dism /Optimize-Image /ImageFile:\WIMFilePath.wim
   ```

5. 保存并卸载映像

   ```batch
   Dism /Unmount-Image /MountDir:\MountPoint /Commit
   ```

### 映像编辑

1. 导出映像其中一个index

   ```batch
   Dism /Export-Image /SourceImageFile:\SourceWIMFilePath.wim /SourceIndex:1 /DestinationImageFile:\DestinationWIMFilePath.wim
   ```

2. 追加已挂载的映像为新的index

   ```batch
   Dism /Capture-Image /ImageFile:WIMFilePath.wim /CaptureDir:\MountedPoint /Name:NewIndex
   ```

### Package 相关

1. 获取已安装的 Package

   ```batch
   Dism /Image:\MountPoint /Get-Packages /Format:Table
   ```

2. 查询 Package

   ```batch
   Dism /Image:\MountPoint /Get-PackageInfo /PackagePath:\Package.cab
   ```

   ```batch
   Dism /Image:\MountPoint /Get-PackageInfo /PackageName:<Package.Name~xxxxx>
   ```

3. 追加 Package

   ```batch
   Dism /Image:\MountPoint /Add-Package /PackagePath:\Package.{cab | msu}
   ```

4. 移除 Package

   ```batch
   Dism /Image:\MountPoint /Remove-Package /PackageName:<Package.Name~xxxxx>
   ```

### Windows Features 控制

1. 获取已安装的 Windows Features

   ```batch
   Dism /Image:\MountPoint /Get-Features /Format:Table
   ```

2. 查询 Windows Features 信息

   ```batch
   Dism /Image:\MountPoint /Get-FeatureInfo /FeatureName:TFTP
   ```

3. 启用 Windows Features

   ```batch
   Dism /Image:\MountPoint /Enable-Feature /FeatureName:TFTP /All
   ```

4. 禁用并删除 Windows Features

   ```batch
   Dism /Image:\MountPoint /Disable-Feature /FeatureName:TFTP /Remove
   ```

### Appx 相关

1. 获取 Appx 信息

   ```batch
   Dism /Image:\MountPoint /Get-ProvisionedAppxPackages
   ```

2. Appx 追加

   ```batch
   DISM /Image:\MountPoint /Add-ProvisionedAppxPackage /PackagePath:\AppxPackage.{appx | appxbundle} {/SkipLicense | /LicensePath:\PackageLicense.xml}
   ```

3. Appx目录 追加

   ```batch
   Dism /Image:\MountPoint /Add-ProvisionedAppxPackage /FolderPath:\AppxDirPath  {/SkipLicense | /LicensePath:\PackageLicense.xml}
   ```

4. Appx 删除

   ```batch
   Dism /Image:\MountPoint /Remove-ProvisionedAppxPackage /PackageName:<package.name_xxxx>
   ```

5. 优化 Appx

   ```batch
   Dism /Image:\MountPoint /Optimize-ProvisionedAppxPackages
   ```

## 从 Wim 映像文件中启动 Windows [^2]

> 这里只简述步骤，具体原理可能以后补充，也可能不会补充
>
> 如需要了解原理，请参考 [Windows Image File Boot (WimBoot)](https://learn.microsoft.com/en-us/windows/win32/w8cookbook/windows-image-file-boot--wimboot-)
>
> 若此链接失效，请直接在 [Microsoft Lean](https://learn.microsoft.com/en-us/) 中搜索 `wimboot` 即可

> 这里的例子会将 Wim 映像文件单独放到一个分区中，这个分区会被设置为恢复分区，默认情况下，不会显示在 *Explorer* 中

### 准备用于 WimBoot 的映像文件

默认情况下，微软提供的安装光盘中的系统映像是不可以直接用于 WimBoot 的

我们需要先从安装光盘中找到 `X:\sources\install.wim` 文件，并将它复制到任意可读写的路径中

然后在控制台中利用 **<i>Dism</i>** 命令将需要的映像导出为可以 WimBoot 的映像，注意，按需选择对应的 *Index* 即可

```batch
Dism /Export-Image /SourceImageFile:\SourceWIMFilePath.wim /SourceIndex:1 /DestinationImageFile:\DestinationWIMFilePath.wim
```

在导出对应的映像之后，推荐进行以下的操作（非必须）：

+ 移除系统自带的 *WinRE* 环境，以减小映像文件体积<br />对应的文件在 `MountPoint\Windows\Windows\System32\Recovery\winre.wim`
+ 按需加入语言包、.Net3.5、IE、补丁等
+ 对映像进行清理并最佳化，以减小映像文件体积<br />参见 [DISM命令速查](#dism-命令速查)

得到基本映像之后，我们还需要给加入 WimBoot 支持

```batch
Dism /Export-Image /WIMBoot /SourceImageFile:\SourceWIMFilePath.wim /SourceIndex:1 /DestinationImageFile:\DestinationWIMFilePath.wim
```

准备好映像之后，我们可以通过以下的命令对映像进行检查

```batch
Dism /Get-ImageInfo /ImageFile:\WIMFile.wim /Index:1
```

若正确无误，返回中应包含 `WIM Bootable : Yes` 或 `WIM 可引导: 是` 字段

### 准备系统安装磁盘

接下来通过 *WinPE* 启动电脑，这里推荐使用系统安装光盘自带的 PE 或者 [Windows ADK](https://learn.microsoft.com/en-us/windows-hardware/get-started/adk-install) 提供的 PE

在我试验时，我一开始使用的是 USM，但是 USM 把命令行工具 `diskpart` 精简掉了，导致无法继续操作

进入PE后按  `Shift + F10` 调出控制台，然后利用 `diskpart` 命令为硬盘分区

```batch
diskpart

REM 根据自己的系统环境选择硬盘号，并重建GPT分区表
select disk X
clean
convert gpt

REM 创建一个 300M 的 EFI 分区
create partition efi size=300
format quick fs=fat32 label=EFI

REM 将剩余的空间都分配给主分区，用作系统盘
create partition primary

REM 缩减系统盘空间，在磁盘最后面保留8G空间
shrink minimum=8192

REM 格式化系统盘，将卷标设为`OS`，并为其指派盘符`C`
format quick fs=ntfs label=OS
assign letter=c

REM 利用保留的8G空间创建专门用于存放映像文件的分区
REM 格式化分区，将卷标设为`WimImgs`，并指为其派盘符`M`
REM 这里不推荐将盘符指派成`D`和`E`，因为PE启动时很可能光驱已经占用了这些盘符
REM 挑选一个在字母表中后的字母较为稳妥
create partition primary
format quick fs=ntfs label=WimImgs
assign letter=m

REM 调整映像分区的参数，让它成为不可见的恢复分区
set id="de94bba4-06d1-4d40-a16a-bfd50179d6ac"
gpt attributes=0x8000000000000001
REM               ^ 14个0

REM 退出 diskpart
exit
```

### 进行WimBoot的安装和引导程序设置

在准备好硬盘的分区之后，接下来我们需要把映像复制到已经准备好的磁盘中

> 安装光盘自带的安装程序并不适用与设置 WimBoot ，所以不能直接使用安装光盘提供的GUI安装程序

首先我们需要将准备好的映像文件复制到储存映像的盘中，在本例就是 M 盘

```batch
Copy WIMFile.wim M:\
```

接下来，需要以 WimBoot 方式释放文件（即创建文件指针）

```batch
Dism /Apply-Image /ImageFile:M:\WIMFile.wim /ApplyDir:C: /Index:1 /WIMBoot
```

最后，我们还需要手动写入 BCD 引导程序

```batch
C:\Windows\System32\bcdboot.exe C:\Windows /L zh-cn "Windows 10 (WimBoot)"
```

到这里，全部操作已经完成，只需要重启即可进入系统准备阶段

### 验证安装正确性

为了验证系统是否以 WimBoot 的方式安装，你可以尝试以下步骤：

+ 以管理员身份运行 `fsutil wim enumwims C:` 并查看返回信息
+ 在 *磁盘管理器* 中查看系统盘是否包含 `Wim 引导` 参数

### 如何快速重装

首先当然还是把电脑启动到 PE 环境并调出控制台

接着需要利用 `diskpart` 将C盘格式化

```batch
diskpart

REM 根据自己的系统环境选择硬盘号
select disk X

REM 列出硬盘里的所有分区
list volume

REM 根据自己的系统环境，选择C盘对应的磁盘号
select volume X

REM 格式化系统盘，将卷标设为`OS`
format quick fs=ntfs label=OS

REM 现在还无需退出 diskpart !!
```

到此，我们还需要将恢复分区手动挂载一下，因为恢复分区是不会被系统自动分配盘符的

```batch
REM 在上面列出分区的步骤，应该可以看到我们存放映像文件的恢复分区了
REM 这里为恢复分区分配盘符`M`，以便我们可以访问它里面的映像文件
select volume Y
assign letter=m

REM 退出 diskpart
exit
```

然后重新运行一下 Dism 命令，以 WimBoot 的方式释放系统文件到 C 盘即可

```batch
Dism /Apply-Image /ImageFile:M:\WIMFile.wim /ApplyDir:C: /Index:1 /WIMBoot
```

注意，这里我们无需重新写入 BCD 引导程序

因为 BCD 引导程序是存放在 EFI 分区，而不是系统盘 C 盘里面的，所以并不会被重装过程影响到

到这里重装就结束了，我们只需要重启电脑即可进入系统准备阶段

## 引用来源

[^1]: [Microsoft Store 应用安装失败，无法为 App 创建 AppContainer 配置文件](https://answers.microsoft.com/zh-hans/windows/forum/all/%E5%BE%AE%E8%BD%AF%E5%BA%94%E7%94%A8%E5%95%86/1ed45936-e599-4524-9616-5263c7031c13)
[^2]: [Fadeer的日志](https://fadeer.github.io/%E5%B7%A5%E4%BD%9C/2015/08/06/windows-wim-boot.html)