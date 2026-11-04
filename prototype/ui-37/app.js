/* ReStore PS5 × Apple Bento 空间控制坞高保真可交互原型 (#37)
   已选定并收敛为 B 方案（Bento 空间控制坞）：
   - 右上角：时间 + 标准用户 Icon 胶囊
   - 上中部：无交互 Bento 空间概览矩阵（存储设备大小、位置与设备状态、守护进程与最新恢复点）
   - 底部：常驻居中四纯图标控制坞（恢复、软件、商店、其他）+ 右下角「确认、返回、备份、恢复」
   - 恢复页：2 列 × 3 行（一行两个、共三行，从上到下）横向大圆角 Bento 卡片
   - 首次引导页：分步向导（第一步选存储位置 → 第二步选恢复点/备份范围 → 第三步确认并开始） */
;(() => {
  'use strict'

  const ICONS = {
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/></svg>',
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
    search:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4.2-4.2"/></svg>',
    chevronLeft:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
    chevronRight:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  }

  /* 两个底部纯 ICON 卡片专属立体徽标（卡片内部严格只有 ICON，零文字） */
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

  /* 底部纯图标卡片（第一阶段聚焦备份与恢复，仅保留：恢复、其他） */
  const DOCK_ITEMS = [
    { id: 'restore', label: '恢复' },
    { id: 'other', label: '其他' },
  ]

  const FIVE_OBJECTS = [
    {
      id: 'elf',
      order: 1,
      title: '系统插件与载荷',
      shortTag: '12 项插件',
      countText: '12 项插件与自启服务',
      icon: 'bolt',
      size: '48 MB',
      desc: '还原宿主环境、插件服务、自启状态与外置游戏扫描配置，恢复后立即生效。',
    },
    {
      id: 'desktop',
      order: 2,
      title: '游戏桌面展示',
      shortTag: '14 款图标',
      countText: '14 款桌面游戏图标',
      icon: 'grid',
      size: '64 MB',
      desc: '在主界面与游戏库还原原有游戏图标和列表记录（仅恢复图标，不含游戏本体）。',
      note: '不含本体',
    },
    {
      id: 'saves',
      order: 3,
      title: '全游戏通用存档',
      shortTag: '46 个存档',
      countText: '19 款游戏 · 46 个存档',
      icon: 'save',
      size: '1.4 GB',
      desc: '自动绑定当前主机账号，支持尚未启动过的游戏直接恢复存档并对齐进度。',
    },
    {
      id: 'settings',
      order: 4,
      title: '系统与账号设置',
      shortTag: '系统偏好',
      countText: '离线激活与系统偏好',
      icon: 'settings',
      size: '6 MB',
      desc: '还原账号离线激活状态、省电待机设置、显示、音频与系统语言偏好。',
    },
    {
      id: 'media',
      order: 5,
      title: '媒体图库',
      shortTag: '86 项媒体',
      countText: '86 项截图与视频',
      icon: 'media',
      size: '3.9 GB',
      desc: '还原游戏截图与视频记录，恢复后可在系统媒体图库中直接浏览播放。',
    },
  ]

  function normalizeView(v) {
    if (!v || v === 'home') return 'home'
    if (v === 'restore') return 'restore'
    if (v === 'other' || v === 'settings') return 'other'
    return 'home'
  }

  function formatAppleClock() {
    const now = new Date()
    let hours = new Date().getHours()
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const period = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12 || 12
    return `${hours}:${minutes} ${period}`
  }

  /* ==================== 已锁定的全站统一 BDD 交互与视觉规范（方案 A：tvOS 极速跟随 + 卡片四色语义融合 + 短胶囊规范） ====================
     1. 全局焦点路由：各页面初始焦点直达主行动点；状态刷新保留焦点；◯ 返回按栈逐层后退并精确还原底坞/触发器焦点；恢复执行中拦截返回。
     2. 导航轨 / Tab 栏切换：主页底坞按 ✕ 确认展开子页；进入子页后，其他页左侧 4 项分类轨与子页底部紧凑控制坞均采用「落焦即切页（Selection Follows Focus）」。
     3. 全站多选开关卡片（恢复页 5 项、引导页位置卡 & 范围卡、其他页位置卡 & 自动备份范围卡 & 恢复点锁定卡）：
        - 取消右上角独立圆形打勾图标，将状态直接融进整张卡片的四色语义底色规范：
          · 默认（未勾选 / 常态）：蓝色（Blue）
          · 已勾选 / 已启用 / 已完成：绿色（Green）
          · 警告 / 待处理 / 占用：黄色（Yellow）
          · 错误 / 未完成：红色（Red）
        - 步骤序号不放胶囊，融合为纯数字放在卡片末尾（.card-order-num）。
        - 全站所有胶囊标签（.badge）缩短精炼为 2～4 字短词。
     4. 单选切换器：位置胶囊、时间点胶囊、恢复点大卡片与向导步骤胶囊统一按 ✕ 单选互斥切换。
     5. 恢复页 2×3 原地三态流转与主次按钮：按钮消失（全选 5 项、一键重试）时焦点自动顺移至相邻主按钮。
     6. WebDAV 软键盘弹窗：顶部 3 个输入字段（服务器地址 / 账号 / 密码）支持手柄方向键落焦并按 ✕ 切换当前输入目标，软键盘按 ✕ 连续输入。
  */
  const urlParams = new URLSearchParams(window.location.search)
  const rawView = urlParams.get('view')
  const initialOnboardingOpen = rawView === 'onboarding' || urlParams.get('onboarding') === '1'
  const initialStep = Math.min(3, Math.max(1, parseInt(urlParams.get('step') || '1', 10) || 1))
  const initialLockMode = urlParams.get('lock')
  const initialModal = urlParams.get('modal')

  const hasInitialLock =
    ['normal', 'conflict', 'resumed', 'done'].includes(initialLockMode) ||
    initialModal === 'restore-result'

  const state = {
    view: hasInitialLock ? 'restore' : normalizeView(rawView),
    otherTab: 'locations',
    focusedDockId: hasInitialLock ? 'restore' : normalizeView(rawView) === 'other' ? 'other' : 'restore',
    devDockCollapsed: true,
    pendingFocusSelector: null,
    lastTriggerSelector: null,
    onboardingOpen: initialOnboardingOpen,
    onboardingStep: initialStep,
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
      active: hasInitialLock,
      mode: initialModal === 'restore-result' ? 'done' : hasInitialLock ? initialLockMode : 'normal',
      progress: initialLockMode === 'done' || initialModal === 'restore-result' ? 100 : initialLockMode === 'resumed' ? 76 : 68,
      currentDetail: '正在还原《最后生还者 Part I》游戏存档（第 14 / 19 款）',
    },
    modal: initialModal === 'webdav-osk' ? 'webdav-osk' : null,
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

  /* 卡片末尾融合序号数字（不再使用右上角圆形打勾图标，序号融合成数字放在卡片末尾） */
  function renderCardOrderNum(num) {
    if (!num) return ''
    const formatted = String(num).padStart(2, '0')
    return `<span class="card-order-num" aria-hidden="true">${formatted}</span>`
  }

  function syncUrl() {
    const u = new URL(window.location.href)
    u.searchParams.delete('variant')
    u.searchParams.delete('lockStyle')
    u.searchParams.delete('otherStyle')
    u.searchParams.set('view', state.onboardingOpen ? 'onboarding' : state.view)
    if (state.onboardingOpen) {
      u.searchParams.set('step', String(state.onboardingStep))
    } else {
      u.searchParams.delete('step')
    }
    if (state.lockScene.active) {
      u.searchParams.set('lock', state.lockScene.mode)
    } else {
      u.searchParams.delete('lock')
    }
    window.history.replaceState({}, '', u)
  }

  /* ==================== 顶栏：右上角严格只有「时间 + 标准用户 Icon」 ==================== */
  function renderHeader() {
    const currentDock = DOCK_ITEMS.find((d) => d.id === state.view)
    let leftSlot = '<div></div>'

    if (state.view !== 'home' && currentDock) {
      leftSlot = `
        <div class="header-subview-title">
          <h1>${currentDock.label}</h1>
        </div>
      `
    }

    return `
      <header class="system-header">
        ${leftSlot}
        <div class="tvos-time-avatar-pill" aria-label="系统时间与用户图标">
          <time class="tvos-clock">${formatAppleClock()}</time>
          <div class="tvos-avatar-icon">${ICONS.user}</div>
        </div>
      </header>
    `
  }

  /* ==================== 底部四个纯 ICON 卡片渲染器（卡片内严格只有 ICON，零文字） ==================== */
  function renderFourIconCards() {
    return DOCK_ITEMS.map((item) => {
      const isRouteActive = state.view === item.id
      const isHomeFocused =
        state.view === 'home' &&
        !state.onboardingOpen &&
        !state.modal &&
        state.focusedDockId === item.id
      return `
        <button
          type="button"
          class="dock-icon-card ${isRouteActive ? 'is-active-route' : ''}"
          data-action="open-dock-item"
          data-dock-id="${item.id}"
          ${isHomeFocused ? 'data-pad-focus="true"' : ''}
          aria-label="${item.label}"
          title="${item.label}"
        >
          ${DOCK_EMBLEMS[item.id]}
        </button>
      `
    }).join('')
  }

  function renderPersistentDock(isCompact = false) {
    return `
      <nav class="bottom-dock-zone vb-dock-shell ${isCompact ? 'is-compact' : ''}" aria-label="底部常驻控制坞">
        ${renderFourIconCards()}
      </nav>
    `
  }

  /* ==================== 主屏幕（B 方案：上中无交互 Bento 空间仪表盘 + 底部居中四纯图标控制坞） ==================== */
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

  function renderHomePage() {
    const latestRp = state.restorePoints[0]
    const ringColors = ['#38BDF8', '#60A5FA', '#818CF8']

    return `
      <main class="home-stage">
        <section class="overview-showcase" aria-label="Bento 存储与设备状态矩阵">
          <div class="vb-bento-grid">
            <div class="vb-bento-card span-2 card-tone-blue">
              <div class="vb-bento-head">
                <span class="vb-bento-label">${ICONS.ssd}<span>ReStore 整机概览</span></span>
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

            <div class="vb-bento-card card-tone-green">
              <div class="vb-bento-head">
                <span class="vb-bento-label">${ICONS.shield}<span>守护服务与最新恢复点</span></span>
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
                return `
                  <div class="vb-bento-card ${loc.enabled ? 'card-tone-green' : 'card-tone-blue'}" style="position:relative; overflow:hidden;">
                    <div class="vb-bento-head">
                      <span class="vb-bento-label">${loc.type === 'usb' ? ICONS.usb : ICONS.cloud}<span>${loc.name}</span></span>
                    </div>
                    <div class="vb-ring-row">
                      ${renderRadialGauge(loc.freePercent, loc.enabled ? '#34D399' : ringColors[idx % ringColors.length])}
                      <div class="vb-ring-copy">
                        <strong>${loc.freeOnly} 可用</strong>
                        <span>总容量 ${loc.totalOnly} · ${loc.endpoint}</span>
                        <small>${!loc.enabled ? '已暂停同步' : loc.statusText}</small>
                      </div>
                    </div>
                    ${renderCardOrderNum(idx + 1)}
                  </div>
                `
              })
              .join('')}
          </div>
        </section>

        ${renderPersistentDock(false)}
      </main>
    `
  }

  /* ==================== 通用 2 列 × 3 行（一行两个、共三行，从上到下）恢复对象卡片渲染 ==================== */
  function renderTwoByThreeObjectsGrid(includeActionCard = true) {
    const currentLoc = state.locations.find((l) => l.id === state.selectedLocationId) || state.locations[0]
    const currentRp = state.restorePoints.find((r) => r.id === state.selectedRestorePointId) || state.restorePoints[0]
    const isRestoring = includeActionCard && state.lockScene.active
    const mode = state.lockScene.mode

    const fiveCardsHtml = FIVE_OBJECTS.map((obj) => {
      const selected = state.selectedObjects.includes(obj.id)

      if (isRestoring) {
        if (mode === 'done') {
          const retried = state.restoreResultRetried
          const isUnfinishedSaves = obj.id === 'saves' && !retried
          const isPendingDesktop = obj.id === 'desktop'
          const toneClass = isUnfinishedSaves
            ? 'card-tone-red stage-error'
            : isPendingDesktop
              ? 'card-tone-yellow stage-warn'
              : 'stage-done'
          let statusBadge = `<span class="badge green">已恢复</span>`
          let secondBadge = `<span class="badge muted">${obj.shortTag}</span>`
          let rightStat = `<span class="stage-done-label">100% · ${obj.size}</span>`
          let subText = obj.desc

          if (obj.id === 'elf') {
            subText = '12 项系统插件与载荷服务已启用，外置游戏扫描配置已还原生效。'
          } else if (isPendingDesktop) {
            statusBadge = `<span class="badge green">已恢复 14</span>`
            secondBadge = `<span class="badge gold">待挂载 2</span>`
            subText = '14 款桌面图标已还原；《战神：诸神黄昏》待挂载外置盘、《死亡回归》待安装本体后即可启动。'
          } else if (obj.id === 'saves') {
            if (!retried) {
              statusBadge = `<span class="badge red">未完成 1</span>`
              secondBadge = `<span class="badge gold">可重试</span>`
              subText = '18 款游戏存档已恢复；《最后生还者 Part I》因恢复期间曾运行而跳过，关闭游戏后可一键重试。'
              rightStat = `<strong class="stage-error-pct">18 / 19 款</strong>`
            } else {
              statusBadge = `<span class="badge green">已恢复</span>`
              secondBadge = `<span class="badge muted">46 个存档</span>`
              subText = '《最后生还者 Part I》存档已重试恢复成功，全部 19 款游戏存档均已绑定当前账号。'
            }
          } else if (obj.id === 'settings') {
            subText = '账号离线激活状态、省电待机设置、显示、音频与系统语言偏好已全部还原。'
          } else if (obj.id === 'media') {
            subText = '86 项游戏截图与视频记录已全部还原，可在系统媒体图库中直接浏览播放。'
          }

          return `
            <div class="restore-horiz-card ${toneClass}">
              <div class="restore-horiz-top">
                <div class="restore-horiz-left">
                  <div class="restore-step-icon-box">${ICONS[obj.icon]}</div>
                  <div class="restore-horiz-copy">
                    <h2>${obj.title}</h2>
                    <p>${subText}</p>
                  </div>
                </div>
              </div>
              <div class="restore-horiz-foot">
                <div class="restore-horiz-tags">
                  ${statusBadge}
                  ${secondBadge}
                </div>
                <div class="restore-horiz-stat">
                  ${rightStat}
                </div>
              </div>
              ${renderCardOrderNum(obj.order)}
            </div>
          `
        }

        const isDone = obj.order < 3
        const isActive = obj.order === 3
        const isConflict = isActive && mode === 'conflict'
        const toneClass = isDone
          ? 'stage-done'
          : isConflict
            ? 'card-tone-yellow stage-warn'
            : isActive
              ? 'card-tone-blue stage-active'
              : 'card-tone-blue stage-pending'
        let statusBadge = ''
        let rightStat = `<strong>${obj.size}</strong>`
        let subText = obj.desc

        if (isDone) {
          statusBadge = `<span class="badge green">已完成</span>`
          rightStat = `<span class="stage-done-label">100% · ${obj.size}</span>`
        } else if (isActive) {
          if (mode === 'conflict') {
            statusBadge = `<span class="badge gold">游戏占用</span>`
            subText = '检测到《最后生还者 Part I》正在运行，请先保存并关闭该游戏以继续写入存档。'
          } else if (mode === 'resumed') {
            statusBadge = `<span class="badge blue">续传中</span>`
            subText = '已自动核验中断前进度，正从第 15 款游戏存档继续恢复。'
          } else {
            statusBadge = `<span class="badge blue">恢复中</span>`
            subText = state.lockScene.currentDetail
          }
          rightStat = `<strong class="stage-active-pct">${state.lockScene.progress}%</strong>`
        } else {
          statusBadge = `<span class="badge muted">排队中</span>`
        }

        return `
          <div class="restore-horiz-card ${toneClass}">
            <div class="restore-horiz-top">
              <div class="restore-horiz-left">
                <div class="restore-step-icon-box">${ICONS[obj.icon]}</div>
                <div class="restore-horiz-copy">
                  <h2>${obj.title}</h2>
                  <p>${subText}</p>
                </div>
              </div>
            </div>
            <div class="restore-horiz-foot">
              <div class="restore-horiz-tags">
                ${statusBadge}
                <span class="badge muted">${obj.shortTag}</span>
              </div>
              <div class="restore-horiz-stat">
                ${rightStat}
              </div>
            </div>
            ${renderCardOrderNum(obj.order)}
          </div>
        `
      }

      return `
        <button
          type="button"
          class="restore-horiz-card bdd-whole-toggle-card ${selected ? 'selected card-tone-green' : 'card-tone-blue'}"
          data-action="toggle-object"
          data-obj="${obj.id}"
          data-bdd-label="多选卡：${obj.order}. ${obj.title}"
        >
          <div class="restore-horiz-top">
            <div class="restore-horiz-left">
              <div class="restore-step-icon-box">${ICONS[obj.icon]}</div>
              <div class="restore-horiz-copy">
                <h2>${obj.title}</h2>
                <p>${obj.desc}</p>
              </div>
            </div>
          </div>
          <div class="restore-horiz-foot">
            <div class="restore-horiz-tags">
              <span class="badge ${selected ? 'green' : 'muted'}">${selected ? '已选' : '未选'}</span>
              ${obj.note ? `<span class="badge gold">${obj.note}</span>` : ''}
            </div>
            <div class="restore-horiz-stat">
              <span>${obj.shortTag}</span>
              <strong>${obj.size}</strong>
            </div>
          </div>
          ${renderCardOrderNum(obj.order)}
        </button>
      `
    }).join('')

    if (!includeActionCard) {
      const allSelected = state.selectedObjects.length === 5
      return `
        <div class="restore-two-by-three-grid">
          ${fiveCardsHtml}
          <button
            type="button"
            class="restore-horiz-card bdd-whole-toggle-card ${allSelected ? 'card-tone-green' : 'card-tone-blue'}"
            data-action="select-all-objects"
            data-bdd-label="主次按钮：一键全选 5 类备份数据"
          >
            <div class="restore-horiz-top">
              <div class="restore-horiz-left">
                <div class="restore-step-icon-box">${ICONS.check}</div>
                <div class="restore-horiz-copy">
                  <h2>已选 ${state.selectedObjects.length} / 5 类备份数据</h2>
                  <p>默认全选全部 5 类核心数据，点击此卡片可一键全选所有类别。</p>
                </div>
              </div>
              <span class="badge ${allSelected ? 'green' : 'blue'}">${allSelected ? '已全选' : '按 ✕ 全选'}</span>
            </div>
            <div class="restore-horiz-foot">
              <div class="restore-horiz-tags">
                <span class="badge green">全量保护</span>
              </div>
              <div class="restore-horiz-stat">
                <strong>5.4 GB</strong>
              </div>
            </div>
          </button>
        </div>
      `
    }

    if (isRestoring) {
      if (mode === 'done') {
        const retried = state.restoreResultRetried
        return `
          <div class="restore-two-by-three-grid">
            ${fiveCardsHtml}
            <section class="restore-horiz-card restore-control-hub-card is-restoring-hub is-summary-hub ${retried ? 'card-tone-green' : 'card-tone-yellow'}" aria-live="polite" aria-label="恢复完成结果汇总">
              <div class="restore-horiz-top">
                <div class="restore-horiz-left">
                  <div class="restore-step-icon-box">${ICONS.check}</div>
                  <div class="restore-horiz-copy">
                    <h2>恢复完成汇总</h2>
                    <p>来源：${currentLoc.name} · ${currentRp.title}（${currentRp.size}）</p>
                  </div>
                </div>
                <div class="restore-hub-cta-group">
                  ${
                    !retried
                      ? `<button type="button" class="pill sm brand" data-action="retry-unfinished-items" data-bdd-label="主按钮：重试未完">重试未完</button>`
                      : ''
                  }
                  <button type="button" class="pill sm primary" data-action="finish-restore-and-close" data-bdd-label="主按钮：完成并退出汇总">完成</button>
                </div>
              </div>

              <div class="restore-inline-summary-strip">
                <div class="restore-inline-summary-col">
                  <span class="summary-col-label">已恢复</span>
                  <span class="badge green">${retried ? '5 项全齐' : '4 项完成'}</span>
                </div>
                <div class="restore-inline-summary-col">
                  <span class="summary-col-label">待处理</span>
                  <span class="badge gold">2 项待挂</span>
                </div>
                <div class="restore-inline-summary-col">
                  <span class="summary-col-label">未完成</span>
                  <span class="badge ${retried ? 'green' : 'red'}">${retried ? '0 项' : '1 项未完'}</span>
                </div>
              </div>
            </section>
          </div>
        `
      }

      const hubTitle =
        mode === 'conflict'
          ? '检测到《最后生还者 Part I》正在运行'
          : mode === 'resumed'
            ? '已从中断位置继续恢复剩余项目'
            : '正在按顺序恢复整机数据（第 3 / 5 步）'

      return `
        <div class="restore-two-by-three-grid">
          ${fiveCardsHtml}
          <button
            type="button"
            class="restore-horiz-card bdd-whole-toggle-card restore-control-hub-card is-restoring-hub ${mode === 'conflict' ? 'card-tone-yellow' : 'card-tone-blue'}"
            data-action="${mode === 'conflict' ? 'resolve-conflict-continue' : 'open-restore-result-modal'}"
            data-bdd-label="${mode === 'conflict' ? '整卡按 ✕：已关闭游戏，继续恢复' : '整卡按 ✕：查看恢复完成汇总'}"
            aria-live="polite"
          >
            <div class="restore-horiz-top">
              <div class="restore-horiz-left">
                <div class="restore-step-icon-box">${ICONS.restore}</div>
                <div class="restore-horiz-copy" style="text-align:left;">
                  <h2>${hubTitle}</h2>
                  <p>来源：${currentLoc.name} · ${currentRp.title}（剩余约 45 秒）</p>
                </div>
              </div>
              <span class="badge ${mode === 'conflict' ? 'gold' : 'blue'}">${mode === 'conflict' ? '按 ✕ 续传' : '恢复中'}</span>
            </div>

            <div class="restore-inline-progress-zone">
              <div class="restore-inline-bar-row">
                <div class="progress-bar-track inline-hub-track">
                  <div class="progress-bar-fill" style="width:${state.lockScene.progress}%"></div>
                </div>
                <strong class="inline-hub-percent">${state.lockScene.progress}%</strong>
              </div>

              <div class="restore-inline-warning-bottom">
                <span class="inline-warn-icon">${ICONS.warn}</span>
                <span>正在恢复数据，请勿启动游戏或关闭主机 · 全部项目完成后将自动解锁并汇总结果</span>
              </div>
            </div>
          </button>
        </div>
      `
    }

    return `
      <div class="restore-two-by-three-grid">
        ${fiveCardsHtml}
        <section class="restore-horiz-card restore-control-hub-card card-tone-blue" aria-label="恢复配置与执行控制台">
          <div class="restore-horiz-top">
            <div class="restore-horiz-left">
              <div class="restore-step-icon-box">${ICONS.restore}</div>
              <div class="restore-horiz-copy">
                <h2>恢复源与执行总控（已选 ${state.selectedObjects.length} / 5 项）</h2>
                <p>当前：${currentLoc.name} · ${currentRp.title}（${currentRp.size}）</p>
              </div>
            </div>
            <div class="restore-hub-cta-group">
              ${
                state.selectedObjects.length < 5
                  ? `<button type="button" class="pill sm secondary" data-action="select-all-objects" data-bdd-label="次按钮：全选">全选</button>`
                  : ''
              }
              <button
                type="button"
                class="pill sm primary"
                data-action="start-lock-demo"
                data-mode="normal"
                data-bdd-label="主按钮：立即恢复"
              >
                ${ICONS.restore}<span>立即恢复</span>
              </button>
            </div>
          </div>

          <div class="restore-hub-selectors">
            <div class="restore-hub-selector-row">
              <span class="restore-hub-label">位置</span>
              <div class="restore-hub-pills">
                ${state.locations
                  .map(
                    (loc) => `
                    <button
                      type="button"
                      class="restore-mini-pill ${state.selectedLocationId === loc.id ? 'active-loc' : ''}"
                      data-action="select-location"
                      data-loc="${loc.id}"
                      data-bdd-label="单选胶囊：恢复位置 ${loc.name}"
                    >
                      ${loc.name.replace(' 存储设备', '')}
                    </button>
                  `,
                  )
                  .join('')}
              </div>
            </div>
            <div class="restore-hub-selector-row">
              <span class="restore-hub-label">时间点</span>
              <div class="restore-hub-pills">
                ${state.restorePoints
                  .map(
                    (rp) => `
                    <button
                      type="button"
                      class="restore-mini-pill ${state.selectedRestorePointId === rp.id ? 'active-rp' : ''}"
                      data-action="select-rp"
                      data-rp="${rp.id}"
                      data-bdd-label="单选胶囊：时间点 ${rp.title}"
                    >
                      ${rp.title.replace(' 自动备份', '').replace(' 手动备份', ' 手动')}
                    </button>
                  `,
                  )
                  .join('')}
              </div>
            </div>
          </div>
        </section>
      </div>
    `
  }

  /* ==================== 子页 1：「恢复」（去除顶部冗余工具条，收敛为居中留白 2×3 卡片矩阵） ==================== */
  function renderRestorePage() {
    return `
      <main class="subpage-stage">
        <div class="subpage-content-body restore-centered-body">
          ${renderTwoByThreeObjectsGrid(true)}
        </div>

        ${renderPersistentDock(true)}
      </main>
    `
  }

  /* ==================== 子页 2：「其他」（左导右景聚焦舞台方案，统一 30rem 圆角） ==================== */
  function renderOtherStyleA() {
    const activeTab = state.otherTab || 'locations'
    const navItems = [
      {
        id: 'locations',
        icon: 'cloud',
        title: '存储位置与连接',
        sub: `已启用 ${state.locations.filter((l) => l.enabled).length} / 3 个位置`,
      },
      {
        id: 'scope',
        icon: 'save',
        title: '自动备份内容范围',
        sub: `已开启 ${state.autoBackupScope.length} / 5 类数据`,
      },
      {
        id: 'protect',
        icon: 'shield',
        title: '恢复点保护与清理',
        sub: `锁定 ${state.restorePoints.filter((r) => r.protected).length} 份 · 智能保底`,
      },
      {
        id: 'daemon',
        icon: 'settings',
        title: '后台守护与引导向导',
        sub: '退游落盘稳定同步',
      },
    ]

    let stageHtml = ''
    if (activeTab === 'locations') {
      const enabledCount = state.locations.filter((l) => l.enabled).length
      stageHtml = `
        <div class="other-a-stage-head">
          <div>
            <h2>备份存储位置与网络凭据</h2>
            <p>整张位置卡片落焦后按 ✕ 即可切换启用或暂停；WebDAV 位置支持按 ↓ 选择「修改凭据」唤起手柄软键盘。</p>
          </div>
          <span class="badge green">启用 ${enabledCount}/${state.locations.length}</span>
        </div>

        <div class="other-a-loc-grid">
          ${state.locations
            .map((loc, idx) => {
              const ringColors = ['#34D399', '#38BDF8', '#60A5FA']
              return `
                <div
                  role="button"
                  tabindex="0"
                  class="other-a-loc-card bdd-whole-toggle-card ${loc.enabled ? 'is-enabled selected card-tone-green' : 'card-tone-blue'}"
                  data-action="toggle-location"
                  data-loc="${loc.id}"
                  data-bdd-label="多选位置卡：${loc.name}"
                  aria-label="切换 ${loc.name}（当前${loc.enabled ? '已启用' : '已暂停'}）"
                >
                  <div class="other-a-loc-top">
                    <div class="other-a-loc-title">
                      ${loc.type === 'usb' ? ICONS.usb : ICONS.cloud}
                      <div>
                        <strong>${loc.name}</strong>
                        <small>${loc.endpoint}</small>
                      </div>
                    </div>
                  </div>

                  <div class="vb-ring-row" style="margin: 6rem 0;">
                    ${renderRadialGauge(loc.freePercent, loc.enabled ? ringColors[0] : ringColors[1])}
                    <div class="vb-ring-copy">
                      <strong style="font-size:21rem;">${loc.freeOnly} 可用</strong>
                      <span>总容量 ${loc.totalOnly}</span>
                      <small>${loc.enabled ? loc.statusText : '已暂停自动同步'}</small>
                    </div>
                  </div>

                  <div class="other-a-loc-foot">
                    <span>最近同步：${loc.lastSync}</span>
                    ${
                      loc.type === 'webdav'
                        ? `<button type="button" class="pill sm secondary" data-action="open-webdav-osk" data-loc="${loc.id}" data-bdd-label="次按钮：修改 ${loc.name} 凭据">修改凭据</button>`
                        : `<span class="badge ${loc.enabled ? 'green' : 'muted'}">${loc.enabled ? '已启用' : '已暂停'}</span>`
                    }
                  </div>
                  ${renderCardOrderNum(idx + 1)}
                </div>
              `
            })
            .join('')}
        </div>
      `
    } else if (activeTab === 'scope') {
      stageHtml = `
        <div class="other-a-stage-head">
          <div>
            <h2>自动备份内容范围</h2>
            <p>关闭游戏或变更宿主配置后，后台守护服务将自动增量同步以下已勾选的数据类别。</p>
          </div>
          <span class="badge green">已选 ${state.autoBackupScope.length}/5</span>
        </div>

        <div class="other-a-scope-grid">
          ${FIVE_OBJECTS.map((obj) => {
            const on = state.autoBackupScope.includes(obj.id)
            return `
              <button
                type="button"
                class="other-a-scope-card bdd-whole-toggle-card ${on ? 'selected card-tone-green' : 'card-tone-blue'}"
                data-action="toggle-auto-scope"
                data-obj="${obj.id}"
                data-bdd-label="多选范围卡：${obj.title}"
              >
                <div class="other-a-scope-top">
                  <div class="other-a-scope-title">
                    <span class="other-clean-icon">${ICONS[obj.icon]}</span>
                    <div>
                      <strong>${obj.title}</strong>
                      <small>${obj.countText} · ${obj.size}</small>
                    </div>
                  </div>
                </div>
                <p>${obj.desc}</p>
                ${renderCardOrderNum(obj.order)}
              </button>
            `
          }).join('')}
        </div>
      `
    } else if (activeTab === 'protect') {
      const protectedCount = state.restorePoints.filter((rp) => rp.protected).length
      stageHtml = `
        <div class="other-a-stage-head">
          <div>
            <h2>恢复点锁定保护与空间自动清理</h2>
            <p>整张恢复点卡片落焦后按 ✕ 即可切换锁定保护；空间不足时自动清理未锁定旧点并保底保留最新完整点。</p>
          </div>
          <span class="badge green">锁定 ${protectedCount}/${state.restorePoints.length}</span>
        </div>

        ${
          state.spaceLowSimulated
            ? `
            <div class="inline-notice-box warn" style="margin:0;">
              <div>
                <strong style="display:block; font-size:15rem; color:#ffd4d2;">USB 存储设备可用空间不足</strong>
                <span style="font-size:13rem; color:#e6c3c1;">已自动清理未锁定旧恢复点并保留最新完整点。</span>
              </div>
              <span class="badge gold">空间告警</span>
            </div>
          `
            : ''
        }

        <div class="other-a-rp-grid">
          ${state.restorePoints
            .map(
              (rp, idx) => `
              <button
                type="button"
                class="other-a-rp-card bdd-whole-toggle-card ${rp.protected ? 'is-protected selected card-tone-green' : 'card-tone-blue'}"
                data-action="toggle-rp-protect"
                data-rp="${rp.id}"
                data-bdd-label="多选保护卡：${rp.title}"
              >
                <div>
                  <div class="other-a-loc-top">
                    <strong style="font-size:19rem; color:#f8fafc;">${rp.title}</strong>
                  </div>
                  <p style="margin:10rem 0; font-size:13.5rem; color:#a8b8ce; line-height:1.5; text-align:left;">${rp.summary}</p>
                </div>
                <div class="other-a-loc-foot">
                  <span>体积 ${rp.size} · ${rp.note}</span>
                  ${
                    rp.isLatestComplete
                      ? '<span class="badge green">保底保留</span>'
                      : `<span class="badge ${rp.protected ? 'green' : 'muted'}">${rp.protected ? '已锁定' : '可清理'}</span>`
                  }
                </div>
                ${renderCardOrderNum(idx + 1)}
              </button>
            `,
            )
            .join('')}
        </div>
      `
    } else {
      stageHtml = `
        <div class="other-a-stage-head">
          <div>
            <h2>后台守护服务与初始化向导</h2>
            <p>守护服务在关闭界面后继续常驻运行；整张卡片落焦后按 ✕ 即可立即触发手动备份或重新打开三步引导向导。</p>
          </div>
          <span class="badge green">常驻运行</span>
        </div>

        <div class="other-a-daemon-grid">
          <button
            type="button"
            class="other-a-rp-card bdd-whole-toggle-card card-tone-green"
            data-action="manual-backup"
            data-bdd-label="动作大卡：立即手动增量备份"
          >
            <div>
              <div class="other-a-loc-top">
                <div class="other-a-scope-title">
                  <span class="other-clean-icon">${ICONS.bolt}</span>
                  <strong>游戏退出后存档稳定监听</strong>
                </div>
              </div>
              <p style="margin:12rem 0 0; font-size:14rem; color:#b2c2d8; line-height:1.55; text-align:left;">
                实时监测前台游戏生命周期与存档目录写入状态，仅在退出游戏且文件落盘稳定后触发增量备份，绝不干扰游玩帧率。
              </p>
            </div>
            <div class="other-a-loc-foot">
              <span>上次触发：今天 19:10（《最后生还者 Part I》）</span>
              <span class="badge green">零抢占</span>
            </div>
            ${renderCardOrderNum(1)}
          </button>

          <button
            type="button"
            class="other-a-rp-card bdd-whole-toggle-card card-tone-blue"
            data-action="open-onboarding"
            data-bdd-label="动作大卡：打开三步引导向导"
          >
            <div>
              <div class="other-a-loc-top">
                <div class="other-a-scope-title">
                  <span class="other-clean-icon">${ICONS.settings}</span>
                  <strong>插件变更即时同步与向导重置</strong>
                </div>
              </div>
              <p style="margin:12rem 0 0; font-size:14rem; color:#b2c2d8; line-height:1.55; text-align:left;">
                当系统载荷、自启插件列表或外置盘游戏扫描路径发生变更时自动同步；您也可以随时重新进入三步初始化向导。
              </p>
            </div>
            <div class="other-a-loc-foot">
              <span>支持三步向导随时重配</span>
              <span class="badge blue">重配向导</span>
            </div>
            ${renderCardOrderNum(2)}
          </button>
        </div>
      `
    }

    return `
      <div class="other-style-a-shell">
        <aside class="other-a-sidebar" role="tablist" aria-label="设置分类导航">
          ${navItems
            .map(
              (item) => `
              <button
                type="button"
                class="other-a-nav-btn ${activeTab === item.id ? 'active' : ''}"
                data-action="select-other-tab"
                data-tab="${item.id}"
                data-bdd-label="左侧导航轨：${item.title}"
              >
                <span class="other-clean-icon">${ICONS[item.icon]}</span>
                <div class="other-a-nav-copy">
                  <strong>${item.title}</strong>
                  <small>${item.sub}</small>
                </div>
              </button>
            `,
            )
            .join('')}
        </aside>

        <section class="other-a-stage">
          ${stageHtml}
        </section>
      </div>
    `
  }

  function renderOtherPage() {
    return `
      <main class="subpage-stage">
        <div class="subpage-content-body other-showcase-body">
          ${renderOtherStyleA()}
        </div>

        ${renderPersistentDock(true)}
      </main>
    `
  }

  /* ==================== 首次引导分步向导（一步一步来：Step 1 → Step 2 → Step 3，单屏只聚焦当前步骤） ==================== */
  function renderOnboardingOverlay() {
    if (!state.onboardingOpen) return ''
    const hasRp = state.onboardingHasRp
    const step = state.onboardingStep
    const enabledLocs = state.locations.filter((l) => l.enabled)
    const selectedRp = state.restorePoints.find((r) => r.id === state.selectedRestorePointId) || state.restorePoints[0]

    const stepLabels = [
      { num: 1, title: '1. 选择存储位置' },
      { num: 2, title: hasRp ? '2. 选择恢复点' : '2. 选择备份内容' },
      { num: 3, title: hasRp ? '3. 确认并恢复' : '3. 确认首次备份' },
    ]

    let stageContent = ''
    let footerLeft = ''
    let footerRight = ''

    if (step === 1) {
      stageContent = `
        <div class="wizard-stage-head">
          <div>
            <h2>第一步：选择备份存储位置（可多选）</h2>
            <p>整张卡片落焦后按 ✕ 切换启用或暂停；网络存储可按 ↓ 选择「填写地址与账号」打开手柄软键盘。</p>
          </div>
          <span class="badge green">启用 ${enabledLocs.length}/${state.locations.length}</span>
        </div>

        <div class="wizard-locations-grid">
          ${state.locations
            .map(
              (loc, idx) => `
            <div
              role="button"
              tabindex="0"
              class="wizard-loc-card bdd-whole-toggle-card ${loc.enabled ? 'selected card-tone-green' : 'card-tone-blue'}"
              data-action="toggle-location"
              data-loc="${loc.id}"
              data-bdd-label="多选位置卡：${loc.name}"
              aria-label="切换 ${loc.name}"
            >
              <div>
                <div class="loc-row-top" style="margin-bottom:14rem;">
                  <div class="loc-row-title">
                    ${loc.type === 'usb' ? ICONS.usb : ICONS.cloud}
                    <span>${loc.name}</span>
                  </div>
                </div>
                <p style="margin:0 0 10rem; font-size:15.5rem; color:#b2c0d4;">
                  ${hasRp ? `最近备份：${loc.lastSync}` : '设备已就绪，可用于存放备份'}
                </p>
                <p style="margin:0; font-size:14rem; color:#8fa1b8;">
                  ${loc.freeSpace} · ${loc.endpoint}
                </p>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; padding-top:16rem; border-top:1rem solid rgba(255,255,255,0.08);">
                <span class="badge ${loc.enabled ? 'green' : 'muted'}">${loc.enabled ? '已启用' : '已暂停'}</span>
                ${
                  loc.type === 'webdav'
                    ? `<button type="button" class="pill sm secondary" data-action="open-webdav-osk" data-loc="${loc.id}" data-bdd-label="次按钮：填写 ${loc.name} 凭据">填写地址与账号</button>`
                    : `<span class="badge blue">按 ✕ 切换</span>`
                }
              </div>
              ${renderCardOrderNum(idx + 1)}
            </div>
          `,
            )
            .join('')}
        </div>
      `
      footerLeft = `
        <div>
          <strong style="font-size:18.5rem; display:block; margin-bottom:4rem;">已启用 ${enabledLocs.length} 个存储位置</strong>
          <span style="font-size:14rem; color:#9fb0c6;">确认位置后进入下一步：${hasRp ? '自动扫描可用恢复点' : '选择首次备份的数据范围'}。</span>
        </div>
      `
      footerRight = `
        <div style="display:flex; gap:12rem;">
          <button type="button" class="pill secondary" data-action="close-onboarding" data-bdd-label="次按钮：跳过向导">跳过向导</button>
          <button type="button" class="pill primary" data-action="wizard-next-step" data-bdd-label="主按钮：下一步">
            <span>下一步</span>
          </button>
        </div>
      `
    } else if (step === 2) {
      if (hasRp) {
        stageContent = `
          <div class="wizard-stage-head">
            <div>
              <h2>第二步：已发现可用恢复点</h2>
              <p>已默认为您选中最新完整恢复点，您也可以切换至其他历史时间点。</p>
            </div>
            <span class="badge blue">${state.restorePoints.length} 份可用</span>
          </div>

          <div class="rp-cards-row">
            ${state.restorePoints
              .map(
                (rp, idx) => `
              <button
                type="button"
                class="rp-card ${state.selectedRestorePointId === rp.id ? 'selected card-tone-green' : 'card-tone-blue'}"
                data-action="select-rp"
                data-rp="${rp.id}"
                data-bdd-label="单选恢复点卡：${rp.title}"
              >
                <div>
                  <div class="rp-card-top">
                    <strong style="font-size:20rem;">${rp.title}</strong>
                  </div>
                  <div class="rp-card-desc" style="margin-top:12rem;">${rp.summary}</div>
                </div>
                <div class="rp-card-foot">
                  <span>体积：${rp.size} · ${rp.note}</span>
                  ${rp.isLatestComplete ? '<span class="badge green">推荐</span>' : `<span class="badge ${state.selectedRestorePointId === rp.id ? 'green' : 'muted'}">${state.selectedRestorePointId === rp.id ? '已选' : '可选'}</span>`}
                </div>
                ${renderCardOrderNum(idx + 1)}
              </button>
            `,
              )
              .join('')}
          </div>
        `
        footerLeft = `
          <div>
            <strong style="font-size:18.5rem; display:block; margin-bottom:4rem;">当前选中：${selectedRp.title}（${selectedRp.size}）</strong>
            <span style="font-size:14rem; color:#9fb0c6;">下一步将预览整机恢复清单并确认开始执行。</span>
          </div>
        `
      } else {
        stageContent = `
          <div class="wizard-stage-head">
            <div>
              <h2>第二步：选择首次备份内容范围</h2>
              <p>所选存储位置尚无历史恢复点，已默认为您全选全部 5 类核心数据。</p>
            </div>
            <span class="badge green">已选 ${state.selectedObjects.length}/5</span>
          </div>

          ${renderTwoByThreeObjectsGrid(false)}
        `
        footerLeft = `
          <div>
            <strong style="font-size:18.5rem; display:block; margin-bottom:4rem;">已勾选 ${state.selectedObjects.length} / 5 类受保护数据</strong>
            <span style="font-size:14rem; color:#9fb0c6;">下一步将确认存储目标并创建第一份完整恢复点。</span>
          </div>
        `
      }
      footerRight = `
        <div style="display:flex; gap:12rem;">
          <button type="button" class="pill secondary" data-action="wizard-prev-step" data-bdd-label="次按钮：上一步">上一步</button>
          <button type="button" class="pill primary" data-action="wizard-next-step" data-bdd-label="主按钮：下一步">
            <span>下一步</span>
          </button>
        </div>
      `
    } else {
      stageContent = `
        <div class="wizard-stage-head">
          <div>
            <h2>${hasRp ? '第三步：确认整机恢复方案' : '第三步：确认创建首份完整恢复点'}</h2>
            <p>${hasRp ? '核对以下恢复来源、目标时间点与执行顺序，确认后立即进入全屏专注恢复。' : '核对以下备份位置与数据范围，确认后立即启动首次全量备份并开启后台守护。'}</p>
          </div>
          <span class="badge green">已就绪</span>
        </div>

        <div class="wizard-summary-grid">
          <div class="wizard-loc-card selected card-tone-green">
            <div>
              <div class="loc-row-top" style="margin-bottom:14rem;">
                <span class="badge green">位置</span>
              </div>
              <h3 style="margin:0 0 10rem; font-size:24rem; font-weight:500;">已启用 ${enabledLocs.length} 个备份位置</h3>
              <p style="margin:0; font-size:15rem; color:#b5c3d7; line-height:1.6;">
                ${enabledLocs.map((l) => `• ${l.name}（${l.freeSpace}）`).join('<br/>')}
              </p>
            </div>
            <div class="rp-card-foot">
              <span>多位置独立同步</span>
              <span>互不阻塞</span>
            </div>
            ${renderCardOrderNum(1)}
          </div>

          <div class="wizard-loc-card selected card-tone-green">
            <div>
              <div class="loc-row-top" style="margin-bottom:14rem;">
                <span class="badge green">${hasRp ? '恢复点' : '范围'}</span>
              </div>
              <h3 style="margin:0 0 10rem; font-size:24rem; font-weight:500;">
                ${hasRp ? selectedRp.title : `共 ${state.selectedObjects.length} 类主机核心数据`}
              </h3>
              <p style="margin:0; font-size:15rem; color:#b5c3d7; line-height:1.6;">
                ${hasRp ? selectedRp.summary : '包含系统插件与载荷、游戏桌面展示、全游戏通用存档、系统设置与媒体图库。'}
              </p>
            </div>
            <div class="rp-card-foot">
              <span>预计数据量：5.4 GB</span>
              <span>${hasRp ? selectedRp.note : '块级去重'}</span>
            </div>
            ${renderCardOrderNum(2)}
          </div>

          <div class="wizard-loc-card card-tone-blue">
            <div>
              <div class="loc-row-top" style="margin-bottom:14rem;">
                <span class="badge blue">策略</span>
              </div>
              <h3 style="margin:0 0 10rem; font-size:24rem; font-weight:500;">
                ${hasRp ? '按依赖顺序还原 + 断点续做' : '退出游戏自动增量同步'}
              </h3>
              <p style="margin:0; font-size:15rem; color:#b5c3d7; line-height:1.6;">
                ${
                  hasRp
                    ? '严格按「插件与载荷 → 桌面展示 → 通用存档 → 系统设置 → 媒体图库」顺序执行，断电重启自动续做。'
                    : '首次备份完成后，守护进程常驻后台，在每次关闭游戏且存档落盘稳定后自动增量同步。'
                }
              </p>
            </div>
            <div class="rp-card-foot">
              <span>零抢占保护</span>
              <span>保底最新点</span>
            </div>
            ${renderCardOrderNum(3)}
          </div>
        </div>
      `
      footerLeft = `
        <div>
          <strong style="font-size:18.5rem; display:block; margin-bottom:4rem;">
            ${hasRp ? `即将从「${selectedRp.title}」恢复整机数据` : '即将创建第一份 5.4 GB 完整恢复点'}
          </strong>
          <span style="font-size:14rem; color:#9fb0c6;">按 ◯ 或点击「上一步」可返回修改配置。</span>
        </div>
      `
      footerRight = `
        <div style="display:flex; gap:12rem;">
          <button type="button" class="pill secondary" data-action="wizard-prev-step" data-bdd-label="次按钮：上一步">上一步</button>
          ${
            hasRp
              ? `
              <button type="button" class="pill primary" data-action="start-lock-demo" data-mode="normal" data-bdd-label="主按钮：开始整机恢复">
                ${ICONS.restore}<span>开始整机恢复</span>
              </button>
            `
              : `
              <button type="button" class="pill primary" data-action="trigger-initial-backup" data-bdd-label="主按钮：开始首次备份">
                ${ICONS.bolt}<span>开始首次备份</span>
              </button>
            `
          }
        </div>
      `
    }

    return `
      <div class="fullscreen-overlay" role="dialog" aria-modal="true" aria-label="首次使用分步引导向导">
        <div class="wizard-header">
          <div class="wizard-brand">
            <img src="./assets/restore-logo-full.png" alt="ReStore" />
            <div>
              <h1>欢迎使用 ReStore</h1>
              <p>按照三步向导完成备份位置绑定与数据初始化</p>
            </div>
          </div>

          <div class="wizard-stepper" role="navigation" aria-label="向导步骤">
            ${stepLabels
              .map(
                (s) => `
              <button
                type="button"
                class="wizard-step-pill ${step === s.num ? 'active' : step > s.num ? 'done' : ''}"
                data-action="wizard-goto-step"
                data-step="${s.num}"
                data-bdd-label="步骤胶囊：${s.title}"
              >
                <span>${s.title}</span>
              </button>
            `,
              )
              .join('')}
          </div>
        </div>

        <section class="wizard-stage-card">
          ${stageContent}
        </section>

        <div class="wizard-footer-bar">
          ${footerLeft}
          ${footerRight}
        </div>
      </div>
    `
  }

  function renderModal() {
    if (state.modal === 'webdav-osk') {
      const loc = state.locations.find((l) => l.id === state.editingLocationId) || state.locations[1]
      const activeField = state.oskForm.activeField || 'url'
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
            <p>使用手柄方向键在顶部切换「服务器地址 / 账号 / 密码」目标字段，再在下方的软键盘按 ✕ 输入字符。</p>
            <div class="osk-field-grid">
              <button
                type="button"
                class="osk-field osk-field-selectable ${activeField === 'url' ? 'is-active-field' : ''}"
                data-action="select-osk-field"
                data-field="url"
                data-bdd-label="输入框目标：服务器地址"
              >
                <div class="osk-field-head">
                  <label>服务器地址</label>
                  <span class="badge ${activeField === 'url' ? 'green' : 'muted'}">${activeField === 'url' ? '输入中' : '可切换'}</span>
                </div>
                <div class="modal-input-display">${state.oskForm.url || '<span style="opacity:0.45">请输入地址</span>'}<i class="osk-caret"></i></div>
              </button>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:14rem;">
                <button
                  type="button"
                  class="osk-field osk-field-selectable ${activeField === 'user' ? 'is-active-field' : ''}"
                  data-action="select-osk-field"
                  data-field="user"
                  data-bdd-label="输入框目标：账号"
                >
                  <div class="osk-field-head">
                    <label>账号</label>
                    <span class="badge ${activeField === 'user' ? 'green' : 'muted'}">${activeField === 'user' ? '输入中' : '可切换'}</span>
                  </div>
                  <div class="modal-input-display">${state.oskForm.user || '<span style="opacity:0.45">请输入账号</span>'}<i class="osk-caret"></i></div>
                </button>
                <button
                  type="button"
                  class="osk-field osk-field-selectable ${activeField === 'pass' ? 'is-active-field' : ''}"
                  data-action="select-osk-field"
                  data-field="pass"
                  data-bdd-label="输入框目标：密码"
                >
                  <div class="osk-field-head">
                    <label>密码</label>
                    <span class="badge ${activeField === 'pass' ? 'green' : 'muted'}">${activeField === 'pass' ? '输入中' : '可切换'}</span>
                  </div>
                  <div class="modal-input-display">${state.oskForm.pass || '<span style="opacity:0.45">请输入密码</span>'}<i class="osk-caret"></i></div>
                </button>
              </div>
            </div>
            <div class="osk-keypad" aria-label="软键盘">
              ${keys
                .map(
                  (row) => `
                <div class="osk-keypad-row">
                  ${row.map((k) => `<button type="button" class="osk-key" data-action="osk-key" data-key="${k}" data-bdd-label="软键盘按键：${k}">${k}</button>`).join('')}
                </div>
              `,
                )
                .join('')}
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:22rem;">
              <span class="badge green">${ICONS.check}<span>连接正常</span></span>
              <div style="display:flex; gap:12rem;">
                <button type="button" class="pill secondary sm" data-action="close-modal" data-bdd-label="次按钮：取消并关闭弹窗">取消</button>
                <button type="button" class="pill primary sm" data-action="save-webdav-osk" data-bdd-label="主按钮：保存并连接 WebDAV">保存并连接</button>
              </div>
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
            class="proto-dock-btn ${state.lockScene.active && state.lockScene.mode === 'done' ? 'active' : ''}"
            data-action="start-lock-demo"
            data-mode="done"
          >
            恢复：完成汇总
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
    if (state.view === 'restore' || state.lockScene.active) return renderRestorePage()
    if (state.view === 'other') return renderOtherPage()
    return renderHomePage()
  }

  /* ==================== 计算各页面/弹窗的默认初始落焦选择器（方案 A：直达主按钮） ==================== */
  function getDefaultFocusSelector() {
    if (state.modal === 'webdav-osk') {
      return '.modal .osk-key[data-key="http://"]'
    }
    if (state.onboardingOpen) {
      return '.fullscreen-overlay .wizard-footer-bar .pill.primary'
    }
    if (state.view === 'restore' || state.lockScene.active) {
      if (state.lockScene.active) {
        if (state.lockScene.mode === 'done') {
          return state.restoreResultRetried
            ? '[data-action="finish-restore-and-close"]'
            : '[data-action="retry-unfinished-items"]'
        }
        return state.lockScene.mode === 'conflict'
          ? '[data-action="resolve-conflict-continue"]'
          : '[data-action="open-restore-result-modal"]'
      }
      return '.restore-control-hub-card [data-action="start-lock-demo"]'
    }
    if (state.view === 'other') {
      return `.other-a-nav-btn[data-tab="${state.otherTab || 'locations'}"]`
    }
    return `.dock-icon-card[data-dock-id="${state.focusedDockId || 'restore'}"]`
  }

  function buildFocusIdentitySelector(el) {
    if (!el || !el.dataset) return null
    const act = el.dataset.action
    if (!act) return null
    if (el.dataset.dockId) return `[data-action="${act}"][data-dock-id="${el.dataset.dockId}"]`
    if (el.dataset.obj) return `[data-action="${act}"][data-obj="${el.dataset.obj}"]`
    if (el.dataset.loc) return `[data-action="${act}"][data-loc="${el.dataset.loc}"]`
    if (el.dataset.rp) return `[data-action="${act}"][data-rp="${el.dataset.rp}"]`
    if (el.dataset.tab) return `[data-action="${act}"][data-tab="${el.dataset.tab}"]`
    if (el.dataset.key) return `[data-action="${act}"][data-key="${CSS.escape(el.dataset.key)}"]`
    if (el.dataset.field) return `[data-action="${act}"][data-field="${el.dataset.field}"]`
    if (el.dataset.step) return `[data-action="${act}"][data-step="${el.dataset.step}"]`
    return `[data-action="${act}"]`
  }

  function applyFocusToSelector(selector) {
    if (!selector) return false
    const target = document.querySelector(selector)
    if (!target) return false
    document.querySelectorAll('[data-pad-focus="true"]').forEach((n) => delete n.dataset.padFocus)
    target.dataset.padFocus = 'true'
    target.focus({ preventScroll: true })
    return true
  }

  function render(reason = 'update') {
    const app = document.getElementById('app')
    if (!app) return
    const previous = window.PS5Motion ? window.PS5Motion.capture() : {}

    const prevFocusedEl = document.querySelector('[data-pad-focus="true"]')
    const preservedSelector = reason === 'update' ? buildFocusIdentitySelector(prevFocusedEl) : null

    app.innerHTML = `
      <div
        class="app-shell"
        data-view="${state.view}"
        data-focus-dock="${state.focusedDockId}"
        data-onboarding-step="${state.onboardingOpen ? state.onboardingStep : ''}"
      >
        <div class="console-wallpaper" aria-hidden="true"></div>
        ${renderHeader()}
        ${renderMainScene()}
        ${renderOnboardingOverlay()}
        ${renderDualSenseBar()}
        ${renderFloatingDevDock()}
        ${renderModal()}
      </div>
    `

    const targetSelector = state.pendingFocusSelector || preservedSelector || getDefaultFocusSelector()
    state.pendingFocusSelector = null
    if (!applyFocusToSelector(targetSelector)) {
      applyFocusToSelector(getDefaultFocusSelector())
    }

    if (window.PS5Motion) {
      window.PS5Motion.animate(previous, reason)
    }
    syncUrl()
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
      state.pendingFocusSelector = state.lastTriggerSelector || null
      state.lastTriggerSelector = null
      render('update')
    } else if (state.onboardingOpen) {
      if (state.onboardingStep > 1) {
        state.onboardingStep -= 1
      } else {
        state.onboardingOpen = false
      }
      render('route')
    } else if (state.lockScene.active) {
      if (state.lockScene.mode !== 'done') {
        showToast('正在恢复数据，请等待当前恢复完成后再返回')
        return
      }
      state.lockScene.active = false
      state.pendingFocusSelector = '.restore-control-hub-card [data-action="start-lock-demo"]'
      render('route')
    } else if (state.view !== 'home') {
      const exitFromDockId = state.view === 'other' ? 'other' : 'restore'
      state.focusedDockId = exitFromDockId
      state.view = 'home'
      state.pendingFocusSelector = `.dock-icon-card[data-dock-id="${exitFromDockId}"]`
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

    if (
      !btn.classList.contains('ds-prompt') &&
      !btn.classList.contains('proto-dock-btn') &&
      !btn.classList.contains('proto-dev-tag')
    ) {
      document.querySelectorAll('[data-pad-focus="true"]').forEach((n) => delete n.dataset.padFocus)
      btn.dataset.padFocus = 'true'
    }

    switch (action) {
      case 'open-dock-item': {
        if (state.lockScene.active && state.lockScene.mode !== 'done') {
          showToast('正在恢复数据，请先完成当前恢复任务')
          return
        }
        state.lockScene.active = false
        const targetId = btn.dataset.dockId
        state.focusedDockId = targetId
        state.onboardingOpen = false
        const goingHome = state.view === targetId
        state.view = goingHome ? 'home' : targetId
        if (goingHome) {
          state.pendingFocusSelector = `.dock-icon-card[data-dock-id="${targetId}"]`
        }
        render('route')
        break
      }
      case 'toggle-dev-dock':
        state.devDockCollapsed = !state.devDockCollapsed
        render('update')
        break
      case 'select-other-tab': {
        const t = btn.dataset.tab || 'locations'
        state.otherTab = t
        state.pendingFocusSelector = `.other-a-nav-btn[data-tab="${t}"]`
        render('update')
        break
      }
      case 'open-onboarding':
        state.onboardingOpen = true
        state.onboardingStep = 1
        render('route')
        break
      case 'close-onboarding':
        state.onboardingOpen = false
        render('route')
        break
      case 'wizard-next-step':
        if (state.onboardingStep < 3) {
          state.onboardingStep += 1
          render('route')
        }
        break
      case 'wizard-prev-step':
        if (state.onboardingStep > 1) {
          state.onboardingStep -= 1
          render('route')
        }
        break
      case 'wizard-goto-step': {
        const targetStep = parseInt(btn.dataset.step, 10)
        if (targetStep >= 1 && targetStep <= 3) {
          state.onboardingStep = targetStep
          render('route')
        }
        break
      }
      case 'demo-onboarding-has-rp':
        if (state.onboardingOpen && state.onboardingHasRp) {
          state.onboardingOpen = false
        } else {
          state.lockScene.active = false
          state.onboardingOpen = true
          state.onboardingHasRp = true
          state.onboardingStep = 1
        }
        render('route')
        break
      case 'demo-onboarding-empty':
        if (state.onboardingOpen && !state.onboardingHasRp) {
          state.onboardingOpen = false
        } else {
          state.lockScene.active = false
          state.onboardingOpen = true
          state.onboardingHasRp = false
          state.onboardingStep = 1
          state.selectedObjects = FIVE_OBJECTS.map((o) => o.id)
        }
        render('route')
        break
      case 'toggle-location': {
        const loc = state.locations.find((l) => l.id === btn.dataset.loc)
        if (loc) {
          loc.enabled = !loc.enabled
          showToast(`${loc.name}${loc.enabled ? '已启用' : '已暂停'}`)
          state.pendingFocusSelector = `[data-action="toggle-location"][data-loc="${loc.id}"]`
          render('update')
        }
        break
      }
      case 'select-location':
        state.selectedLocationId = btn.dataset.loc
        state.pendingFocusSelector = `[data-action="select-location"][data-loc="${btn.dataset.loc}"]`
        render('update')
        break
      case 'select-rp':
        state.selectedRestorePointId = btn.dataset.rp
        state.pendingFocusSelector = `[data-action="select-rp"][data-rp="${btn.dataset.rp}"]`
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
        state.pendingFocusSelector = `[data-action="toggle-object"][data-obj="${id}"]`
        render('update')
        break
      }
      case 'select-all-objects':
        state.selectedObjects = FIVE_OBJECTS.map((o) => o.id)
        showToast('已全选全部 5 类数据')
        state.pendingFocusSelector = state.onboardingOpen
          ? '.fullscreen-overlay [data-action="select-all-objects"]'
          : '.restore-control-hub-card [data-action="start-lock-demo"]'
        render('update')
        break
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
          state.view = 'restore'
          state.focusedDockId = 'restore'
          state.lockScene.active = true
          state.lockScene.mode = targetMode
          state.lockScene.progress = targetMode === 'done' ? 100 : targetMode === 'resumed' ? 76 : 68
          if (targetMode === 'done') {
            state.restoreResultRetried = false
          }
        }
        render('route')
        break
      }
      case 'resolve-conflict-continue':
        state.lockScene.mode = 'normal'
        state.lockScene.progress = 92
        state.lockScene.currentDetail = '《最后生还者 Part I》已关闭，正在完成存档恢复'
        showToast('已继续恢复《最后生还者 Part I》存档')
        state.pendingFocusSelector = '[data-action="open-restore-result-modal"]'
        render('update')
        break
      case 'open-restore-result-modal':
        state.restoreResultRetried = false
        state.modal = null
        state.lockScene.active = true
        state.lockScene.mode = 'done'
        state.lockScene.progress = 100
        state.pendingFocusSelector = '[data-action="retry-unfinished-items"]'
        render('update')
        break
      case 'retry-unfinished-items':
        state.restoreResultRetried = true
        state.lockScene.progress = 100
        showToast('未完成项已重试成功')
        state.pendingFocusSelector = '[data-action="finish-restore-and-close"]'
        render('update')
        break
      case 'finish-restore-and-close':
        state.modal = null
        state.lockScene.active = false
        state.pendingFocusSelector = '.restore-control-hub-card [data-action="start-lock-demo"]'
        render('update')
        break
      case 'open-webdav-osk':
        state.lastTriggerSelector = buildFocusIdentitySelector(btn)
        state.editingLocationId = btn.dataset.loc || 'lan'
        state.modal = 'webdav-osk'
        state.pendingFocusSelector = '.modal .osk-key[data-key="http://"]'
        render('update')
        break
      case 'select-osk-field': {
        const f = btn.dataset.field || 'url'
        state.oskForm.activeField = f
        state.pendingFocusSelector = `.modal [data-action="select-osk-field"][data-field="${f}"]`
        render('update')
        break
      }
      case 'osk-key': {
        const k = btn.dataset.key
        const field = state.oskForm.activeField || 'url'
        if (k === '退格') {
          state.oskForm[field] = state.oskForm[field].slice(0, -1)
        } else {
          state.oskForm[field] += k
        }
        state.pendingFocusSelector = `.modal .osk-key[data-key="${CSS.escape(k)}"]`
        render('update')
        break
      }
      case 'save-webdav-osk': {
        const loc = state.locations.find((l) => l.id === state.editingLocationId)
        if (loc) {
          loc.enabled = true
          loc.status = 'connected'
          loc.progress = 100
          loc.statusText = '在线 · 已同步最新备份'
        }
        state.modal = null
        state.pendingFocusSelector = state.lastTriggerSelector || null
        state.lastTriggerSelector = null
        showToast('WebDAV 连接配置已保存')
        render('update')
        break
      }
      case 'close-modal':
        state.modal = null
        state.pendingFocusSelector = state.lastTriggerSelector || null
        state.lastTriggerSelector = null
        render('update')
        break
      case 'toggle-rp-protect': {
        const rp = state.restorePoints.find((r) => r.id === btn.dataset.rp)
        if (rp) {
          rp.protected = !rp.protected
          showToast(`${rp.title}${rp.protected ? '已锁定保护' : '已解除保护'}`)
          state.pendingFocusSelector = `[data-action="toggle-rp-protect"][data-rp="${rp.id}"]`
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
        state.pendingFocusSelector = `[data-action="toggle-auto-scope"][data-obj="${id}"]`
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
          state.focusedDockId = 'restore'
          state.view = 'restore'
          render('route')
        } else {
          state.focusedDockId = 'restore'
          state.lockScene.active = true
          state.lockScene.mode = 'normal'
          state.lockScene.progress = 68
          render('route')
        }
        break
    }
  })

  /* 当方向键落焦到子页导航轨时，执行 Selection Follows Focus（落焦即切页） */
  function handleFocusEnteredElement(el) {
    if (!el || !el.dataset) return
    const act = el.dataset.action

    // 1. 其他页左侧四项导航轨：上下移动焦点立即切换右侧设置舞台
    if (act === 'select-other-tab') {
      const targetTab = el.dataset.tab
      if (targetTab && state.otherTab !== targetTab) {
        state.otherTab = targetTab
        state.pendingFocusSelector = `.other-a-nav-btn[data-tab="${targetTab}"]`
        render('update')
        return
      }
    }

    // 2. 子页底部紧凑控制坞（恢复 ↔ 其他）：在子页内移到底坞左右切换时立即切页
    if (act === 'open-dock-item' && state.view !== 'home' && !state.lockScene.active) {
      const targetDock = el.dataset.dockId
      if (targetDock && state.view !== targetDock) {
        state.focusedDockId = targetDock
        state.view = targetDock
        state.pendingFocusSelector = `.dock-icon-card[data-dock-id="${targetDock}"]`
        render('route')
      }
    }
  }

  function moveFocusSpatially(dir) {
    const scopeRoot = state.modal
      ? document.querySelector('.modal')
      : state.onboardingOpen
        ? document.querySelector('.fullscreen-overlay')
        : document.getElementById('app')

    const candidates = [
      ...(scopeRoot || document).querySelectorAll(
        'button:not([disabled]):not(.proto-dock-btn):not(.proto-dev-tag):not(.ds-prompt), [role="button"][tabindex="0"], input:not([disabled])',
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
      handleFocusEnteredElement(candidates[0])
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
    handleFocusEnteredElement(next)
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

    if (e.key === 'Enter' || e.key === ' ') {
      const focused = document.querySelector('[data-pad-focus="true"]')
      if (focused) {
        e.preventDefault()
        focused.click()
      }
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

  setInterval(() => {
    const clockNode = document.querySelector('.tvos-clock')
    if (clockNode) clockNode.textContent = formatAppleClock()
  }, 30000)

  render('init')
})()
