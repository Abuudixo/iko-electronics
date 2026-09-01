# IKO Electronics — Storefront

Customer-facing storefront for IKO Electronics. React + Vite frontend; Odoo is
the system of record for products, stock and orders.

> **Current state:** the frontend is complete and runs against a **mock catalog**
> in `frontend/src/data/products.ts`. The Express BFF that adapts Odoo is not
> built yet, so a deployment today ships fake products. That is fine for review
> and for sharing the design — it is not a live shop.

## Running locally

Requires Node 20+ (built on 24.19 LTS).

```bash
cd frontend
npm install
npm run dev
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:5173 |
| `npm run build` | Typecheck, then production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Types only, no build |

## Layout

```
frontend/            React + Vite app  ← Vercel Root Directory
  src/
    components/      layout/, ui/, shop/, home/
    context/         CartContext — cart state, persisted to localStorage
    data/            mock catalog (replaced by the BFF in step 10)
    lib/             nav config, formatting helpers
    pages/           one file per route
    types/           catalog types, shaped to match Odoo
  public/brand/      logo and favicon assets
Project Pics/        original logo source files (raster only)
stitch_.../          original Stitch mockups — design reference, not built code
```

## Design system

Tokens live in `frontend/src/index.css` as Tailwind v4 `@theme` variables.

Structure (type scale, spacing, radii, elevation) comes from the Stitch
`DESIGN.md`. **Colour does not** — that file was generated for a fictional
"TechNova" brand on Electric Blue `#004AC6`. The real brand is:

| Token | Value | Notes |
| --- | --- | --- |
| Primary | `#683695` | Purple. 8.23:1 on white, both directions |
| Ink / inverse | `#0E2043` | Navy. 16.08:1 on the page ground |
| Inverse primary | `#C9B3DD` | For purple on navy — `#683695` there is only 1.95:1 |

Do not reintroduce the blue.

## Deploying to Vercel

Vercel redeploys automatically on every push once the repo is connected.

1. Push this repo to GitHub (private is recommended — it is commercial code).
2. In Vercel: **Add New → Project**, import the repo.
3. **Set Root Directory to `frontend`.** This is the one setting that is easy to
   miss; without it the build fails because there is no `package.json` at the
   repo root.
4. Framework preset should auto-detect as **Vite**. Leave the build command and
   output directory at their defaults.
5. Deploy.

`frontend/vercel.json` handles the SPA fallback. Without it, `/` would work but
loading or refreshing `/shop` or `/product/aurora-x9-5g-smartphone` would 404,
because those routes exist only in the browser.

### Branches

- `main` → production URL
- any other branch → its own preview URL, on every push

### Environment variables

Nothing is required today. When the BFF lands, set `VITE_API_BASE_URL` in the
Vercel dashboard.

**Odoo credentials must never be `VITE_`-prefixed.** Anything with that prefix is
compiled into the JavaScript bundle and is readable by anyone who opens the site.
Odoo keys belong to the server only.
