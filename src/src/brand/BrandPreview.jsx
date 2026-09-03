// Dev-only brand proof sheet (/brand — not in the scene map, no nav item,
// no number key). Shows both wordmarks on their canonical backgrounds at
// stage and small sizes so the lockups can be reviewed and tuned.

import { MeridianWordmark } from './MeridianWordmark'
import { NorthwindWordmark } from './NorthwindWordmark'

function Sheet({ label, background, children }) {
  return (
    <div style={{ background, borderRadius: 12, padding: '48px 56px', display: 'grid', gap: 40, justifyItems: 'center' }}>
      {children}
      <div style={{ font: '400 12px "Open Sans", sans-serif', color: 'var(--ot-ink-3)', letterSpacing: 1, textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  )
}

export function BrandPreview() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', padding: 48, display: 'grid', gap: 24, alignContent: 'start' }}>
      <Sheet label="Meridian — cream" background="var(--mer-cream)">
        <MeridianWordmark height={56} />
        <MeridianWordmark height={24} />
      </Sheet>
      <Sheet label="Meridian — reversed on navy" background="var(--mer-navy)">
        <MeridianWordmark height={40} color="#fff" />
      </Sheet>
      <Sheet label="Northwind Outfitters — sand" background="var(--nw-sand)">
        <NorthwindWordmark height={72} />
        <NorthwindWordmark height={36} />
      </Sheet>
      <Sheet label="Northwind Outfitters — white" background="#fff">
        <NorthwindWordmark height={48} />
      </Sheet>
    </div>
  )
}
