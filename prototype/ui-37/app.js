/* ReStore PS5 原生应用高保真可交互原型 (#37)
   支持三套结构变体 (?variant=A|B|C)：
   - Variant A：当前已按反馈打磨的分块工作台
   - Variant B：PS5 沉浸主从焦点舞台（左巨幅焦点卡 + 右联动检查器）
   - Variant C：PS5 控制中心极简横向带（Ribbon 等高大磁贴阵列）
   严格保证：页面内点击绝不跳转其他页面；所有原型/开发者开关完全悬浮独立。 */
;(() => {
  'use strict'

  const ICONS = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5.5v-6h-5v6H4a1 1 0 0 1-1-1v-9.5Z"/></svg>',
    restore: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3.5 2"/></svg>',
    store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M4 7h16l-1.5 12.5a1 1 0 0 1-1 .9H6.5a1 1 0 0 1-1-.9L4 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>',
    cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M7.5 18.5h9.8a4.2 4.2 0 0 0 .4-8.4A5.8 5.8 0 0 0 6.3 8.9 4.6 4.6 0 0 0 7.5 18.5Z"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.4 1Z"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="11" width="16" height="10" rx="2.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    unlock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="11" width="16" height="10" rx="2.5"/><path d="M8 11V7a4 4 0 0 1 7.4-2"/></svg>',
    usb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M12 3v14"/><path d="m9 6 3-3 3 3"/><path d="M7 10v3l5 3"/><path d="M17 9v3l-5 3"/><circle cx="12" cy="19" r="2.2"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M13 2 4.5 13H12l-1 9 8.5-11H12l1-9Z"/></svg>',
    save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M5 4h11l3 3v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"/><path d="M8 4v6h8V4"/><path d="M8 21v-6h8v6"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="3" width="7.5" height="7.5" rx="1.8"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.8"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.8"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.8"/></svg>',
    media: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.6"/><path d="m21 16-5.2-5.2L7 19"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9.5v5"/><circle cx="12" cy="17.2" r="1"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M12 3 4 6.5v5.8c0 5 3.4 9.3 8 10.7 4.6-1.4 8-5.7 8-10.7V6.5L12 3Z"/></svg>',
  }

  const NAV_TABS = [
    { id: 'home', label: '概览', icon: 'home' },
    { id: 'restore', label: '恢复', icon: 'restore' },
    { id: 'store-apps', label: '软件商店', icon: 'store', disabledPreview: true },
    { id: 'store-games', label: '网盘游戏', icon: 'cloud', disabledPreview: true },
    { id: 'settings', label: '设置', icon: 'settings' },
  ]

  const VARIANTS = {
    A: 'A · 经典双栏分块工作台',
    B: 'B · 沉浸主从焦点舞台',
    C: 'C · 控制中心极简横向带',
  }

  const FIVE_OBJECTS = [
    {
      id: 'elf',
      order: 1,
      stepName: '插件与载荷',
      title: '系统插件与载荷',
      countText: '12 项插件与自启服务',
      icon: 'bolt',
      size: '48 MB',
      desc: '还原宿主环境、插件服务、自启状态与外置游戏扫描配置，恢复后立即生效。',
    },
    {
      id: 'desktop',
      order: 2,
      stepName: '桌面图标',
      title: '游戏桌面展示',
      countText: '14 款桌面游戏图标',
      icon: 'grid',
      size: '64 MB',
      desc: '在主界面与游戏库还原原有游戏图标和列表记录。',
      note: '仅恢复桌面图标，不含游戏本体与补丁文件',
    },
    {
      id: 'saves',
      order: 3,
      stepName: '游戏存档',
      title: '全游戏通用存档',
      countText: '19 款游戏 · 46 个存档',
      icon: 'save',
      size: '1.4 GB',
      desc: '自动绑定当前主机账号，支持尚未启动过的游戏直接恢复存档并对齐列表进度。',
    },
    {
      id: 'settings',
      order: 4,
      stepName: '系统设置',
      title: '系统与账号设置',
      countText: '离线激活与系统偏好',
      icon: 'settings',
      size: '6 MB',
      desc: '还原账号离线激活状态、省电待机设置、显示、音频与系统语言偏好。',
    },
    {
      id: 'media',
      order: 5,
      stepName: '媒体图库',
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

  const urlParams = new URLSearchParams(window.location.search)
  const initialVariant = ['A', 'B', 'C'].includes(urlParams.get('variant')) ? urlParams.get('variant') : 'A'
  const rawView = urlParams.get('view')
  const initialOnboardingOpen = rawView === 'onboarding' || urlParams.get('onboarding') === '1'
  const initialView = NAV_TABS.some((t) => t.id === rawView) ? rawView : 'home'
  const initialLockMode = urlParams.get('lock')
  const initialModal = urlParams.get('modal')

  const state = {
    variant: initialVariant,
    view: initialView,
    devDockCollapsed: false,
    onboardingOpen: initialOnboardingOpen,
    onboardingHasRp: urlParams.get('branch') !== 'empty-rp',
    settingsCategory: 'locations',
    homeFocusedLocationId: 'usb',
    homeFocusedObjectId: 'saves',
    selectedLocationId: 'usb',
    selectedRestorePointId: 'rp-18',
    selectedObjects: ['elf', 'desktop', 'saves', 'settings', 'media'],
    autoBackupScope: ['elf', 'desktop', 'saves', 'settings', 'media'],
    spaceLowSimulated: false,
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
        type: 'usb',
        enabled: true,
        status: 'connected',
        statusText: '已同步最新备份',
        progress: 100,
        lastSync: '今天 19:10',
        freeSpace: '184 GB 可用 / 256 GB',
      },
      {
        id: 'lan',
        name: '局域网 WebDAV',
        type: 'webdav',
        enabled: true,
        status: 'connected',
        statusText: '已同步最新备份',
        progress: 100,
        lastSync: '今天 19:11',
        freeSpace: '1.8 TB 可用 / 4.0 TB',
      },
      {
        id: 'cloud',
        name: '云端 WebDAV',
        type: 'webdav',
        enabled: true,
        status: 'syncing',
        statusText: '正在后台同步 74%',
        progress: 74,
        lastSync: '今天 16:40',
        freeSpace: '412 GB 可用 / 1.0 TB',
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

  function renderHeader() {
    return `
      <header class="system-header">
        <div class="header-logo-minimal">
          <img src="./assets/restore-logo.png" alt="ReStore" />
          <span>ReStore</span>
        </div>

        <nav class="top-l1r1-bar" aria-label="顶部主导航">
          <button type="button" class="shoulder-key" data-action="prev-tab" title="L1 上一页 (快捷键 Q)">L1</button>
          ${NAV_TABS.map(
            (tab) => `
            <button
              type="button"
              class="top-nav-pill ${!state.lockScene.active && state.view === tab.id ? 'current' : ''} ${tab.disabledPreview ? 'is-disabled-preview' : ''}"
              data-action="switch-view"
              data-view="${tab.id}"
            >
              ${tab.disabledPreview ? ICONS.lock : ICONS[tab.icon]}
              <span>${tab.label}</span>
            </button>
          `,
          ).join('')}
          <button type="button" class="shoulder-key" data-action="next-tab" title="R1 下一页 (快捷键 E)">R1</button>
        </nav>

        <div class="header-status-cluster">
          <div class="service-indicator">
            <i class="status-dot"></i>
            <span>后台服务运行中</span>
          </div>
          <div class="user-pill">
            <div class="user-avatar">YP</div>
            <span>YunPeng</span>
          </div>
          <time class="system-clock">20:02</time>
        </div>
      </header>
    `
  }

  /* ==================== 概览页（Variant A / B / C，页内操作绝不跳页面） ==================== */
  function renderHomeVariantA() {
    return `
      <main class="page-container">
        <section class="home-hero-banner">
          <div class="home-hero-left">
            <img src="./assets/restore-logo-full.png" alt="ReStore" />
            <div class="home-hero-copy">
              <h1>
                <span>主机数据受保护中</span>
                <span class="badge green">${ICONS.check}<span>最新备份：今天 19:10</span></span>
              </h1>
              <p>游戏退出或插件配置变化后自动增量备份，三个存储位置独立同步。</p>
            </div>
          </div>
          <div class="home-hero-actions">
            <button type="button" class="pill primary" data-action="manual-backup">
              ${ICONS.bolt}<span>立即备份</span>
            </button>
          </div>
        </section>

        <div class="home-dashboard-grid">
          <section class="section-block">
            <div class="section-block-header">
              <h2>备份位置状态</h2>
              <span>点击位置可同步或配置连接</span>
            </div>
            <div class="location-status-stack">
              ${state.locations
                .map(
                  (loc) => `
                <button
                  type="button"
                  class="location-status-row ${state.homeFocusedLocationId === loc.id ? 'selected' : ''}"
                  data-action="focus-home-location"
                  data-loc="${loc.id}"
                >
                  <div class="loc-row-top">
                    <div class="loc-row-title">
                      ${loc.type === 'usb' ? ICONS.usb : ICONS.cloud}
                      <span>${loc.name}</span>
                    </div>
                    <span class="badge ${loc.status === 'connected' ? 'green' : 'blue'}">${loc.statusText}</span>
                  </div>
                  <div class="loc-progress-line">
                    <i style="width:${loc.progress}%"></i>
                  </div>
                  <div class="loc-row-bottom">
                    <span>最近完成：${loc.lastSync}</span>
                    <span>${loc.freeSpace}</span>
                  </div>
                </button>
              `,
                )
                .join('')}
            </div>
          </section>

          <section class="section-block">
            <div class="section-block-header">
              <h2>当前保护内容（最新完整恢复点）</h2>
              <span>共 5 类 · 5.4 GB</span>
            </div>
            <div class="protected-content-grid">
              ${FIVE_OBJECTS.map(
                (obj, idx) => `
                <button
                  type="button"
                  class="content-summary-tile ${idx === 4 ? 'span-2' : ''} ${state.homeFocusedObjectId === obj.id ? 'selected' : ''}"
                  data-action="focus-home-object"
                  data-obj="${obj.id}"
                >
                  <div>
                    <div class="tile-head" style="margin-bottom:10rem;">
                      <div class="tile-icon">${ICONS[obj.icon]}</div>
                      <span class="badge muted">${obj.size}</span>
                    </div>
                    <strong>${obj.title}</strong>
                    <small>${obj.countText}</small>
                  </div>
                  ${idx === 4 ? `<span class="badge green">${ICONS.check}<span>已纳入自动备份</span></span>` : ''}
                </button>
              `,
              ).join('')}
            </div>
          </section>
        </div>
      </main>
    `
  }

  function renderHomeVariantB() {
    const focusedObj = FIVE_OBJECTS.find((o) => o.id === state.homeFocusedObjectId) || FIVE_OBJECTS[2]
    return `
      <main class="page-container">
        <div class="vb-stage-layout">
          <section class="vb-hero-spotlight">
            <div>
              <img class="vb-spotlight-art" src="./assets/restore-logo-full.png" alt="ReStore" />
              <span class="badge green">${ICONS.check}<span>后台保护运行中 · 最新完整备份 今天 19:10</span></span>
              <h1>主机环境与游戏存档已完整备份</h1>
              <p>当前焦点：${focusedObj.title}（${focusedObj.countText}）— ${focusedObj.desc}</p>
            </div>

            <div class="vb-metric-strip">
              <div class="vb-metric-box">
                <strong>3 个位置</strong>
                <small>独立同步互不阻塞</small>
              </div>
              <div class="vb-metric-box">
                <strong>19 款存档</strong>
                <small>含未启动游戏建槽</small>
              </div>
              <div class="vb-metric-box">
                <strong>5.4 GB</strong>
                <small>未变化数据自动复用</small>
              </div>
            </div>

            <div class="home-hero-actions">
              <button type="button" class="pill primary" data-action="manual-backup">
                ${ICONS.bolt}<span>立即执行增量备份</span>
              </button>
              <button type="button" class="pill secondary" data-action="open-webdav-osk" data-loc="lan">
                <span>配置网络存储</span>
              </button>
            </div>
          </section>

          <div class="vb-right-stack">
            <section class="section-block">
              <div class="section-block-header">
                <h2>备份位置实时状态</h2>
                <span>全部在线</span>
              </div>
              <div class="vb-horizontal-cards">
                ${state.locations
                  .map(
                    (loc) => `
                  <button
                    type="button"
                    class="vb-loc-card ${state.homeFocusedLocationId === loc.id ? 'selected' : ''}"
                    data-action="focus-home-location"
                    data-loc="${loc.id}"
                  >
                    <div class="loc-row-top">
                      <div class="tile-icon">${loc.type === 'usb' ? ICONS.usb : ICONS.cloud}</div>
                      <span class="badge ${loc.status === 'connected' ? 'green' : 'blue'}">${loc.progress}%</span>
                    </div>
                    <div>
                      <strong style="display:block; font-size:18rem; margin-bottom:5rem;">${loc.name}</strong>
                      <small style="display:block; font-size:13.5rem; color:#95a0b0;">${loc.statusText} · ${loc.lastSync}</small>
                    </div>
                    <div class="loc-progress-line"><i style="width:${loc.progress}%"></i></div>
                  </button>
                `,
                  )
                  .join('')}
              </div>
            </section>

            <section class="section-block" style="flex:1;">
              <div class="section-block-header">
                <h2>已纳入保护的五类内容</h2>
                <span>点击卡片在左侧查看详情</span>
              </div>
              <div class="five-columns-grid" style="margin-top:0;">
                ${FIVE_OBJECTS.map(
                  (obj) => `
                  <button
                    type="button"
                    class="object-tile-card ${state.homeFocusedObjectId === obj.id ? 'selected' : ''}"
                    style="min-height:190rem;"
                    data-action="focus-home-object"
                    data-obj="${obj.id}"
                  >
                    <div class="object-tile-top">
                      <div class="tile-icon">${ICONS[obj.icon]}</div>
                      <span class="badge muted">${obj.size}</span>
                    </div>
                    <div class="object-tile-body">
                      <strong>${obj.title}</strong>
                      <span style="margin-bottom:0;">${obj.countText}</span>
                    </div>
                  </button>
                `,
                ).join('')}
              </div>
            </section>
          </div>
        </div>
      </main>
    `
  }

  function renderHomeVariantC() {
    return `
      <main class="page-container">
        <div class="vc-ribbon-shell">
          <div class="vc-top-summary-bar">
            <div style="display:flex; align-items:center; gap:16rem;">
              <span class="badge green">${ICONS.check}<span>最近完整恢复点：今天 19:10</span></span>
              <span style="font-size:16.5rem; color:#c5cfde;">已保护 12 项插件、19 款存档、14 款桌面图标、系统设置与 86 项媒体</span>
            </div>
            <button type="button" class="pill sm primary" data-action="manual-backup">
              ${ICONS.bolt}<span>立即备份</span>
            </button>
          </div>

          <div class="vc-ribbon-grid">
            <button type="button" class="vc-tall-card primary-card" data-action="manual-backup">
              <div>
                <img src="./assets/restore-logo-full.png" alt="ReStore" style="width:76rem; height:76rem; border-radius:18rem; margin-bottom:20rem;" />
                <span class="badge blue">自动增量保护</span>
                <h2>立即创建恢复点</h2>
                <p>检测自上次备份以来的存档与插件变更，未变化数据自动复用已有块。</p>
              </div>
              <div style="padding-top:16rem; border-top:1rem solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; font-size:14rem; color:#bfd6f6;">
                <span>共 5 类保护对象</span>
                <span>5.4 GB</span>
              </div>
            </button>

            ${state.locations
              .map(
                (loc) => `
              <button
                type="button"
                class="vc-tall-card ${state.homeFocusedLocationId === loc.id ? 'selected' : ''}"
                data-action="focus-home-location"
                data-loc="${loc.id}"
              >
                <div>
                  <div class="loc-row-top" style="margin-bottom:20rem;">
                    <div class="tile-icon" style="width:52rem; height:52rem;">${loc.type === 'usb' ? ICONS.usb : ICONS.cloud}</div>
                    <span class="badge ${loc.status === 'connected' ? 'green' : 'blue'}">${loc.progress}%</span>
                  </div>
                  <span class="badge muted">${loc.type === 'usb' ? '本地高速存储' : '网络存储'}</span>
                  <h2>${loc.name}</h2>
                  <p>${loc.statusText}，最近完成于 ${loc.lastSync}。</p>
                </div>
                <div>
                  <div class="loc-progress-line" style="margin-bottom:12rem;"><i style="width:${loc.progress}%"></i></div>
                  <div style="display:flex; justify-content:space-between; font-size:13.5rem; color:#94a0b2;">
                    <span>${loc.freeSpace}</span>
                    <span>${loc.type === 'webdav' ? '按 ✕ 配置连接' : '按 ✕ 校验'}</span>
                  </div>
                </div>
              </button>
            `,
              )
              .join('')}
          </div>
        </div>
      </main>
    `
  }

  /* ==================== 恢复页（Variant A / B / C，页内操作绝不跳页面） ==================== */
  function renderRestoreVariantA() {
    const allSelected = state.selectedObjects.length === FIVE_OBJECTS.length
    const stages = [
      { step: '1', label: '插件与载荷', active: state.selectedObjects.includes('elf') },
      { step: '2', label: '桌面图标', active: state.selectedObjects.includes('desktop') },
      { step: '3', label: '游戏存档', active: state.selectedObjects.includes('saves') },
      { step: '4', label: '系统设置与媒体', active: state.selectedObjects.includes('settings') || state.selectedObjects.includes('media') },
    ]

    return `
      <main class="page-container">
        <div class="restore-step-stack">
          <section class="restore-source-block">
            <div class="source-locations-col">
              <div class="block-step-label">
                <span>1. 选择备份位置</span>
              </div>
              ${state.locations
                .map(
                  (loc) => `
                <button
                  type="button"
                  class="source-loc-btn ${state.selectedLocationId === loc.id ? 'active' : ''}"
                  data-action="select-location"
                  data-loc="${loc.id}"
                >
                  <span>${loc.name}</span>
                  <span class="badge ${loc.status === 'connected' ? 'green' : 'gold'}">${loc.progress}%</span>
                </button>
              `,
                )
                .join('')}
            </div>

            <div class="source-rp-col">
              <div class="block-step-label">
                <span>2. 选择恢复点</span>
                <span>按 □ 键可锁定或解锁恢复点保护</span>
              </div>
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
                        ${rp.isLatestComplete ? '<span class="badge blue">最新完整</span>' : ''}
                      </div>
                      <div class="rp-card-desc" style="margin-top:6rem;">${rp.note}</div>
                    </div>
                    <div class="rp-card-foot">
                      <span>${rp.size}</span>
                      <span class="badge ${rp.protected ? 'gold' : 'muted'}">
                        ${rp.protected ? ICONS.lock : ICONS.unlock}
                        <span>${rp.protected ? '已保护' : '未锁定'}</span>
                      </span>
                    </div>
                  </button>
                `,
                  )
                  .join('')}
              </div>
            </div>
          </section>

          <section class="restore-objects-block">
            <div class="section-block-header" style="margin-bottom:6rem;">
              <h2>3. 选择要恢复的内容（已选 ${state.selectedObjects.length} / 5 项）</h2>
              <button
                type="button"
                class="pill sm ${allSelected ? 'brand' : 'secondary'}"
                data-action="select-all-objects"
              >
                ${ICONS.check}
                <span>${allSelected ? '已选整机恢复（全部 5 项）' : '全选整机恢复'}</span>
              </button>
            </div>

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
                    <div>
                      <div class="object-tile-top" style="margin-bottom:14rem;">
                        <div class="tile-icon">${ICONS[obj.icon]}</div>
                        <div class="check-indicator">${ICONS.check}</div>
                      </div>
                      <div class="object-tile-body">
                        <strong>${obj.title}</strong>
                        <span>${obj.countText} · ${obj.size}</span>
                        <p>${obj.desc}</p>
                      </div>
                    </div>
                    ${obj.note ? `<div class="object-tile-note">${obj.note}</div>` : `<div style="font-size:13rem; color:#7f8b9c;">执行顺序：第 ${obj.order} 步</div>`}
                  </button>
                `
              }).join('')}
            </div>
          </section>

          <section class="restore-action-bar">
            <div class="order-flow-steps">
              <span class="order-flow-label">恢复执行顺序：</span>
              ${stages
                .map(
                  (s, i) => `
                <span class="order-step-pill ${s.active ? '' : 'dimmed'}">
                  <em>${s.step}</em>
                  <span>${s.label}</span>
                </span>
                ${i < stages.length - 1 ? '<span class="order-arrow">→</span>' : ''}
              `,
                )
                .join('')}
            </div>
            <button type="button" class="pill primary" data-action="start-lock-demo" data-mode="normal">
              ${ICONS.restore}<span>开始恢复</span>
            </button>
          </section>
        </div>
      </main>
    `
  }

  function renderRestoreVariantB() {
    const currentRp = state.restorePoints.find((r) => r.id === state.selectedRestorePointId) || state.restorePoints[0]
    return `
      <main class="page-container">
        <div class="vb-stage-layout">
          <section class="vb-hero-spotlight">
            <div>
              <div style="display:flex; gap:8rem; margin-bottom:18rem;">
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
              </div>
              <span class="badge blue">当前选中恢复点 · ${currentRp.size}</span>
              <h1>${currentRp.title}</h1>
              <p>${currentRp.note}。${currentRp.summary}。</p>

              <div class="settings-row-list" style="margin-top:22rem;">
                ${state.restorePoints
                  .map(
                    (rp) => `
                  <button
                    type="button"
                    class="source-loc-btn ${state.selectedRestorePointId === rp.id ? 'active' : ''}"
                    data-action="select-rp"
                    data-rp="${rp.id}"
                  >
                    <span>${rp.title}</span>
                    <span class="badge ${rp.protected ? 'gold' : 'muted'}">${rp.protected ? '已保护' : '未锁定'}</span>
                  </button>
                `,
                  )
                  .join('')}
              </div>
            </div>

            <div class="home-hero-actions" style="margin-top:24rem;">
              <button type="button" class="pill primary" data-action="start-lock-demo" data-mode="normal">
                ${ICONS.restore}<span>开始恢复所选内容 (${state.selectedObjects.length}/5)</span>
              </button>
              <button type="button" class="pill secondary" data-action="select-all-objects">
                <span>全选整机恢复</span>
              </button>
            </div>
          </section>

          <section class="section-block">
            <div class="section-block-header">
              <h2>勾选要恢复的内容（自动按依赖顺序执行）</h2>
              <span>已选 ${state.selectedObjects.length} / 5 项</span>
            </div>
            <div class="settings-row-list">
              ${FIVE_OBJECTS.map((obj) => {
                const selected = state.selectedObjects.includes(obj.id)
                return `
                  <button
                    type="button"
                    class="settings-row-card"
                    style="border-color:${selected ? '#66a8ff' : 'rgba(255,255,255,0.07)'}; background:${selected ? 'rgba(0,67,156,0.22)' : '#171b22'};"
                    data-action="toggle-object"
                    data-obj="${obj.id}"
                  >
                    <div class="settings-row-info">
                      <strong>
                        <span>第 ${obj.order} 步 · ${obj.title}</span>
                        <span class="badge muted">${obj.countText} · ${obj.size}</span>
                        ${obj.note ? `<span class="badge gold">${obj.note}</span>` : ''}
                      </strong>
                      <p>${obj.desc}</p>
                    </div>
                    <div class="check-indicator" style="${selected ? 'background:#eef2f7;border-color:#eef2f7;color:#11151b;' : ''}">
                      ${ICONS.check}
                    </div>
                  </button>
                `
              }).join('')}
            </div>
          </section>
        </div>
      </main>
    `
  }

  function renderRestoreVariantC() {
    return `
      <main class="page-container">
        <div class="vc-ribbon-shell">
          <div class="vc-top-summary-bar">
            <div style="display:flex; align-items:center; gap:12rem;">
              <span style="font-size:15rem; color:#95a2b4;">备份位置：</span>
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
              <span style="font-size:15rem; color:#95a2b4; margin-left:12rem;">恢复点：</span>
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

          <div class="five-columns-grid" style="margin-top:0;">
            ${FIVE_OBJECTS.map((obj) => {
              const selected = state.selectedObjects.includes(obj.id)
              return `
                <button
                  type="button"
                  class="vc-tall-card ${selected ? 'primary-card selected' : ''}"
                  style="min-height:480rem;"
                  data-action="toggle-object"
                  data-obj="${obj.id}"
                >
                  <div>
                    <div class="object-tile-top" style="margin-bottom:22rem;">
                      <div class="tile-icon" style="width:50rem; height:50rem;">${ICONS[obj.icon]}</div>
                      <div class="check-indicator">${ICONS.check}</div>
                    </div>
                    <span class="badge blue">执行顺序：第 ${obj.order} 步</span>
                    <h2>${obj.title}</h2>
                    <p style="margin-top:10rem;">${obj.desc}</p>
                  </div>
                  <div>
                    ${obj.note ? `<div class="object-tile-note" style="margin-bottom:12rem;">${obj.note}</div>` : ''}
                    <div style="padding-top:14rem; border-top:1rem solid rgba(255,255,255,0.08); display:flex; justify-content:space-between; font-size:14rem; color:#b5c2d4;">
                      <span>${obj.countText}</span>
                      <span>${obj.size}</span>
                    </div>
                  </div>
                </button>
              `
            }).join('')}
          </div>
        </div>
      </main>
    `
  }

  /* ==================== 设置页（纯净产品设置，不含开发者模拟按钮） ==================== */
  function renderSettingsPage() {
    const categories = [
      { id: 'locations', label: '备份位置与网络', icon: 'cloud', badge: '3 个位置' },
      { id: 'scope', label: '自动备份内容范围', icon: 'save', badge: `${state.autoBackupScope.length}/5 项` },
      { id: 'retention', label: '恢复点保护与空间清理', icon: 'shield', badge: '自动保留' },
      { id: 'system', label: '首次引导与系统服务', icon: 'settings', badge: '运行中' },
    ]

    let detailHtml = ''
    if (state.settingsCategory === 'locations') {
      detailHtml = `
        <div class="settings-panel-head">
          <div>
            <h2>备份位置与网络配置</h2>
            <p>支持同时启用多个备份位置，各位置独立同步互不影响；网络存储可通过手柄调用系统输入法填写。</p>
          </div>
          <button type="button" class="pill sm brand" data-action="open-webdav-osk" data-loc="lan">配置 WebDAV 凭据</button>
        </div>
        <div class="settings-row-list">
          ${state.locations
            .map(
              (loc) => `
            <div class="settings-row-card">
              <div class="settings-row-info">
                <strong>
                  <span>${loc.name}</span>
                  <span class="badge ${loc.enabled ? 'green' : 'muted'}">${loc.enabled ? '已启用' : '已暂停'}</span>
                </strong>
                <p>${loc.statusText} · 最近完成：${loc.lastSync} · ${loc.freeSpace}</p>
              </div>
              <div class="settings-row-actions">
                ${
                  loc.type === 'webdav'
                    ? `<button type="button" class="pill sm secondary" data-action="open-webdav-osk" data-loc="${loc.id}">输入连接凭据</button>`
                    : ''
                }
                <button type="button" class="pill sm ${loc.enabled ? 'secondary' : 'brand'}" data-action="toggle-location" data-loc="${loc.id}">
                  ${loc.enabled ? '暂停同步' : '启用同步'}
                </button>
              </div>
            </div>
          `,
            )
            .join('')}
        </div>
      `
    } else if (state.settingsCategory === 'scope') {
      detailHtml = `
        <div class="settings-panel-head">
          <div>
            <h2>自动备份内容范围</h2>
            <p>当关闭游戏或修改插件配置后，后台服务自动检测变化并备份所选内容；未变化的数据自动复用已有版本。</p>
          </div>
          <span class="badge green">已启用 ${state.autoBackupScope.length} / 5 项</span>
        </div>
        <div class="settings-row-list">
          ${FIVE_OBJECTS.map((obj) => {
            const on = state.autoBackupScope.includes(obj.id)
            return `
              <div class="settings-row-card">
                <div class="settings-row-info">
                  <strong>
                    <span>${obj.title}</span>
                    <span class="badge muted">${obj.countText}</span>
                  </strong>
                  <p>${obj.desc}</p>
                </div>
                <div class="settings-row-actions">
                  <button type="button" class="pill sm ${on ? 'brand' : 'secondary'}" data-action="toggle-auto-scope" data-obj="${obj.id}">
                    ${on ? '已开启自动备份' : '已关闭'}
                  </button>
                </div>
              </div>
            `
          }).join('')}
        </div>
      `
    } else if (state.settingsCategory === 'retention') {
      detailHtml = `
        <div class="settings-panel-head">
          <div>
            <h2>恢复点保护与存储空间清理</h2>
            <p>存储空间不足时，系统自动从旧到新清理未锁定的恢复点，并始终保留每个位置的最后一个完整恢复点。</p>
          </div>
          <span class="badge blue">自动保留最新完整点</span>
        </div>
        ${
          state.spaceLowSimulated
            ? `
          <div class="inline-notice-box warn" style="margin-top:0;">
            <div>
              <strong style="display:block; font-size:17rem; color:#ffd4d2; margin-bottom:4rem;">USB 存储设备可用空间不足</strong>
              <span style="font-size:14rem; color:#e6c3c1;">已自动清理未保护的旧恢复点，但剩余空间仍不足写入新备份；已为您保留最新完整恢复点，局域网与云端同步正常进行。</span>
            </div>
            <span class="badge gold">保留最新完整点</span>
          </div>
        `
            : ''
        }
        <div class="settings-row-list">
          ${state.restorePoints
            .map(
              (rp) => `
            <div class="settings-row-card">
              <div class="settings-row-info">
                <strong>
                  <span>${rp.title}</span>
                  ${rp.isLatestComplete ? '<span class="badge blue">最新完整恢复点</span>' : ''}
                  <span class="badge ${rp.protected ? 'gold' : 'muted'}">${rp.protected ? '已手动锁定保护' : '未锁定（可自动清理）'}</span>
                </strong>
                <p>${rp.note} · ${rp.size}</p>
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
      `
    } else {
      detailHtml = `
        <div class="settings-panel-head">
          <div>
            <h2>首次引导与系统服务</h2>
            <p>查看后台守护服务运行状态，或在更换主要存储设备后重新进入全屏引导向导。</p>
          </div>
        </div>
        <div class="settings-row-list">
          <div class="settings-row-card">
            <div class="settings-row-info">
              <strong>
                <span>后台自动备份服务</span>
                <span class="badge green">运行稳定</span>
              </strong>
              <p>关闭 ReStore 界面或退出入口应用后，后台服务依然保持运行并在游戏退出后自动同步。</p>
            </div>
            <div class="settings-row-actions">
              <button type="button" class="pill sm secondary" data-action="manual-backup">立即执行一次备份</button>
            </div>
          </div>
          <div class="settings-row-card">
            <div class="settings-row-info">
              <strong><span>重新打开首次引导向导</span></strong>
              <p>重新选择默认备份存储位置，并检查恢复点或执行首次全量备份。</p>
            </div>
            <div class="settings-row-actions">
              <button type="button" class="pill sm brand" data-action="open-onboarding">打开首次引导向导</button>
            </div>
          </div>
        </div>
      `
    }

    if (state.variant === 'C') {
      return `
        <main class="page-container">
          <div class="vc-ribbon-shell">
            <div class="vc-top-summary-bar">
              <div style="display:flex; gap:10rem;">
                ${categories
                  .map(
                    (c) => `
                  <button
                    type="button"
                    class="pill sm ${state.settingsCategory === c.id ? 'primary' : 'secondary'}"
                    data-action="set-settings-cat"
                    data-cat="${c.id}"
                  >
                    ${ICONS[c.icon]}<span>${c.label}</span>
                  </button>
                `,
                  )
                  .join('')}
              </div>
              <span class="badge green">自动保存生效</span>
            </div>
            <section class="settings-detail-panel" style="min-height:520rem;">
              ${detailHtml}
            </section>
          </div>
        </main>
      `
    }

    return `
      <main class="page-container">
        <div class="settings-split-layout">
          <aside class="settings-category-nav" aria-label="设置分类">
            ${categories
              .map(
                (c) => `
              <button
                type="button"
                class="settings-cat-btn ${state.settingsCategory === c.id ? 'active' : ''}"
                data-action="set-settings-cat"
                data-cat="${c.id}"
              >
                <span>${ICONS[c.icon]}<span>${c.label}</span></span>
                <small style="opacity:0.75; font-size:13.5rem;">${c.badge}</small>
              </button>
            `,
              )
              .join('')}
          </aside>
          <section class="settings-detail-panel">
            ${detailHtml}
          </section>
        </div>
      </main>
    `
  }

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
                  <p style="margin:0; font-size:14.5rem; color:#9ba6b6;">
                    ${hasRp ? `最近备份：${loc.lastSync}` : '已就绪，可用于存放备份'} · ${loc.freeSpace}
                  </p>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; padding-top:12rem; border-top:1rem solid rgba(255,255,255,0.07);">
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
                    <div class="rp-card-desc" style="margin-top:6rem;">${rp.summary}</div>
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
              <span style="font-size:14.5rem; color:#9aa6b6;">确认后将立即按依赖顺序恢复整机数据。</span>
            </div>
            <div class="home-hero-actions">
              <button type="button" class="pill primary" data-action="start-lock-demo" data-mode="normal">
                ${ICONS.restore}<span>开始整机恢复</span>
              </button>
            </div>
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
                    style="min-height:165rem;"
                    data-action="toggle-object"
                    data-obj="${obj.id}"
                  >
                    <div class="object-tile-top">
                      <div class="tile-icon">${ICONS[obj.icon]}</div>
                      <div class="check-indicator">${ICONS.check}</div>
                    </div>
                    <div class="object-tile-body">
                      <strong>${obj.title}</strong>
                      <span>${obj.countText}</span>
                    </div>
                  </button>
                `
              }).join('')}
            </div>
          </section>

          <div class="wizard-footer-bar">
            <div>
              <strong style="font-size:19rem; display:block; margin-bottom:4rem;">创建第一份完整恢复点</strong>
              <span style="font-size:14.5rem; color:#9aa6b6;">预计大小约 5.4 GB，完成后将自动同步至所选备份位置。</span>
            </div>
            <div class="home-hero-actions">
              <button type="button" class="pill primary" data-action="trigger-initial-backup">
                ${ICONS.bolt}<span>开始首次备份</span>
              </button>
            </div>
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
            <h2 style="font-size:36rem; font-weight:300; margin:14rem 0 8rem;">
              ${
                mode === 'conflict'
                  ? '检测到《最后生还者 Part I》正在运行，已优先恢复其余项目'
                  : mode === 'resumed'
                    ? '已从上次中断位置继续恢复剩余项目'
                    : '正在恢复全游戏通用存档'
              }
            </h2>
            <p style="font-size:17rem; color:#aeb8c7; margin:0;">
              ${state.lockScene.currentDetail}
            </p>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width:${state.lockScene.progress}%"></div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:14.5rem; color:#96a2b4;">
              <span>已完成：系统插件与载荷 (12/12) · 游戏桌面展示 (14/14) · 游戏存档 (14/19)</span>
              <span>剩余约 45 秒</span>
            </div>

            ${
              mode === 'conflict'
                ? `
              <div class="inline-notice-box warn">
                <div>
                  <strong style="display:block; font-size:17rem; color:#ffd4d2; margin-bottom:4rem;">请先保存并关闭正在运行的《最后生还者 Part I》</strong>
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
                  <strong style="display:block; font-size:17rem; color:#cfe6ff; margin-bottom:4rem;">已自动核验中断前进度并继续执行</strong>
                  <span style="font-size:14rem; color:#b8cde6;">重启前已完成的系统插件与桌面图标无需重复恢复，当前直接从第 15 款游戏存档继续。</span>
                </div>
                <span class="badge green">断点续做</span>
              </div>
            `
                : ''
            }
          </div>

          <div class="section-block" style="background:rgba(14,17,23,0.92);">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:18rem;">
              <div class="progress-big-number">${state.lockScene.progress}%</div>
              <img src="./assets/restore-logo.png" alt="ReStore" style="width:68rem; height:68rem; border-radius:16rem;" />
            </div>
            <div class="settings-row-list">
              <div class="settings-row-card" style="padding:14rem 18rem;"><span>1. 系统插件与载荷</span><span class="badge green">已完成</span></div>
              <div class="settings-row-card" style="padding:14rem 18rem;"><span>2. 游戏桌面展示</span><span class="badge green">已完成</span></div>
              <div class="settings-row-card" style="padding:14rem 18rem; border-color:#66a8ff;"><strong>3. 全游戏通用存档</strong><span class="badge blue">进行中 (14/19)</span></div>
              <div class="settings-row-card" style="padding:14rem 18rem;"><span>4. 系统设置与媒体图库</span><span class="badge muted">等待中</span></div>
            </div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; padding-top:18rem; border-top:1rem solid rgba(255,255,255,0.09);">
          <span style="font-size:14.5rem; color:#94a0b2;">若中途断电或重启，重新打开 ReStore 后将自动从断点处继续恢复。</span>
          <div class="home-hero-actions">
            <button type="button" class="pill primary sm" data-action="open-restore-result-modal">查看恢复完成汇总</button>
          </div>
        </div>
      </section>
    `
  }

  /* ==================== 软件商店 & 网盘游戏（纯锁定遮罩，无任何跨页跳转按钮） ==================== */
  function renderStoreAppsPage() {
    return `
      <main class="page-container">
        <div class="section-block-header" style="margin-bottom:16rem;">
          <h1 style="margin:0; font-size:30rem; font-weight:400;">软件商店</h1>
          <div class="home-hero-actions">
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
              <h2>软件商店暂未开放</h2>
              <p>自制应用与插件在线下载功能将在后续版本推出。</p>
            </div>
          </div>
        </div>
      </main>
    `
  }

  function renderStoreGamesPage() {
    return `
      <main class="page-container">
        <div class="section-block-header" style="margin-bottom:16rem;">
          <h1 style="margin:0; font-size:30rem; font-weight:400;">网盘游戏</h1>
          <div class="home-hero-actions">
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
              <h2>网盘游戏暂未开放</h2>
              <p>网盘扫码连接与游戏下载功能将在后续版本推出。</p>
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
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20rem;">
              <span class="badge green">${ICONS.check}<span>连接测试正常</span></span>
              <div class="home-hero-actions">
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
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:16rem;">
              <div class="section-block" style="padding:20rem;">
                <div class="loc-row-top" style="margin-bottom:12rem;">
                  <strong>已恢复</strong>
                  <span class="badge green">${retried ? '全部完成' : '4 类完整 + 18 款存档'}</span>
                </div>
                <div class="settings-row-list" style="font-size:14rem; color:#a5b0c0; line-height:1.55;">
                  <div>• 系统插件与载荷：12 项已启用</div>
                  <div>• 游戏桌面展示：14 款图标已还原</div>
                  <div>• 全游戏通用存档：${retried ? '全部 19 款已恢复' : '18 款游戏存档已恢复'}</div>
                  <div>• 系统设置与媒体：离线激活与 86 项媒体已恢复</div>
                </div>
              </div>

              <div class="section-block" style="padding:20rem;">
                <div class="loc-row-top" style="margin-bottom:12rem;">
                  <strong>待处理</strong>
                  <span class="badge gold">2 款待挂载外置盘</span>
                </div>
                <div class="settings-row-list" style="font-size:14rem; color:#a5b0c0; line-height:1.55;">
                  <div>• 《战神：诸神黄昏》：桌面图标已恢复，接入外置存储后即可启动</div>
                  <div>• 《死亡回归》：桌面图标已恢复，待安装游戏本体</div>
                </div>
              </div>

              <div class="section-block" style="padding:20rem;">
                <div class="loc-row-top" style="margin-bottom:12rem;">
                  <strong>未完成</strong>
                  <span class="badge ${retried ? 'green' : 'gold'}">${retried ? '0 项' : '1 项可重试'}</span>
                </div>
                <div class="settings-row-list" style="font-size:14rem; color:#a5b0c0; line-height:1.55;">
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

  /* ==================== 100% 纯净的底部手柄按键提示栏 ==================== */
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
            <span class="ds-glyph">△</span><span>立即备份</span>
          </button>
          <button type="button" class="ds-prompt" data-action="ds-square">
            <span class="ds-glyph">□</span><span>锁定恢复点</span>
          </button>
        </div>
      </footer>
    `
  }

  /* ==================== 独立悬浮的开发者/原型调试浮层（不混入产品 UI） ==================== */
  function renderFloatingDevDock() {
    if (state.devDockCollapsed) {
      return `
        <aside class="proto-floating-dock" aria-label="开发者原型调试浮窗">
          <div class="proto-dock-row">
            <button type="button" class="proto-dev-tag" data-action="toggle-dev-dock">展开 DEV 调试面板 (${state.variant})</button>
          </div>
        </aside>
      `
    }
    return `
      <aside class="proto-floating-dock" aria-label="开发者原型调试浮窗">
        <div class="proto-dock-row">
          <span class="proto-dev-tag">PROTOTYPE DEV（仅原型调试悬浮窗）</span>
          ${['A', 'B', 'C']
            .map(
              (k) => `
            <button
              type="button"
              class="proto-dock-btn ${state.variant === k ? 'active' : ''}"
              data-action="set-variant"
              data-variant="${k}"
            >
              ${VARIANTS[k]}
            </button>
          `,
            )
            .join('')}
          <button type="button" class="proto-dock-btn" data-action="toggle-dev-dock">收起</button>
        </div>
        <div class="proto-dock-row">
          <button
            type="button"
            class="proto-dock-btn ${state.onboardingOpen && state.onboardingHasRp ? 'active' : ''}"
            data-action="demo-onboarding-has-rp"
          >
            引导浮层：已有恢复点
          </button>
          <button
            type="button"
            class="proto-dock-btn ${state.onboardingOpen && !state.onboardingHasRp ? 'active' : ''}"
            data-action="demo-onboarding-empty"
          >
            引导浮层：无恢复点
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
            设置：空间不足提示
          </button>
        </div>
      </aside>
    `
  }

  function renderMainScene() {
    if (state.lockScene.active) return renderRestoreLockScene()
    if (state.view === 'restore') {
      if (state.variant === 'B') return renderRestoreVariantB()
      if (state.variant === 'C') return renderRestoreVariantC()
      return renderRestoreVariantA()
    }
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

    app.innerHTML = `
      <div
        class="app-shell"
        data-variant="${state.variant}"
        data-view="${state.lockScene.active ? 'restore-lock' : state.view}"
      >
        <div class="console-wallpaper" aria-hidden="true">
          <video src="./assets/ps5-showcase-excerpt.mp4" autoplay muted loop playsinline></video>
        </div>
        ${renderHeader()}
        ${renderMainScene()}
        ${renderOnboardingOverlay()}
        ${renderDualSenseBar()}
        ${renderFloatingDevDock()}
        ${renderModal()}
      </div>
    `

    if (window.PS5Motion) {
      window.PS5Motion.animate(previous, reason)
    }
    syncUrl()
  }

  function cycleTab(delta) {
    if (state.onboardingOpen) return
    if (state.lockScene.active) {
      showToast('正在恢复数据，请勿切换页面')
      return
    }
    const idx = NAV_TABS.findIndex((t) => t.id === state.view)
    const next = (idx + delta + NAV_TABS.length) % NAV_TABS.length
    state.view = NAV_TABS[next].id
    render('route')
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]')
    if (!btn) return
    const action = btn.dataset.action

    switch (action) {
      case 'switch-view':
        if (state.lockScene.active) {
          showToast('正在恢复数据，请先完成当前恢复任务')
          return
        }
        state.onboardingOpen = false
        state.view = btn.dataset.view
        render('route')
        break
      case 'prev-tab':
        cycleTab(-1)
        break
      case 'next-tab':
        cycleTab(1)
        break
      case 'set-variant':
        state.variant = btn.dataset.variant
        render('route')
        break
      case 'toggle-dev-dock':
        state.devDockCollapsed = !state.devDockCollapsed
        render('update')
        break
      case 'focus-home-location': {
        state.homeFocusedLocationId = btn.dataset.loc
        const loc = state.locations.find((l) => l.id === btn.dataset.loc)
        if (loc && loc.type === 'webdav') {
          state.editingLocationId = loc.id
          state.modal = 'webdav-osk'
        } else if (loc) {
          showToast(`${loc.name}：${loc.statusText}`)
        }
        render('update')
        break
      }
      case 'focus-home-object': {
        state.homeFocusedObjectId = btn.dataset.obj
        const obj = FIVE_OBJECTS.find((o) => o.id === btn.dataset.obj)
        if (obj) showToast(`已选中查看：${obj.title}（${obj.countText}）`)
        render('update')
        break
      }
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
      case 'set-settings-cat':
        state.settingsCategory = btn.dataset.cat
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
            showToast('请至少保留一项内容')
          }
        } else {
          state.selectedObjects = [...state.selectedObjects, id]
        }
        render('update')
        break
      }
      case 'select-all-objects':
        state.selectedObjects = FIVE_OBJECTS.map((o) => o.id)
        showToast('已全选全部 5 项恢复内容')
        render('update')
        break
      case 'trigger-initial-backup':
        state.onboardingOpen = false
        showToast('已开始创建首份完整恢复点')
        render('route')
        break
      case 'manual-backup':
        showToast('已启动后台增量备份')
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
          loc.statusText = '已同步最新备份'
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
        showToast(state.spaceLowSimulated ? '已在设置页开启空间不足告警预览' : '已关闭空间不足告警预览')
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
        const focused = document.querySelector('[data-pad-focus="true"]') || document.activeElement
        if (focused && focused !== document.body && typeof focused.click === 'function') {
          focused.click()
        }
        break
      }
      case 'ds-circle':
        if (state.modal) {
          state.modal = null
          render('update')
        } else if (state.onboardingOpen) {
          state.onboardingOpen = false
          render('route')
        } else if (state.lockScene.active) {
          state.lockScene.active = false
          render('route')
        }
        break
      case 'ds-triangle':
        showToast('已启动后台增量备份')
        break
      case 'ds-square': {
        const rp = state.restorePoints.find((r) => r.id === state.selectedRestorePointId)
        if (rp) {
          rp.protected = !rp.protected
          showToast(`${rp.title}${rp.protected ? '已锁定保护' : '已解除保护'}`)
          render('update')
        }
        break
      }
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
        'button:not([disabled]):not(.proto-dock-btn):not(.proto-dev-tag), input:not([disabled])',
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
      const keys = ['A', 'B', 'C']
      state.variant = keys[(keys.indexOf(state.variant) + 2) % 3]
      render('route')
    } else if (e.key === ']') {
      e.preventDefault()
      const keys = ['A', 'B', 'C']
      state.variant = keys[(keys.indexOf(state.variant) + 1) % 3]
      render('route')
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
