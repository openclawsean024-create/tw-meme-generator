# AGENTS.md — 台灣梗圖產生器（tw-meme-generator）

> ⚠️ 本產品評估建議**暫緩**（見 `PRD/SPEC.md` §0）。Sean 決定前不得開發新功能。

## 1. 權威文件與範圍

- 規格：[`PRD/SPEC.md`](./PRD/SPEC.md) v4.0（含 §10 合併清單）；目標：[`GOAL.md`](./GOAL.md)（M1，僅在繼續時適用）。
- 驗證：[`SOP.md`](./SOP.md)；狀態：[`STATUS.md`](./STATUS.md)。
- `DELIVERY-REPORT.md`、`PRD/CHANGELOG.md` 為舊紀錄，內容與程式有出入（見 SPEC §11）。
- `taiwan-meme-generator` 為候選併入 repo，**只讀**；搬什麼以 SPEC §10 為準。

## 2. 專案結構

```
src/app/                 # page（首頁＋排行＋雷達）、editor/[id]、gallery、meme/[id]、favorites
src/components/          # MemeCanvas、TextRegion、OcrDetector、ShareCard、BrandKitPicker、RankList、TrendingRadar…
src/lib/                 # ai-caption、brand-kit(-storage)、canvas-geometry、export-sizes、favorites、ocr、rank、storage、trending
src/data/                # memes.json（25 筆，picsum 佔位）、rankings.json（假數字）、tw-topics.ts（32 則）
tests/                   # Vitest，16 檔
```

## 3. 技術棧

Next.js ^16.2.10（App Router）、React 19、TypeScript 5.5、Tailwind CSS 3.4、framer-motion 11、react-rnd 10、html-to-image 1.11、tesseract.js 5、Vitest 2。`engines.node >= 20`。純前端，資料存 localStorage。

## 4. 開發規則

1. **素材合法優先**：預載素材只能是自製、CC0／公眾領域或已取得授權，且必須在授權清單登記；不得加入影視動漫截圖、受保護角色、藝人或任何可辨識真人。
2. **不製造假數據**：排行、分享數、時事來源不得寫死或假造後以真實數據呈現。
3. **不打付費 API**：梗文案只用本機規則式；新增外部服務需 Sean 同意。
4. **不得提交憑證**：任何 token、`.env*` 不得進 repo。
5. **使用者圖片不離開瀏覽器**。
6. **測試不可為了通過而刪改斷言**；不得 `.skip`／`.only`。
7. **Git**：預設分支 `master`；開分支、PR 合併；不 push `master`、不 force push、不改 repo 設定、不部署 production、不封存任何 repo。
8. **Commit 格式**：`<type>(scope): <說明或 AC 編號>`。

## 5. 驗證

見 [`SOP.md`](./SOP.md)。標「尚未配置」的指令不得宣稱已通過。
