---
title: "把 GnuPG 私钥移动到 Yubico 上"
type: docs
draft: false
notHomePage: true
bookHidden: true
description: "Move GPG Private Key to Yubico"
summary: "把 GnuPG 私钥移动到 Yubico 上"
---

# 把 GnuPG 私钥移动到 Yubico 上

> [!WARNING]
>
> 把私钥转移到 Yubico 上这种行为是不可逆的，谁也无法从 Yubico 里面恢复出私钥信息
>
> 在删除本地电脑的私钥前，请确保自己已做好必要的备份操作！

> [!TIP] 前篇
>
> [GnuPG 套件创建、管理密钥对](../../main/softUsage/devSoft/gnupg.md)

1. 创建一个授权用的密钥

   ```text
   > gpg --expert --edit-key 4CC5████████EE6D38ED████A21C
   gpg (GnuPG) 2.4.3; Copyright (C) 2023 g10 Code GmbH
   This is free software: you are free to change and redistribute it.
   There is NO WARRANTY, to the extent permitted by law.

   Secret key is available.

   sec  rsa4096/38ED████A21C
        created: 2023-12-19  expires: never       usage: SC
        trust: ultimate      validity: ultimate
   ssb  rsa4096/737C████DA88
        created: 2023-12-19  expires: never       usage: E
   [ultimate] (1). Joshua Lee (Yubico) <chinanoahli@████.com>

   gpg> addkey                    # 使用命令 addkey 开始创建授权用子密钥
   Please select what kind of key you want:
      (3) DSA (sign only)
      (4) RSA (sign only)
      (5) Elgamal (encrypt only)
      (6) RSA (encrypt only)
      (7) DSA (set your own capabilities)
      (8) RSA (set your own capabilities)
     (10) ECC (sign only)
     (11) ECC (set your own capabilities)
     (12) ECC (encrypt only)
     (13) Existing key
     (14) Existing key from card
   Your selection? 8              # 选 8 创建一个 RSA 子密钥，用途由用户自行决定

   Possible actions for this RSA key: Sign Encrypt Authenticate
   Current allowed actions: Sign Encrypt
                                  # 默认的密钥用途是 签名/Sign 与 加密/Encrypt

      (S) Toggle the sign capability
      (E) Toggle the encrypt capability
      (A) Toggle the authenticate capability
      (Q) Finished

   Your selection? A              # 输入 A 启用 授权 用途

   Possible actions for this RSA key: Sign Encrypt Authenticate
   Current allowed actions: Sign Encrypt Authenticate
                                  # 可以看到用途里面多出了 授权/Authenticate

      (S) Toggle the sign capability
      (E) Toggle the encrypt capability
      (A) Toggle the authenticate capability
      (Q) Finished

   Your selection? S              # 输入 S 禁用 签名 用途

   Possible actions for this RSA key: Sign Encrypt Authenticate
   Current allowed actions: Encrypt Authenticate
                                  # 可以看到用途里面的 签名/Sign 消失了

      (S) Toggle the sign capability
      (E) Toggle the encrypt capability
      (A) Toggle the authenticate capability
      (Q) Finished

   Your selection? E              # 输入 E 禁用 加密 用途

   Possible actions for this RSA key: Sign Encrypt Authenticate
   Current allowed actions: Authenticate
                                  # 可以看到用途里面的 加密/Encrypt 消失了
                                  # 这表示这个子密钥只能用于 授权/Authenticate

      (S) Toggle the sign capability
      (E) Toggle the encrypt capability
      (A) Toggle the authenticate capability
      (Q) Finished

   Your selection? Q              # 输入 Q 完成功能设置
   RSA keys may be between 1024 and 4096 bits long.
   What keysize do you want? (3072) 4096
                                  # 指定密钥长度为 4096
   Requested keysize is 4096 bits
   Please specify how long the key should be valid.
            0 = key does not expire
         <n>  = key expires in n days
         <n>w = key expires in n weeks
         <n>m = key expires in n months
         <n>y = key expires in n years
   Key is valid for? (0) 0
                                  # 指定密钥有效期
   Key does not expire at all
   Is this correct? (y/N) y
   Really create? (y/N) y
                                  # 两次确认信息无误
   We need to generate a lot of random bytes. It is a good idea to perform
   some other action (type on the keyboard, move the mouse, utilize the
   disks) during the prime generation; this gives the random number
   generator a better chance to gain enough entropy.

   sec  rsa4096/38ED████A21C
        created: 2023-12-19  expires: never       usage: SC
        trust: ultimate      validity: ultimate
   ssb  rsa4096/737C████DA88
        created: 2023-12-19  expires: never       usage: E
   ssb  rsa4096/C964████3AEF
        # 授权用密钥已创建完毕
        created: 2023-12-19  expires: never       usage: AR
   [ultimate] (1). Joshua Lee (Yubico) <chinanoahli@████.com>

   gpg> save                      # 保存并退出
   ```

