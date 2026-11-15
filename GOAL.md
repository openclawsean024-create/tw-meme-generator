# Goal — 台灣梗圖產生器 M1

> ⚠️ **建議暫緩，需 Sean 決定後才開發。** 理由見 `PRD/SPEC.md` §0：沒有任何合法梗圖素材、獲利途徑薄弱，且現有素材清單有著作權與肖像權風險。以下 M1 僅在 Sean 決定以「合法免費小工具」繼續時適用。

## Objective

在純前端、不接金流、不呼叫付費 AI、預載素材全部合法可追溯的前提下，把現有編輯器收斂成可公開使用的免費小工具：品質閘門擋得住失敗、移除受保護角色與真人相關素材及假排行數字、每張素材有授權紀錄、使用者可上傳自己的圖片、規則式梗文案接到編輯器、分享改為分享圖片本身。

規格依據：`PRD/SPEC.md` v4.0（§4 FR、§7 風險、§8 M1、§10 合併清單）。

## Acceptance criteria

每條 AC 的「驗證」指令必須 exit 0。

- **AC-001：品質閘門擋得住失敗**
  - `lint` 改為 ESLint 9（flat config），另新增 `typecheck`（`tsc --noEmit`）與 `e2e`（Playwright，Chromium，每次清空 localStorage）script；只保留 npm lockfile，移除 `pnpm-lock.yaml`、`pnpm-workspace.yaml`。
  - CI 新增 typecheck、e2e job；deploy 需所有 job 通過且 PR 不部署。
  - 驗證：`npm run lint && npm run typecheck && npm test && npm run build && npm run e2e` 全部 exit 0；PR 上 GitHub Actions 全綠。

- **AC-002：移除風險素材與假數據**（FR-002、FR-010、SPEC §7）
  - `memes.json` 移除以受保護角色、作品或真人命名的項目（含哆啦 A 夢、JoJo、皮卡丘、Rickroll、歐陽娜娜等）；`rankings.json` 的假分享／按讚數移除，排行只計使用者本機實際資料，空資料時顯示空狀態。
  - 驗證：`npm test -- tests/asset-safety.test.ts`（以禁用詞表掃描 `src/data/**`，命中即失敗）；`git grep -nE "哆啦|JoJo|皮卡丘|Rickroll|歐陽娜娜|娜娜" -- src` 無結果。

- **AC-003：素材授權清單**（FR-014）
  - 新增 `src/data/assets-license.json`：每張預載素材記錄 `id`、檔案路徑（放在 `public/memes/`，不再用外部隨機圖）、`source`、`license`（僅允許 `self-made`、`CC0`、`public-domain`、`licensed`）、`author`、`addedAt`；`licensed` 需附授權文件路徑。
  - `next.config.mjs` 移除 `picsum.photos` 等外部圖片網域。
  - 驗證：`npm test -- tests/assets-license.test.ts`（每個 `memes.json` 項目都有授權紀錄、license 值合法、檔案存在）；`git grep -n "picsum" -- src next.config.mjs` 無結果。

- **AC-004：上傳自己的圖片**（FR-003）
  - 首頁與編輯器提供上傳（JPG／PNG／WebP、≤ 10 MB），圖片只在瀏覽器以 object URL 處理，不上傳伺服器；上傳前顯示「請確認你有權使用此圖片，含他人肖像需取得同意」。
  - 上傳圖片可使用 OCR、文字框、Brand Kit 與匯出。
  - 驗證：`npm test -- tests/upload-validation.test.ts`；`npm run e2e -- tests/e2e/upload-edit-export.spec.ts`（上傳測試幾何圖 → 加字 → 匯出 PNG，網路紀錄無圖片上傳請求）。

- **AC-005：梗文案接 UI、分享改為圖片**（FR-011、FR-009）
  - 編輯器加入「梗文案建議」：呼叫既有 `ai-caption.ts`（規則式，不打外部 API），一鍵套入選取的文字框；被過濾的輸入顯示提示。
  - 分享改用 Web Share API 分享 PNG 檔（不支援時下載），不再產生只有本機看得到的 `?share=` 連結。
  - 驗證：`npm test -- tests/ai-caption.test.ts tests/share-image.test.ts`；`npm run e2e -- tests/e2e/caption-apply.spec.ts`。

## Out of scope

- 金流、帳號、雲端儲存、公開作品牆。
- 任何付費 AI 或 LLM API；真實 Ptt／Dcard／Threads 資料抓取。
- 政治人物、候選人、藝人或任何可辨識真人的預載素材；影視動漫截圖。
- 自動發布到 LINE／FB／IG／Threads。
- production 部署與 Vercel 設定變更；封存 `taiwan-meme-generator`（由 Sean 決定）。

## Exit gate

- Sean 先決定「繼續」並選定素材策略（SPEC §12 第 2 點），才可開始 M1。
- AC-001～AC-005 驗證指令全部 exit 0，記錄於 `STATUS.md`；實作 PR 的 GitHub Actions 全綠。
- 公開 production 前，需 Sean 覆核 `assets-license.json` 每一筆。
