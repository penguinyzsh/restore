# PS5 12.40 全游戏通用存档备份与恢复机制

## 背景与目标

ReStore 需要支持任意 PS5 游戏存档的自动变化备份与恢复，并满足三项核心体验要求：
1. **已有存档槽覆盖恢复**：恢复后不仅游戏能实际载入对应进度，且系统存档管理与游戏内读取列表显示的章节、时长、保存时间、图标必须与实际进度完全一致。
2. **初始化后无存档槽直接恢复**：当主机刚初始化或重装游戏后从未启动过（尚无任何存档槽容器）时，无需用户先打开游戏手动建档，ReStore 可直接在后台创建槽位并恢复数据。
3. **跨账号/重建账号自动绑定**：恢复时自动绑定当前主机登录用户的身份信息，避免出现“存档已损坏”或“属于其他玩家”报错。

本文件汇总 [Save Mounter](https://github.com/n0llptr/Playstation-5-Save-Mounter/blob/1a0281ea9794afadc2e2da345ca0b66e5db45bc7/mounter_payload/main.c)、[PS5Save](https://github.com/heni0xyz/PS5Save/blob/aab1574ec1bad253eda8e7629ec8c897d4033b16/main.c)、[PSCloud](https://github.com/JakeBusler/PS5-Cloud-Save/tree/b85b99c082243212e613b68790736348c75d448e) 的源码机制对比，以及在 PS5 12.40 主机上针对《最后生还者 Part I》（`PPSA03396`，用户 `17dfdf4e`）的实机验证结论。

---

## 一、PS5 存档的三层存储结构

在 PS5（Prospero）系统中，用户 `<uid>`（8位十六进制，如 `17dfdf4e`）下某款游戏 `<title_id>`（如 `PPSA03396`）的每个存档槽 `<slot>`（如 `SAVEFILE00`）由以下三部分共同组成：

| 层级 | 系统路径 | 存储内容与作用 |
| --- | --- | --- |
| **1. PFS 加密容器** | `/user/home/<uid>/savedata_prospero/<title_id>/sdimg_<slot>` | 加密镜像文件（偏移 `0x800` 处存放由主机密封的 `pfsSKKey`）。挂载解密后包含游戏实际进度文件（如 `USR-DATA`、`ICN-ID`）以及 `sce_sys/param.sfo`、`sce_sys/keystone`、`sce_sys/icon0.png`。此外系统还会为部分槽位生成 `sdimg_sce_bu_<slot>` 备份容器。 |
| **2. 外部元数据缓存** | `/user/home/<uid>/savedata_prospero_meta/user/<title_id>/` | 实机验证确认：正常活跃槽位在此目录下仅存放槽位图标 `<slot>_icon0.png`（其 `.sfo` 真身位于 PFS 容器内 `sce_sys/param.sfo`）；仅 `sdimg_sce_bu_<slot>` 自动备份槽在此目录下额外存有明文 `sce_bu_<slot>.sfo` 与 `sce_bu_<slot>_icon0.png`。 |
| **3. 系统存档数据库** | `/system_data/savedata_prospero/<uid>/db/user/savedata.db` | SQLite 数据库（回滚日志模式，无 WAL，12.40 实机 `user_version = 11`）。包含 `title` 与 `savedata` 等 5 张表；其中 `savedata` 表（32 列）每个槽位占一行，缓存 `main_title`、`sub_title`、`detail`、`user_param`、`blocks`、`free_blocks`、`size_kib`、`system_blocks`、`mtime`、`account_id`、`user_id`、`game_title_id` 等字段。 |

### 12.40 实机多游戏存档槽位与字段实测样本（用户 `1066f6d7` `"Peng"`，`account_id = 0xea53d6993286bdfc`）

在 `192.168.0.111` 主机上直接解析 `/system_data/savedata_prospero/1066f6d7/db/user/savedata.db` 得到的 6 条真实槽位记录如下：

| `id` | `title_id` | `dir_name` | `main_title` | `sub_title` | `detail` | `blocks` / `free_blocks` | `size_kib` | `system_blocks` | `mtime` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `1` | `PPSA01650` | `STARBOARD` | `YouTube` | `User Information & Settings` | `""` | `96` / `72` | `6144` | `0` | `2026-11-01T10:36:14Z` |
| `2` | `PPSA01650` | `sce_sdmemory` | `セーブデータ` | `""` | `""` | `48` / `8` | `3072` | `0` | `2026-11-01T10:36:15Z` |
| `3` | `PPSA02796` | `RELEASESAVEDATA` | `Tales of ARISE` | `""` | `""` | `627` / `578` | `40128` | `0` | `2026-11-01T12:20:32Z` |
| `4` | `PPSA30117` | `save170` | `序章“父亲、起程”　　　　　　＜Normal＞` | `洛连特市` | `"2026/11/03 23:20:09\n游击士艾丝蒂尔　　 \n等级4\n游玩时间　0:09:49"` | `160` / `19` | `10240` | `80` | `2026-11-03T15:20:09Z` |
| `5` | `PPSA30117` | `save000` | `序章“父亲、起程”　　　　　　＜Normal＞` | `洛连特市` | `"2026/11/03 23:22:07\n游击士艾丝蒂尔　　 \n等级4\n游玩时间　0:11:37"` | `160` / `16` | `10240` | `80` | `2026-11-03T15:22:07Z` |
| `6` | `PPSA30117` | `sce_sdmemory` | `空之轨迹the1st` | `系统数据` | `"记录环境设置等系统数据。"` | `96` / `24` | `6144` | `48` | `2026-11-03T15:22:08Z` |

### 实机现象验证（为何仅替换游戏数据会导致列表显示脱节）
在 12.40 实机测试中，将状态 A（序章，4分28秒）的 `USR-DATA` 与 `ICN-ID` 写入状态 B（8分35秒）的容器并提交后：
- **游戏实际读取**：启动《最后生还者 Part I》读取该手动槽，成功载入状态 A 的 Sarah 卧室场景，并自动生成 4分29秒的自动存档（证实容器内游戏数据恢复有效）。
- **列表显示脱节**：由于未更新容器内 `param.sfo`、外部 `savedata_prospero_meta` 及 `savedata.db` 的 `savedata` 表行，游戏内手动读取列表依然显示状态 B 的 `8分35秒`。

---

## 二、`sce_sys/param.sfo` 的全游戏通用字段规律

通过对 12.40 实机导出的状态 A（账号未激活时创建）与状态 B（账号离线激活后创建）的 `param.sfo`（2860 字节，15 个固定条目）逐字节比对，并结合 PSCloud 在多款游戏上的对比实证，所有 PS5 游戏的存档 `param.sfo` 均遵循系统统一结构：

| 字段分类 | 具体 SFO 键 / 偏移 | 跨游戏通用规律 |
| --- | --- | --- |
| **机器与账号绑定字段**<br>（决定是否报“存档损坏”） | • `ACCOUNT_ID`（8 字节小端整数）<br>• `PARAMS` 偏移 `+0x04`（4 字节小端整数） | `ACCOUNT_ID` 对应当前用户的 PSN/离线激活账号 ID（未激活时为 `0`，激活后为非零 64 位整数，与 `savedata.db` 的 `account_id` 一致）；`PARAMS+0x04` 固定为当前用户的 Profile ID（如 `0x17dfdf4e`）。 |
| **游戏版本与防篡改指纹** | • `sce_sys/keystone` 文件<br>• `PARAMS` 偏移 `+0x08`（32 字节指纹）<br>• `TITLE_ID`、`CATEGORY`(`"sd"`)、`FORMAT`(`"ppr"`) | 同一游戏的所有槽位完全相同，直接保留备份源存档自带的 `keystone` 与指纹即可。 |
| **槽位展示与游戏特定属性**<br>（不同游戏使用不同字段组合） | • `MAINTITLE`（游戏主标题）<br>• `SUBTITLE`（槽位副标题，如 `セーブゲーム 1`）<br>• `DETAIL`（进度详情，如章节、时长、难度）<br>• `SAVEDATA_LIST_PARAM`（4 字节，对应 DB 的 `user_param`）<br>• `SAVEDATA_DIRECTORY`（槽位目录名，如 `SAVEFILE00`）<br>• `SAVEDATA_BLOCKS`（8 字节，等于 `capacity / 65536`）<br>• `SAVEDATA_REVISION`（16 字节时间 UUID）<br>• `PARAMS` 偏移 `+0x4c` / `+0x5c`（槽位计数）<br>• `PARAMS` 偏移 `+0x68`（4 字节小端 Unix 秒时间戳，与 DB 的 `mtime` 完全一致） | 不同游戏会将进度信息存放在 `SUBTITLE`、`DETAIL` 或 `SAVEDATA_LIST_PARAM` 中。**因此不能只针对单一游戏硬编码修补 `DETAIL`，而应完整保留源备份 `param.sfo` 的全部字段，仅将其中与账号绑定的 `ACCOUNT_ID` 和 `PARAMS+0x04` 重写为当前目标用户的值。** |

---

## 三、全游戏通用备份与恢复标准流程

### 1. 通用备份采集
1. 确认目标游戏未在运行（检查进程列表与 `/mnt/sandbox/<TITLE_ID>*`），且存档容器 `mtime` 已稳定。
2. 将 `sdimg_<slot>` 复制到临时工作路径，从偏移 `0x800` 读取密封密钥并调用 `/dev/pfsmgr`（ioctl `0xc0845302`）解封密钥，通过 `sceFsMountSaveData` 挂载副本。
3. 完整打包挂载目录内的**所有游戏文件**及完整的 `sce_sys/`（含 `param.sfo`、`keystone`、`icon0.png`），并记录容器字节容量与 `savedata.db` 中该行的元数据。
4. 调用 `sceFsUmountSaveData` 卸载并清理临时副本。

### 2. 通用恢复（同时支持“已有槽覆盖”与“无槽从零建槽”）
1. **准备或创建容器**：
   - **当目标槽位已存在时**：复制现有 `sdimg_<slot>` 为同目录或暂存区的可写工作副本。
   - **当目标槽位不存在时（如初始化后尚未启动过该游戏）**：通过 `dlopen("libSceFsInternalForVsh.sprx", RTLD_LAZY)` 解析三个内部接口直接从零建槽：
     - 调用 `sceFsInitCreatePfsSaveDataOpt(&opt)`（`sizeof(CreatePfsSaveDataOpt) == 0x20`）并将 `opt.flags[1]` 置为 `0x02`；
     - 按备份记录的原始容量计算字节大小（`1 block = 65536` 字节，新建容器最小容量为 `31,457,280` 字节即 `480` blocks，含 `system_blocks = 80` 开销），打开目标 `sdimg_<slot>` 并调用 `sceFsUfsAllocateSaveData(fd, capacity, 0, 0)` 预分配磁盘块（失败时回退 `ftruncate(fd, capacity)`）；
     - 调用 `sceFsCreatePprPfsSaveDataImage(&opt, sdimg_path, 0, capacity, zero_key_32B)`（传入 32 字节全 `0` 密钥，由当前主机自动生成偏移 `0x800` 处的密封密钥并格式化 PFS 超块）。
2. **反向合成通用 `sce_sys`**：
   - 直接采用备份归档中的原始 `param.sfo`、`keystone` 与 `icon0.png` 作为底本（完整保留源存档的所有标题、详情、自定义参数、块大小与保存时间戳）；若备份缺少 `param.sfo` 则按 12 个标准键（`ACCOUNT_ID`、`ATTRIBUTE`、`CATEGORY="sd"`、`DETAIL`、`FORMAT="obs"`、`MAINTITLE`、`PARAMS`、`SAVEDATA_BLOCKS`、`SAVEDATA_DIRECTORY`、`SAVEDATA_LIST_PARAM`、`SUBTITLE`、`TITLE_ID`）与 96 字节 `keystone` 动态合成；
   - 从当前主机目标用户的已有配置（`/system_data/priv/home/<uid>/config.dat`）中读取当前用户的 `account_id`（8 字节）与 `user_id`（4 字节），写入 `param.sfo` 的 `ACCOUNT_ID` 与 `PARAMS+0x04`。
3. **挂载写入与同目录重命名提交**：
   - 挂载暂存容器，清空旧游戏数据文件后写入备份的游戏数据文件与合成后的 `sce_sys/*`，随后卸载容器并 `fsync`。
   - **提交方式（12.40 实机实证）**：12.40 主机上对存档目录调用 `link(target, rollback)` 创建硬链接会返回失败；必须采用**先将原容器复制为回滚备份文件并 `fsync`，再使用同目录 `rename(staged, target)` 原子替换**的方式提交。
4. **同步外部缓存与 `savedata.db`**：
   - 将槽位图标同步写入 `/user/home/<uid>/savedata_prospero_meta/user/<title_id>/<slot>_icon0.png`（若有 `sdimg_sce_bu_<slot>` 备份槽则同步更新 `sce_bu_<slot>.sfo` 与 `sce_bu_<slot>_icon0.png`）；
   - 在 `/system_data/savedata_prospero/<uid>/db/user/savedata.db`（`user_version = 11`）中开启 `BEGIN IMMEDIATE` 事务，确保 `title` 表存在对应 `title_id` 记录，并在 `savedata` 表中更新或插入对应 `(title_id, dir_name)` 行，使 `main_title`、`sub_title`、`detail`、`user_param`、`blocks`、`free_blocks`、`size_kib`、`system_blocks`、`mtime`、`account_id`、`user_id` 与容器内 `param.sfo` 完全对齐。
