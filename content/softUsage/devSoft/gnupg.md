---
title: "GnuPG 套件创建、管理密钥对"
type: docs
draft: false
notHomePage: true
bookHidden: true
description: "GnuPG Usage"
summary: "GnuPG 套件创建、管理密钥对"
---

# GnuPG 套件创建、管理密钥对

> 记录日期：`2023-12-19` / GnuPG 版本： `2.4.3`
>
> 操作系统：Windows 10 (在 Linux 和 macOS 中只有安装方式不一样，这里不再叙述)

> GnuPG 在生成密钥对时，默认会生成：
>
> 1. 一个可以用于 **<i>验证子密钥<sub>(<u>C</u>ertify)</sub></i>** 和 **<i>签名<sub>(<u>S</u>ign)</sub></i></i>** 的 **<i>主密钥<sub>(sec)</sub></i></i>**
>
> 2. 一个可以用于 **<i>加密<sub>(<u>E</u>ncrypt)</sub></i>** 的 **<i>子密钥<sub>(ssb)</sub></i>**

> [!WARNING] 安全警示
>
> 任何时候都不要泄漏你的 **<i>私钥<sub>(Secret Keys)</sub></i>**

1. Windows 根据 [GnuPG 官网](https://gnupg.org) 安装 [Gpg4win](https://gpg4win.org/download.html) 即可使用 GnuPG 套件

2. 打开 *命令提示符 <sub>CMD</sub>* ，无须管理员权限

3. 运行 `gpg --expert --full-gen-key` 开始生成密钥，此时 GnuPG 会显示版权资讯

   ```text
   gpg (GnuPG) 2.4.3; Copyright (C) 2023 g10 Code GmbH
   This is free software: you are free to change and redistribute it.
   There is NO WARRANTY, to the extent permitted by law.
   ```

4. 接着 GnuPG 会让你选择主密钥和子密钥的类型，这里选择 **<i>(1) RSA and RSA</i>**

   ```text
   Please select what kind of key you want:
      (1) RSA and RSA
      (2) DSA and Elgamal
      (3) DSA (sign only)
      (4) RSA (sign only)
      (7) DSA (set your own capabilities)
      (8) RSA (set your own capabilities)
      (9) ECC (sign and encrypt) *default*
     (10) ECC (sign only)
     (11) ECC (set your own capabilities)
     (13) Existing key
     (14) Existing key from card
   Your selection? 1
   ```

5. 接着选择密钥的长度，因为分主密钥和子密钥，所以要选择两次<br />第一次为主密钥的长度，第二次为子密钥的长度

   > [!WARNING]
   > 
   > 若你打算搭配 Yubico 使用的话， Neo 只支持 2048 位，而 4 和 5 均可以支持 4096 位

   ```text
   RSA keys may be between 1024 and 4096 bits long.
   What keysize do you want? (3072) 4096
   Requested keysize is 4096 bits
   RSA keys may be between 1024 and 4096 bits long.
   What keysize do you want for the subkey? (3072) 4096
   Requested keysize is 4096 bits
   ```

6. 为密钥选择自动失效日期，若选择 `0` 则为 **<i>永远有效</i>**

   ```text
   Please specify how long the key should be valid.
            0 = key does not expire
         <n>  = key expires in n days
         <n>w = key expires in n weeks
         <n>m = key expires in n months
         <n>y = key expires in n years
   Key is valid for? (0) 0
   Key does not expire at all
   Is this correct? (y/N) y
   ```

7. 根据提示输入姓名、电子邮箱、密钥描述等资讯，并按输入完成并确认无误后输入 `O` 确认提交

   ```text
   GnuPG needs to construct a user ID to identify your key.

   Real name: Joshua Lee
   Email address: chinanoahli@████.com
   Comment: Yubico
   You selected this USER-ID:
       "Joshua Lee (Yubico) <chinanoahli@████.com>"

   Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? O
   ```

8. 接下来系统会弹出一个窗口，要求用户设置一个 **<i>口令 <sub>(passphrase)</sub></i>** 用以保护密钥对

   ![passphrase](https://github-share-1304366332.cos.ap-guangzhou.myqcloud.com/softUsage/devSoft/attachments/gpg_img001.png)

9. 随便做点别的事，让 GnuPG 获取到足够生成密钥需要用到的信息熵<br />稍等片刻，直至密钥成功生成，请记下密钥的 **<i>KeyID</i>** ，本例中为 `4CC5████████EE6D38ED████A21C`

   > 如果忘记记下 KeyID 可以通过命令 `gpg --list-keys --keyid-format LONG` 进行查询

   ```text
   We need to generate a lot of random bytes. It is a good idea to perform
   some other action (type on the keyboard, move the mouse, utilize the
   disks) during the prime generation; this gives the random number
   generator a better chance to gain enough entropy.
   gpg: directory 'D:\\.Users\\chinanoahli\\AppData\\Roaming\\gnupg\\openpgp-revocs.d' created
   gpg: revocation certificate stored as 'D:\\.Users\\chinanoahli\\AppData\\Roaming\\gnupg\\openpgp-revocs.d\\4CC5████████EE6D38ED████A21C.rev'
   public and secret key created and signed.

   pub   rsa4096 2023-12-19 [SC]
         4CC5████████EE6D38ED████A21C
   uid                      Joshua Lee (Yubico) <chinanoahli@████.com>
   sub   rsa4096 2023-12-19 [E]
   ```

10. 使用命令 `gpg --gen-revoke 4CC5████████EE6D38ED████A21C` 创建吊销密钥并备份在离线且安全的位置<br />若密钥不再使用或不幸泄漏，则可以使用吊销密钥将其吊销<br />吊销密钥的内容为包含 `-----BEGIN PGP PUBLIC KEY BLOCK-----` 行在内<br />到包含行 `-----END PGP PUBLIC KEY BLOCK-----` 为止，请手动复制下来

    ```text
    sec  rsa4096/38ED████A21C 2023-12-19 Joshua Lee (Yubico) <chinanoahli@████.com>
 
    Create a revocation certificate for this key? (y/N) y
    Please select the reason for the revocation:
                                # 选择吊销的原因
      0 = No reason specified
      1 = Key has been compromised
      2 = Key is superseded
      3 = Key is no longer used
      Q = Cancel
    (Probably you want to select 1 here)
    Your decision? 0
    Enter an optional description; end it with an empty line:
    >                           # 若选择无，则会要求用户手动输入原因(可留空)
    Reason for revocation: No reason specified
    (No description given)
    Is this okay? (y/N) y       # 确认选择的内容
    ASCII armored output forced.
    -----BEGIN PGP PUBLIC KEY BLOCK-----    # 吊销密钥开始的行
    Comment: This is a revocation certificate
 
    █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █
    █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █
    █ █ █ █
    -----END PGP PUBLIC KEY BLOCK-----      # 吊销密钥结束的行
    Revocation certificate created.
 
    Please move it to a medium which you can hide away; if Mallory gets
    access to this certificate he can use it to make your key unusable.
    It is smart to print this certificate and store it away, just in case
    your media become unreadable.  But have some caution:  The print system of
    your machine might store the data and make it available to others!
    ```

11. 把密钥对输出为纯文本备份

    ```shell
    # 公钥
    gpg --armor --output public-key.txt --export 4CC5████████EE6D38ED████A21C
 
    # 私钥(输出私钥时会要求用户输入口令，出自 步骤 8)
    gpg --armor --output secret-key.txt --export-secret-keys 4CC5████████EE6D38ED████A21C
    ```

12. 若你不需要在本机上执行解密和更新密钥等操作，你应该使用下面的命令把私钥从系统中删除<sub>(前提是你十分确定已经把它们备份在了安全的地方)</sub>

    ```shell
    > gpg --delete-secret-keys 4CC5████████EE6D38ED████A21C
    gpg (GnuPG) 2.4.3; Copyright (C) 2023 g10 Code GmbH
    This is free software: you are free to change and redistribute it.
    There is NO WARRANTY, to the extent permitted by law.
 
    sec  rsa4096/38ED████A21C 2023-12-19 Joshua Lee (Yubico) <chinanoahli@████.com>
 
    Delete this key from the keyring? (y/N) y
    This is a secret key! - really delete? (y/N) y
    ```

13. 导入密钥信息<br />有时我们需要对密钥进行操作，则需要系统中存在对应的私钥信息才行，我们可以通过下面的操作来导入之前备份好的私钥

    ```shell
    > gpg --import secret-key.txt
    gpg: key 38ED████A21C: "Joshua Lee (Yubico) <chinanoahli@████.com>" not changed
    gpg: key 38ED████A21C: secret key imported
    gpg: Total number processed: 1
    gpg:              unchanged: 1
    gpg:       secret keys read: 1
    gpg:   secret keys imported: 1
    ```

14. 续签密钥的有效期<br />本操作除了可以更新已设有有效期的密钥的过期时间之外，还可以给没有设置有效期的密钥创建有效期

    ```shell
    > gpg --edit-key 4CC5████████EE6D38ED████A21C
    gpg (GnuPG) 2.4.3; Copyright (C) 2023 g10 Code GmbH
    This is free software: you are free to change and redistribute it.
    There is NO WARRANTY, to the extent permitted by law.
 
    Secret key is available.    # 注意是否有出现本提示(私钥可用)
                                # 若没有本提示，你需要参考第 13 步重新导入私钥
 
    sec  rsa4096/38ED████A21C
         created: 2023-12-19  expires: never       usage: SC
         trust: ultimate      validity: ultimate
    ssb  rsa4096/737C████DA88
         created: 2023-12-19  expires: never       usage: E
    [ultimate] (1). Joshua Lee (Yubico) <chinanoahli@████.com>
 
    gpg> key 737C████DA88       # 通过 key 命令选择需要操作的密钥
                                # 这个密钥在创建时没有设置有效期
 
    sec  rsa4096/38ED████A21C
         created: 2023-12-19  expires: never       usage: SC
         trust: ultimate      validity: ultimate
    ssb* rsa4096/737C████DA88   # 被选择密钥会有 * 号标识
         created: 2023-12-19  expires: never       usage: E
    [ultimate] (1). Joshua Lee (Yubico) <chinanoahli@████.com>
 
    gpg> expire                 # 进行续期
    Changing expiration time for a subkey.
    Please specify how long the key should be valid.
             0 = key does not expire
          <n>  = key expires in n days
          <n>w = key expires in n weeks
          <n>m = key expires in n months
          <n>y = key expires in n years
    Key is valid for? (0) 1y    # 续期 1 年
    Key expires at 12-18-2024 PM 04:29:21
    Is this correct? (y/N) y    # 确认操作
 
    sec  rsa4096/38ED████A21C
         created: 2023-12-19  expires: never       usage: SC
         trust: ultimate      validity: ultimate
    ssb* rsa4096/737C████DA88
         created: 2023-12-19  expires: 2024-12-18  usage: E
                                # 可以看到密钥已经被加上 1 年有效期
    [ultimate] (1). Joshua Lee (Yubico) <chinanoahli@████.com>
 
    gpg> save                   # 操作完成后，保存退出
    ```

15. 若你需要吊销某个 **<i>子密钥</i>** ，你可以执行下面的操作

    ```shell
    > gpg --expert --edit-key 4CC5████████EE6D38ED████A21C
    gpg (GnuPG) 2.4.3; Copyright (C) 2023 g10 Code GmbH
    This is free software: you are free to change and redistribute it.
    There is NO WARRANTY, to the extent permitted by law.
 
    Secret key is available.    # 注意是否有出现本提示(私钥可用)
                                # 若没有本提示，你需要参考第 13 步重新导入私钥
 
    sec  rsa4096/38ED████A21C
         created: 2021-03-04  expires: never       usage: SC
         trust: ultimate      validity: ultimate
    ssb  rsa4096/737C████DA88
         created: 2021-03-04  expires: never       usage: E
    ssb  rsa4096/C964████3AEF   # 本例中需要吊销的密钥
         created: 2021-03-04  expires: never       usage: S
    [ultimate] (1). Joshua Lee (Yubico) <chinanoahli@████.com>
 
    gpg> key C964████3AEF       # 通过 key 命令选择需要吊销的密钥
 
    sec  rsa4096/38ED████A21C
         created: 2021-03-04  expires: never       usage: SC
         trust: ultimate      validity: ultimate
    ssb  rsa4096/737C████DA88
         created: 2021-03-04  expires: never       usage: E
    ssb* rsa4096/C964████3AEF   # 被选择密钥会有 * 号标识
         created: 2021-03-04  expires: never       usage: S
    [ultimate] (1). Joshua Lee (Yubico) <chinanoahli@████.com>
 
    gpg> revkey                 # 通过 revkey 命令进行吊销
    Do you really want to revoke this subkey? (y/N) y
    Please select the reason for the revocation:
      0 = No reason specified
      1 = Key has been compromised
      2 = Key is superseded
      3 = Key is no longer used
      Q = Cancel
    Your decision? 3            # 选择吊销原因
    Enter an optional description; end it with an empty line:
    >                           # 输入吊销描述(可留空)
    Reason for revocation: Key is no longer used
    (No description given)
    Is this okay? (y/N) y       # 确认吊销操作
 
    sec  rsa4096/38ED████A21C
         created: 2021-03-04  expires: never       usage: SC
         trust: ultimate      validity: ultimate
    ssb  rsa4096/737C████DA88
         created: 2021-03-04  expires: never       usage: E
    The following key was revoked on 2023-12-19 by RSA key 38ED████A21C Joshua Lee (Yubico) <chinanoahli@████.com>
                                # 提示本密钥已吊销
    ssb  rsa4096/C964████3AEF
         created: 2021-03-04  revoked: 2023-12-19  usage: S
    [ultimate] (1). Joshua Lee (Yubico) <chinanoahli@████.com>
 
    gpg> save                   # 操作完成后，保存退出
    ```

16. 删除 **<i>子密钥</i>** ，你可以通过下面的操作来删除一个子密钥

    ```shell
    > gpg --edit-key 4CC5████████EE6D38ED████A21C
    gpg (GnuPG) 2.4.3; Copyright (C) 2023 g10 Code GmbH
    This is free software: you are free to change and redistribute it.
    There is NO WARRANTY, to the extent permitted by law.
 
    Secret key is available.    # 注意是否有出现本提示(私钥可用)
                                # 若没有本提示，你需要参考第 13 步重新导入私钥
 
    sec  rsa4096/38ED████A21C
         created: 2023-12-19  expires: never       usage: SC
         trust: ultimate      validity: ultimate
    ssb  rsa4096/737C████DA88
         created: 2023-12-19  expires: 2024-12-18  usage: E
    [ultimate] (1). Joshua Lee (Yubico) <chinanoahli@████.com>
 
    gpg> key 737C████DA88       # 通过 key 命令选择需要删除的密钥
 
    sec  rsa4096/38ED████A21C
         created: 2023-12-19  expires: never       usage: SC
         trust: ultimate      validity: ultimate
    ssb* rsa4096/737C████DA88   # 被选择密钥会有 * 号标识
         created: 2023-12-19  expires: 2024-12-18  usage: E
    [ultimate] (1). Joshua Lee (Yubico) <chinanoahli@████.com>
 
    gpg> delkey 737C████DA88    # 通过 delkey 命令删除密钥
    Do you really want to delete this key? (y/N) y
 
    sec  rsa4096/38ED████A21C
         created: 2023-12-19  expires: never       usage: SC
         trust: ultimate      validity: ultimate
                                # 密钥 737C████DA88 已被删除
    [ultimate] (1). Joshua Lee (Yubico) <chinanoahli@████.com>
 
    gpg> save                   # 操作完成后，保存退出
    ```

17. 若你需要一次性吊销所有主密钥与子密钥，你可以使用命令 `gpg --import 吊销密钥的路径` 来进行操作

18. 修改密钥的持有人信息，可以执行下面的操作

    ```shell
    > gpg --key-edit 38ED████A21C
    gpg (GnuPG) 2.4.3; Copyright (C) 2023 g10 Code GmbH
    This is free software: you are free to change and redistribute it.
    There is NO WARRANTY, to the extent permitted by law.
 
    Secret key is available.    # 注意是否有出现本提示(私钥可用)
                                # 若没有本提示，你需要参考第 13 步重新导入私钥
 
    sec  rsa4096/38ED████A21C
         created: 2023-12-19  expires: never       usage: SC
         trust: ultimate      validity: ultimate
    [ultimate] (1). Joshua Lee (Yubico) <chinanoahli@████.com>
 
    gpg> adduid                 # 新增一个 uid 用于储存新的持有人信息
    Real name: chinanoahli      # 与新建密钥时的操作类似，根据提示输入即可
    Email address: xxxxxxxxxxxx@████.com
    Comment: New comment
    You selected this USER-ID:
        "chinanoahli (New comment) <xxxxxxxxxxxx@████.com>"
 
    Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? O
 
    sec  rsa4096/38ED████A21C
         created: 2023-12-19  expires: never       usage: SC
         trust: ultimate      validity: ultimate
    [ultimate] (1)  Joshua Lee (Yubico) <chinanoahli@████.com>
                             # 下面一条就是新的 uid
    [ unknown] (2). chinanoahli (New comment) <xxxxxxxxxxxx@████.com>
 
    gpg> uid 2                  # 通过 uid 命令选择新增的持有人信息
 
    sec  rsa4096/38ED████A21C
         created: 2023-12-19  expires: never       usage: SC
         trust: ultimate      validity: ultimate
    [ultimate] (1)  Joshua Lee (Yubico) <chinanoahli@████.com>
    [ unknown] (2)* chinanoahli (New comment) <xxxxxxxxxxxx@████.com>
                                # 被选择的 uid 会带有 * 号
 
    gpg> primary                # 使用 primary 命令将本条 uid 设为默认
 
    sec  rsa4096/38ED████A21C
         created: 2023-12-19  expires: never       usage: SC
         trust: ultimate      validity: ultimate
    [ultimate] (1)  Joshua Lee (Yubico) <chinanoahli@████.com>
    [ unknown] (2)* chinanoahli (New comment) <xxxxxxxxxxxx@████.com>
 
    gpg> save                   # 先保存当前的操作，让操作生效
 
    > gpg --key-edit 38ED████A21C
                                # 重新进入密钥编辑状态
    gpg (GnuPG) 2.4.3; Copyright (C) 2023 g10 Code GmbH
    This is free software: you are free to change and redistribute it.
    There is NO WARRANTY, to the extent permitted by law.
 
    Secret key is available.
 
    sec  rsa4096/38ED████A21C
         created: 2023-12-19  expires: never       usage: SC
         trust: ultimate      validity: ultimate
    [ultimate] (1). chinanoahli (New comment) <xxxxxxxxxxxx@████.com>
    [ultimate] (2)  Joshua Lee (Yubico) <chinanoahli@████.com>
 
    gpg> uid 2                  # 选择旧的 uid
                                # 💡 注意：新旧持有人资讯已经调换位置，请勿选错
 
    sec  rsa4096/38ED████A21C
         created: 2023-12-19  expires: never       usage: SC
         trust: ultimate      validity: ultimate
    [ultimate] (1). chinanoahli (New comment) <xxxxxxxxxxxx@████.com>
    [ultimate] (2)* Joshua Lee (Yubico) <chinanoahli@████.com>
                                # 被选择的 uid 会带有 * 号
 
    gpg> deluid                 # 通过 deluid 命令删除旧的 uid
    Really remove this user ID? (y/N) y    # 确认删除操作
 
    sec  rsa4096/38ED████A21C
         created: 2023-12-19  expires: never       usage: SC
         trust: ultimate      validity: ultimate
    [ultimate] (1). chinanoahli (New comment) <xxxxxxxxxxxx@████.com>
                                # 旧的 uid 已被删除
 
    gpg> save                   # 操作完成后，保存退出
    ```

19. 将公钥发送到密钥服务器上，方便别人对你发布的文件进行解密或验证

    > [!WARNING]
    > 
    > 公钥一旦被上传到公钥服务器，则很难以被移除，请三思而行
   
    > [!TIP]
    >
    > 在修改密钥<sub>(包括但不限于：新增子密钥、续签有效期、吊销密钥、吊销子密钥)</sub>后，你需要重新发送把密钥到同一个服务器上，才能更新服务器上的信息

    > [!TIP]
    >
    > 若你需要更安全的公钥服务器，可以使用 [keys.openpgp.org](https://keys.openpgp.org/) ，它要求密钥上传者验证他们的电子邮件地址
    >
    >   ```shell
    >   > gpg --keyserver keyserver.ubuntu.com --send-keys 4CC5████████EE6D38ED████A21C
    >  gpg: sending key 4CC5████████EE6D38ED████A21C to hkp://keyserver.ubuntu.com
    >  ```
