/* ReStore UI Prototype (#37)
   Three variants of the ReStore PS5 console application, switchable via ?variant=A|B|C
   Follows /Users/penguinyzsh/Project/PS5/Archive/public/web visual geometry & PS5Motion */
;(() => {
  'use strict'

  const ICONS = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5.5v-6h-5v6H4a1 1 0 0 1-1-1v-9.5Z"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M12 2.5 14.6 9l6.9.6-5.2 4.5 1.6 6.7L12 17.2 6.1 20.8l1.6-6.7-5.2-4.5L9.4 9 12 2.5Z"/></svg>',
    restore: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3.5 2"/></svg>',
    store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M4 7h16l-1.5 12.5a1 1 0 0 1-1 .9H6.5a1 1 0 0 1-1-.9L4 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>',
    cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M7.5 18.5h9.8a4.2 4.2 0 0 0 .4-8.4A5.8 5.8 0 0 0 6.3 8.9 4.6 4.6 0 0 0 7.5 18.5Z"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.4 1Z"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="11" width="16" height="10" rx="2.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    usb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M12 3v14"/><path d="m9 6 3-3 3 3"/><path d="M7 10v3l5 3"/><path d="M17 9v3l-5 3"/><circle cx="12" cy="19" r="2.2"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M13 2 4.5 13H12l-1 9 8.5-11H12l1-9Z"/></svg>',
    save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M5 4h11l3 3v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"/><path d="M8 4v6h8V4"/><path d="M8 21v-6h8v6"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="3" width="7.5" height="7.5" rx="1.8"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.8"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.8"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.8"/></svg>',
    media: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.6"/><path d="m21 16-5.2-5.2L7 19"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9.5v5"/><circle cx="12" cy="17.2" r="1"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  }

  const NAV_TABS = [
    { id: 'onboarding', label: '首次引导', icon: 'spark' },
    { id: 'home', label: '首页概览', icon: 'home' },
    { id: 'restore', label: '数据恢复', icon: 'restore' },
    { id: 'store-apps', label: '软件商店', icon: 'store', locked: true },
    { id: 'store-games', label: '网盘游戏', icon: 'cloud', locked: true },
    { id: 'settings', label: '系统设置', icon: 'settings' },
  ]

  const VARIANTS = {
    A: 'A — 2026 PS5 Welcome 磁贴轨 + 三栏矩阵',
    B: 'B — PS5 Project 巨幅主视觉 + 横向五对象看板',
    C: 'C — PS5 控制中心双栏工作台 + 恢复点时间轴',
  }

  const FIVE_OBJECTS = [
    {
      id: 'elf',
      order: 1,
      stage: '阶段 1 · 宿主与载荷',
      title: '① ELF 插件、独立载荷与宿主配置',
      badge: '恢复后服务即刻生效',
      icon: 'bolt',
      size: '48 MB',
      summary:
        '完整包含 OnionHEN / etaHEN 宿主配置、插件目录 .elf 插件（ftpsrv.elf、ntp.elf、kstuff.elf）、独立 .elf 载荷、.auto_start / autoload.txt 自启标记及 ShadowMountPlus 外置游戏扫描路径列表。',
    },
    {
      id: 'desktop',
      order: 2,
      stage: '阶段 2 · 桌面图标展示',
      title: '③ 游戏与应用桌面展示',
      badge: '轻量元数据 · 14 款游戏图标',
      icon: 'grid',
      size: '64 MB',
      warning: '⚠️ 仅恢复桌面图标与列表展示（sce_sys / icon0.png / mount.lnk / app.db），不含任何游戏本体、补丁或 DLC 文件',
      summary:
        '恢复后 PS5 主界面与游戏库立即重现原有游戏图标展示；外置盘/M.2 上文件仍在的游戏经挂载可直接启动，未安装本体的游戏仅保留桌面图标展示。',
    },
    {
      id: 'saves',
      order: 3,
      stage: '阶段 3 · 全游戏通用存档',
      title: '② 全游戏通用存档（含无槽直接建槽）',
      badge: '跨账号重绑 · 19 款游戏 / 46 槽位',
      icon: 'save',
      size: '1.42 GB',
      summary:
        '支持已有槽覆盖与初始化后从未启动过游戏（无存档槽）直接调用 libSceFsInternalForVsh 创建 PFS 容器；保留源备份完整 param.sfo 并重写当前账号 ACCOUNT_ID 与 PARAMS+0x04，同步 savedata_prospero_meta 与 savedata.db，列表章节/时长/时间/图标与实际载入完全一致。',
    },
    {
      id: 'settings',
      order: 4,
      stage: '阶段 4A · 系统与账号设置',
      title: '④ 系统与账号设置',
      badge: '含离线激活与省电不待机',
      icon: 'settings',
      size: '6 MB',
      summary:
        '恢复本地账号离线激活状态（PSN Account ID 绑定）、省电待机时间（设为不待机）、显示与视频（4K 120Hz / HDR / VRR）、音频输出与语言偏好白名单（排除机器硬件唯一标识项）。',
    },
    {
      id: 'media',
      order: 5,
      stage: '阶段 4B · 媒体图库',
      title: '⑤ 媒体图库（截图与视频）',
      badge: '文件 + 图库数据库同步',
      icon: 'media',
      size: '3.85 GB',
      summary:
        '同时还原游戏截图/录屏视频文件与系统媒体图库数据库记录，恢复后打开系统“媒体图库”即可直接浏览图片并播放视频。',
    },
  ]

  const STORE_APPS = [
    {
      name: 'etaHEN',
      repo: 'etaHEN/etaHEN',
      version: 'v2.0B · 12.40 适配',
      category: '独立载荷',
      art: './assets/etahen-icon.jpg',
      size: '3.4 MB · ELF 载荷',
      desc: '集成式一体的 PS5 自制宿主载荷，提供插件管理、FTP、Kstuff 与工具箱服务。',
    },
    {
      name: 'ShadowMountPlus',
      repo: 'drakmor/ShadowMountPlus',
      version: 'v1.4.2 · 挂载服务',
      category: '独立载荷',
      art: './assets/ps5-payload-dev.png',
      size: '410 KB · ELF + config.ini',
      desc: '自动扫描外置 USB / M.2 游戏目录及 .ffpkg / .exfat / .ffpfs 镜像并挂载到主界面。',
    },
    {
      name: 'ezRemote Client',
      repo: 'cy33hc/ps5-ezremote-client',
      version: 'v2.17 · 独立应用',
      category: '独立软件',
      art: './assets/idlesauce.png',
      size: '28.6 MB · ZIP / ELF / PKG',
      desc: '支持 WebDAV、SMB、FTP、NFS 与 GitHub Releases 浏览下载及 ZIP/7z/RAR 解压安装。',
    },
    {
      name: 'OnionHEN FTP Plugin',
      repo: 'OnionBuddies/onionHEN-ftpsrv-plugin',
      version: 'v1.2.0 · 插件',
      category: 'OnionHEN 插件',
      art: './assets/Cryptogenic.png',
      size: '198 KB · .elf 插件',
      desc: '随宿主启动的轻量级高速 FTP 服务插件，支持全分区读写访问与自启标记配置。',
    },
    {
      name: 'PS5 Payload SDK & elfldr',
      repo: 'ps5-payload-dev/elfldr',
      version: 'v0.19 · 后台加载器',
      category: '独立载荷',
      art: './assets/ps5-payload-dev.png',
      size: '245 KB · 端口 9021 驻留',
      desc: '标准动态链接 ELF 载荷后台加载器，支持关闭入口应用后持续驻留运行后台服务。',
    },
    {
      name: 'ReStore Native Companion',
      repo: 'penguinyzsh/restore',
      version: 'v1.0.0 · 本机内置',
      category: '独立软件',
      art: './assets/restore-logo.png',
      size: '12.4 MB · 主界面应用 + 守护载荷',
      desc: 'ReStore 原生独立应用与后台增量备份守护服务，支持五类核心对象与多位置同步。',
    },
  ]

  const STORE_GAMES = [
    {
      id: 'astro-bot',
      title: '宇宙机器人 ASTRO BOT',
      meta: 'PPSA21564 · 百度网盘 / 夸克网盘',
      format: '.ffpkg 挂载镜像 · 36.4 GB',
      cover: './assets/games/astro-bot/cover.png',
    },
    {
      id: 'ratchet',
      title: '瑞奇与叮当：时空跳转',
      meta: 'PPSA01473 · 夸克 TV 扫码直连',
      format: 'exFAT 目录镜像 · 33.8 GB',
      cover: './assets/games/ratchet-and-clank-rift-apart/cover.png',
    },
    {
      id: 'returnal',
      title: '死亡回归 Returnal',
      meta: 'PPSA01284 · OpenList 聚合源',
      format: '7z 分卷自动解压 · 52.1 GB',
      cover: './assets/games/returnal/cover.png',
    },
    {
      id: 'gow',
      title: '战神：诸神黄昏',
      meta: 'PPSA08329 · 百度网盘高速通道',
      format: '.ffpfs 镜像 · 84.2 GB',
      cover: './assets/games/god-of-war-ragnarok/cover.png',
    },
    {
      id: 'horizon',
      title: '地平线：西之绝境',
      meta: 'PPSA04072 · 夸克网盘直连',
      format: 'PKG + 补丁直装 · 79.5 GB',
      cover: './assets/games/horizon-forbidden-west/cover.png',
    },
    {
      id: 'spiderman2',
      title: '漫威蜘蛛侠 2',
      meta: 'PPSA08331 · OpenList WebDAV',
      format: 'ShadowMount 目录 · 68.0 GB',
      cover: './assets/games/marvels-spider-man-2/cover.png',
    },
  ]

  const urlParams = new URLSearchParams(window.location.search)
  const initialVariant = ['A', 'B', 'C'].includes(urlParams.get('variant'))
    ? urlParams.get('variant')
    : 'A'
  const initialView = NAV_TABS.some((t) => t.id === urlParams.get('view'))
    ? urlParams.get('view')
    : 'home'
  const initialLockMode = urlParams.get('lock')
  const initialModal = urlParams.get('modal')

  const state = {
    variant: initialVariant,
    view: initialView,
    launcherTile: 'restore-now',
    onboardingBranch: urlParams.get('branch') === 'empty-rp' ? 'empty-rp' : 'has-rp', // 'has-rp' | 'empty-rp'
    selectedLocationId: 'usb',
    selectedRestorePointId: 'rp-20261101-1910',
    selectedObjects: ['elf', 'desktop', 'saves', 'settings', 'media'],
    autoBackupScope: ['elf', 'desktop', 'saves', 'settings', 'media'],
    storeAppFilter: '全部',
    storeGameSource: '全部网盘源（百度 / 夸克 / OpenList）',
    spaceLowSimulated: false,
    lockScene: {
      active: ['normal', 'conflict', 'resumed'].includes(initialLockMode),
      mode: ['normal', 'conflict', 'resumed'].includes(initialLockMode) ? initialLockMode : 'normal', // 'normal' | 'conflict' | 'resumed'
      progress: initialLockMode === 'resumed' ? 76 : 68,
      currentStage: 3,
      currentDetail: '正在恢复《最后生还者 Part I》(PPSA03396) 存档槽 SAVEFILE00 · 重绑账号 17dfdf4e 并同目录 rename 提交',
    },
    modal: ['webdav-osk', 'restore-result'].includes(initialModal) ? initialModal : null, // null | 'webdav-osk' | 'restore-result'
    editingLocationId: 'lan',
    oskForm: {
      url: 'http://192.168.50.10:5244/dav/ps5-restore',
      user: 'penguinyzsh',
      pass: '••••••••••••',
      activeField: 'url',
      verified: true,
    },
    restoreResultRetried: false,
    locations: [
      {
        id: 'usb',
        name: 'USB 扩展存储 (exFAT)',
        endpoint: '/mnt/usb0/ReStore',
        type: 'usb',
        enabled: true,
        status: 'connected',
        statusText: '已就绪 · 独立同步完成 100%',
        progress: 100,
        lastSync: '今天 19:10（完整恢复点 #18）',
        freeSpace: '184.2 GB 可用 / 256 GB',
        dedupRate: '86% 块复用',
      },
      {
        id: 'lan',
        name: '局域网 WebDAV (OpenList NAS)',
        endpoint: 'http://192.168.50.10:5244/dav/ps5-restore',
        type: 'webdav',
        enabled: true,
        status: 'connected',
        statusText: '已连接 · 增量校验完成 100%',
        progress: 100,
        lastSync: '今天 19:11（完整恢复点 #18）',
        freeSpace: '1.82 TB 可用 / 4.0 TB',
        dedupRate: '91% 块复用',
      },
      {
        id: 'cloud',
        name: '云端 WebDAV (异地加密灾备)',
        endpoint: 'https://dav.restore-cloud.example/ps5',
        type: 'webdav',
        enabled: true,
        status: 'syncing',
        statusText: '后台断点续传中 74%（保留 #17 完整恢复点可用）',
        progress: 74,
        lastSync: '今天 16:40（上一完整点 #17 可用）',
        freeSpace: '412 GB 可用 / 1.0 TB',
        dedupRate: '89% 块复用',
      },
    ],
    restorePoints: [
      {
        id: 'rp-20261101-1910',
        title: '恢复点 #18 · 关闭《最后生还者 Part I》后自动生成',
        time: '2026-11-01 19:10:42',
        locationIds: ['usb', 'lan'],
        isLatestComplete: true,
        protected: true,
        size: '5.39 GB（本次增量仅传输 142 MB）',
        summary: '含 5 类完整对象：ELF 插件/载荷 12 项、通用存档 19 款、桌面图标 14 款、12.40 离线激活与设置、媒体 86 项',
      },
      {
        id: 'rp-20261101-1640',
        title: '恢复点 #17 · 新增 ShadowMountPlus 扫描路径后自动生成',
        time: '2026-11-01 16:40:15',
        locationIds: ['usb', 'lan', 'cloud'],
        isLatestComplete: false,
        protected: true,
        size: '5.25 GB（增量传输 18 MB）',
        summary: '含 5 类完整对象：三位置全部同步完成，云端 WebDAV 当前最新完整恢复点',
      },
      {
        id: 'rp-20261031-2305',
        title: '恢复点 #16 · 折腾内核前手动触发备份',
        time: '2026-10-31 23:05:09',
        locationIds: ['usb', 'lan', 'cloud'],
        isLatestComplete: false,
        protected: false,
        size: '5.10 GB（未保护 · 空间不足时优先按序清理）',
        summary: '含 5 类完整对象：未锁定保护，空间不足清理时可安全回收无引用块',
      },
    ],
  }

  let toastTimer = null
  function showToast(msg) {
    const el = document.getElementById('toast')
    if (!el) return
    el.innerHTML = `${ICONS.spark}<span>${msg}</span>`
    el.classList.add('show')
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => el.classList.remove('show'), 3200)
  }

  function syncUrl() {
    const u = new URL(window.location.href)
    u.searchParams.set('variant', state.variant)
    u.searchParams.set('view', state.view)
    window.history.replaceState({}, '', u)
  }

  function renderHeader() {
    return `
      <header class="system-header">
        <div class="header-brand-cluster">
          <div class="brand-mark">
            <img src="./assets/restore-logo.png" alt="ReStore 官方 Logo" />
            <div class="brand-mark-text">
              <strong>ReStore</strong>
              <small>PS5 12.40 数据备份与恢复 · 原生独立应用</small>
            </div>
          </div>
          <nav class="top-l1r1-bar" aria-label="L1 R1 顶部页面切换">
            <button type="button" class="shoulder-key" data-action="prev-tab" title="L1 切换到上一页 (快捷键 Q)">L1</button>
            ${NAV_TABS.map(
              (tab) => `
              <button
                type="button"
                class="top-nav-pill ${!state.lockScene.active && state.view === tab.id ? 'current' : ''}"
                data-action="switch-view"
                data-view="${tab.id}"
              >
                ${ICONS[tab.icon]}
                <span>${tab.label}</span>
                ${tab.locked ? '<em class="lock-tag">预览</em>' : ''}
              </button>
            `,
            ).join('')}
            <button type="button" class="shoulder-key" data-action="next-tab" title="R1 切换到下一页 (快捷键 E)">R1</button>
          </nav>
        </div>
        <div class="header-status-cluster">
          <div class="daemon-pill" title="关闭前台界面或退出 YouTube 入口后，后台守护载荷依然持续驻留">
            <i class="status-dot"></i>
            <span>后台载荷驻留中 · 监听稳定</span>
          </div>
          <div class="user-badge">
            <div class="user-avatar">YP</div>
            <span>YunPeng <small>· 17dfdf4e 已激活</small></span>
          </div>
          <time class="system-clock">20:02</time>
        </div>
      </header>
    `
  }

  function renderSidebarNav() {
    return `
      <aside class="system-nav" aria-label="PS5 左侧系统导航轨">
        <div class="system-nav-brand">
          <img src="./assets/restore-logo.png" alt="ReStore" />
          <div>
            <strong>ReStore</strong>
            <small>皇家蓝手提箱 #00439C</small>
          </div>
        </div>
        ${NAV_TABS.map(
          (tab, idx) => `
          <button
            type="button"
            class="system-tab ${!state.lockScene.active && state.view === tab.id ? 'current' : ''} ${idx === 2 ? 'divider-after' : ''}"
            data-action="switch-view"
            data-view="${tab.id}"
          >
            ${ICONS[tab.icon]}
            <span>${tab.label}</span>
            ${tab.locked ? '<small class="nav-badge">只看</small>' : ''}
          </button>
        `,
        ).join('')}
      </aside>
    `
  }

  function renderOnboardingPage() {
    const isHasRp = state.onboardingBranch === 'has-rp'
    return `
      <main class="browse-page">
        <div class="page-title">
          <div>
            <h1>首次引导与备份位置连接</h1>
            <p>配置 USB 或 WebDAV 备份位置 · 纯手柄调起系统输入法填写凭据（无手机扫码配网）</p>
          </div>
          <div class="onboarding-branch-switch" role="tablist" aria-label="首次启动检测状态切换">
            <button
              type="button"
              class="${isHasRp ? 'active' : ''}"
              data-action="set-onboarding-branch"
              data-branch="has-rp"
            >
              场景 A：检测到已有恢复点（默认选最近完整点）
            </button>
            <button
              type="button"
              class="${!isHasRp ? 'active' : ''}"
              data-action="set-onboarding-branch"
              data-branch="empty-rp"
            >
              场景 B：位置尚无恢复点（默认全选五类发起首备）
            </button>
          </div>
        </div>

        <div class="onboarding-layout">
          <section class="onboarding-brand-panel">
            <div class="onboarding-logo-hero">
              <img src="./assets/restore-logo-full.png" alt="ReStore 官方蓝白手提箱 Logo" />
              <div>
                <h2>欢迎使用 ReStore</h2>
                <p>PS5 12.40 原生独立应用 + 后台驻留服务</p>
              </div>
            </div>
            <div class="dns-guide-box">
              <h3>${ICONS.spark} 站点 DNS 引导与本机入口已就绪</h3>
              <p>
                1. 手机/电脑访问引导站点查看 12.40 DNS 配置 → 打开 PS5「用户指南」自动部署带官方 Logo 的 ReStore 主界面应用与后台载荷。<br/>
                2. 引导 DNS 仅定向拦截用户指南域名，<strong>正常放行其余全部互联网域名解析</strong>，主机可直接连接云端 WebDAV。
              </p>
            </div>
            <div class="dns-guide-box">
              <h3>${ICONS.restore} 当前引导分支行为</h3>
              <p>
                ${
                  isHasRp
                    ? '已从所选位置发现历史恢复点：界面已自动为您默认选中<strong>最近一次完整恢复点 (#18 · 今天 19:10)</strong>，按 ✕ 即可进入整机恢复，也可改选历史恢复点。'
                    : '所选备份位置尚无恢复点：界面已自动<strong>默认全选全部五类可备份对象</strong>，确认后立即生成第一份完整恢复点并独立同步。'
                }
              </p>
            </div>
            <div class="hero-actions" style="margin-top: 8rem;">
              ${
                isHasRp
                  ? `<button type="button" class="pill primary" data-action="go-restore-from-onboarding">${ICONS.restore}<span>使用最近完整恢复点开始恢复</span></button>`
                  : `<button type="button" class="pill primary" data-action="trigger-initial-backup">${ICONS.spark}<span>立即生成第一份完整恢复点（已全选 5 类）</span></button>`
              }
              <button type="button" class="pill secondary" data-action="switch-view" data-view="home">进入首页概览</button>
            </div>
          </section>

          <section class="onboarding-steps-panel">
            <div class="panel-card">
              <div class="panel-card-header">
                <h2><span class="step-num">1</span> 用手柄选择一个或多个备份位置（独立同步 · 互不阻塞）</h2>
                <button type="button" class="pill sm brand" data-action="open-webdav-osk" data-loc="lan">
                  ⌨️ 手柄调起系统输入法配置 WebDAV
                </button>
              </div>
              <div class="location-grid">
                ${state.locations
                  .map(
                    (loc) => `
                  <div class="location-card ${loc.enabled ? 'selected' : ''}">
                    <div class="location-card-top">
                      <strong>${loc.name}</strong>
                      <button
                        type="button"
                        class="check-circle"
                        data-action="toggle-location"
                        data-loc="${loc.id}"
                        aria-label="启用或禁用 ${loc.name}"
                      >
                        ${loc.enabled ? '✓' : ''}
                      </button>
                    </div>
                    <div class="location-meta">
                      <div>地址：<code>${loc.endpoint}</code></div>
                      <div>状态：${loc.statusText}</div>
                      <div>最近完成：${isHasRp ? loc.lastSync : '尚无恢复点（待首次备份）'}</div>
                    </div>
                    <div class="location-card-footer">
                      <span class="badge ${loc.status === 'connected' ? 'green' : 'gold'}">${loc.freeSpace}</span>
                      ${
                        loc.type === 'webdav'
                          ? `<button type="button" class="pill sm secondary" data-action="open-webdav-osk" data-loc="${loc.id}">手柄输入凭据</button>`
                          : `<button type="button" class="pill sm secondary" data-action="toggle-location" data-loc="${loc.id}">${loc.enabled ? '已启用' : '启用位置'}</button>`
                      }
                    </div>
                  </div>
                `,
                  )
                  .join('')}
              </div>
            </div>

            ${
              isHasRp
                ? `
              <div class="panel-card">
                <div class="panel-card-header">
                  <h2><span class="step-num">2</span> 发现已有恢复点（默认选中最近一次完整恢复点，可改选历史点）</h2>
                  <span class="badge blue">自动跳过未完成同步点</span>
                </div>
                <div class="restore-points-list">
                  ${state.restorePoints
                    .map(
                      (rp) => `
                    <button
                      type="button"
                      class="restore-point-item ${state.selectedRestorePointId === rp.id ? 'selected' : ''}"
                      data-action="select-rp"
                      data-rp="${rp.id}"
                    >
                      <div class="rp-header">
                        <strong>${rp.title}</strong>
                        <div class="rp-badges">
                          ${rp.isLatestComplete ? '<span class="badge blue">默认选中 · 最近完整恢复点</span>' : ''}
                          ${rp.protected ? '<span class="badge gold">🔒 已保护</span>' : '<span class="badge">可自动清理</span>'}
                          <span class="badge green">${rp.time}</span>
                        </div>
                      </div>
                      <div class="location-meta">${rp.summary} · ${rp.size}</div>
                    </button>
                  `,
                    )
                    .join('')}
                </div>
              </div>
            `
                : `
              <div class="panel-card">
                <div class="panel-card-header">
                  <h2><span class="step-num">2</span> 位置尚无恢复点 · 默认全选五类对象生成首份完整备份</h2>
                  <span class="badge green">已默认全选 5 / 5 类</span>
                </div>
                <div class="five-objects-grid">
                  ${FIVE_OBJECTS.map(
                    (obj) => `
                    <button
                      type="button"
                      class="object-card ${state.selectedObjects.includes(obj.id) ? 'selected' : ''}"
                      data-action="toggle-object"
                      data-obj="${obj.id}"
                    >
                      <div class="object-icon-box">${ICONS[obj.icon]}</div>
                      <div class="object-copy">
                        <strong>${obj.title} <span class="badge blue">${obj.size}</span></strong>
                        <p>${obj.summary}</p>
                        ${obj.warning ? `<span class="scope-warning">${obj.warning}</span>` : ''}
                      </div>
                      <div class="check-circle">${state.selectedObjects.includes(obj.id) ? '✓' : ''}</div>
                    </button>
                  `,
                  ).join('')}
                </div>
              </div>
            `
            }
          </section>
        </div>
      </main>
    `
  }

  function renderHomeVariantA() {
    const tiles = [
      { id: 'restore-now', title: '整机恢复', sub: '最近完整点 #18', tag: '推荐', accent: '#00439c', logo: true },
      { id: 'backup-now', title: '立即备份', sub: '增量复用 89%', tag: '手动触发', accent: '#1f5f8b' },
      { id: 'loc-usb', title: 'USB 存储', sub: '100% 已同步', tag: '/mnt/usb0', accent: '#235c4b' },
      { id: 'loc-lan', title: '局域网 WebDAV', sub: '100% 已同步', tag: 'NAS 在线', accent: '#3a4869' },
      { id: 'loc-cloud', title: '云端 WebDAV', sub: '续传中 74%', tag: '#17 完整可用', accent: '#4b3568' },
      { id: 'store-preview', title: '商店外观预览', sub: '第二阶段开放', tag: '🔒 只看', accent: '#2d3748' },
    ]
    let leftCursor = 18
    const tileNodes = tiles
      .map((t) => {
        const active = state.launcherTile === t.id
        const size = active ? 164 : 118
        const top = active ? 4 : 34
        const node = `
          <button
            type="button"
            class="launch-tile ${active ? 'active' : ''}"
            data-select="${t.id}"
            data-action="select-launcher-tile"
            data-tile="${t.id}"
            style="left:${leftCursor}rem; top:${top}rem; width:${size}rem; height:${size}rem;"
          >
            ${
              t.logo
                ? `<img src="./assets/restore-logo-full.png" alt="${t.title}" /><span class="launch-tile-tag">${t.title}</span>`
                : `<div class="launch-tile-inner" style="--tile-accent:${t.accent}">
                    ${ICONS.spark}
                    <div>
                      <strong>${t.title}</strong>
                      <small style="display:block">${t.sub}</small>
                    </div>
                  </div>`
            }
          </button>
        `
        leftCursor += size + 18
        return node
      })
      .join('')

    return `
      <section class="welcome-scene">
        <div class="launcher" aria-label="PS5 主界面磁贴流">${tileNodes}</div>
        <div class="welcome-prompt-bar">
          <div class="welcome-prompt">
            ${ICONS.spark}
            <span>ReStore 后台守护运行中 · 游戏退出落盘稳定后自动增量备份，多位置独立同步互不阻塞</span>
          </div>
          <div class="welcome-quick-actions">
            <button type="button" class="pill brand sm" data-action="manual-backup">⚡ 立即手动备份</button>
            <button type="button" class="pill primary sm" data-action="switch-view" data-view="restore">进入数据恢复</button>
            <button type="button" class="pill secondary sm" data-action="start-lock-demo" data-mode="normal">演示全屏恢复进度锁</button>
          </div>
        </div>

        <div class="welcome-grid">
          <div class="welcome-column">
            ${state.locations
              .map(
                (loc) => `
              <button
                type="button"
                class="widget home-rail-card"
                data-action="${loc.type === 'webdav' ? 'open-webdav-osk' : 'switch-view'}"
                data-loc="${loc.id}"
                data-view="restore"
              >
                <div class="widget-heading">
                  <span>${loc.type === 'usb' ? ICONS.usb : ICONS.cloud}<span>${loc.name}</span></span>
                  <small>${loc.dedupRate}</small>
                </div>
                <div class="status-content">
                  <div class="connection-ring ${loc.status === 'syncing' ? 'syncing' : ''}">
                    ${loc.status === 'connected' ? ICONS.check : ICONS.restore}
                  </div>
                  <span>
                    <b>${loc.statusText}</b>
                    <small>${loc.lastSync} · ${loc.freeSpace}</small>
                  </span>
                  <span class="badge ${loc.status === 'connected' ? 'green' : 'gold'}">${loc.progress}%</span>
                </div>
              </button>
            `,
              )
              .join('')}
          </div>

          <button type="button" class="widget welcome-feature-card" data-action="switch-view" data-view="restore">
            <div class="widget-heading">
              <span>${ICONS.restore}<span>最近完整恢复点 #18</span></span>
              <small>🔒 已手动保护</small>
            </div>
            <div class="home-feature-identity">
              <div class="home-feature-art">
                <img src="./assets/restore-logo-full.png" alt="ReStore 官方手提箱图标" />
              </div>
              <div class="home-feature-badges">
                <strong>2026-11-01 19:10 完成</strong>
                <span>《最后生还者 Part I》退出后自动增量生成</span>
                <span>未变化数据块自动复用 · 仅传输 142 MB</span>
              </div>
              <span class="home-feature-type">PS5 12.40 验证</span>
            </div>
            <div class="home-feature-copy">
              <small>五类核心对象全量就绪 · 按依赖顺序一键恢复</small>
              <h2>宿主与 ELF 插件 → 桌面图标 → 通用存档 → 设置与媒体</h2>
              <p>支持主机初始化后从未启动过游戏（无存档槽）直接创建 PFS 容器并重绑账号，列表章节/时长与实际进度完全一致。</p>
            </div>
            <div class="home-feature-stats">
              <span>${ICONS.bolt}<b>12 项 ELF</b><small>插件/载荷/自启</small></span>
              <span>${ICONS.save}<b>19 款存档</b><small>含无槽直接建槽</small></span>
              <span>${ICONS.grid}<b>14 款图标</b><small>不含游戏本体</small></span>
            </div>
          </button>

          <div class="welcome-column">
            <button type="button" class="widget home-rail-card" data-action="manual-backup">
              <div class="widget-heading">
                <span>${ICONS.bolt}<span>后台稳定监听策略</span></span>
                <small>零抢占 · 零崩溃</small>
              </div>
              <div class="stars-breakdown">
                <span>${ICONS.save}<b>存档监听</b><small>游戏退出稳定后</small></span>
                <span>${ICONS.bolt}<b>ELF/配置</b><small>增改即刻捕获</small></span>
                <span>${ICONS.media}<b>设置/媒体</b><small>落盘增量同步</small></span>
              </div>
              <div class="category-strip">
                <i style="width:38%; background:#00439c"></i>
                <i style="width:28%; background:#3b82f6"></i>
                <i style="width:20%; background:#77c495"></i>
                <i style="width:14%; background:#f2c97d"></i>
              </div>
            </button>

            <button type="button" class="widget home-rail-card" data-action="start-lock-demo" data-mode="resumed">
              <div class="widget-heading">
                <span>${ICONS.warn}<span>应用内专注恢复保护 & 断点续做</span></span>
                <small>点击体验</small>
              </div>
              <div class="status-content">
                <div class="connection-ring">${ICONS.restore}</div>
                <span>
                  <b>全屏专注进度锁 + 断电重启自动核验续做</b>
                  <small>温和提示“请勿启动游戏”，绝不注入或 Hook 系统进程</small>
                </span>
                <span class="badge blue">演示</span>
              </div>
            </button>

            <button type="button" class="widget home-rail-card" data-action="switch-view" data-view="store-apps">
              <div class="widget-heading">
                <span>${ICONS.lock}<span>软件商店 & 网盘游戏外观预览</span></span>
                <small>第一版只看不让用</small>
              </div>
              <div class="status-content">
                <div class="connection-ring">${ICONS.store}</div>
                <span>
                  <b>GitHub 载荷商店 + 百度/夸克网盘游戏库</b>
                  <small>已定好完整卡片视觉并覆盖半透明预览锁定遮罩</small>
                </span>
                <span class="badge gold">预览</span>
              </div>
            </button>
          </div>
        </div>
      </section>
    `
  }

  function renderHomeVariantB() {
    return `
      <section class="project-scene">
        <div class="project-main-art">
          <img src="./assets/restore-logo-full.png" alt="ReStore 官方 Logo" />
          <div class="project-art-metrics">
            <div><strong>3 位置独立同步</strong><small>USB 100% · LAN 100% · 云端 74%</small></div>
            <div><strong>恢复点 #18</strong><small>今天 19:10 · 🔒 已锁定保护</small></div>
            <div><strong>89% 增量复用</strong><small>未变化存档与媒体自动去重</small></div>
          </div>
        </div>
        <div class="project-copy">
          <span class="project-eyebrow">${ICONS.spark} Variant B · PS5 Project 巨幅主视觉布局</span>
          <h1>ReStore 整机折腾环境与全游戏存档守护</h1>
          <p>
            专为 PS5 12.40 打造：关闭前台应用或退出入口后后台持续稳定驻留。支持 ELF 插件与独立载荷、全游戏通用存档（含无槽直接建槽）、游戏桌面图标展示（不含本体）、离线激活设置与媒体图库的一键恢复。
          </p>
          <div class="hero-actions">
            <button type="button" class="pill primary" data-action="switch-view" data-view="restore">
              ${ICONS.restore}<span>从恢复点 #18 恢复数据</span>
            </button>
            <button type="button" class="pill brand" data-action="manual-backup">
              ${ICONS.spark}<span>立即手动创建恢复点</span>
            </button>
            <button type="button" class="pill secondary" data-action="start-lock-demo" data-mode="conflict">
              演示全屏恢复锁与冲突检测
            </button>
          </div>
        </div>
        <div class="project-highlights">
          ${state.locations
            .map(
              (loc) => `
            <button type="button" data-action="${loc.type === 'webdav' ? 'open-webdav-osk' : 'switch-view'}" data-loc="${loc.id}" data-view="restore">
              <span>${loc.name} <em class="badge ${loc.status === 'connected' ? 'green' : 'gold'}">${loc.progress}%</em></span>
              <strong>${loc.statusText}</strong>
              <small>${loc.lastSync} · ${loc.freeSpace}</small>
            </button>
          `,
            )
            .join('')}
          <button type="button" data-action="switch-view" data-view="store-games">
            <span>第二阶段外观预览 <em class="badge gold">🔒 锁定遮罩</em></span>
            <strong>软件商店 & 网盘游戏</strong>
            <small>点击浏览 GitHub 载荷商店与百度/夸克网盘游戏底层视觉</small>
          </button>
        </div>
      </section>
    `
  }

  function renderHomeVariantC() {
    return `
      <main class="browse-page">
        <div class="page-title">
          <div>
            <h1>ReStore 控制中心工作台 · 恢复点时间轴 (Variant C)</h1>
            <p>左侧管理三位置独立同步与手动备份，右侧沿时间轴检视恢复点增量演进与块复用</p>
          </div>
          <div class="welcome-quick-actions">
            <button type="button" class="pill brand sm" data-action="manual-backup">⚡ 立即备份</button>
            <button type="button" class="pill primary sm" data-action="switch-view" data-view="restore">进入恢复工作台</button>
          </div>
        </div>
        <div class="restore-workbench">
          <div class="onboarding-steps-panel">
            <div class="panel-card">
              <div class="panel-card-header">
                <h2>备份位置实时连接与独立同步状态</h2>
                <button type="button" class="pill sm secondary" data-action="open-webdav-osk" data-loc="lan">⌨️ WebDAV 手柄输入</button>
              </div>
              <div class="restore-points-list">
                ${state.locations
                  .map(
                    (loc) => `
                  <button type="button" class="restore-point-item selected" data-action="open-webdav-osk" data-loc="${loc.id}">
                    <div class="rp-header">
                      <strong>${loc.name}</strong>
                      <span class="badge ${loc.status === 'connected' ? 'green' : 'gold'}">${loc.progress}% · ${loc.dedupRate}</span>
                    </div>
                    <div class="location-meta">${loc.statusText} · ${loc.lastSync}</div>
                  </button>
                `,
                  )
                  .join('')}
              </div>
            </div>
          </div>
          <div class="panel-card">
            <div class="panel-card-header">
              <h2>恢复点生成与多位置同步时间轴</h2>
              <span class="badge blue">始终保留每个位置最后一个完整恢复点</span>
            </div>
            <ol class="activity-release-timeline">
              ${state.restorePoints
                .map(
                  (rp) => `
                <li>
                  <span class="activity-release-marker"></span>
                  <button type="button" class="restore-point-item ${state.selectedRestorePointId === rp.id ? 'selected' : ''}" style="width:100%" data-action="select-rp" data-rp="${rp.id}">
                    <div class="rp-header">
                      <strong>${rp.title}</strong>
                      <div class="rp-badges">
                        ${rp.isLatestComplete ? '<span class="badge blue">最近完整点</span>' : ''}
                        ${rp.protected ? '<span class="badge gold">🔒 已保护</span>' : '<span class="badge">可自动清理</span>'}
                        <span class="badge green">${rp.time}</span>
                      </div>
                    </div>
                    <div class="location-meta">${rp.summary} · ${rp.size}</div>
                  </button>
                </li>
              `,
                )
                .join('')}
            </ol>
          </div>
        </div>
      </main>
    `
  }

  function renderRestorePage() {
    const allSelected = state.selectedObjects.length === FIVE_OBJECTS.length
    const stages = [
      { num: '阶段 1', name: '宿主与 ELF 插件/独立载荷', desc: '先恢复 OnionHEN/etaHEN、.elf 插件、独立载荷、.auto_start 与 ShadowMountPlus 配置并直接启用', active: state.selectedObjects.includes('elf') },
      { num: '阶段 2', name: '游戏与应用桌面展示', desc: '恢复 sce_sys / icon0.png / mount.lnk 与 app.db 记录，重现主界面图标（不含游戏本体）', active: state.selectedObjects.includes('desktop') },
      { num: '阶段 3', name: '匹配当前用户的全游戏存档', desc: '支持无槽直接创建 PFS 容器，保留源 param.sfo 并重写当前账号 17dfdf4e，同目录 rename 提交', active: state.selectedObjects.includes('saves') },
      { num: '阶段 4', name: '媒体图库与系统账号设置', desc: '同步恢复截图/视频文件与图库数据库，恢复离线激活状态、省电不待机与 4K 120Hz 设置', active: state.selectedObjects.includes('settings') || state.selectedObjects.includes('media') },
    ]

    return `
      <main class="browse-page">
        <div class="page-title">
          <div>
            <h1>数据恢复（位置 → 恢复点 → 五类对象选择）</h1>
            <p>支持整机恢复或单项/多项按需勾选 · 严格按宿主载荷 → 桌面图标 → 存档 → 设置与媒体的依赖顺序执行</p>
          </div>
          <div class="welcome-quick-actions">
            <button type="button" class="pill sm ${allSelected ? 'brand' : 'secondary'}" data-action="select-all-objects">
              ${allSelected ? '✓ 已选整机恢复（全部 5 类）' : '一键全选整机恢复'}
            </button>
            <button type="button" class="pill primary" data-action="start-lock-demo" data-mode="normal">
              ${ICONS.restore}<span>开始恢复（进入全屏专注进度锁）</span>
            </button>
          </div>
        </div>

        <div class="restore-workbench">
          <div class="onboarding-steps-panel">
            <div class="panel-card">
              <div class="panel-card-header">
                <h2><span class="step-num">1</span> 选择备份位置</h2>
              </div>
              <div class="filter-chips">
                ${state.locations
                  .map(
                    (loc) => `
                  <button
                    type="button"
                    class="chip ${state.selectedLocationId === loc.id ? 'active' : ''}"
                    data-action="select-location"
                    data-loc="${loc.id}"
                  >
                    ${loc.name.split(' ')[0]} (${loc.progress}%)
                  </button>
                `,
                  )
                  .join('')}
              </div>

              <div class="panel-card-header" style="margin-top:22rem;">
                <h2><span class="step-num">2</span> 选择恢复点</h2>
                <span class="badge blue">□ 键可锁定保护</span>
              </div>
              <div class="restore-points-list">
                ${state.restorePoints
                  .map(
                    (rp) => `
                  <button
                    type="button"
                    class="restore-point-item ${state.selectedRestorePointId === rp.id ? 'selected' : ''}"
                    data-action="select-rp"
                    data-rp="${rp.id}"
                  >
                    <div class="rp-header">
                      <strong>${rp.title}</strong>
                      <div class="rp-badges">
                        ${rp.isLatestComplete ? '<span class="badge blue">最近完整点</span>' : ''}
                        <span class="badge ${rp.protected ? 'gold' : ''}">${rp.protected ? '🔒 已保护' : '未锁定'}</span>
                      </div>
                    </div>
                    <div class="location-meta">${rp.time} · ${rp.size}</div>
                    <div class="location-meta">${rp.summary}</div>
                  </button>
                `,
                  )
                  .join('')}
              </div>
            </div>
          </div>

          <div class="onboarding-steps-panel">
            <div class="panel-card">
              <div class="panel-card-header">
                <h2><span class="step-num">3</span> 勾选要恢复的核心对象（已选 ${state.selectedObjects.length} / 5 类）</h2>
                <div class="welcome-quick-actions">
                  <button type="button" class="pill sm secondary" data-action="start-lock-demo" data-mode="conflict">模拟游戏运行冲突</button>
                  <button type="button" class="pill sm secondary" data-action="start-lock-demo" data-mode="resumed">模拟断电重启续做</button>
                </div>
              </div>
              <div class="five-objects-grid">
                ${FIVE_OBJECTS.map(
                  (obj) => `
                  <button
                    type="button"
                    class="object-card ${state.selectedObjects.includes(obj.id) ? 'selected' : ''}"
                    data-action="toggle-object"
                    data-obj="${obj.id}"
                  >
                    <div class="object-icon-box">${ICONS[obj.icon]}</div>
                    <div class="object-copy">
                      <strong>
                        <span>${obj.title}</span>
                        <span class="badge blue">${obj.stage}</span>
                        <span class="badge green">${obj.badge}</span>
                      </strong>
                      <p>${obj.summary}</p>
                      ${obj.warning ? `<span class="scope-warning">${obj.warning}</span>` : ''}
                    </div>
                    <div class="check-circle">${state.selectedObjects.includes(obj.id) ? '✓' : ''}</div>
                  </button>
                `,
                ).join('')}
              </div>

              <div class="dependency-pipeline">
                <h3>
                  <span>🔗 恢复依赖顺序执行计划（自动按阶段编排）</span>
                  <small>开始前预检运行中应用 · 断电重启可从阶段断点续做</small>
                </h3>
                <div class="pipeline-steps">
                  ${stages
                    .map(
                      (s) => `
                    <div class="pipeline-step ${s.active ? '' : 'dimmed'}">
                      <small>${s.num} ${s.active ? '· 已纳入计划' : '· 本次跳过'}</small>
                      <strong>${s.name}</strong>
                      <span>${s.desc}</span>
                    </div>
                  `,
                    )
                    .join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    `
  }

  function renderRestoreLockScene() {
    const mode = state.lockScene.mode
    return `
      <section class="restore-lock-scene" aria-live="polite">
        <div class="gentle-warning-banner">
          <div class="gentle-warning-left">
            <div class="gentle-warning-icon">${ICONS.warn}</div>
            <div>
              <strong>正在恢复数据，请勿启动游戏或关闭主机</strong>
              <p>当前处于 ReStore 应用内全屏专注恢复进度锁 · 已屏蔽无关导航以防误触（不注入或 Hook 系统底层进程）</p>
            </div>
          </div>
          <div class="welcome-quick-actions">
            <button type="button" class="pill sm ${mode === 'normal' ? 'brand' : 'secondary'}" data-action="set-lock-mode" data-mode="normal">正常推进态</button>
            <button type="button" class="pill sm ${mode === 'conflict' ? 'brand' : 'secondary'}" data-action="set-lock-mode" data-mode="conflict">运行冲突等待态</button>
            <button type="button" class="pill sm ${mode === 'resumed' ? 'brand' : 'secondary'}" data-action="set-lock-mode" data-mode="resumed">断电重启断点续做态</button>
          </div>
        </div>

        <div class="lock-progress-hero">
          <div>
            <span class="badge blue">目标源：USB 扩展存储 · 恢复点 #18 (2026-11-01 19:10)</span>
            <h2 style="font-size:38rem; font-weight:300; margin:14rem 0 8rem;">
              ${
                mode === 'conflict'
                  ? '阶段 3/4：检测到目标游戏正在后台运行，已跳过冲突项并继续其余恢复'
                  : mode === 'resumed'
                    ? '断点续做核验完成：阶段 1-2 已生效，正从阶段 3 断点继续恢复'
                    : '阶段 3/4：正在恢复匹配当前用户的全游戏通用存档'
              }
            </h2>
            <p style="font-size:17rem; color:#aeb8c7; margin:0;">
              ${state.lockScene.currentDetail}
            </p>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width:${state.lockScene.progress}%"></div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:15rem; color:#9aa6b8;">
              <span>已完成：ELF 插件与载荷 (12/12) · 游戏桌面展示 (14/14) · 通用存档 (14/19)</span>
              <span>采用同目录备份 + rename() 原子替换提交</span>
            </div>

            ${
              mode === 'conflict'
                ? `
              <div class="conflict-alert-box">
                <div>
                  <strong style="display:block; font-size:18rem; color:#ffd4d2;">⚠️ 检测到《最后生还者 Part I》(PPSA03396) 正在运行 (/mnt/sandbox/PPSA03396_000)</strong>
                  <span style="font-size:14.5rem; color:#e6c3c1;">为防止写入运行中的存档容器导致数据损坏，请先保存并关闭该游戏；后台正继续恢复其余无冲突存档与媒体。</span>
                </div>
                <button type="button" class="pill sm primary" data-action="resolve-conflict-continue">已关闭游戏 · 继续写回</button>
              </div>
            `
                : ''
            }

            ${
              mode === 'resumed'
                ? `
              <div class="resume-checkpoint-box">
                <div>
                  <strong style="display:block; font-size:18rem; color:#cfe6ff;">🔄 意外断电/重启后自动断点续做已触发</strong>
                  <span style="font-size:14.5rem; color:#b8cde6;">重新打开 ReStore 后已自动核验：阶段 1（12 项 ELF 插件与宿主配置）与阶段 2（14 款桌面图标）均已落盘生效，无需重头再来，直接从阶段 3 第 15 款存档继续。</span>
                </div>
                <span class="badge green">已省去 2.1 GB 重复写入</span>
              </div>
            `
                : ''
            }
          </div>

          <div class="panel-card" style="background:rgba(14,17,23,0.9);">
            <div style="display:flex; align-items:center; justify-content:space-between;">
              <div class="progress-big-number">${state.lockScene.progress}%</div>
              <img src="./assets/restore-logo.png" alt="ReStore" style="width:76rem; height:76rem; border-radius:18rem;" />
            </div>
            <div class="restore-points-list" style="margin-top:20rem;">
              <div class="restore-point-item"><div class="rp-header"><strong>阶段 1 · 宿主与 ELF 插件载荷</strong><span class="badge green">✓ 已生效 (12/12)</span></div></div>
              <div class="restore-point-item"><div class="rp-header"><strong>阶段 2 · 游戏桌面图标展示</strong><span class="badge green">✓ 已还原 (14/14)</span></div></div>
              <div class="restore-point-item selected"><div class="rp-header"><strong>阶段 3 · 全游戏通用存档（含无槽建槽）</strong><span class="badge blue">进行中 (14/19)</span></div></div>
              <div class="restore-point-item"><div class="rp-header"><strong>阶段 4 · 媒体图库与系统账号设置</strong><span class="badge">排队中</span></div></div>
            </div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; padding-top:18rem; border-top:1rem solid rgba(255,255,255,0.1);">
          <span style="font-size:15rem; color:#98a4b5;">提示：恢复期间即使意外断电，重启后打开 ReStore 也会自动核验实际完成状态并续做剩余任务。</span>
          <div class="welcome-quick-actions">
            <button type="button" class="pill secondary" data-action="exit-lock-scene">返回恢复页</button>
            <button type="button" class="pill primary" data-action="open-restore-result-modal">查看恢复结果分类汇总弹窗</button>
          </div>
        </div>
      </section>
    `
  }

  function renderStoreAppsPage() {
    const categories = ['全部', '独立软件', 'OnionHEN 插件', '独立载荷']
    return `
      <main class="browse-page">
        <div class="page-title">
          <div>
            <h1>软件商店（GitHub 应用 / ELF 插件 / 独立载荷）</h1>
            <p>浏览精选 PS5 自制软件目录或添加公开 GitHub 仓库 · 第一版仅定好完整视觉外观并覆盖预览锁定遮罩</p>
          </div>
          <div class="filter-chips">
            ${categories
              .map(
                (c) => `<span class="chip ${state.storeAppFilter === c ? 'active' : ''}">${c}</span>`,
              )
              .join('')}
            <span class="chip">+ 添加 GitHub 仓库</span>
          </div>
        </div>

        <div class="store-stage-wrap is-locked">
          <div class="store-underlying-canvas" aria-hidden="true">
            <div class="library-grid">
              ${STORE_APPS.map(
                (app) => `
                <article class="store-app-card">
                  <div class="store-app-top">
                    <img src="${app.art}" alt="${app.name}" />
                    <div>
                      <strong>${app.name}</strong>
                      <small>${app.repo} · ${app.version}</small>
                    </div>
                  </div>
                  <p class="store-app-desc">${app.desc}</p>
                  <div class="store-app-footer">
                    <span>${app.category} · ${app.size}</span>
                    <span class="badge blue">下载并自动配置</span>
                  </div>
                </article>
              `,
              ).join('')}
            </div>
          </div>

          <div class="store-preview-lock-overlay">
            <div class="store-lock-glass-card">
              <div class="store-lock-logo-pair">
                <img src="./assets/restore-logo.png" alt="ReStore 官方 Logo" />
                <div class="store-lock-icon-badge">${ICONS.lock}</div>
              </div>
              <span class="badge gold">第一版范围锁定 · 仅供外观预览（只看不让用）</span>
              <h2>「软件商店」将在后续版本开放</h2>
              <p>
                当前第一版聚焦<strong>五类核心数据（ELF 插件与载荷、全游戏存档、桌面图标展示、系统设置、媒体图库）的备份与恢复全链路</strong>。<br/>
                软件商店的底层卡片视觉与导航位置已定型，内部下载安装交互已由本半透明遮罩安全拦截。
              </p>
              <div class="hero-actions" style="margin-top:10rem; justify-content:center;">
                <button type="button" class="pill primary" data-action="switch-view" data-view="restore">
                  ${ICONS.restore}<span>返回数据恢复</span>
                </button>
                <button type="button" class="pill secondary" data-action="switch-view" data-view="store-games">
                  查看「网盘游戏」外观预览
                </button>
                <button type="button" class="pill sm brand" data-action="Intercepted-store-click">
                  测试点击拦截提示
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    `
  }

  function renderStoreGamesPage() {
    return `
      <main class="browse-page">
        <div class="page-title">
          <div>
            <h1>网盘游戏（百度网盘 / 夸克网盘扫码 & OpenList 多格式直连）</h1>
            <p>PS5 本机直连网盘浏览下载，自动识别 PKG 直装、ZIP/7z/RAR 解压及 ShadowMountPlus 镜像挂载 · 当前仅供外观预览</p>
          </div>
          <div class="filter-chips">
            <span class="chip active">全部网盘源</span>
            <span class="chip">百度网盘开放接口</span>
            <span class="chip">夸克网盘 TV 扫码</span>
            <span class="chip">.ffpkg / .exfat 挂载镜像</span>
          </div>
        </div>

        <div class="store-stage-wrap is-locked">
          <div class="store-underlying-canvas" aria-hidden="true">
            <div class="game-grid">
              ${STORE_GAMES.map(
                (g) => `
                <article class="game-tile">
                  <div class="game-cover">
                    <img src="${g.cover}" alt="${g.title}" />
                    <span class="library-platform">PS5</span>
                    <span class="library-format-tag">${g.format.split(' · ')[0]}</span>
                  </div>
                  <h2>${g.title}</h2>
                  <p>${g.meta}</p>
                  <p style="color:#78b4ff; margin-top:4rem;">${g.format}</p>
                </article>
              `,
              ).join('')}
            </div>
          </div>

          <div class="store-preview-lock-overlay">
            <div class="store-lock-glass-card">
              <div class="store-lock-logo-pair">
                <img src="./assets/restore-logo.png" alt="ReStore 官方 Logo" />
                <div class="store-lock-icon-badge">${ICONS.lock}</div>
              </div>
              <span class="badge gold">第一版范围锁定 · 仅供外观预览（只看不让用）</span>
              <h2>「网盘游戏」将在后续版本开放</h2>
              <p>
                百度网盘、夸克 TV 扫码授权及 PKG / 压缩包 / 挂载镜像自动处理将在第二阶段实现。<br/>
                当前您可通过 <code>L1 / R1</code> 浏览底层游戏封面网格与标签设计，所有内部点击均被锁定遮罩拦截。
              </p>
              <div class="hero-actions" style="margin-top:10rem; justify-content:center;">
                <button type="button" class="pill primary" data-action="switch-view" data-view="home">
                  ${ICONS.home}<span>返回首页概览</span>
                </button>
                <button type="button" class="pill secondary" data-action="switch-view" data-view="store-apps">
                  查看「软件商店」外观预览
                </button>
                <button type="button" class="pill sm brand" data-action="Intercepted-store-click">
                  测试点击拦截提示
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    `
  }

  function renderSettingsPage() {
    return `
      <main class="browse-page">
        <div class="page-title">
          <div>
            <h1>系统设置与恢复点保留策略</h1>
            <p>管理多备份位置、自动备份对象范围、恢复点手动锁定保护、空间不足自动清理规则及重新触发首次引导</p>
          </div>
          <div class="welcome-quick-actions">
            <button type="button" class="pill brand sm" data-action="restart-onboarding">
              🔄 重新开始首次引导流程
            </button>
          </div>
        </div>

        <div class="restore-workbench">
          <div class="onboarding-steps-panel">
            <div class="panel-card">
              <div class="panel-card-header">
                <h2>1. 备份位置管理与 WebDAV 手柄输入法配置</h2>
                <button type="button" class="pill sm secondary" data-action="open-webdav-osk" data-loc="lan">⌨️ 编辑 WebDAV 凭据</button>
              </div>
              <div class="restore-points-list">
                ${state.locations
                  .map(
                    (loc) => `
                  <div class="restore-point-item ${loc.enabled ? 'selected' : ''}">
                    <div class="rp-header">
                      <strong>${loc.name}</strong>
                      <div class="rp-badges">
                        <span class="badge ${loc.enabled ? 'green' : ''}">${loc.enabled ? '已启用独立同步' : '已暂停'}</span>
                        ${
                          loc.type === 'webdav'
                            ? `<button type="button" class="pill sm secondary" data-action="open-webdav-osk" data-loc="${loc.id}">手柄输入凭据</button>`
                            : ''
                        }
                        <button type="button" class="pill sm brand" data-action="toggle-location" data-loc="${loc.id}">
                          ${loc.enabled ? '禁用' : '启用'}
                        </button>
                      </div>
                    </div>
                    <div class="location-meta">路径：<code>${loc.endpoint}</code> · ${loc.freeSpace}</div>
                  </div>
                `,
                  )
                  .join('')}
              </div>
            </div>

            <div class="panel-card">
              <div class="panel-card-header">
                <h2>2. 空间不足自动清理与最后完整恢复点保护</h2>
                <button type="button" class="pill sm ${state.spaceLowSimulated ? 'brand' : 'secondary'}" data-action="toggle-space-alert">
                  ${state.spaceLowSimulated ? '已触发空间严重不足告警' : '模拟空间严重不足告警'}
                </button>
              </div>
              <p class="location-meta" style="font-size:15.5rem;">
                • 当某备份位置空间不足时，系统自动<strong>从旧到新清理未保护（未锁定）的恢复点</strong>及不再被任何保留点引用的数据块。<br/>
                • <strong>铁律保护</strong>：无论如何清理，始终保留该位置的<strong>最后一个完整恢复点</strong>，绝不删空可用备份。
              </p>
              ${
                state.spaceLowSimulated
                  ? `
                <div class="conflict-alert-box">
                  <div>
                    <strong style="display:block; font-size:17rem; color:#ffd4d2;">⚠️ USB 扩展存储 (/mnt/usb0) 空间严重不足</strong>
                    <span style="font-size:14rem; color:#e6c3c1;">已自动清理未保护的恢复点 #16（释放 380 MB），但剩余空间仍不足写入新快照；已保留最后完整恢复点 #18，且局域网/云端 WebDAV 继续正常同步不受影响。</span>
                  </div>
                  <span class="badge gold">互不阻塞</span>
                </div>
              `
                  : ''
              }
            </div>
          </div>

          <div class="onboarding-steps-panel">
            <div class="panel-card">
              <div class="panel-card-header">
                <h2>3. 恢复点手动保护（锁定后免于被自动清理）</h2>
                <span class="badge gold">点击切换 🔒 锁定状态</span>
              </div>
              <div class="restore-points-list">
                ${state.restorePoints
                  .map(
                    (rp) => `
                  <button type="button" class="restore-point-item ${rp.protected ? 'selected' : ''}" data-action="toggle-rp-protect" data-rp="${rp.id}">
                    <div class="rp-header">
                      <strong>${rp.title}</strong>
                      <span class="badge ${rp.protected ? 'gold' : ''}">${rp.protected ? '🔒 已手动保护（永不自动清理）' : '🔓 未保护（空间不足时按序清理）'}</span>
                    </div>
                    <div class="location-meta">${rp.time} · ${rp.size}</div>
                  </button>
                `,
                  )
                  .join('')}
              </div>
            </div>

            <div class="panel-card">
              <div class="panel-card-header">
                <h2>4. 自动变化检测与备份范围（已启用 ${state.autoBackupScope.length} / 5 类）</h2>
                <span class="badge green">未变化数据块自动复用</span>
              </div>
              <div class="filter-chips">
                ${FIVE_OBJECTS.map(
                  (obj) => `
                  <button
                    type="button"
                    class="chip ${state.autoBackupScope.includes(obj.id) ? 'active' : ''}"
                    data-action="toggle-auto-scope"
                    data-obj="${obj.id}"
                  >
                    ${state.autoBackupScope.includes(obj.id) ? '✓ ' : ''}${obj.title.slice(0, 10)}
                  </button>
                `,
                ).join('')}
              </div>
            </div>
          </div>
        </div>
      </main>
    `
  }

  function renderModal() {
    if (state.modal === 'webdav-osk') {
      const loc = state.locations.find((l) => l.id === state.editingLocationId) || state.locations[1]
      const keys = [
        ['http://', 'https://', '192.168.', ':5244', '/dav', '/ps5-restore', '.com', '退格'],
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'],
        ['n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
        ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '_', '/'],
      ]
      return `
        <div class="modal-backdrop" role="dialog" aria-modal="true" aria-label="PS5 手柄系统输入法配置 WebDAV">
          <div class="modal">
            <div class="rp-header" style="margin-bottom:8rem;">
              <span class="badge blue">PS5 原生系统输入法 (OSK) · 纯手柄填写</span>
              <span class="badge">不做手机扫码配 WebDAV</span>
            </div>
            <h2>配置 ${loc.name}</h2>
            <p>使用手柄十字键选择输入框与软键盘字符，按 ✕ 输入，按 □ 测试 WebDAV 连通性并保存。</p>
            <div class="osk-field-grid">
              <div class="osk-field">
                <label>WebDAV 服务器地址 (URL)</label>
                <input class="modal-input" type="text" id="osk-url" value="${state.oskForm.url}" data-osk-field="url" />
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:14rem;">
                <div class="osk-field">
                  <label>账号 (Username)</label>
                  <input class="modal-input" type="text" id="osk-user" value="${state.oskForm.user}" data-osk-field="user" />
                </div>
                <div class="osk-field">
                  <label>密码 / 应用令牌 (Password)</label>
                  <input class="modal-input" type="text" id="osk-pass" value="${state.oskForm.pass}" data-osk-field="pass" />
                </div>
              </div>
            </div>
            <div class="osk-keypad" aria-label="DualSense 手柄软键盘快捷输入">
              ${keys
                .map(
                  (row) => `
                <div class="osk-keypad-row">
                  ${row
                    .map(
                      (k) => `<button type="button" class="osk-key" data-action="osk-key" data-key="${k}">${k}</button>`,
                    )
                    .join('')}
                </div>
              `,
                )
                .join('')}
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:22rem;">
              <span class="badge green">✓ PROPFIND 连通性与读写权限核验通过 (28 ms)</span>
              <div class="welcome-quick-actions">
                <button type="button" class="pill secondary sm" data-action="close-modal">◯ 取消返回</button>
                <button type="button" class="pill primary sm" data-action="save-webdav-osk">✕ 验证连接并保存</button>
              </div>
            </div>
          </div>
        </div>
      `
    }

    if (state.modal === 'restore-result') {
      const retried = state.restoreResultRetried
      return `
        <div class="modal-backdrop" role="dialog" aria-modal="true" aria-label="恢复任务分类结果汇总">
          <div class="modal wide">
            <div class="rp-header" style="margin-bottom:8rem;">
              <span class="badge green">恢复任务执行完毕 · 分类结果汇总</span>
              <span class="badge blue">恢复点 #18 · 账号 17dfdf4e</span>
            </div>
            <h2>恢复完成分类汇总（已恢复 / 待处理 / 未完成）</h2>
            <p>所有可自动落盘项均已按依赖顺序提交生效；您可以查看各项状态或一键重试未完成项。</p>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:16rem;">
              <div class="panel-card" style="padding:20rem;">
                <div class="rp-header"><strong>✅ 已恢复</strong><span class="badge green">${retried ? '5 / 5 类全齐' : '4 类完整 + 18 款存档'}</span></div>
                <div class="restore-points-list" style="margin-top:12rem;">
                  <div class="location-meta">• <strong>ELF 插件与独立载荷</strong>：12 项 .elf、.auto_start 与 ShadowMountPlus 配置已启用生效</div>
                  <div class="location-meta">• <strong>游戏桌面展示</strong>：14 款游戏图标已重回 PS5 主界面（不含本体文件）</div>
                  <div class="location-meta">• <strong>全游戏通用存档</strong>：${retried ? '全部 19 款（含无槽新建 PFS 容器与跨账号重绑）' : '18 款存档槽已重绑账号并同步 savedata.db'}</div>
                  <div class="location-meta">• <strong>系统设置与媒体图库</strong>：离线激活、省电不待机与 86 项截图/视频已刷出</div>
                </div>
              </div>
              <div class="panel-card" style="padding:20rem;">
                <div class="rp-header"><strong>⏳ 待处理</strong><span class="badge gold">2 款外置盘待挂载</span></div>
                <div class="restore-points-list" style="margin-top:12rem;">
                  <div class="location-meta">• <strong>《战神：诸神黄昏》桌面图标已恢复</strong>：本体位于外置 M.2，插入对应存储后由 ShadowMountPlus 自动挂载即可启动</div>
                  <div class="location-meta">• <strong>《死亡回归》桌面图标已恢复</strong>：当前未安装游戏本体，仅保留主界面图标展示</div>
                </div>
              </div>
              <div class="panel-card" style="padding:20rem;">
                <div class="rp-header"><strong>${retried ? '🎉 未完成 (0)' : '⚠️ 未完成 (1)'}</strong><span class="badge ${retried ? 'green' : 'gold'}">${retried ? '已全部重试成功' : '可一键重试'}</span></div>
                <div class="restore-points-list" style="margin-top:12rem;">
                  ${
                    retried
                      ? `<div class="location-meta">• <strong>《最后生还者 Part I》(PPSA03396) SAVEFILE00</strong>：重试成功！容器内 param.sfo、savedata_prospero_meta 与 savedata.db 已完全对齐。</div>`
                      : `<div class="location-meta">• <strong>《最后生还者 Part I》(PPSA03396) SAVEFILE00</strong>：恢复期间游戏曾处于运行状态，现已关闭，点击下方按钮即可一键重试写回。</div>`
                  }
                </div>
              </div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:24rem;">
              <span class="location-meta">外部结果核验：FTP/加载器已响应 · 游戏读取列表时间/章节一致 · 媒体图库可直接播放</span>
              <div class="welcome-quick-actions">
                ${
                  !retried
                    ? `<button type="button" class="pill brand" data-action="retry-unfinished-items">🔄 一键重试未完成项 (1 项)</button>`
                    : ''
                }
                <button type="button" class="pill primary" data-action="finish-restore-and-close">✕ 完成并返回首页概览</button>
              </div>
            </div>
          </div>
        </div>
      `
    }
    return ''
  }

  function renderDualSenseBar() {
    const isStore = state.view === 'store-apps' || state.view === 'store-games'
    const contextText = state.lockScene.active
      ? '全屏专注恢复进度锁激活中 · 已屏蔽其他页面切换以防误触'
      : isStore
        ? '当前位于商店外观预览页 · 顶层半透明锁定遮罩已拦截内部操作'
        : `十字键/方向键 流转焦点 · L1/R1 (Q/E) 切换顶栏 · 当前已选 ${state.selectedObjects.length}/5 类恢复对象`

    return `
      <footer class="dualsense-bar" aria-label="DualSense 手柄常驻按键提示栏">
        <div class="dualsense-Context">
          <img src="./assets/restore-logo.png" alt="" style="width:28rem; height:28rem; border-radius:6rem;" />
          <span>${contextText}</span>
        </div>
        <div class="dualsense-prompts">
          <button type="button" class="ds-prompt" data-action="ds-cross">
            <span class="ds-glyph cross">✕</span><span>确认 / 选择</span>
          </button>
          <button type="button" class="ds-prompt" data-action="ds-circle">
            <span class="ds-glyph">◯</span><span>返回</span>
          </button>
          <button type="button" class="ds-prompt" data-action="ds-triangle">
            <span class="ds-glyph">△</span><span>选项 (立即备份)</span>
          </button>
          <button type="button" class="ds-prompt" data-action="ds-square">
            <span class="ds-glyph">□</span><span>操作 (全屏恢复锁/保护)</span>
          </button>
        </div>
      </footer>
    `
  }

  function renderPrototypeSwitcher() {
    return `
      <div class="prototype-switcher" role="region" aria-label="UI 原型变体切换器">
        <button type="button" data-action="prev-variant" title="上一视觉变体 (快捷键 [)">←</button>
        <div class="prototype-switcher-label">
          <b>${VARIANTS[state.variant]}</b>
          <span style="margin-left:8rem; color:#9bb5d8;">| 视图: ${state.lockScene.active ? 'restore-lock (专注锁)' : state.view} · 恢复点: ${state.selectedRestorePointId.replace('rp-2026', '')}</span>
        </div>
        <button type="button" data-action="next-variant" title="下一视觉变体 (快捷键 ])">→</button>
      </div>
    `
  }

  function renderMainScene() {
    if (state.lockScene.active) return renderRestoreLockScene()
    if (state.view === 'onboarding') return renderOnboardingPage()
    if (state.view === 'restore') return renderRestorePage()
    if (state.view === 'store-apps') return renderStoreAppsPage()
    if (state.view === 'store-games') return renderStoreGamesPage()
    if (state.view === 'settings') return renderSettingsPage()
    if (state.variant === 'B') return renderHomeVariantB()
    if (state.variant === 'C') return renderHomeVariantC()
    return renderHomeVariantA()
  }

  function render(reason = 'update') {
    const app = document.getElementById('app')
    if (!app) return
    const previous = window.PS5Motion ? window.PS5Motion.capture() : {}
    const isBrowse = state.lockScene.active || state.view !== 'home' || state.variant === 'C'

    app.innerHTML = `
      <div
        class="app-shell ${isBrowse ? 'browse-mode' : ''}"
        data-variant="${state.variant}"
        data-view="${state.lockScene.active ? 'restore-lock' : state.view}"
      >
        <div class="console-wallpaper" aria-hidden="true">
          <video src="./assets/ps5-showcase-excerpt.mp4" autoplay muted loop playsinline></video>
        </div>
        ${renderHeader()}
        ${renderSidebarNav()}
        ${renderMainScene()}
        ${renderDualSenseBar()}
        ${renderPrototypeSwitcher()}
        ${renderModal()}
      </div>
    `

    if (window.PS5Motion) {
      window.PS5Motion.animate(previous, reason)
    }
    syncUrl()
  }

  function cycleTab(delta) {
    if (state.lockScene.active) {
      showToast('正在执行恢复专注锁，已屏蔽 L1/R1 页面切换以防误触')
      return
    }
    const idx = NAV_TABS.findIndex((t) => t.id === state.view)
    const next = (idx + delta + NAV_TABS.length) % NAV_TABS.length
    state.view = NAV_TABS[next].id
    render('route')
  }

  function cycleVariant(delta) {
    const keys = ['A', 'B', 'C']
    const idx = keys.indexOf(state.variant)
    state.variant = keys[(idx + delta + keys.length) % keys.length]
    render('route')
    showToast(`已切换原型变体：${VARIANTS[state.variant]}`)
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]')
    if (!btn) return
    const action = btn.dataset.action

    switch (action) {
      case 'switch-view':
        if (state.lockScene.active) {
          showToast('正在恢复数据，请先退出或完成全屏恢复进度锁')
          return
        }
        state.view = btn.dataset.view
        render('route')
        break
      case 'prev-tab':
        cycleTab(-1)
        break
      case 'next-tab':
        cycleTab(1)
        break
      case 'prev-variant':
        cycleVariant(-1)
        break
      case 'next-variant':
        cycleVariant(1)
        break
      case 'select-launcher-tile':
        state.launcherTile = btn.dataset.tile
        render('select')
        break
      case 'set-onboarding-branch':
        state.onboardingBranch = btn.dataset.branch
        if (state.onboardingBranch === 'empty-rp') {
          state.selectedObjects = FIVE_OBJECTS.map((o) => o.id)
        }
        render('update')
        break
      case 'toggle-location': {
        const loc = state.locations.find((l) => l.id === btn.dataset.loc)
        if (loc) {
          loc.enabled = !loc.enabled
          showToast(`${loc.name} 已${loc.enabled ? '启用' : '暂停'}`)
          render('update')
        }
        break
      }
      case 'select-location':
        state.selectedLocationId = btn.dataset.loc
        render('update')
        break
      case 'select-rp':
        state.selectedRestorePointId = btn.dataset.rp
        render('update')
        break
      case 'toggle-object': {
        const id = btn.dataset.obj
        if (state.selectedObjects.includes(id)) {
          if (state.selectedObjects.length > 1) {
            state.selectedObjects = state.selectedObjects.filter((x) => x !== id)
          } else {
            showToast('请至少保留一项需要恢复或备份的对象')
          }
        } else {
          state.selectedObjects = [...state.selectedObjects, id]
        }
        render('update')
        break
      }
      case 'select-all-objects':
        state.selectedObjects = FIVE_OBJECTS.map((o) => o.id)
        showToast('已全选全部五类核心对象（整机恢复）')
        render('update')
        break
      case 'go-restore-from-onboarding':
        state.view = 'restore'
        render('route')
        showToast('已载入最近一次完整恢复点 #18')
        break
      case 'trigger-initial-backup':
      case 'manual-backup':
        showToast('已触发后台增量备份：未变化数据块自动复用，正独立同步至 USB 与 WebDAV')
        break
      case 'start-lock-demo':
        state.lockScene.active = true
        state.lockScene.mode = btn.dataset.mode || 'normal'
        state.lockScene.progress = state.lockScene.mode === 'resumed' ? 76 : 68
        render('route')
        break
      case 'set-lock-mode':
        state.lockScene.mode = btn.dataset.mode
        state.lockScene.progress = state.lockScene.mode === 'resumed' ? 76 : 68
        render('update')
        break
      case 'resolve-conflict-continue':
        state.lockScene.mode = 'normal'
        state.lockScene.progress = 92
        state.lockScene.currentDetail = '《最后生还者 Part I》已关闭，正在完成 SAVEFILE00 容器挂载与 savedata.db 同步'
        showToast('冲突已解除，正在继续写回存档容器')
        render('update')
        break
      case 'exit-lock-scene':
        state.lockScene.active = false
        render('route')
        break
      case 'open-restore-result-modal':
        state.restoreResultRetried = false
        state.modal = 'restore-result'
        render('update')
        break
      case 'retry-unfinished-items':
        state.restoreResultRetried = true
        state.lockScene.progress = 100
        showToast('重试成功：《最后生还者 Part I》SAVEFILE00 已完成恢复与数据库对齐')
        render('update')
        break
      case 'finish-restore-and-close':
        state.modal = null
        state.lockScene.active = false
        state.view = 'home'
        render('route')
        showToast('整机恢复已完成，所有生效结果已同步')
        break
      case 'open-webdav-osk':
        state.editingLocationId = btn.dataset.loc || 'lan'
        state.modal = 'webdav-osk'
        render('update')
        break
      case 'osk-key': {
        const k = btn.dataset.key
        const field = state.oskForm.activeField || 'url'
        if (k === '退格') {
          state.oskForm[field] = state.oskForm[field].slice(0, -1)
        } else {
          state.oskForm[field] += k
        }
        render('update')
        break
      }
      case 'save-webdav-osk': {
        const urlInput = document.getElementById('osk-url')
        if (urlInput) state.oskForm.url = urlInput.value
        const loc = state.locations.find((l) => l.id === state.editingLocationId)
        if (loc) {
          loc.endpoint = state.oskForm.url
          loc.enabled = true
          loc.status = 'connected'
          loc.progress = 100
          loc.statusText = '已验证连接 · 独立同步完成 100%'
        }
        state.modal = null
        showToast('WebDAV 凭据已通过手柄输入法保存并验证连通')
        render('update')
        break
      }
      case 'close-modal':
        state.modal = null
        render('update')
        break
      case 'Intercepted-store-click':
        showToast('🔒 当前版本仅供外观预览，商店后台下载功能将在第二阶段开放')
        break
      case 'toggle-rp-protect': {
        const rp = state.restorePoints.find((r) => r.id === btn.dataset.rp)
        if (rp) {
          rp.protected = !rp.protected
          showToast(`${rp.title.split(' · ')[0]} 已${rp.protected ? '设为手动保护 🔒' : '解除手动保护'}`)
          render('update')
        }
        break
      }
      case 'toggle-space-alert':
        state.spaceLowSimulated = !state.spaceLowSimulated
        render('update')
        break
      case 'toggle-auto-scope': {
        const id = btn.dataset.obj
        state.autoBackupScope = state.autoBackupScope.includes(id)
          ? state.autoBackupScope.filter((x) => x !== id)
          : [...state.autoBackupScope, id]
        render('update')
        break
      }
      case 'restart-onboarding':
        state.lockScene.active = false
        state.view = 'onboarding'
        render('route')
        showToast('已重新进入首次引导配置流程')
        break
      case 'ds-cross': {
        const focused = document.querySelector('[data-pad-focus="true"]') || document.activeElement
        if (focused && focused !== document.body && typeof focused.click === 'function') {
          focused.click()
        } else {
          showToast('按方向键移动手柄焦点，按 ✕ / Enter 触发当前高亮卡片')
        }
        break
      }
      case 'ds-circle':
        if (state.modal) {
          state.modal = null
          render('update')
        } else if (state.lockScene.active) {
          state.lockScene.active = false
          render('route')
        } else if (state.view !== 'home') {
          state.view = 'home'
          render('route')
        }
        break
      case 'ds-triangle':
        showToast('△ 快捷操作：已向后台载荷发起手动增量备份')
        break
      case 'ds-square':
        if (state.view === 'restore' && !state.lockScene.active) {
          state.lockScene.active = true
          state.lockScene.mode = 'normal'
          render('route')
        } else {
          const rp = state.restorePoints.find((r) => r.id === state.selectedRestorePointId)
          if (rp) {
            rp.protected = !rp.protected
            showToast(`□ 快捷锁定：${rp.title.split(' · ')[0]} ${rp.protected ? '🔒 已保护' : '已解锁'}`)
            render('update')
          }
        }
        break
    }
  })

  // Spatial D-pad / Arrow Key Navigation + L1/R1 (Q/E) + Variant Switch ([/])
  function moveFocusSpatially(dir) {
    const candidates = [
      ...document.querySelectorAll(
        '#app button:not([disabled]), #app input:not([disabled]), #app select:not([disabled])',
      ),
    ].filter((el) => {
      const r = el.getBoundingClientRect()
      return r.width > 0 && r.height > 0
    })
    if (!candidates.length) return

    let current =
      document.querySelector('[data-pad-focus="true"]') ||
      (candidates.includes(document.activeElement) ? document.activeElement : null)

    if (!current) {
      candidates[0].dataset.padFocus = 'true'
      candidates[0].focus({ preventScroll: false })
      return
    }

    const cr = current.getBoundingClientRect()
    const cx = cr.left + cr.width / 2
    const cy = cr.top + cr.height / 2

    let best = null
    let bestScore = Infinity

    for (const el of candidates) {
      if (el === current) continue
      const r = el.getBoundingClientRect()
      const ex = r.left + r.width / 2
      const ey = r.top + r.height / 2
      const dx = ex - cx
      const dy = ey - cy

      if (dir === 'right' && dx <= 8) continue
      if (dir === 'left' && dx >= -8) continue
      if (dir === 'down' && dy <= 8) continue
      if (dir === 'up' && dy >= -8) continue

      const primary = dir === 'left' || dir === 'right' ? Math.abs(dx) : Math.abs(dy)
      const secondary = dir === 'left' || dir === 'right' ? Math.abs(dy) : Math.abs(dx)
      const score = primary + secondary * 2.35
      if (score < bestScore) {
        bestScore = score
        best = el
      }
    }

    const next = best || candidates[0]
    document.querySelectorAll('[data-pad-focus="true"]').forEach((n) => delete n.dataset.padFocus)
    next.dataset.padFocus = 'true'
    next.focus({ preventScroll: false })
    if (next.classList.contains('launch-tile') && next.dataset.tile) {
      state.launcherTile = next.dataset.tile
      render('select')
    }
  }

  document.addEventListener('keydown', (e) => {
    const tag = e.target?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA') {
      if (e.key === 'Escape') {
        state.modal = null
        render('update')
      }
      return
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault()
      moveFocusSpatially('right')
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      moveFocusSpatially('left')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      moveFocusSpatially('down')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      moveFocusSpatially('up')
    } else if (e.key === 'q' || e.key === 'Q') {
      e.preventDefault()
      cycleTab(-1)
    } else if (e.key === 'e' || e.key === 'E') {
      e.preventDefault()
      cycleTab(1)
    } else if (e.key === '[') {
      e.preventDefault()
      cycleVariant(-1)
    } else if (e.key === ']') {
      e.preventDefault()
      cycleVariant(1)
    } else if (e.key === 'Escape' || e.key === 'Backspace') {
      e.preventDefault()
      document.querySelector('[data-action="ds-circle"]')?.click()
    } else if (e.key === 't' || e.key === 'T') {
      e.preventDefault()
      document.querySelector('[data-action="ds-triangle"]')?.click()
    } else if (e.key === 'f' || e.key === 'F') {
      e.preventDefault()
      document.querySelector('[data-action="ds-square"]')?.click()
    }
  })

  render('initial')
})()
