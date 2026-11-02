/* Plan: Three structurally distinct Apple tvOS × PS5 variants of ReStore (#37), switchable via `?variant=A|B|C` and a floating bottom switcher.
   - VariantA：tvOS 液态玻璃画境（Apple TV 开放展台 + 右侧三层液态设备条 + 底部全宽毛玻璃托盘四纯图标卡）
   - VariantB：Bento 空间控制坞（visionOS 对称环形容量矩阵 + 底部居中常驻四纯图标控制坞）
   - VariantC：PS5 极简全画幅光域（全景四联横置仪器舱 + 无外框独立水晶大磁贴 + 焦点联动氛围光） */
;(() => {
  'use strict'

  const ICONS = {
    restore:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3.5 2"/></svg>',
    apps: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 16.5 9 5 9-5"/></svg>',
    store:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1.3 11.4a2 2 0 0 1-2 1.8H8.3a2 2 0 0 1-2-1.8L5 8Z"/><path d="M9 8V5.8a3 3 0 0 1 6 0V8"/></svg>',
    other:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="17" x2="20" y2="17"/><circle cx="9" cy="7" r="2.6" fill="currentColor"/><circle cx="15" cy="17" r="2.6" fill="currentColor"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="3"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    usb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v14"/><path d="m9 6 3-3 3 3"/><path d="M7 10v3l5 3"/><path d="M17 9v3l-5 3"/><circle cx="12" cy="19" r="2.2"/></svg>',
    cloud:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 18.5h9.8a4.2 4.2 0 0 0 .4-8.4A5.8 5.8 0 0 0 6.3 8.9 4.6 4.6 0 0 0 7.5 18.5Z"/></svg>',
    ssd: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="3"/><path d="M7 14h4"/><circle cx="16.5" cy="14" r="1.2" fill="currentColor"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4.5 13H12l-1 9 8.5-11H12l1-9Z"/></svg>',
    save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h11l3 3v13a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 4 20V5.5A1.5 1.5 0 0 1 5.5 4Z"/><path d="M8 4v6h8V4"/><path d="M8 21v-6h8v6"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7.5" height="7.5" rx="2.2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2.2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2.2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.2"/></svg>',
    media:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="8.5" cy="10" r="1.6"/><path d="m21 16-5.2-5.2L7 19"/></svg>',
    settings:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.4 1Z"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9.5v5"/><circle cx="12" cy="17.2" r="1"/></svg>',
    check:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    shield:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6.5v5.8c0 5 3.4 9.3 8 10.7 4.6-1.4 8-5.7 8-10.7V6.5L12 3Z"/></svg>',
  }

  /* 四个最下方卡片专属立体纯图形徽标（Apple TV 多层质感 × PS5 几何语言，卡片内零文字） */
  const DOCK_EMBLEMS = {
    restore: `
      <svg class="dock-emblem" viewBox="0 0 88 88" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="emb-res-ring" x1="14" y1="12" x2="74" y2="76" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#FFFFFF"/>
            <stop offset="100%" stop-color="#93C5FD"/>
          </linearGradient>
          <linearGradient id="emb-res-core" x1="28" y1="26" x2="60" y2="62" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#E0F2FE" stop-opacity="0.95"/>
            <stop offset="100%" stop-color="#60A5FA" stop-opacity="0.45"/>
          </linearGradient>
        </defs>
        <circle cx="44" cy="44" r="30" fill="url(#emb-res-core)" fill-opacity="0.22"/>
        <path d="M18.5 44C18.5 29.9 29.9 18.5 44 18.5C58.1 18.5 69.5 29.9 69.5 44C69.5 58.1 58.1 69.5 44 69.5C34.2 69.5 25.7 64 21.4 55.8" stroke="url(#emb-res-ring)" stroke-width="6.2" stroke-linecap="round"/>
        <path d="M16 21V36.5H31.5" stroke="#FFFFFF" stroke-width="6.2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M44 30.5V45L54.5 51" stroke="#FFFFFF" stroke-width="6.2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    apps: `
      <svg class="dock-emblem" viewBox="0 0 88 88" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="emb-app-top" x1="20" y1="16" x2="68" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#67E8F9"/>
            <stop offset="100%" stop-color="#38BDF8"/>
          </linearGradient>
          <linearGradient id="emb-app-mid" x1="18" y1="36" x2="70" y2="62" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#34D399"/>
            <stop offset="100%" stop-color="#0EA5E9"/>
          </linearGradient>
        </defs>
        <path d="M44 50L72 35.5L44 21L16 35.5L44 50Z" fill="url(#emb-app-top)"/>
        <path d="M16 46.5L44 61L72 46.5" stroke="url(#emb-app-mid)" stroke-width="6.2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16 58L44 72.5L72 58" stroke="#E2E8F0" stroke-opacity="0.78" stroke-width="6.2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    store: `
      <svg class="dock-emblem" viewBox="0 0 88 88" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="emb-bag-body" x1="22" y1="28" x2="66" y2="74" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.96"/>
            <stop offset="100%" stop-color="#C7D2FE" stop-opacity="0.82"/>
          </linearGradient>
        </defs>
        <path d="M32.5 31V26.5C32.5 20.1 37.6 15 44 15C50.4 15 55.5 20.1 55.5 26.5V31" stroke="#FFFFFF" stroke-width="5.8" stroke-linecap="round"/>
        <rect x="20" y="29" width="48" height="43" rx="13" fill="url(#emb-bag-body)"/>
        <path d="M44 41L47.1 47.6L54.4 48.5L49 53.6L50.4 60.8L44 57.3L37.6 60.8L39 53.6L33.6 48.5L40.9 47.6L44 41Z" fill="#2563EB"/>
      </svg>
    `,
    other: `
      <svg class="dock-emblem" viewBox="0 0 88 88" fill="none" aria-hidden="true">
        <rect x="16" y="25" width="56" height="12" rx="6" fill="#FFFFFF" fill-opacity="0.22"/>
        <rect x="16" y="51" width="56" height="12" rx="6" fill="#FFFFFF" fill-opacity="0.22"/>
        <rect x="16" y="25" width="26" height="12" rx="6" fill="#60A5FA"/>
        <rect x="44" y="51" width="28" height="12" rx="6" fill="#93C5FD"/>
        <circle cx="38" cy="31" r="10.5" fill="#FFFFFF"/>
        <circle cx="50" cy="57" r="10.5" fill="#FFFFFF"/>
      </svg>
    `,
  }

  /* 右上角类 Apple TV Memoji 质感头像 SVG */
  const AVATAR_SVG = `
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="20" fill="url(#av-bg)"/>
      <defs>
        <linearGradient id="av-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FFE0CC"/>
          <stop offset="100%" stop-color="#D7B4F8"/>
        </linearGradient>
      </defs>
      <path d="M9 38C9.8 31.5 14.3 28 20 28C25.7 28 30.2 31.5 31 38" fill="#1E293B"/>
      <circle cx="20" cy="18.5" r="8.2" fill="#FCD5B8"/>
      <path d="M11.6 17.5C11.6 11.8 15.2 8.8 20 8.8C24.8 8.8 28.4 11.8 28.4 17.5C26.7 15.1 23.7 14 20 14C16.3 14 13.3 15.1 11.6 17.5Z" fill="#1E2430"/>
      <circle cx="17.1" cy="18.8" r="1.15" fill="#1E2430"/>
      <circle cx="22.9" cy="18.8" r="1.15" fill="#1E2430"/>
      <path d="M17.6 22.3C18.9 23.4 21.1 23.4 22.4 22.3" stroke="#9A5B4A" stroke-width="1.4" stroke-linecap="round"/>
    </svg>
  `

  /* 四个最下方纯图标卡片（顺序：恢复、软件、商店、其他） */
  const DOCK_ITEMS = [
    { id: 'restore', label: '恢复' },
    { id: 'apps', label: '软件', lockedPreview: true },
    { id: 'store', label: '商店', lockedPreview: true },
    { id: 'other', label: '其他' },
  ]

  const VARIANTS = [
    { key: 'A', name: 'tvOS 液态玻璃画境' },
    { key: 'B', name: 'Bento 空间控制坞' },
    { key: 'C', name: 'PS5 极简全画幅光域' },
  ]

  const FIVE_OBJECTS = [
    {
      id: 'elf',
      order: 1,
      title: '系统插件与载荷',
      countText: '12 项插件与自启服务',
      icon: 'bolt',
      size: '48 MB',
      desc: '还原宿主环境、插件服务、自启状态与外置游戏扫描配置，恢复后立即生效。',
    },
    {
      id: 'desktop',
      order: 2,
      title: '游戏桌面展示',
      countText: '14 款桌面游戏图标',
      icon: 'grid',
      size: '64 MB',
      desc: '在主界面与游戏库还原原有游戏图标和列表记录。',
      note: '仅恢复桌面图标，不含游戏本体',
    },
    {
      id: 'saves',
      order: 3,
      title: '全游戏通用存档',
      countText: '19 款游戏 · 46 个存档',
      icon: 'save',
      size: '1.4 GB',
      desc: '自动绑定当前主机账号，支持尚未启动过的游戏直接恢复存档并对齐进度。',
    },
    {
      id: 'settings',
      order: 4,
      title: '系统与账号设置',
      countText: '离线激活与系统偏好',
      icon: 'settings',
      size: '6 MB',
      desc: '还原账号离线激活状态、省电待机设置、显示、音频与系统语言偏好。',
    },
    {
      id: 'media',
      order: 5,
      title: '媒体图库',
      countText: '86 项截图与视频',
      icon: 'media',
      size: '3.9 GB',
      desc: '还原游戏截图与视频记录，恢复后可在系统媒体图库中直接浏览播放。',
    },
  ]

  const STORE_APPS = [
    {
      name: 'etaHEN',
      version: 'v2.0B · 系统宿主',
      category: '系统载荷',
      art: './assets/etahen-icon.jpg',
      size: '3.4 MB',
      desc: '集成式自制宿主服务，提供插件加载、远程传输与工具箱管理。',
    },
    {
      name: 'ShadowMountPlus',
      version: 'v1.4.2 · 挂载服务',
      category: '系统载荷',
      art: './assets/ps5-payload-dev.png',
      size: '410 KB',
      desc: '自动扫描外置存储中的游戏目录与镜像文件，并挂载至主界面。',
    },
    {
      name: 'ezRemote Client',
      version: 'v2.17 · 文件管理',
      category: '独立应用',
      art: './assets/idlesauce.png',
      size: '28.6 MB',
      desc: '支持局域网与网盘文件访问、压缩包解压与软件包安装。',
    },
    {
      name: 'FTP 服务插件',
      version: 'v1.2.0 · 随宿主自启',
      category: '扩展插件',
      art: './assets/Cryptogenic.png',
      size: '198 KB',
      desc: '后台高速文件传输服务，支持全天候无线管理主机存储。',
    },
    {
      name: 'ELF 后台加载器',
      version: 'v0.19 · 守护服务',
      category: '系统载荷',
      art: './assets/ps5-payload-dev.png',
      size: '245 KB',
      desc: '支持在关闭入口应用后持续稳定运行后台服务。',
    },
    {
      name: 'NTP 时间同步插件',
      version: 'v1.1.0 · 随宿主自启',
      category: '扩展插件',
      art: './assets/restore-logo.png',
      size: '160 KB',
      desc: '开机自动校准系统时钟，确保存档时间与备份记录准确一致。',
    },
  ]

  const STORE_GAMES = [
    { id: 'astro-bot', title: '宇宙机器人', meta: '动作冒险 · 36.4 GB', cover: './assets/games/astro-bot/cover.png' },
    { id: 'ratchet', title: '瑞奇与叮当：时空跳转', meta: '动作射击 · 33.8 GB', cover: './assets/games/ratchet-and-clank-rift-apart/cover.png' },
    { id: 'returnal', title: '死亡回归', meta: '科幻射击 · 52.1 GB', cover: './assets/games/returnal/cover.png' },
    { id: 'gow', title: '战神：诸神黄昏', meta: '动作角色扮演 · 84.2 GB', cover: './assets/games/god-of-war-ragnarok/cover.png' },
    { id: 'horizon', title: '地平线：西之绝境', meta: '开放世界 · 79.5 GB', cover: './assets/games/horizon-forbidden-west/cover.png' },
    { id: 'spiderman2', title: '漫威蜘蛛侠 2', meta: '动作冒险 · 68.0 GB', cover: './assets/games/marvels-spider-man-2/cover.png' },
  ]

  function normalizeView(v) {
    if (!v || v === 'home') return 'home'
    if (v === 'restore') return 'restore'
    if (v === 'apps' || v === 'store-apps') return 'apps'
    if (v === 'store' || v === 'store-games') return 'store'
    if (v === 'other' || v === 'settings') return 'other'
    return 'home'
  }

  function formatAppleClock() {
    const now = new Date()
    let hours = now.getHours()
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const period = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12 || 12
    return `${hours}:${minutes} ${period}`
  }

  const urlParams = new URLSearchParams(window.location.search)
  const rawVariant = (urlParams.get('variant') || 'A').toUpperCase()
  const initialVariant = VARIANTS.some((v) => v.key === rawVariant) ? rawVariant : 'A'
  const rawView = urlParams.get('view')
  const initialOnboardingOpen = rawView === 'onboarding' || urlParams.get('onboarding') === '1'
  const initialLockMode = urlParams.get('lock')
  const initialModal = urlParams.get('modal')

  const state = {
    variant: initialVariant,
    view: normalizeView(rawView),
    focusedDockId: 'restore',
    devDockCollapsed: true,
    onboardingOpen: initialOnboardingOpen,
    onboardingHasRp: urlParams.get('branch') !== 'empty-rp',
    selectedLocationId: 'usb',
    selectedRestorePointId: 'rp-18',
    selectedObjects: ['elf', 'desktop', 'saves', 'settings', 'media'],
    autoBackupScope: ['elf', 'desktop', 'saves', 'settings', 'media'],
    spaceLowSimulated: false,
    hostStorage: {
      name: 'PS5 主机内置存储',
      free: '218 GB',
      total: '825 GB',
      usedPercent: 74,
      daemonText: '守护服务常驻运行中',
    },
    lockScene: {
      active: ['normal', 'conflict', 'resumed'].includes(initialLockMode),
      mode: ['normal', 'conflict', 'resumed'].includes(initialLockMode) ? initialLockMode : 'normal',
      progress: initialLockMode === 'resumed' ? 76 : 68,
      currentDetail: '正在还原《最后生还者 Part I》游戏存档（第 14 / 19 款）',
    },
    modal: ['webdav-osk', 'restore-result'].includes(initialModal) ? initialModal : null,
    editingLocationId: 'lan',
    oskForm: {
      url: 'http://192.168.50.10:5244/dav/restore',
      user: 'YunPeng',
      pass: '••••••••••••',
      activeField: 'url',
    },
    restoreResultRetried: false,
    locations: [
      {
        id: 'usb',
        name: 'USB 存储设备',
        endpoint: '前置高速接口 · exFAT',
        type: 'usb',
        enabled: true,
        status: 'connected',
        statusText: '已接入 · 已同步最新备份',
        progress: 100,
        lastSync: '今天 19:10',
        freeOnly: '184 GB',
        totalOnly: '256 GB',
        freeSpace: '184 GB 可用 / 256 GB',
        usedPercent: 28,
        freePercent: 72,
      },
      {
        id: 'lan',
        name: '局域网 WebDAV',
        endpoint: '192.168.50.10 · NAS',
        type: 'webdav',
        enabled: true,
        status: 'connected',
        statusText: '在线 · 已同步最新备份',
        progress: 100,
        lastSync: '今天 19:11',
        freeOnly: '1.8 TB',
        totalOnly: '4.0 TB',
        freeSpace: '1.8 TB 可用 / 4.0 TB',
        usedPercent: 55,
        freePercent: 45,
      },
      {
        id: 'cloud',
        name: '云端 WebDAV',
        endpoint: '加密远端存储池',
        type: 'webdav',
        enabled: true,
        status: 'syncing',
        statusText: '在线 · 后台同步中 74%',
        progress: 74,
        lastSync: '今天 16:40',
        freeOnly: '412 GB',
        totalOnly: '1.0 TB',
        freeSpace: '412 GB 可用 / 1.0 TB',
        usedPercent: 59,
        freePercent: 41,
      },
    ],
    restorePoints: [
      {
        id: 'rp-18',
        title: '今天 19:10 自动备份',
        note: '关闭《最后生还者 Part I》后生成',
        isLatestComplete: true,
        protected: true,
        size: '5.4 GB',
        summary: '包含全部 5 类数据（12 项插件、19 款存档、14 款图标、系统设置、86 项媒体）',
      },
      {
        id: 'rp-17',
        title: '今天 16:40 自动备份',
        note: '更新游戏扫描路径后生成',
        isLatestComplete: false,
        protected: true,
        size: '5.2 GB',
        summary: '包含全部 5 类数据 · 三个备份位置均已同步完成',
      },
      {
        id: 'rp-16',
        title: '昨天 23:05 手动备份',
        note: '调整系统环境前手动创建',
        isLatestComplete: false,
        protected: false,
        size: '5.1 GB',
        summary: '包含全部 5 类数据 · 未锁定保护，空间不足时优先自动清理',
      },
    ],
  }

  let toastTimer = null
  function showToast(msg) {
    const el = document.getElementById('toast')
    if (!el) return
    el.innerHTML = `${ICONS.check}<span>${msg}</span>`
    el.classList.add('show')
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600)
  }

  function syncUrl() {
    const u = new URL(window.location.href)
    u.searchParams.set('variant', state.variant)
    u.searchParams.set('view', state.onboardingOpen ? 'onboarding' : state.view)
    if (state.lockScene.active) {
      u.searchParams.set('lock', state.lockScene.mode)
    } else {
      u.searchParams.delete('lock')
    }
    window.history.replaceState({}, '', u)
  }

  /* ==================== 顶栏：右上角严格只有「时间 + 头像」 ==================== */
  function renderHeader() {
    const currentDock = DOCK_ITEMS.find((d) => d.id === state.view)
    let leftSlot = '<div></div>'

    if (state.lockScene.active) {
      leftSlot = `
        <div class="header-subview-title">
          <h1>正在恢复数据</h1>
        </div>
      `
    } else if (state.view === 'home') {
      if (state.variant === 'A') {
        leftSlot = `
          <div class="header-stage-brand">
            <span class="header-wordmark">ReStore</span>
          </div>
        `
      }
    } else if (currentDock) {
      leftSlot = `
        <div class="header-subview-title">
          <h1>${currentDock.label}</h1>
          <span class="badge muted">按 ◯ 返回主界面</span>
        </div>
      `
    }

    return `
      <header class="system-header">
        ${leftSlot}
        <div class="tvos-time-avatar-pill" aria-label="系统时间与当前账号头像">
          <time class="tvos-clock">${formatAppleClock()}</time>
          <div class="tvos-avatar">${AVATAR_SVG}</div>
        </div>
      </header>
    `
  }

  /* ==================== 底部四个纯 ICON 卡片渲染器（卡片内严格只有 ICON，零文字） ==================== */
  function renderFourIconCards() {
    return DOCK_ITEMS.map((item) => {
      const isRouteActive = state.view === item.id && !state.lockScene.active
      return `
        <button
          type="button"
          class="dock-icon-card ${isRouteActive ? 'is-active-route' : ''}"
          data-action="open-dock-item"
          data-dock-id="${item.id}"
          aria-label="${item.label}"
          title="${item.label}"
        >
          ${DOCK_EMBLEMS[item.id]}
        </button>
      `
    }).join('')
  }

  /* ==================== Variant A：tvOS 液态玻璃画境（主屏：上中无交互概览 + 下方全宽毛玻璃四图标托盘） ==================== */
  function VariantAHome() {
    const latestRp = state.restorePoints[0]
    const enabledCount = state.locations.filter((l) => l.enabled).length

    return `
      <main class="home-stage">
        <section class="overview-showcase" aria-label="设备与存储状态概览">
          <div class="va-overview-layout">
            <div class="va-hero-left">
              <div class="va-eyebrow">
                <i class="status-dot-inline"></i>
                <span>${state.hostStorage.daemonText} · ${enabledCount} 个备份位置已启用</span>
              </div>
              <h1 class="va-hero-headline">整机数据保护已就绪</h1>
              <p class="va-hero-sub">
                最近完整恢复点生成于 ${latestRp.title.replace(' 自动备份', '')}，共保护 12 项插件、19 款游戏存档、14 款桌面图标、系统设置与 86 项媒体记录。
              </p>
              <div class="va-host-strip">
                <div class="va-host-metric">
                  <strong>${state.hostStorage.free}</strong>
                  <span>PS5 内置存储可用 / 共 ${state.hostStorage.total}</span>
                </div>
                <div class="va-host-divider"></div>
                <div class="va-host-metric">
                  <strong>${latestRp.size}</strong>
                  <span>最新完整快照体积</span>
                </div>
                <div class="va-host-divider"></div>
                <div class="va-host-metric">
                  <strong>5 / 5 类</strong>
                  <span>保护范围全部开启</span>
                </div>
              </div>
            </div>

            <div class="va-devices-stack">
              ${state.locations
                .map((loc) => {
                  const dotClass = !loc.enabled ? 'paused' : loc.status === 'syncing' ? 'syncing' : ''
                  const stateLabel = !loc.enabled ? '已暂停同步' : loc.statusText
                  return `
                    <div class="va-device-glass-card">
                      <div class="va-device-top">
                        <div class="va-device-name">
                          ${loc.type === 'usb' ? ICONS.usb : ICONS.cloud}
                          <span>${loc.name}</span>
                        </div>
                        <div class="va-device-state">
                          <i class="status-dot-inline ${dotClass}"></i>
                          <span>${stateLabel}</span>
                        </div>
                      </div>
                      <div class="liquid-meter">
                        <i style="width:${loc.usedPercent}%"></i>
                      </div>
                      <div class="va-device-meta">
                        <span>${loc.freeSpace}</span>
                        <span>${loc.endpoint} · 最近同步 ${loc.lastSync}</span>
                      </div>
                    </div>
                  `
                })
                .join('')}
            </div>
          </div>
        </section>

        <nav class="bottom-dock-zone va-dock-tray" aria-label="底部主功能卡片">
          ${renderFourIconCards()}
        </nav>
      </main>
    `
  }

  /* ==================== Variant B：Bento 空间控制坞（对称毛玻璃环形矩阵 + 常驻居中四图标 Dock） ==================== */
  function renderRadialGauge(freePercent, accentColor) {
    const r = 33
    const c = 2 * Math.PI * r
    const usedPercent = 100 - freePercent
    const dash = (usedPercent / 100) * c
    return `
      <svg class="vb-radial-svg" viewBox="0 0 82 82" aria-hidden="true">
        <circle cx="41" cy="41" r="${r}" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="8"/>
        <circle
          cx="41"
          cy="41"
          r="${r}"
          fill="none"
          stroke="${accentColor}"
          stroke-width="8"
          stroke-linecap="round"
          stroke-dasharray="${dash.toFixed(1)} ${c.toFixed(1)}"
          transform="rotate(-90 41 41)"
        />
        <text x="41" y="45" text-anchor="middle" fill="#F8FAFC" font-size="16" font-weight="600">${freePercent}%</text>
      </svg>
    `
  }

  function VariantBHome() {
    const latestRp = state.restorePoints[0]
    const ringColors = ['#38BDF8', '#60A5FA', '#818CF8']

    return `
      <main class="home-stage">
        <section class="overview-showcase" aria-label="Bento 存储与设备状态矩阵">
          <div class="vb-bento-grid">
            <div class="vb-bento-card span-2">
              <div class="vb-bento-head">
                <span class="vb-bento-label">${ICONS.ssd}<span>PS5 主机内置存储与受保护数据构成</span></span>
                <span class="badge blue">ReStore 整机概览</span>
              </div>
              <div style="display:flex; align-items:baseline; justify-content:space-between; gap:20rem;">
                <div class="vb-bento-big">${state.hostStorage.free} 可用 <span style="font-size:19rem; font-weight:400; color:#9fb0c6;">/ 共 ${state.hostStorage.total}</span></div>
                <span style="font-size:15rem; color:#bcd0ea;">受保护数据总计 5.4 GB</span>
              </div>
              <div class="vb-spectrum-bar">
                <div class="vb-spectrum-seg" style="width:48%; background:#475569;"></div>
                <div class="vb-spectrum-seg" style="width:14%; background:#3B82F6;"></div>
                <div class="vb-spectrum-seg" style="width:8%; background:#38BDF8;"></div>
                <div class="vb-spectrum-seg" style="width:4%; background:#818CF8;"></div>
              </div>
              <div class="vb-spectrum-legend">
                <span class="vb-legend-item"><i class="vb-legend-swatch" style="background:#3B82F6;"></i>媒体图库 3.9 GB</span>
                <span class="vb-legend-item"><i class="vb-legend-swatch" style="background:#38BDF8;"></i>通用存档 1.4 GB</span>
                <span class="vb-legend-item"><i class="vb-legend-swatch" style="background:#818CF8;"></i>插件与桌面 112 MB</span>
                <span class="vb-legend-item"><i class="vb-legend-swatch" style="background:#475569;"></i>系统与游戏本体 601 GB</span>
              </div>
            </div>

            <div class="vb-bento-card">
              <div class="vb-bento-head">
                <span class="vb-bento-label">${ICONS.shield}<span>守护服务与最新恢复点</span></span>
                <span class="badge green">运行正常</span>
              </div>
              <div>
                <div class="vb-bento-big" style="font-size:31rem;">${latestRp.title.replace(' 自动备份', '')}</div>
                <p style="margin:8rem 0 0; font-size:14.5rem; color:#a6b5c9; line-height:1.5;">
                  ${latestRp.note}，退出游戏且存档写入稳定后自动增量同步。
                </p>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:14rem; color:#94a6be; padding-top:10rem; border-top:1rem solid rgba(255,255,255,0.08);">
                <span>已启用 ${state.locations.filter((l) => l.enabled).length} / 3 个位置</span>
                <span>锁定保护 ${state.restorePoints.filter((r) => r.protected).length} 份</span>
              </div>
            </div>

            ${state.locations
              .map((loc, idx) => {
                const dotClass = !loc.enabled ? 'paused' : loc.status === 'syncing' ? 'syncing' : ''
                return `
                  <div class="vb-bento-card">
                    <div class="vb-bento-head">
                      <span class="vb-bento-label">${loc.type === 'usb' ? ICONS.usb : ICONS.cloud}<span>${loc.name}</span></span>
                      <i class="status-dot-inline ${dotClass}"></i>
                    </div>
                    <div class="vb-ring-row">
                      ${renderRadialGauge(loc.freePercent, ringColors[idx % ringColors.length])}
                      <div class="vb-ring-copy">
                        <strong>${loc.freeOnly} 可用</strong>
                        <span>总容量 ${loc.totalOnly} · ${loc.endpoint}</span>
                        <small>${!loc.enabled ? '已暂停同步' : loc.statusText}</small>
                      </div>
                    </div>
                  </div>
                `
              })
              .join('')}
          </div>
        </section>

        <nav class="bottom-dock-zone vb-dock-shell" aria-label="底部常驻控制坞">
          ${renderFourIconCards()}
        </nav>
      </main>
    `
  }

  /* ==================== Variant C：PS5 极简全画幅光域（全景横置仪器舱 + 无外框独立发光大磁贴） ==================== */
  function VariantCHome() {
    const enabledCount = state.locations.filter((l) => l.enabled).length

    return `
      <main class="home-stage">
        <section class="overview-showcase" aria-label="全景存储与位置状态总览">
          <div class="vc-panoramic-overview">
            <div class="vc-monument-copy">
              <div class="vc-monument-kicker">
                <i class="status-dot-inline"></i>
                <span>ReStore · ${state.hostStorage.daemonText}</span>
              </div>
              <div class="vc-monument-value">5.4 GB 整机快照已同步</div>
              <div class="vc-monument-sub">
                最近完整恢复点：今天 19:10 · ${enabledCount} 台存储设备在线 · 共 5.26 TB 备份存储池
              </div>
            </div>

            <div class="vc-horizon-capsule">
              <div class="vc-horizon-col">
                <div class="vc-horizon-top">
                  <span>PS5 内置存储</span>
                  <i class="status-dot-inline"></i>
                </div>
                <div class="vc-horizon-size">${state.hostStorage.free}<small>/ ${state.hostStorage.total}</small></div>
                <div class="liquid-meter"><i style="width:${state.hostStorage.usedPercent}%"></i></div>
                <div class="vc-horizon-foot">本机高速 NVMe · 5 类数据已受保护</div>
              </div>

              ${state.locations
                .map((loc) => {
                  const dotClass = !loc.enabled ? 'paused' : loc.status === 'syncing' ? 'syncing' : ''
                  return `
                    <div class="vc-horizon-col">
                      <div class="vc-horizon-top">
                        <span>${loc.name}</span>
                        <i class="status-dot-inline ${dotClass}"></i>
                      </div>
                      <div class="vc-horizon-size">${loc.freeOnly}<small>/ ${loc.totalOnly}</small></div>
                      <div class="liquid-meter"><i style="width:${loc.usedPercent}%"></i></div>
                      <div class="vc-horizon-foot">${!loc.enabled ? '已暂停同步' : `${loc.statusText} · ${loc.lastSync}`}</div>
                    </div>
                  `
                })
                .join('')}
            </div>
          </div>
        </section>

        <nav class="bottom-dock-zone vc-monolith-dock" aria-label="底部独立功能大磁贴">
          ${renderFourIconCards()}
        </nav>
      </main>
    `
  }

  function renderPersistentDockIfVariantB() {
    if (state.variant !== 'B') return ''
    return `
      <nav class="bottom-dock-zone vb-dock-shell is-compact" aria-label="底部常驻控制坞">
        ${renderFourIconCards()}
      </nav>
    `
  }

  /* ==================== 子页 1：「恢复」（位置/恢复点药丸 + 5 张统一 30rem 液态玻璃步骤卡） ==================== */
  function renderRestorePage() {
    return `
      <main class="subpage-stage">
        <div class="subpage-toolbar">
          <div class="subpage-toolbar-group">
            <span style="font-size:15rem; color:#9fb0c6;">备份位置：</span>
            ${state.locations
              .map(
                (loc) => `
                <button
                  type="button"
                  class="pill sm ${state.selectedLocationId === loc.id ? 'brand' : 'secondary'}"
                  data-action="select-location"
                  data-loc="${loc.id}"
                >
                  <span>${loc.name}</span>
                </button>
              `,
              )
              .join('')}
            <span style="font-size:15rem; color:#9fb0c6; margin-left:10rem;">恢复点：</span>
            ${state.restorePoints
              .map(
                (rp) => `
                <button
                  type="button"
                  class="pill sm ${state.selectedRestorePointId === rp.id ? 'primary' : 'secondary'}"
                  data-action="select-rp"
                  data-rp="${rp.id}"
                >
                  <span>${rp.title}</span>
                </button>
              `,
              )
              .join('')}
          </div>
          <button type="button" class="pill sm primary" data-action="start-lock-demo" data-mode="normal">
            ${ICONS.restore}<span>开始恢复 (${state.selectedObjects.length}/5)</span>
          </button>
        </div>

        <div class="five-columns-grid">
          ${FIVE_OBJECTS.map((obj) => {
            const selected = state.selectedObjects.includes(obj.id)
            return `
              <button
                type="button"
                class="glass-tall-card ${selected ? 'selected' : ''}"
                data-action="toggle-object"
                data-obj="${obj.id}"
              >
                <div>
                  <div class="object-tile-top">
                    <div class="tile-icon">${ICONS[obj.icon]}</div>
                    <div class="check-indicator">${ICONS.check}</div>
                  </div>
                  <h2>${obj.title}</h2>
                  <p>${obj.desc}</p>
                  <div class="card-below-tags">
                    <span class="badge blue">第 ${obj.order} 步</span>
                    ${obj.note ? `<span class="badge gold">${obj.note}</span>` : ''}
                  </div>
                </div>
                <div style="padding-top:14rem; border-top:1rem solid rgba(255,255,255,0.09); display:flex; justify-content:space-between; font-size:14rem; color:#b8c7dc;">
                  <span>${obj.countText}</span>
                  <span>${obj.size}</span>
                </div>
              </button>
            `
          }).join('')}
        </div>

        ${renderPersistentDockIfVariantB()}
      </main>
    `
  }

  /* ==================== 子页 2：「软件」（底层卡片 + 30rem 液态玻璃预览锁遮罩） ==================== */
  function renderAppsPage() {
    return `
      <main class="subpage-stage">
        <div class="subpage-toolbar">
          <div class="subpage-toolbar-group">
            <span class="badge muted">全部</span>
            <span class="badge muted">独立应用</span>
            <span class="badge muted">扩展插件</span>
            <span class="badge muted">系统载荷</span>
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
                      <small>${app.version}</small>
                    </div>
                  </div>
                  <p class="store-app-desc">${app.desc}</p>
                  <div class="store-app-footer">
                    <span>${app.category} · ${app.size}</span>
                    <span class="badge muted">获取</span>
                  </div>
                </article>
              `,
              ).join('')}
            </div>
          </div>

          <div class="store-preview-lock-overlay">
            <div class="store-lock-glass-card">
              <div class="store-lock-icon-badge">${ICONS.lock}</div>
              <h2>软件频道暂未开放</h2>
              <p>自制应用、系统载荷与扩展插件在线获取功能将在后续版本推出。</p>
            </div>
          </div>
        </div>

        ${renderPersistentDockIfVariantB()}
      </main>
    `
  }

  /* ==================== 子页 3：「商店」（底层封面网格 + 30rem 液态玻璃预览锁遮罩） ==================== */
  function renderStorePage() {
    return `
      <main class="subpage-stage">
        <div class="subpage-toolbar">
          <div class="subpage-toolbar-group">
            <span class="badge muted">全部来源</span>
            <span class="badge muted">百度网盘</span>
            <span class="badge muted">夸克网盘</span>
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
                  </div>
                  <h3>${g.title}</h3>
                  <p>${g.meta}</p>
                </article>
              `,
              ).join('')}
            </div>
          </div>

          <div class="store-preview-lock-overlay">
            <div class="store-lock-glass-card">
              <div class="store-lock-icon-badge">${ICONS.lock}</div>
              <h2>商店频道暂未开放</h2>
              <p>网盘连接与游戏库在线下载功能将在后续版本推出。</p>
            </div>
          </div>
        </div>

        ${renderPersistentDockIfVariantB()}
      </main>
    `
  }

  /* ==================== 子页 4：「其他」（2×2 高密度玻璃工作台，统一 30rem 圆角） ==================== */
  function renderOtherPage() {
    return `
      <main class="subpage-stage">
        <div class="subpage-toolbar">
          <div class="subpage-toolbar-group">
            <span class="badge green">${ICONS.check}<span>配置实时生效</span></span>
            <span style="font-size:15rem; color:#b8c7dc;">备份位置与网络 · 自动备份范围 · 恢复点保护与清理 · 后台守护与首次引导</span>
          </div>
          <div class="subpage-toolbar-group">
            <button type="button" class="pill sm secondary" data-action="open-webdav-osk" data-loc="lan">
              <span>配置 WebDAV 凭据</span>
            </button>
            <button type="button" class="pill sm brand" data-action="open-onboarding">
              <span>重新打开首次引导</span>
            </button>
          </div>
        </div>

        <div class="settings-dense-grid">
          <section class="settings-dense-card">
            <div class="settings-dense-head">
              <div>
                <div class="settings-dense-title">
                  <div class="tile-icon">${ICONS.cloud}</div>
                  <h2>备份位置与网络配置</h2>
                </div>
                <p class="settings-dense-sub">各位置独立同步互不阻塞，支持手柄软键盘输入连接凭据</p>
              </div>
              <span class="badge blue">已启用 ${state.locations.filter((l) => l.enabled).length} / 3</span>
            </div>
            <div class="settings-compact-list">
              ${state.locations
                .map(
                  (loc) => `
                  <div class="settings-compact-row">
                    <div class="settings-compact-main">
                      <strong>${loc.name}</strong>
                      <p>${loc.statusText} · ${loc.freeSpace}</p>
                      <div class="settings-compact-tags">
                        <span class="badge ${loc.enabled ? 'green' : 'muted'}">${loc.enabled ? '已启用' : '已暂停'}</span>
                        <span class="badge muted">${loc.endpoint}</span>
                      </div>
                    </div>
                    <div class="settings-row-actions">
                      ${
                        loc.type === 'webdav'
                          ? `<button type="button" class="pill sm secondary" data-action="open-webdav-osk" data-loc="${loc.id}">凭据</button>`
                          : ''
                      }
                      <button type="button" class="pill sm ${loc.enabled ? 'secondary' : 'brand'}" data-action="toggle-location" data-loc="${loc.id}">
                        ${loc.enabled ? '暂停' : '启用'}
                      </button>
                    </div>
                  </div>
                `,
                )
                .join('')}
            </div>
          </section>

          <section class="settings-dense-card">
            <div class="settings-dense-head">
              <div>
                <div class="settings-dense-title">
                  <div class="tile-icon">${ICONS.save}</div>
                  <h2>自动备份内容范围</h2>
                </div>
                <p class="settings-dense-sub">关闭游戏或变更配置后自动增量同步所选项目</p>
              </div>
              <span class="badge green">已开启 ${state.autoBackupScope.length} / 5</span>
            </div>
            <div class="settings-scope-grid">
              ${FIVE_OBJECTS.map((obj, idx) => {
                const on = state.autoBackupScope.includes(obj.id)
                return `
                  <button
                    type="button"
                    class="settings-scope-item ${on ? 'selected' : ''} ${idx === 4 ? 'span-2' : ''}"
                    data-action="toggle-auto-scope"
                    data-obj="${obj.id}"
                  >
                    <div class="settings-compact-main">
                      <strong>${obj.title}</strong>
                      <p>${obj.countText} · ${obj.size}</p>
                    </div>
                    <div class="check-indicator">${ICONS.check}</div>
                  </button>
                `
              }).join('')}
            </div>
          </section>

          <section class="settings-dense-card">
            <div class="settings-dense-head">
              <div>
                <div class="settings-dense-title">
                  <div class="tile-icon">${ICONS.shield}</div>
                  <h2>恢复点保护与空间清理</h2>
                </div>
                <p class="settings-dense-sub">空间不足时自动清理未锁定旧恢复点，保底保留最新完整点</p>
              </div>
              <span class="badge blue">智能保底</span>
            </div>
            ${
              state.spaceLowSimulated
                ? `
              <div class="inline-notice-box warn" style="margin-top:0; padding:10rem 16rem;">
                <div>
                  <strong style="display:block; font-size:14.5rem; color:#ffd4d2;">USB 存储设备可用空间不足</strong>
                  <span style="font-size:12.5rem; color:#e6c3c1;">已自动清理未锁定旧恢复点并保留最新完整点。</span>
                </div>
                <span class="badge gold">已保底</span>
              </div>
            `
                : ''
            }
            <div class="settings-compact-list">
              ${state.restorePoints
                .map(
                  (rp) => `
                  <div class="settings-compact-row">
                    <div class="settings-compact-main">
                      <strong>${rp.title}</strong>
                      <p>${rp.note} · ${rp.size}</p>
                      <div class="settings-compact-tags">
                        <span class="badge ${rp.protected ? 'gold' : 'muted'}">${rp.protected ? '已锁定保护' : '可自动清理'}</span>
                        ${rp.isLatestComplete ? '<span class="badge blue">最新完整点</span>' : ''}
                      </div>
                    </div>
                    <div class="settings-row-actions">
                      <button type="button" class="pill sm ${rp.protected ? 'secondary' : 'brand'}" data-action="toggle-rp-protect" data-rp="${rp.id}">
                        ${rp.protected ? '解除保护' : '锁定保护'}
                      </button>
                    </div>
                  </div>
                `,
                )
                .join('')}
            </div>
          </section>

          <section class="settings-dense-card">
            <div class="settings-dense-head">
              <div>
                <div class="settings-dense-title">
                  <div class="tile-icon">${ICONS.settings}</div>
                  <h2>后台守护服务与触发策略</h2>
                </div>
                <p class="settings-dense-sub">关闭主界面后常驻后台，在游戏退出且存档落盘稳定后自动同步</p>
              </div>
              <span class="badge green">常驻运行中</span>
            </div>
            <div class="settings-compact-list">
              <div class="settings-compact-row">
                <div class="settings-compact-main">
                  <strong>游戏退出后存档稳定监听</strong>
                  <p>游戏运行期间零抢占读写，退出游戏后自动创建增量恢复点。</p>
                </div>
                <div class="settings-row-actions">
                  <button type="button" class="pill sm secondary" data-action="manual-backup">立即备份</button>
                </div>
              </div>
              <div class="settings-compact-row">
                <div class="settings-compact-main">
                  <strong>插件与宿主配置即时同步</strong>
                  <p>插件、自启列表或外置盘扫描路径变更时即时增量同步。</p>
                </div>
                <div class="settings-row-actions">
                  <button type="button" class="pill sm secondary" data-action="open-onboarding">引导向导</button>
                </div>
              </div>
            </div>
          </section>
        </div>

        ${renderPersistentDockIfVariantB()}
      </main>
    `
  }

  /* ==================== 首次引导覆盖层 & 专注恢复进度锁 ==================== */
  function renderOnboardingOverlay() {
    if (!state.onboardingOpen) return ''
    const hasRp = state.onboardingHasRp
    return `
      <div class="fullscreen-overlay" role="dialog" aria-modal="true" aria-label="首次使用引导向导">
        <div class="wizard-header">
          <div class="wizard-brand">
            <img src="./assets/restore-logo-full.png" alt="ReStore" />
            <div>
              <h1>欢迎使用 ReStore</h1>
              <p>选择一个或多个备份存储位置，自动发现已有备份或创建首份完整恢复点。</p>
            </div>
          </div>
          <button type="button" class="pill sm secondary" data-action="close-onboarding">完成并关闭向导</button>
        </div>

        <section class="wizard-step-card">
          <h2>
            <span>第一步：选择备份存储位置（可多选）</span>
            <button type="button" class="pill sm secondary" data-action="open-webdav-osk" data-loc="lan">配置 WebDAV 连接</button>
          </h2>
          <div class="wizard-locations-grid">
            ${state.locations
              .map(
                (loc) => `
              <div class="wizard-loc-card ${loc.enabled ? 'selected' : ''}">
                <div>
                  <div class="loc-row-top" style="margin-bottom:10rem;">
                    <div class="loc-row-title">
                      ${loc.type === 'usb' ? ICONS.usb : ICONS.cloud}
                      <span>${loc.name}</span>
                    </div>
                    <button
                      type="button"
                      class="check-indicator"
                      data-action="toggle-location"
                      data-loc="${loc.id}"
                      aria-label="切换 ${loc.name}"
                    >
                      ${ICONS.check}
                    </button>
                  </div>
                  <p style="margin:0; font-size:14.5rem; color:#9fb0c6;">
                    ${hasRp ? `最近备份：${loc.lastSync}` : '已就绪，可用于存放备份'} · ${loc.freeSpace}
                  </p>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; padding-top:12rem; border-top:1rem solid rgba(255,255,255,0.08);">
                  <span class="badge ${loc.enabled ? 'green' : 'muted'}">${loc.enabled ? '已选择' : '未启用'}</span>
                  ${
                    loc.type === 'webdav'
                      ? `<button type="button" class="pill sm secondary" data-action="open-webdav-osk" data-loc="${loc.id}">填写地址与账号</button>`
                      : `<button type="button" class="pill sm secondary" data-action="toggle-location" data-loc="${loc.id}">${loc.enabled ? '取消选择' : '选择此位置'}</button>`
                  }
                </div>
              </div>
            `,
              )
              .join('')}
          </div>
        </section>

        ${
          hasRp
            ? `
          <section class="wizard-step-card">
            <h2>
              <span>第二步：已发现可用恢复点（默认选中最新完整恢复点）</span>
              <span class="badge blue">可切换历史恢复点</span>
            </h2>
            <div class="rp-cards-row">
              ${state.restorePoints
                .map(
                  (rp) => `
                <button
                  type="button"
                  class="rp-card ${state.selectedRestorePointId === rp.id ? 'selected' : ''}"
                  data-action="select-rp"
                  data-rp="${rp.id}"
                >
                  <div>
                    <div class="rp-card-top">
                      <strong>${rp.title}</strong>
                      ${rp.isLatestComplete ? '<span class="badge blue">默认选中</span>' : ''}
                    </div>
                    <div class="rp-card-desc" style="margin-top:8rem;">${rp.summary}</div>
                  </div>
                  <div class="rp-card-foot">
                    <span>${rp.size}</span>
                    <span>${rp.note}</span>
                  </div>
                </button>
              `,
                )
                .join('')}
            </div>
          </section>

          <div class="wizard-footer-bar">
            <div>
              <strong style="font-size:19rem; display:block; margin-bottom:4rem;">已选中「${state.restorePoints.find((r) => r.id === state.selectedRestorePointId)?.title}」</strong>
              <span style="font-size:14.5rem; color:#9fb0c6;">确认后将立即按依赖顺序恢复整机数据。</span>
            </div>
            <button type="button" class="pill primary" data-action="start-lock-demo" data-mode="normal">
              ${ICONS.restore}<span>开始整机恢复</span>
            </button>
          </div>
        `
            : `
          <section class="wizard-step-card">
            <h2>
              <span>第二步：所选位置尚无恢复点（已默认全选全部 5 类备份内容）</span>
              <span class="badge green">已选 ${state.selectedObjects.length} / 5 项</span>
            </h2>
            <div class="five-columns-grid">
              ${FIVE_OBJECTS.map((obj) => {
                const selected = state.selectedObjects.includes(obj.id)
                return `
                  <button
                    type="button"
                    class="object-tile-card ${selected ? 'selected' : ''}"
                    data-action="toggle-object"
                    data-obj="${obj.id}"
                  >
                    <div class="object-tile-top" style="margin-bottom:0;">
                      <div class="tile-icon">${ICONS[obj.icon]}</div>
                      <div class="check-indicator">${ICONS.check}</div>
                    </div>
                    <div>
                      <strong style="display:block; font-size:18rem; margin-bottom:4rem;">${obj.title}</strong>
                      <span style="font-size:13.5rem; color:#9fb0c6;">${obj.countText}</span>
                    </div>
                  </button>
                `
              }).join('')}
            </div>
          </section>

          <div class="wizard-footer-bar">
            <div>
              <strong style="font-size:19rem; display:block; margin-bottom:4rem;">创建第一份完整恢复点</strong>
              <span style="font-size:14.5rem; color:#9fb0c6;">预计大小约 5.4 GB，完成后将自动同步至所选备份位置。</span>
            </div>
            <button type="button" class="pill primary" data-action="trigger-initial-backup">
              ${ICONS.bolt}<span>开始首次备份</span>
            </button>
          </div>
        `
        }
      </div>
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
              <p>全部项目恢复完成后将自动解锁界面并汇总结果。</p>
            </div>
          </div>
          <span class="badge blue">第 3 / 4 步</span>
        </div>

        <div class="lock-progress-hero">
          <div>
            <span class="badge green">来源：USB 存储设备 · 今天 19:10 自动备份</span>
            <h2 style="font-size:36rem; font-weight:400; margin:14rem 0 8rem;">
              ${
                mode === 'conflict'
                  ? '检测到《最后生还者 Part I》正在运行，已优先恢复其余项目'
                  : mode === 'resumed'
                    ? '已从上次中断位置继续恢复剩余项目'
                    : '正在恢复全游戏通用存档'
              }
            </h2>
            <p style="font-size:17rem; color:#b2c0d4; margin:0;">
              ${state.lockScene.currentDetail}
            </p>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width:${state.lockScene.progress}%"></div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:14.5rem; color:#9fb0c6;">
              <span>已完成：插件与载荷 (12/12) · 游戏桌面展示 (14/14) · 游戏存档 (14/19)</span>
              <span>剩余约 45 秒</span>
            </div>

            ${
              mode === 'conflict'
                ? `
              <div class="inline-notice-box warn">
                <div>
                  <strong style="display:block; font-size:16.5rem; color:#ffd4d2; margin-bottom:4rem;">请先保存并关闭正在运行的《最后生还者 Part I》</strong>
                  <span style="font-size:14rem; color:#e6c3c1;">为避免覆盖正在游玩的进度，系统已暂停该游戏存档写入，其余无冲突项目正继续恢复。</span>
                </div>
                <button type="button" class="pill sm primary" data-action="resolve-conflict-continue">已关闭游戏，继续恢复</button>
              </div>
            `
                : ''
            }

            ${
              mode === 'resumed'
                ? `
              <div class="inline-notice-box">
                <div>
                  <strong style="display:block; font-size:16.5rem; color:#cfe6ff; margin-bottom:4rem;">已自动核验中断前进度并继续执行</strong>
                  <span style="font-size:14rem; color:#b8cde6;">重启前已完成的系统插件与桌面图标无需重复恢复，当前直接从第 15 款游戏存档继续。</span>
                </div>
                <span class="badge green">断点续做</span>
              </div>
            `
                : ''
            }
          </div>

          <div class="lock-side-card">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:18rem;">
              <div class="progress-big-number">${state.lockScene.progress}%</div>
              <img src="./assets/restore-logo.png" alt="ReStore" style="width:66rem; height:66rem; border-radius:20rem;" />
            </div>
            <div class="settings-row-list">
              <div class="settings-row-card"><span>1. 系统插件与载荷</span><span class="badge green">已完成</span></div>
              <div class="settings-row-card"><span>2. 游戏桌面展示</span><span class="badge green">已完成</span></div>
              <div class="settings-row-card" style="border-color:rgba(118,190,255,0.55);"><strong>3. 全游戏通用存档</strong><span class="badge blue">进行中 (14/19)</span></div>
              <div class="settings-row-card"><span>4. 系统设置与媒体图库</span><span class="badge muted">等待中</span></div>
            </div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; padding-top:16rem; border-top:1rem solid rgba(255,255,255,0.09);">
          <span style="font-size:14.5rem; color:#9fb0c6;">若中途断电或重启，重新打开 ReStore 后将自动从断点处继续恢复。</span>
          <button type="button" class="pill primary sm" data-action="open-restore-result-modal">查看恢复完成汇总</button>
        </div>
      </section>
    `
  }

  function renderModal() {
    if (state.modal === 'webdav-osk') {
      const loc = state.locations.find((l) => l.id === state.editingLocationId) || state.locations[1]
      const keys = [
        ['http://', 'https://', '192.168.', ':5244', '/dav', '/restore', '.com', '退格'],
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'],
        ['n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
        ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '_', '/'],
      ]
      return `
        <div class="modal-backdrop" role="dialog" aria-modal="true" aria-label="配置 WebDAV 存储">
          <div class="modal">
            <h2>配置 ${loc.name}</h2>
            <p>使用手柄方向键选择输入框与软键盘字符，按 ✕ 输入并验证连接。</p>
            <div class="osk-field-grid">
              <div class="osk-field">
                <label>服务器地址</label>
                <input class="modal-input" type="text" id="osk-url" value="${state.oskForm.url}" />
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:14rem;">
                <div class="osk-field">
                  <label>账号</label>
                  <input class="modal-input" type="text" id="osk-user" value="${state.oskForm.user}" />
                </div>
                <div class="osk-field">
                  <label>密码</label>
                  <input class="modal-input" type="text" id="osk-pass" value="${state.oskForm.pass}" />
                </div>
              </div>
            </div>
            <div class="osk-keypad" aria-label="软键盘">
              ${keys
                .map(
                  (row) => `
                <div class="osk-keypad-row">
                  ${row.map((k) => `<button type="button" class="osk-key" data-action="osk-key" data-key="${k}">${k}</button>`).join('')}
                </div>
              `,
                )
                .join('')}
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:22rem;">
              <span class="badge green">${ICONS.check}<span>连接测试正常</span></span>
              <div style="display:flex; gap:12rem;">
                <button type="button" class="pill secondary sm" data-action="close-modal">取消</button>
                <button type="button" class="pill primary sm" data-action="save-webdav-osk">保存并连接</button>
              </div>
            </div>
          </div>
        </div>
      `
    }

    if (state.modal === 'restore-result') {
      const retried = state.restoreResultRetried
      return `
        <div class="modal-backdrop" role="dialog" aria-modal="true" aria-label="恢复完成结果汇总">
          <div class="modal wide">
            <h2>恢复完成汇总</h2>
            <p>以下为本次恢复任务的执行结果分类清单。</p>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:18rem;">
              <div class="wizard-loc-card">
                <div class="loc-row-top">
                  <strong>已恢复</strong>
                  <span class="badge green">${retried ? '全部完成' : '4 类完整 + 18 款存档'}</span>
                </div>
                <div style="font-size:14rem; color:#b2c0d4; line-height:1.6;">
                  <div>• 系统插件与载荷：12 项已启用</div>
                  <div>• 游戏桌面展示：14 款图标已还原</div>
                  <div>• 全游戏通用存档：${retried ? '全部 19 款已恢复' : '18 款游戏存档已恢复'}</div>
                  <div>• 系统设置与媒体：离线激活与 86 项媒体已恢复</div>
                </div>
              </div>

              <div class="wizard-loc-card">
                <div class="loc-row-top">
                  <strong>待处理</strong>
                  <span class="badge gold">2 款待挂载外置盘</span>
                </div>
                <div style="font-size:14rem; color:#b2c0d4; line-height:1.6;">
                  <div>• 《战神：诸神黄昏》：桌面图标已恢复，接入外置存储后即可启动</div>
                  <div>• 《死亡回归》：桌面图标已恢复，待安装游戏本体</div>
                </div>
              </div>

              <div class="wizard-loc-card">
                <div class="loc-row-top">
                  <strong>未完成</strong>
                  <span class="badge ${retried ? 'green' : 'gold'}">${retried ? '0 项' : '1 项可重试'}</span>
                </div>
                <div style="font-size:14rem; color:#b2c0d4; line-height:1.6;">
                  ${
                    retried
                      ? '<div>• 《最后生还者 Part I》存档已重试恢复成功。</div>'
                      : '<div>• 《最后生还者 Part I》：恢复期间游戏曾处于运行状态，关闭游戏后可一键重试。</div>'
                  }
                </div>
              </div>
            </div>
            <div style="display:flex; justify-content:flex-end; align-items:center; gap:12rem; margin-top:24rem;">
              ${
                !retried
                  ? `<button type="button" class="pill brand sm" data-action="retry-unfinished-items">一键重试未完成项</button>`
                  : ''
              }
              <button type="button" class="pill primary sm" data-action="finish-restore-and-close">关闭汇总</button>
            </div>
          </div>
        </div>
      `
    }
    return ''
  }

  /* ==================== 最底部右侧按钮提示：确认、返回、备份、恢复 ==================== */
  function renderDualSenseBar() {
    return `
      <footer class="dualsense-bar" aria-label="手柄按键提示栏">
        <div class="dualsense-prompts">
          <button type="button" class="ds-prompt" data-action="ds-cross">
            <span class="ds-glyph cross">✕</span><span>确认</span>
          </button>
          <button type="button" class="ds-prompt" data-action="ds-circle">
            <span class="ds-glyph">◯</span><span>返回</span>
          </button>
          <button type="button" class="ds-prompt" data-action="ds-triangle">
            <span class="ds-glyph">△</span><span>备份</span>
          </button>
          <button type="button" class="ds-prompt" data-action="ds-square">
            <span class="ds-glyph">□</span><span>恢复</span>
          </button>
        </div>
      </footer>
    `
  }

  /* ==================== 底部正中 Prototype Variant Switcher（遵循 UI.md 规范） ==================== */
  function renderPrototypeSwitcher() {
    const currentObj = VARIANTS.find((v) => v.key === state.variant) || VARIANTS[0]
    return `
      <div class="prototype-switcher" role="region" aria-label="原型设计变体切换器">
        <button
          type="button"
          class="prototype-switcher-arrow"
          data-action="prev-variant"
          title="上一变体 (快捷键 [ 或 Shift+←)"
          aria-label="上一变体"
        >
          ←
        </button>
        <span class="prototype-switcher-label">${currentObj.key} (${currentObj.name})</span>
        <button
          type="button"
          class="prototype-switcher-arrow"
          data-action="next-variant"
          title="下一变体 (快捷键 ] 或 Shift+→)"
          aria-label="下一变体"
        >
          →
        </button>
      </div>
    `
  }

  /* ==================== 左下角可收起开发者状态调试浮窗 ==================== */
  function renderFloatingDevDock() {
    if (state.devDockCollapsed) {
      return `
        <aside class="proto-floating-dock" aria-label="开发者原型调试浮窗">
          <div class="proto-dock-row">
            <button type="button" class="proto-dev-tag" data-action="toggle-dev-dock">DEV 场景调试</button>
          </div>
        </aside>
      `
    }
    return `
      <aside class="proto-floating-dock expanded" aria-label="开发者原型调试浮窗">
        <div class="proto-dock-row">
          <span class="proto-dev-tag">PROTOTYPE DEV</span>
          <button
            type="button"
            class="proto-dock-btn ${state.onboardingOpen && state.onboardingHasRp ? 'active' : ''}"
            data-action="demo-onboarding-has-rp"
          >
            引导：有恢复点
          </button>
          <button
            type="button"
            class="proto-dock-btn ${state.onboardingOpen && !state.onboardingHasRp ? 'active' : ''}"
            data-action="demo-onboarding-empty"
          >
            引导：无恢复点
          </button>
          <button
            type="button"
            class="proto-dock-btn ${state.lockScene.active && state.lockScene.mode === 'normal' ? 'active' : ''}"
            data-action="start-lock-demo"
            data-mode="normal"
          >
            恢复锁：正常
          </button>
          <button
            type="button"
            class="proto-dock-btn ${state.lockScene.active && state.lockScene.mode === 'conflict' ? 'active' : ''}"
            data-action="start-lock-demo"
            data-mode="conflict"
          >
            恢复锁：冲突
          </button>
          <button
            type="button"
            class="proto-dock-btn ${state.lockScene.active && state.lockScene.mode === 'resumed' ? 'active' : ''}"
            data-action="start-lock-demo"
            data-mode="resumed"
          >
            恢复锁：断点续做
          </button>
          <button
            type="button"
            class="proto-dock-btn ${state.spaceLowSimulated ? 'active' : ''}"
            data-action="toggle-space-alert"
          >
            空间不足告警
          </button>
          <button type="button" class="proto-dock-btn" data-action="toggle-dev-dock">收起</button>
        </div>
      </aside>
    `
  }

  function renderMainScene() {
    if (state.lockScene.active) return renderRestoreLockScene()
    if (state.view === 'restore') return renderRestorePage()
    if (state.view === 'apps') return renderAppsPage()
    if (state.view === 'store') return renderStorePage()
    if (state.view === 'other') return renderOtherPage()
    if (state.variant === 'B') return VariantBHome()
    if (state.variant === 'C') return VariantCHome()
    return VariantAHome()
  }

  function render(reason = 'update') {
    const app = document.getElementById('app')
    if (!app) return
    const previous = window.PS5Motion ? window.PS5Motion.capture() : {}

    app.innerHTML = `
      <div
        class="app-shell"
        data-variant="${state.variant}"
        data-view="${state.lockScene.active ? 'restore-lock' : state.view}"
        data-focus-dock="${state.focusedDockId}"
      >
        <div class="console-wallpaper" aria-hidden="true">
          <video src="./assets/ps5-showcase-excerpt.mp4" autoplay muted loop playsinline></video>
        </div>
        ${renderHeader()}
        ${renderMainScene()}
        ${renderOnboardingOverlay()}
        ${renderDualSenseBar()}
        ${renderPrototypeSwitcher()}
        ${renderFloatingDevDock()}
        ${renderModal()}
      </div>
    `

    if (window.PS5Motion) {
      window.PS5Motion.animate(previous, reason)
    }
    syncUrl()
  }

  function cycleVariant(delta) {
    const idx = VARIANTS.findIndex((v) => v.key === state.variant)
    const next = (idx + delta + VARIANTS.length) % VARIANTS.length
    state.variant = VARIANTS[next].key
    render('route')
  }

  function triggerQuickBackup() {
    state.locations.forEach((loc) => {
      if (loc.enabled) {
        loc.status = 'connected'
        loc.progress = 100
        loc.statusText = loc.type === 'usb' ? '已接入 · 已同步最新备份' : '在线 · 已同步最新备份'
        loc.lastSync = '刚刚'
      }
    })
    showToast('已启动后台增量备份，存储位置状态已更新')
    render('update')
  }

  function handleBackAction() {
    if (state.modal) {
      state.modal = null
      render('update')
    } else if (state.onboardingOpen) {
      state.onboardingOpen = false
      render('route')
    } else if (state.lockScene.active) {
      state.lockScene.active = false
      render('route')
    } else if (state.view !== 'home') {
      state.view = 'home'
      render('route')
    }
  }

  document.addEventListener('focusin', (e) => {
    const dockCard = e.target?.closest?.('.dock-icon-card[data-dock-id]')
    if (dockCard) {
      state.focusedDockId = dockCard.dataset.dockId
      const shell = document.querySelector('#app .app-shell')
      if (shell) shell.dataset.focusDock = state.focusedDockId
    }
  })

  document.addEventListener('mouseover', (e) => {
    const dockCard = e.target?.closest?.('.dock-icon-card[data-dock-id]')
    if (dockCard && state.focusedDockId !== dockCard.dataset.dockId) {
      state.focusedDockId = dockCard.dataset.dockId
      const shell = document.querySelector('#app .app-shell')
      if (shell) shell.dataset.focusDock = state.focusedDockId
    }
  })

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]')
    if (!btn) return
    const action = btn.dataset.action

    switch (action) {
      case 'open-dock-item': {
        if (state.lockScene.active) {
          showToast('正在恢复数据，请先完成当前恢复任务')
          return
        }
        const targetId = btn.dataset.dockId
        state.focusedDockId = targetId
        state.onboardingOpen = false
        if (state.variant === 'B' && state.view === targetId) {
          state.view = 'home'
        } else {
          state.view = targetId
        }
        render('route')
        break
      }
      case 'prev-variant':
        cycleVariant(-1)
        break
      case 'next-variant':
        cycleVariant(1)
        break
      case 'toggle-dev-dock':
        state.devDockCollapsed = !state.devDockCollapsed
        render('update')
        break
      case 'open-onboarding':
        state.onboardingOpen = true
        render('route')
        break
      case 'close-onboarding':
        state.onboardingOpen = false
        render('route')
        break
      case 'demo-onboarding-has-rp':
        if (state.onboardingOpen && state.onboardingHasRp) {
          state.onboardingOpen = false
        } else {
          state.lockScene.active = false
          state.onboardingOpen = true
          state.onboardingHasRp = true
        }
        render('update')
        break
      case 'demo-onboarding-empty':
        if (state.onboardingOpen && !state.onboardingHasRp) {
          state.onboardingOpen = false
        } else {
          state.lockScene.active = false
          state.onboardingOpen = true
          state.onboardingHasRp = false
          state.selectedObjects = FIVE_OBJECTS.map((o) => o.id)
        }
        render('update')
        break
      case 'toggle-location': {
        const loc = state.locations.find((l) => l.id === btn.dataset.loc)
        if (loc) {
          loc.enabled = !loc.enabled
          showToast(`${loc.name}${loc.enabled ? '已启用' : '已暂停'}`)
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
            showToast('请至少保留一项恢复内容')
          }
        } else {
          state.selectedObjects = [...state.selectedObjects, id]
        }
        render('update')
        break
      }
      case 'trigger-initial-backup':
        state.onboardingOpen = false
        triggerQuickBackup()
        break
      case 'manual-backup':
        triggerQuickBackup()
        break
      case 'start-lock-demo': {
        const targetMode = btn.dataset.mode || 'normal'
        if (state.lockScene.active && state.lockScene.mode === targetMode) {
          state.lockScene.active = false
        } else {
          state.onboardingOpen = false
          state.lockScene.active = true
          state.lockScene.mode = targetMode
          state.lockScene.progress = targetMode === 'resumed' ? 76 : 68
        }
        render('route')
        break
      }
      case 'resolve-conflict-continue':
        state.lockScene.mode = 'normal'
        state.lockScene.progress = 92
        state.lockScene.currentDetail = '《最后生还者 Part I》已关闭，正在完成存档恢复'
        showToast('已继续恢复《最后生还者 Part I》存档')
        render('update')
        break
      case 'open-restore-result-modal':
        state.restoreResultRetried = false
        state.modal = 'restore-result'
        render('update')
        break
      case 'retry-unfinished-items':
        state.restoreResultRetried = true
        state.lockScene.progress = 100
        showToast('未完成项已重试成功')
        render('update')
        break
      case 'finish-restore-and-close':
        state.modal = null
        state.lockScene.active = false
        state.view = 'home'
        render('route')
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
          loc.enabled = true
          loc.status = 'connected'
          loc.progress = 100
          loc.statusText = '在线 · 已同步最新备份'
        }
        state.modal = null
        showToast('WebDAV 连接配置已保存')
        render('update')
        break
      }
      case 'close-modal':
        state.modal = null
        render('update')
        break
      case 'toggle-rp-protect': {
        const rp = state.restorePoints.find((r) => r.id === btn.dataset.rp)
        if (rp) {
          rp.protected = !rp.protected
          showToast(`${rp.title}${rp.protected ? '已锁定保护' : '已解除保护'}`)
          render('update')
        }
        break
      }
      case 'toggle-space-alert':
        state.spaceLowSimulated = !state.spaceLowSimulated
        showToast(state.spaceLowSimulated ? '已在「其他」页开启空间不足告警预览' : '已关闭空间不足告警预览')
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
      case 'ds-cross': {
        const focused =
          document.querySelector('[data-pad-focus="true"]') ||
          (document.activeElement && document.activeElement !== document.body
            ? document.activeElement
            : document.querySelector('.dock-icon-card'))
        if (focused && typeof focused.click === 'function') {
          focused.click()
        }
        break
      }
      case 'ds-circle':
        handleBackAction()
        break
      case 'ds-triangle':
        triggerQuickBackup()
        break
      case 'ds-square':
        if (state.lockScene.active) {
          showToast('恢复任务正在执行中')
        } else if (state.view !== 'restore') {
          state.onboardingOpen = false
          state.view = 'restore'
          render('route')
        } else {
          state.lockScene.active = true
          state.lockScene.mode = 'normal'
          state.lockScene.progress = 68
          render('route')
        }
        break
    }
  })

  function moveFocusSpatially(dir) {
    const scopeRoot = state.modal
      ? document.querySelector('.modal')
      : state.onboardingOpen
        ? document.querySelector('.fullscreen-overlay')
        : document.getElementById('app')

    const candidates = [
      ...(scopeRoot || document).querySelectorAll(
        'button:not([disabled]):not(.proto-dock-btn):not(.proto-dev-tag):not(.prototype-switcher-arrow):not(.ds-prompt), input:not([disabled])',
      ),
    ].filter((el) => {
      const r = el.getBoundingClientRect()
      return r.width > 0 && r.height > 0
    })
    if (!candidates.length) return

    let current =
      document.querySelector('[data-pad-focus="true"]') ||
      (candidates.includes(document.activeElement) ? document.activeElement : null)

    if (!current || !candidates.includes(current)) {
      candidates[0].dataset.padFocus = 'true'
      candidates[0].focus({ preventScroll: true })
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

    const next = best || current
    document.querySelectorAll('[data-pad-focus="true"]').forEach((n) => delete n.dataset.padFocus)
    next.dataset.padFocus = 'true'
    next.focus({ preventScroll: true })
  }

  document.addEventListener('keydown', (e) => {
    const tag = e.target?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) {
      if (e.key === 'Escape') {
        state.modal = null
        render('update')
      }
      return
    }

    if (e.key === '[' || (e.shiftKey && e.key === 'ArrowLeft')) {
      e.preventDefault()
      cycleVariant(-1)
    } else if (e.key === ']' || (e.shiftKey && e.key === 'ArrowRight')) {
      e.preventDefault()
      cycleVariant(1)
    } else if (e.key === 'ArrowRight') {
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
    } else if (e.key === 'Escape' || e.key === 'Backspace') {
      e.preventDefault()
      handleBackAction()
    } else if (e.key === 't' || e.key === 'T') {
      e.preventDefault()
      triggerQuickBackup()
    } else if (e.key === 'f' || e.key === 'F' || e.key === 'r' || e.key === 'R') {
      e.preventDefault()
      document.querySelector('[data-action="ds-square"]')?.click()
    }
  })

  /* 每 30 秒同步右上角时钟 */
  setInterval(() => {
    const clockNode = document.querySelector('.tvos-clock')
    if (clockNode) clockNode.textContent = formatAppleClock()
  }, 30000)

  render('init')
})()