2. 把密钥对输出为纯文本备份

   ```shell
   # 公钥
   gpg --armor --output public-key.txt --export 4CC5████████EE6D38ED████A21C

   # 私钥
   gpg --armor --output secret-key.txt --export-secret-keys 4CC5████████EE6D38ED████A21C
   ```

3. 安装 [YubiKey Manager](https://www.yubico.com/support/download/yubikey-manager/)

   > 如果你之前往 Yubico 写入过密钥，想完全重置 Yubico 的 PGP 功能的话，请参考[这里](https://support.yubico.com/hc/en-us/articles/360013761339-Resetting-the-OpenPGP-Applet-on-the-YubiKey)
   >
   > 但要确保在你重置前，先把之前的证书吊销<sub>(若曾上传到 Keyserver 上的话)</sub>

4. 插入 Yubico ，并在 CMD 执行 `gpg --expert --edit-key 4CC5████████EE6D38ED████A21C`<br />此时你应该能在 GnuPG 的输出里面看到有 1 个主密钥和 2 个子密钥

   ```text
   gpg (GnuPG) 2.4.3; Copyright (C) 2023 g10 Code GmbH
   This is free software: you are free to change and redistribute it.
   There is NO WARRANTY, to the extent permitted by law.

   Secret key is available.

   sec  rsa4096/38ED████A21C
        created: 2023-12-19  expires: never       usage: SC
        trust: ultimate      validity: ultimate
   ssb  rsa4096/737C████DA88
        created: 2023-12-19  expires: never       usage: E
   ssb  rsa4096/C964████3AEF
        created: 2023-12-19  expires: never       usage: AR
   [ultimate] (1). Joshua Lee (Yubico) <chinanoahli@████.com>
   ```

5. 使用命令 `keytocard` 把储存在电脑本地的 **<i>主密钥私钥</i>** 移动至 Yubico 上

   ```text
   gpg> keytocard
   Really move the primary key? (y/N) y
   Please select where to store the key:
      (1) Signature key
      (3) Authentication key
   Your selection? 1              # 把 主密钥私钥 储存在 Signature key 位置上

   sec  rsa4096/38ED████A21C
        created: 2023-12-19  expires: never       usage: SC
        trust: ultimate      validity: ultimate
   ssb  rsa4096/737C████DA88
        created: 2023-12-19  expires: never       usage: E
   ssb  rsa4096/C964████3AEF
        created: 2023-12-19  expires: never       usage: AR
   [ultimate] (1). Joshua Lee (Yubico) <chinanoahli@████.com>

   Note: the local copy of the secret key will only be deleted with "save".
                                  # ⚠ 警告：使用 keytocard 命令时， GnuPG 会自动删除储存在电脑中的对应密钥的私钥
                                  # 但不会自动保存操作，如果你确定要把私钥从电脑中删除，就可以使用命令 save 操作生效
   ```

6. 接下来移动 **<i>加密/Encrypt</i>** 密钥的私钥到 Yubico 上

   ```text
   gpg> key 737C████DA88          # 用 key 命令选择 加密 密钥

   sec  rsa4096/38ED████A21C
        created: 2023-12-19  expires: never       usage: SC
        trust: ultimate      validity: ultimate
   ssb* rsa4096/737C████DA88
        # 加密 密钥被选中
        created: 2023-12-19  expires: never       usage: E
   ssb  rsa4096/C964████3AEF
        created: 2023-12-19  expires: never       usage: AR
   [ultimate] (1). Joshua Lee (Yubico) <chinanoahli@████.com>

   gpg> keytocard                 # 用 keytocard 把 加密 密钥的 私钥 转移到 Yubico
   Please select where to store the key:
      (2) Encryption key
   Your selection? 2              # 把 加密 密钥 的 私钥 储存在 Encryption key 位置上

   sec  rsa4096/38ED████A21C
        created: 2023-12-19  expires: never       usage: SC
        trust: ultimate      validity: ultimate
   ssb* rsa4096/737C████DA88
        created: 2023-12-19  expires: never       usage: E
   ssb  rsa4096/C964████3AEF
        created: 2023-12-19  expires: never       usage: AR
   [ultimate] (1). Joshua Lee (Yubico) <chinanoahli@████.com>

   Note: the local copy of the secret key will only be deleted with "save".
                                  # 同样地，电脑中对应的私钥会被自动删除

   gpg> key 737C████DA88          # 用 key 命令取消选择 加密 密钥

   sec  rsa4096/38ED████A21C
        created: 2023-12-19  expires: never       usage: SC
        trust: ultimate      validity: ultimate
   ssb  rsa4096/737C████DA88
        # 加密 密钥被取消选中
        created: 2023-12-19  expires: never       usage: E
   ssb  rsa4096/C964████3AEF
        created: 2023-12-19  expires: never       usage: AR
   [ultimate] (1). Joshua Lee (Yubico) <chinanoahli@████.com>
   ```

7. 接下来移动 **<i>授权/Authenticate</i>** 密钥的私钥到 Yubico 上

   ```text
   gpg> key C964████3AEF          # 用 key 命令选择 授权 密钥

   sec  rsa4096/38ED████A21C
           created: 2023-12-19  expires: never       usage: SC
           trust: ultimate      validity: ultimate
   ssb  rsa4096/737C████DA88
           created: 2023-12-19  expires: never       usage: E
   ssb* rsa4096/C964████3AEF
           # 授权 密钥被选中
           created: 2023-12-19  expires: never       usage: AR
   [ultimate] (1). Joshua Lee (Yubico) <chinanoahli@████.com>

   gpg> keytocard                 # 用 keytocard 把 授权 密钥的 私钥 转移到 Yubico
   Please select where to store the key:
       (3) Authentication key
   Your selection? 3              # 把 授权 密钥 的 私钥 储存在 Authentication key 位置上

   sec  rsa4096/38ED████A21C
           created: 2023-12-19  expires: never       usage: SC
           trust: ultimate      validity: ultimate
   ssb  rsa4096/737C████DA88
           # 加密 密钥被取消选中
           created: 2023-12-19  expires: never       usage: E
   ssb  rsa4096/C964████3AEF
           created: 2023-12-19  expires: never       usage: AR
   [ultimate] (1). Joshua Lee (Yubico) <chinanoahli@████.com>

   Note: the local copy of the secret key will only be deleted with "save".
                                   # 同样地，电脑中对应的私钥会被自动删除

   gpg> quit                      # 如果你不想保存删除私钥的操作，请直接使用 quit 命令退出 GnuPG
   Save changes? (y/N) N          # 输入 N 代表不保存更改
   Quit without saving? (y/N) y   # 输入 y 确认不保存并退出
   ```
