# tw-meme-generator · CHANGELOG

所有對 `tw-meme-generator` 規格 / 部署 / 測試的版本變更紀錄。

---

## v3.0.2 — 2026-09-06（repo-fleet 升級）

> 由 repo-fleet 批次 6B 自動駕駛：Sean Li / Mavis worker agent
> v3.0.2 完成於 2026-09-06 by Sean 10-repo-fleet

### Added
- `PRD/SPEC.md` v3.0.2 等級規格書（問題陳述 / 14 條 FR / NFR table / 部署契約 / mermaid flow）
- `PRD/CHANGELOG.md` 本檔
- `.github/workflows/ci.yml` GHA 4-job workflow（lint / test / build / deploy to Vercel）

### Changed
- `package.json` — `lint` script 從 `next lint`（Next 16 已 deprecated）改為 `tsc --noEmit`
- `tsconfig.json` — 加入 `vitest/globals` types（測試用）

### Verified
- ✅ `npm run lint` — 0 error（tsc --noEmit）
- ✅ `npm test` — 63/63 pass（8 test files）
- ✅ `npm run build` — 54 static pages + 5 routes 綠
- ✅ Vercel production 已 deployed

---

## v3.0 — 2026-07-19（v3 sprint：強制升級 5 件銳化）

> commit `4739cd4 wip(dev): tw-meme-generator initial scaffold + 30 tests`

### Added
- **Ptt/Dcard/Threads 時事雷達**（`src/lib/trending.ts`）— 自動抓熱門關鍵字 → 即時梗主題
- **AI 梗文案 v2**（`src/lib/ai-caption.ts`）— 加 Claude 3.5 Sonnet fallback + 風格記憶
- **限動互動模板** — Threads poll / IG 倒數 / IG 票選
- **多帳號 + 團隊工作區** — 5 個 Threads/IG 子帳號 + 統一品牌套件
- **品牌套件 Brand Kit v2**（`src/lib/brand-kit.ts`）— 字型 + Logo + 主色 + 浮水印 token 化

### Stack
- Next.js 14.2.5 → 16.2.10（CVE-2025-66478 patched）
- React 18 → 19（Next 16 requirement）
- 17 v1 tests + 46 new v3.0 tests = 63 total（270% of 30 minimum）

### Verified
- 54 個 static pages 產出
- Live: https://tw-meme-generator.vercel.app
- Vercel: Ready (Production, 32s build)

---

## v2.2.2 — 2026-07（sweet spot sharp rewrite）

> 銳化「繁中 Threads/IG 梗圖 + 商用圖庫 + 一鍵 9:16 直出 + AI 梗文案 + Ptt/Dcard 時事雷達」

- 甜蜜點：8/10
- 商業化 = 30 + 8×7 = 86 / 100
- §15.11 完整 5 問量表
- §15.12 ADR≥5（5+ 個技術決策）
- §15.13 市場驗證≥5（5 個 peer URL 驗證）

---

## v2.0 — 2026（初始 Threads/IG 商用圖庫版）

- 商用圖庫 + 繁中 AI 梗文案 + 1:1/9:16 直出
- 17 v1 unit tests 通過

---

## v1.0 — 2025（首發版）

- 基本梗圖編輯器
- 文字覆蓋 + 簡單下載
