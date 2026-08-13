# Handoff Manifest

## Included
- Full application source under `src/`
- Required runtime/static assets under `public/`
- Exact Figma setup-dashboard icons under `public/figma/`
- Shared `components/` directory
- Original `spec_pack/` product/design/story/fixture specifications
- `report/` report source artifacts
- `package.json` and `package-lock.json`
- Vite, TypeScript path, Vercel, and Firebase configuration
- `README.md` and historical `PROGRESS.md`
- Claude Code root instructions (`CLAUDE.md`)
- Focused architecture, interaction, design-system, and continuation guides (`docs/`)

## Excluded
- `node_modules/` — recreate with `npm install`
- `dist/` — recreate with `npm run build`
- Runtime/debug logs and temporary browser screenshots
- v0-only plan, memory, tool-output, and conversation files
- Git metadata
- Secrets and environment variables (none are required)

## Integrity expectations
The project should install and build without external credentials. Static assets use project-relative paths. All interactions and demo data should function offline after dependencies are installed.
