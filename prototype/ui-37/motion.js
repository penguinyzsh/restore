/* 沿用 public/web 的 PS5 动效序列实现（FLIP 磁贴、场景交叠、弹窗淡入淡出） */
window.PS5Motion = (() => {
  'use strict'

  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  const owned = new Map()
  let serial = 0
  let lastReport = null
  const PREFIX = 'ps5-motion:'
  const timing = Object.freeze({
    tile: 300,
    exit: 180,
    sceneDelay: 140,
    scene: 280,
    backgroundDelay: 180,
    background: 320,
    artworkDelay: 140,
    artwork: 300,
    copyDelay: 220,
    copy: 220,
    actionsDelay: 280,
    cardsDelay: 340,
    cards: 260,
    welcomeDelay: 220,
    welcome: 320,
    dialog: 200,
    dialogExit: 140,
    ease: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
    fade: 'linear',
  })

  const q = (selector, root = document) => root?.querySelector(selector)
  const qa = (selector, root = document) => [...(root?.querySelectorAll(selector) || [])]
  const rect = (node) => {
    const r = node.getBoundingClientRect()
    return { left: r.left, top: r.top, width: r.width, height: r.height }
  }
  const available = () => !media.matches && typeof Element.prototype.animate === 'function'
  const px = (value) =>
    value * Math.min(1, parseFloat(getComputedStyle(document.documentElement).fontSize) || 1)

  function describe() {
    const shell = q('#app .app-shell')
    if (!shell) return { key: 'empty', kind: 'empty', shell: null }
    const scene = q('.welcome-scene,.project-scene,.browse-page,.restore-lock-scene', shell)
    const kind = scene?.matches('.welcome-scene')
      ? 'welcome'
      : scene?.matches('.project-scene')
        ? 'project'
        : scene?.matches('.restore-lock-scene')
          ? 'lock'
          : 'browse'
    const active = q('.launch-tile.active', shell)?.dataset.select || ''
    const navKey = shell.dataset.view || ''
    const variantKey = shell.dataset.variant || 'A'
    return {
      key: `${variantKey}/${kind}/${navKey}/${active}`,
      kind,
      shell,
      scene,
      active,
      navKey,
    }
  }

  function capture() {
    const previous = describe()
    const tiles = new Map(
      qa('.launch-tile', previous.shell).map((node) => [
        node.dataset.select,
        {
          box: rect(node),
          radius: getComputedStyle(node).borderRadius,
        },
      ]),
    )
    return { ...previous, tiles }
  }

  function cancel(scope = 'scene') {
    const visible = document.getAnimations?.() || []
    for (const animation of visible) {
      if (animation.id.startsWith(`${PREFIX}${scope}:`)) animation.cancel()
    }
    for (const [animation, spec] of owned) {
      if (spec.scope === scope) {
        animation.cancel()
        owned.delete(animation)
      }
    }
  }

  function play(node, frames, options = {}, selector = '', scope = 'scene') {
    if (!node || !available()) return null
    const opts = { duration: timing.scene, easing: timing.ease, fill: 'both', ...options }
    const animation = node.animate(frames, opts)
    animation.id = `${PREFIX}${scope}:${++serial}`
    owned.set(animation, { scope, selector, frames, options: opts })
    animation.finished.then(
      () => {
        owned.delete(animation)
        animation.cancel()
      },
      () => {
        owned.delete(animation)
      },
    )
    return animation
  }

  function fade(selector, delay, duration, offset = 0) {
    const node = q(selector, q('#app'))
    if (!node) return null
    const frames = offset
      ? [
          { opacity: 0, transform: `translateY(${offset}px)` },
          { opacity: 1, transform: 'translateY(0)' },
        ]
      : [{ opacity: 0 }, { opacity: 1 }]
    return play(
      node,
      frames,
      { delay, duration, easing: offset ? timing.ease : timing.fade },
      selector,
    )
  }

  function flipTiles(previous, next) {
    let count = 0
    for (const node of qa('.launch-tile', next.shell)) {
      const old = previous.tiles?.get(node.dataset.select)
      if (!old) continue
      const to = rect(node)
      const from = old.box
      if (!to.width || !to.height) continue
      const dx = from.left - to.left
      const dy = from.top - to.top
      const sx = from.width / to.width
      const sy = from.height / to.height
      if (Math.abs(dx) + Math.abs(dy) + Math.abs(sx - 1) + Math.abs(sy - 1) < 0.01) continue
      node.style.transformOrigin = '0 0'
      play(
        node,
        [
          { transform: `translate(${dx}px,${dy}px) scale(${sx},${sy})`, borderRadius: old.radius },
          {
            transform: 'translate(0,0) scale(1,1)',
            borderRadius: getComputedStyle(node).borderRadius,
          },
        ],
        { duration: timing.tile },
        `.launch-tile[data-select="${CSS.escape(node.dataset.select)}"]`,
      )
      count++
    }
    return count
  }

  function animate(previous = {}, reason = 'update') {
    const next = describe()
    if (!available() || !next.shell) return
    if (previous.key === next.key && reason === 'update') return
    cancel('scene')
    flipTiles(previous, next)
    if (next.kind === 'project') {
      fade('.project-main-art', 60, timing.artwork)
      fade('.project-copy', 80, timing.copy, px(18))
      fade('.project-highlights', 150, timing.cards, px(24))
    } else if (next.kind === 'welcome') {
      fade('.welcome-prompt', 40, timing.copy)
      fade('.welcome-grid', 90, timing.welcome, px(34))
    } else if (next.kind === 'lock') {
      fade('.restore-lock-scene', 0, 220, px(16))
    } else {
      fade('.browse-page', 40, timing.scene, px(18))
    }
    lastReport = { reason, scene: next.kind }
  }

  return Object.freeze({ capture, animate, cancel, timing })
})()
