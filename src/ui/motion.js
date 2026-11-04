/* Apple Bento × PS5 空间过场与常驻控制坞 FLIP 动效 (#37) */
window.PS5Motion = (() => {
  'use strict'

  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  const owned = new Map()
  let serial = 0
  const PREFIX = 'ps5-motion:'
  const timing = Object.freeze({
    tile: 320,
    scene: 280,
    lock: 220,
    ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
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
    const navKey = shell.dataset.view || 'home'
    const stepKey = shell.dataset.onboardingStep || ''
    const kind = navKey === 'restore-lock' ? 'lock' : navKey === 'home' ? 'home' : 'subpage'
    return {
      key: `${navKey}/${stepKey}`,
      kind,
      shell,
      navKey,
    }
  }

  function capture() {
    const previous = describe()
    const tiles = new Map(
      qa('.dock-icon-card[data-dock-id]', previous.shell).map((node) => [
        node.dataset.dockId,
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
          { opacity: 0, transform: `translateY(${offset}px) scale(0.99)` },
          { opacity: 1, transform: 'translateY(0) scale(1)' },
        ]
      : [{ opacity: 0 }, { opacity: 1 }]
    return play(
      node,
      frames,
      { delay, duration, easing: offset ? timing.ease : timing.fade },
      selector,
    )
  }

  function flipDockTiles(previous, next) {
    let count = 0
    for (const node of qa('.dock-icon-card[data-dock-id]', next.shell)) {
      const old = previous.tiles?.get(node.dataset.dockId)
      if (!old) continue
      const to = rect(node)
      const from = old.box
      if (!to.width || !to.height || !from.width || !from.height) continue
      const dx = from.left - to.left
      const dy = from.top - to.top
      const sx = from.width / to.width
      const sy = from.height / to.height
      if (Math.abs(dx) + Math.abs(dy) + Math.abs(sx - 1) + Math.abs(sy - 1) < 0.5) continue
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
        `.dock-icon-card[data-dock-id="${CSS.escape(node.dataset.dockId)}"]`,
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
    flipDockTiles(previous, next)
    if ( q('.wizard-stage-card', next.shell) ) {
      fade('.wizard-stage-card', 10, 240, px(14))
    } else if (next.kind === 'lock') {
      fade('.restore-lock-scene', 0, timing.lock, px(16))
    } else if (next.kind === 'home') {
      fade('.overview-showcase', 15, timing.scene, px(14))
    } else {
      fade('.subpage-content-body', 15, timing.scene, px(14))
    }
  }

  return Object.freeze({ capture, animate, cancel, timing })
})()
