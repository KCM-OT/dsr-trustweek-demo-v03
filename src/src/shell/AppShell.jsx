import { NavLink, Outlet } from 'react-router-dom'
import { NAV_ITEMS } from '../scenes/sceneMap'
import { ChevronRightIcon } from './icons'

// Future-OneTrust shell chrome — 02_design_system.md §1, revised against
// the real Privacy Rights Automation screenshots (spec_pack/reference/
// pra_request_queue.png, pra_request_detail.png): near-black top bar +
// dark-navy module sidebar with the real module's items. Wraps every
// admin-side route; the Meridian intake agent and blank holding screen
// render standalone.
export function AppShell() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar />
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <NavRail />
        <main style={{ flex: 1, minWidth: 0, position: 'relative', overflow: 'auto', background: 'var(--ot-bg)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

const NAV_ICON_ASSETS = {
  Dashboard: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-dashboard-peKY3X02gaFcHIP4KHpB6XraYT8UZ4.svg',
  Reports: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-reports-VzAnuf5OrXLqgguxkTzhjNKc5jkMFK.svg',
  Requests: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-requests-PdiZ9E4Wqu6nStIToNpXLKgTuRb4AZ.svg',
  Subtasks: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-subtasks-bPdVWAPGnvURPg7OQxN0fZwpwKu4az.svg',
  Setup: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-setup-ZB7YsW0WXbPrEaAHRAdVytxi9hA0wD.svg',
  Settings: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-settings-9SQ4oKcqgiNQB9eS5jBxFz54p866fa.svg',
}

function SidebarIcon({ src }) {
  if (!src) return null

  return (
    <span style={{ width: 20, height: 20, flexShrink: 0, display: 'grid', placeItems: 'center' }}>
      <img src={src} alt="" width="16" height="16" style={{ display: 'block', objectFit: 'contain' }} />
    </span>
  )
}

function NavRail() {
  return (
    <nav
      aria-label="Privacy Rights Automation module navigation"
      style={{
        width: 260,
        flexShrink: 0,
        background: '#000000',
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--space-4) 0',
      }}
    >
      <div
        style={{
          padding: '0 var(--space-6) var(--space-4)',
          font: '600 14px "Open Sans", sans-serif',
          color: '#ffffff',
          letterSpacing: 0.2,
        }}
      >
        Privacy Rights Automation
      </div>

      <div style={{ display: 'grid' }}>
        {NAV_ITEMS.map((item) => {
          const iconSrc = NAV_ICON_ASSETS[item.navLabel]
          const hasSubmenu = item.navLabel === 'Setup'
          return (
            <NavLink
              key={item.id}
              to={item.route}
              style={({ isActive }) => ({
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px var(--space-6)',
                textDecoration: 'none',
                color: isActive ? '#ffffff' : 'var(--ot-sidebar-ink)',
                background: isActive ? '#1A1A1A' : 'transparent',
                borderTop: ['Dashboard', 'Setup', 'Settings'].includes(item.navLabel) ? '1px solid #333333' : '1px solid transparent',
                font: 'var(--fs-body)',
              })}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 3,
                        background: '#6CEEAD',
                      }}
                    />
                  )}
                  <SidebarIcon src={iconSrc} />
                  <span style={{ flex: 1 }}>{item.navLabel}</span>
                  {hasSubmenu && <ChevronRightIcon width={16} height={16} />}
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

function Mark() {
  return (
    <img
      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/OT_Privacy_Artifacts_and_research-ELu2lacTtcgnrsqELd6Wock9l05g2e.png"
      alt="OneTrust"
      width="153"
      height="22"
      style={{ display: 'block', width: 153, height: 22, objectFit: 'contain' }}
    />
  )
}

const utilityIcons = {
  search: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/figma-assets/5c8664ed22809eb86f4d2f7c96d6ba6ce5e2d99816c7af44007f9f0ed8f64362.svg',
  alert: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/figma-assets/037bc49e63427908a848195273947f46c13a7606e5bf572a5abecc1d7e24da1b.svg',
  cog: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/figma-assets/b15fd15e4eac114d49b6a9c8c5b5575482d37b8695542fa2e416158673e7d576.svg',
  user: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSR_2026-0qRyuvUNaTzuK2MWWm6y1DfHfbvLfy.png',
  question: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/figma-assets/19b3685984b7b8bdf293135e0d2a682eff39c93dcccef5b1e2bbb3fe49cb5379.svg',
  angleDown: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/figma-assets/6e4aaf0cbb8cdf3d9f52cc0311a4b7d26d6b3bd474eb2e3a1e253111ce0132dd.svg',
  copilot: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/figma-assets/7384a04a79afbae20c5cf1854e5c0aaf7b80adf34c1147ed362968e49313e478.svg',
}

function UtilityIcon({ src, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      style={{ width: 42, height: 40, padding: 0, border: 0, background: 'transparent', display: 'grid', placeItems: 'center', cursor: 'pointer' }}
    >
      <img src={src} alt="" width="42" height="40" />
    </button>
  )
}

function TopBar() {
  return (
    <header style={{ height: 66, flexShrink: 0, display: 'flex', borderBottom: '1px solid #333333' }}>
      <div style={{ width: 260, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '0 var(--space-4)', background: '#000000' }}>
        <button
          type="button"
          aria-label="Open main menu"
          style={{ width: 40, height: 40, flexShrink: 0, padding: 0, border: 0, background: 'transparent', cursor: 'pointer' }}
        >
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSR_2026-7IxVE7aBMtuDZBoMbjiRIfI4oseKZJ.png"
            alt=""
            width="40"
            height="40"
            style={{ display: 'block', width: 40, height: 40, objectFit: 'contain' }}
          />
        </button>
        <Mark />
      </div>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-6)', padding: '0 var(--space-6)', background: '#ffffff' }}>
        <span style={{ color: '#1a1a1a', font: '600 18px/25px "Open Sans", sans-serif', whiteSpace: 'nowrap' }}>Meridian Brands</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <UtilityIcon src={utilityIcons.search} label="Search" />
          <button type="button" style={{ height: 32, padding: '6px 16px', border: '1px solid #4c754d', borderRadius: 4, background: '#ffffff', color: '#33553e', display: 'flex', alignItems: 'center', gap: 8, font: '600 14px/20px "Open Sans", sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <img src={utilityIcons.copilot} alt="" width="12" height="15" />
            Ask Copilot
          </button>
          <UtilityIcon src={utilityIcons.alert} label="Notifications" />
          <button type="button" aria-label="Select privacy group" style={{ height: 40, padding: '0 12px', border: 0, borderRadius: 6, background: 'rgba(255,255,255,0.2)', color: '#282828', display: 'flex', alignItems: 'center', gap: 12, font: '400 14px/19px "Open Sans", sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Privacy Group
            <img src={utilityIcons.angleDown} alt="" width="16" height="9" />
          </button>
          <UtilityIcon src={utilityIcons.cog} label="Settings" />
          <UtilityIcon src={utilityIcons.user} label="User account" />
          <UtilityIcon src={utilityIcons.question} label="Help" />
        </div>
      </div>
    </header>
  )
}
