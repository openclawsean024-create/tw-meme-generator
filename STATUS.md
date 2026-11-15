# Status — tw-meme-generator（台灣梗圖產生器）

- 主 repo：`openclawsean024-create/tw-meme-generator`（`master` @ `40b4508`）
- 候選併入：`openclawsean024-create/taiwan-meme-generator`（`main` @ `2494fc1`，只讀；無產品程式）
- 規格：`PRD/SPEC.md` v4.0；目標：`GOAL.md`（M1，僅在繼續時適用）
- 狀態：🟠 **文件重建完成；評估建議暫緩，待 Sean 決定**（2026-11-16）
- §0：完成度 50；獲利潛力 低

> 本檔取代 2026-07-19 的 v3.0 sprint STATUS；舊內容可由 git 歷史查閱。

## 目前狀態摘要

- 編輯器、OCR、多尺寸匯出、Brand Kit、收藏有程式與測試。
- 25 張素材全是 picsum 佔位，名稱含受保護角色與真人；無上傳功能。
- 排行為寫死假數字；梗文案未接 UI；時事雷達為假來源；分享連結只在本機有效。

## FR 對照

| FR | 需求 | 優先 | 狀態 | 所在 repo |
|---|---|---|---|---|
| FR-001 | 編輯器 | P0 | 已實作 | tw-meme-generator |
| FR-002 | 合法素材庫 | P0 | 未實作 | — |
| FR-003 | 上傳底圖 | P0 | 未實作 | 需求來自 taiwan-meme-generator PRD |
| FR-004 | 多尺寸匯出 | P0 | 已實作 | tw-meme-generator |
| FR-005 | FB／LINE 尺寸 | P1 | 未實作 | 需求來自 taiwan-meme-generator PRD |
| FR-006 | OCR | P1 | 已實作 | tw-meme-generator |
| FR-007 | Brand Kit | P1 | 已實作 | tw-meme-generator |
| FR-008 | 收藏 | P1 | 已實作 | tw-meme-generator |
| FR-009 | 分享 | P1 | 部分 | tw-meme-generator |
| FR-010 | 熱門排行 | P2 | 部分 | tw-meme-generator |
| FR-011 | 梗文案建議 | P2 | 部分 | tw-meme-generator |
| FR-012 | 時事雷達 | P2 | 部分 | tw-meme-generator |
| FR-013 | 台灣梗主題庫 | P2 | 已實作 | tw-meme-generator |
| FR-014 | 素材授權標示 | P0 | 未實作 | — |
| FR-015 | 檢舉下架 | P1 | 未實作 | — |
| FR-016 | 校園自製範本 | P2 | 未實作 | 需求來自 taiwan-meme-generator PRD |

## Deterministic checks

本次未在本機執行（環境無 node）。最近 CI：2026-09-28 run `36497181080` — lint（tsc）／test／build ✓，Vercel deploy ✗。

## 本次變更

- 改寫 `PRD/SPEC.md`、`STATUS.md`；新增 `GOAL.md`、`AGENTS.md`、`SOP.md`；未動程式、設定、測試、`DELIVERY-REPORT.md`、`PRD/CHANGELOG.md`；未寫入 `taiwan-meme-generator`。

## 待決事項

1. 是否暫緩，或以 M1 收斂為合法免費小工具。
2. 素材策略（自製／CC0／只靠上傳）。
3. `taiwan-meme-generator` 是否封存。
4. 舊 production URL 是否仍公開含真人與受保護角色名稱的項目。
