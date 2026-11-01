# PS5 12.40 后台载荷启动安全与权限恢复实证

## 背景与问题

在 PS5 固件 12.40 实机测试中，基于 PS5 Payload SDK 构建的后台 ELF 载荷（如存档服务探针、设置读写探针）在启动阶段曾引发主机远程服务全部失联并记录系统错误 `CE-108262-9`（系统软件崩溃）。

通过对比成功与失败现场的实时内核日志（klog）及离线复现实验，定位到三处明确的启动与权限处理风险点。

---

## 一、SDK CRT 初始化的 `kernel_find_iommu_softc` 扫描风险

### 1. 现场证据与机制分析
- **内核日志断点**：设置探针在使用默认 SDK CRT 启动时，最后一条输出停留在 `__kernel_init` 阶段的 `K3 iommu-enter`，尚未进入载荷的 `main` 函数即触发异常。
- **源码原因**：PS5 Payload SDK 的 `sdk/crt/kernel.c` 在 `__kernel_init` 中默认调用 `kernel_find_iommu_softc()`，该函数从 `ALLPROC` 向下按 8 字节步进扫描至内核数据基址，并对形似内核堆地址的指针解引用读取 `softc + 0x48` 以寻找特征值 `0xfdd80000`。
- **影响**：ReStore 的后台 Agent、存档、设置与存储服务均只使用 CPU、文件系统、Socket 与系统用户态服务，不直接操作 GPU/IOMMU，但默认 CRT 每次启动都会执行这段高风险内核堆遍历。

### 2. CPU-only CRT 修复方案與实机验证
- **修改方式**：在构建后台 CPU 载荷的 CRT（`crt1.o`）时，将 `__kernel_init` 中的 `kernel_find_iommu_softc()` 调用替换为直接将 `KERNEL_ADDRESS_IOMMU_SOFTC = 0`（SDK 内部 `iommu_init` 对零值安全返回错误，不影响非 IOMMU 载荷）。
- **12.40 实机结果**：采用跳过 IOMMU 扫描的 CPU-only CRT 后，设置探针与存档载荷均稳定通过 `C1–C5` 初始化进入 `main` 并正常监听服务端口。

---

## 二、进程权限（Privilege）读写的错误处理缺陷

### 1. 原始载荷启动代码的三处缺陷
对原存档载荷启动与退出时的内核凭据修改逻辑进行故障注入测试，确认存在以下缺陷：
1. **未初始化能力集（caps）写回**：当 `kernel_get_ucred_caps` 读取失败时，原代码未中止流程，退出清理阶段会将栈上未初始化的 16 字节局部数组写回进程 `cr_sceCaps`。
2. **零地址 `rootdir` 写入**：当读取 `KERNEL_ADDRESS_ROOTVNODE` 失败返回 `0` 时，原代码直接调用 `kernel_set_proc_rootdir(pid, 0)`，将进程根目录vnode置空。
3. **SDK Setter 假成功**：SDK v0.44/v0.45 的 `kernel_set_proc_rootdir` 与 `kernel_set_proc_jaildir` 在 `kernel_get_proc_filedesc(pid)` 返回 `0` 时未执行任何内核写入却返回 `0`（成功），仅检查返回值无法确认目录越狱已生效。

### 2. 规范化权限提升与恢复流程
ReStore 后台载荷在执行需要越狱根路径或高权限的操作时，统一遵循以下四步检查规则：
1. **先读后判**：先获取进程 `ucred`、`filedesc` 地址及 `KERNEL_ADDRESS_ROOTVNODE`，任一指针为空立即中止且不修改任何内核状态。
2. **按需修改并记录位掩码（`changed`）**：
   - 若 `rootdir` 已等于 `ROOTVNODE` 或 `jaildir` 已为 `0`（例如经由已越狱的常驻 Loader 启动时），直接跳过对应写入；
   - 仅对实际发生变更的字段置位 `changed` 掩码。
3. **写后回读校验（Read-back Verification）**：每次调用 `set_ucred_authid`、`set_ucred_caps`、`set_proc_rootdir`、`set_proc_jaildir` 后，立即通过 `kernel_copyout` 回读内核对应偏移，确认实际值与目标值一致。
4. **对称安全恢复**：退出或释放权限时，仅根据 `changed` 掩码恢复已成功备份且确实修改过的字段。

---

## 三、常驻 Loader 的进程控制块（`proc`）缓存注意事项

- SDK 的 `kernel_get_proc(pid)` 使用进程内静态 BSS 数组缓存 `pid -> kproc` 映射。
- 新启动的独立 ELF 载荷自身 BSS 从零开始，首次查询自身 PID 不会命中旧缓存；但常驻型 Loader 进程若长期运行并跨多次加载复用同一缓存，在极端 PID 回绕复用场景下可能读到过期 `kproc`。
- **结论**：ReStore 后台作为单实例常驻守护进程运行，避免频繁起停短生命周期的独立 ELF 载荷，从架构上规避高频加载带来的内核扫描与缓存问题。
