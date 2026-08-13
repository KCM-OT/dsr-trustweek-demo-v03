// Single source of truth for demo data — imported at build time, no fetches
// (README "Tech constraints": all fixture data imported from
// 04_data_fixtures.json at build time).
import fixtures from '../../spec_pack/04_data_fixtures.json'

export const tenant = fixtures.tenant
export const marcus = fixtures.marcus
export const teamsThread = fixtures.teamsThread
export const history = fixtures.history
export const attention = fixtures.attention
export const queue = fixtures.queue

export default fixtures
