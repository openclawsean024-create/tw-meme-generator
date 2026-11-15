# 台灣梗圖產生器 — 開發與驗證 SOP

## 規格對齊狀態（2026-11-16）

- ✅ `PRD/SPEC.md` v4.0 依 `master`（`40b4508`）程式重建；`GOAL.md` 定義 M1。
- ⚠️ 評估建議**暫緩**；Sean 決定前不開發。
- ⚠️ 本機無法執行 node：下表所有指令**未在本機執行**，結果欄只引用 GitHub Actions 紀錄。

## 環境

```bash
npm ci          # 使用 package-lock.json；repo 另有 pnpm-lock.yaml、pnpm-workspace.yaml（M1 移除）
npm run dev     # http://localhost:3000（未在本機執行）
```

## 驗證指令（依 `package.json` scripts 查證）

| 類型 | 指令 | 狀態 | 最近證據 |
|---|---|---|---|
| Install | `npm ci` | 可用 | CI 2026-09-28 成功 |
| Lint | `npm run lint` | 可用，但實際是 `tsc --noEmit`（無 ESLint） | CI ✓（不吞錯） |
| Typecheck | `npm run lint`（同上） | 以 lint 代替；獨立 `typecheck` **尚未配置** | CI ✓ |
| Unit test | `npm test`（`vitest run`） | 可用；16 個測試檔 | CI ✓（不吞錯） |
| Build | `npm run build` | 可用 | CI ✓ |
| E2E | — | **尚未配置** | — |
| Format | — | **尚未配置** | — |

## CI 現況

- lint／test／build 皆不吞錯，是本批 4 個工具中唯一能擋住失敗的 CI。
- deploy job 在 `master` push 時部署 Vercel production；2026-09-28 run `36497181080` deploy 失敗。
- 缺 ESLint 與 e2e；本次文件 PR 不改 CI。

## 故意不做

- ❌ 金流、帳號、付費 AI、真實社群資料抓取、真人或受保護角色素材、自動發布、production 部署。
