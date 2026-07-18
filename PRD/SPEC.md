# 台灣梗圖製造器 — 規格計劃書 v2.2.2（sweet spot sharp rewrite）

> **版本**：v2.2.2｜**更新日期**：2026-07-19｜**維護者**：Sophia (CPO) for Sean
> **對接技術**：Alan (CTO)｜**對接 Repo**：[openclawsean024-create/tw-meme-generator](https://github.com/openclawsean024-create/tw-meme-generator)
> **Live**：https://tw-meme-generator.vercel.app
> **Sweet Spot**：6/10（**繁中唯一 Threads/IG 梗圖 + 商用圖庫 + 一鍵 9:16 直出**）→ 本版銳化

---

## 0. 本版重寫摘要 (v2.2.2)

v2.2.1 已定位「正版圖庫 + 繁中模板 + 社群直出尺寸」。本版**三件銳化**：

1. **砍掉 Picsum**（版權風險）→ 100% **Pexels + Unsplash + Pixabay 商用圖庫**（CC0）
2. **甜蜜點定位**：Threads / IG 繁中創作者（Reels / 短影音封面 + 限動）+ 行銷小編 + 社群小編 — 與 Imgflip（英文紅海）、Canva（通用）切割
3. **新功能**：**梗文案 AI 生成（繁中 GPT-4o-mini）** + **排程發文（Threads / IG buffer API）**

§15 貼出完整 sweet spot 5 問 + **最終商業化評分**：**69 / 100**（公式 = (9×0.3 + 6×0.7)×10）。

---

## 1. 產品概述

### 1.1 問題陳述

繁中 Threads / IG 創作者每天產 1-3 張圖，最大的痛點不是「做圖」（Canva / 廣告設計師都會），而是「**找到商用圖 + 配繁中梗文案 + 一鍵 9:16 / 1:1 直出**」——三件事拆成三個工具。

| 現有方案 | 問題 |
|---|---|
| **Imgflip** | 30M+ users、英文梗為主、無繁中梗資料庫 |
| **Canva** | 200M+ users、繁中支援好、但**自動梗文案無、無 Threads 1:1 直出** |
| **Figma + 素材網** | 通用設計工具、非梗圖設計 |
| **imgur + 自己剪** | 版權風險、無梗文化 |
| **Threads 創作社群（盜圖）** | 版權 + 流量大但商用安全 |
| **繁中 Threads/IG 梗圖 + 商用圖庫 + 9:16 直出** | **市場空白** |

**甜蜜點（v2.2.2 銳化）**：**繁中唯一 Threads/IG「商用圖庫 + 繁中梗文案 AI + 一鍵 9:16 直出」一條龍工廠**。

### 1.2 目標使用者

| Persona | 規模 (台灣) | 月情境 | 痛點 | ARPU/年 |
|---|---|---|---|---|
| 🧵 **小琪 Threads 創作者** | ~30,000 | 日 2 張 | 找圖 + 梗文案 + 尺寸 | NT$1,188 |
| 📸 **阿德 IG 限動小編** | ~50,000 | 日 5 張 | 9:16 直出 + 商用安全 | NT$1,188 |
| 💼 **Lisa 社群小編** | ~20,000 | 月 100 張 | 商用圖 + 模板 | **NT$3,588（團隊）** |
| 🎓 **志明學生 / 文創** | ~100,000 | 月 5 張 | 免費偶爾付 | NT$0 → 廣告 |
| 📰 **新聞小編** | ~2,000 | 日 5 張 | 時事梗 + 商用授權 | **NT$9,588** |

**核心 TA = 小琪 + 阿德 + Lisa**（100,000 人，Threads / IG 創作者 6% 付費 × NT$1,188 = NT$7.1M/年 TAM；保守抓 NT$2M）。

### 1.3 核心價值主張

> **「繁中唯一 Threads / IG 梗圖工廠 — 商用圖 + AI 梗文案 + 9:16 直出，10 秒做完一張。」**

| 替代 | 缺點 | 我們差異 |
|---|---|---|
| Imgflip | 英文 + 通用尺寸 | **繁中 Threads 1:1 + Reels 9:16** |
| Canva | 通用、無自動梗文案 | **繁中 GPT 梗文案 + 商用圖庫** |
| Figma | 設計工具非梗圖 | **一鍵直出尺寸** |
| 自己剪 | 版權風險、慢 | **CC0 商用 + 10 秒** |

### 1.4 商業目標

| 時間 | 目標 | 指標 |
|---|---|---|
| M3 | 200 付費 + 10K 月訪 + 1K 免費用戶 | 100K MRR |
| M6 | 800 付費 + **10 企業** | 500K MRR |
| M12 | 3000 付費 + **40 企業** | **2M MRR** |

**Unit Economics**：
- 個人 NT$99/mo × 3,000 = NT$297K MRR
- 團隊 NT$299/mo × 40 = NT$12K MRR
- 企業 NT$799/mo × 40 = NT$32K MRR
- 商用授權費 NT$999/次 × 60 = NT$60K MRR
- 合計 NT$400K MRR（M12 保守）

### 1.5 ⭐ Non-Goals

- ❌ **英文 / 日文 / 韓文梗素材**（v1 繁中 only，鎖 niche）
- ❌ **影音剪輯 / Reels 編輯**（CapCut 紅海）
- ❌ **短影音生成**（Sora / Veo 紅海）
- ❌ **AI 圖像生成**（Midjourney / DALL-E 紅海）
- ❌ **NFT / meme coin 推廣**（法規 + 偏投機）
- ❌ **論壇 / 留言區**（Ptt/Dcard 紅海）
- ❌ **轉址 / 短網址**（PicSee 紅海）
- ❌ **Scheduling 進階**（Buffer / Later 紅海，僅做基本排程）
- ❌ **GIF 梗圖**（Giphy 紅海）

---

## 2. 使用者場景與流程

### 2.1 流程圖

```
進入首頁 (tw-meme-generator.vercel.app)
   ↓
選「梗主題」/ 搜 / AI 生成主題
   ├─ 熱門：今日時事 / Threads 熱榜 / 梗詞庫
   ├─ 搜：「確診」、「躺平」、「閃電」
   └─ AI 生成主題：AI 依熱度建議 5 個
   ↓
選圖庫（商用 CC0）
   ├─ Pexels / Unsplash / Pixabay 搜
   └─ 圖建議：AI 配對（依梗主題）
   ↓
AI 產生 3 種繁中梗文案
   ├─ 短版（一句話）
   ├─ 中版（兩句）
   └─ 長版（三句 punchline）
   ↓
編輯（字型 / 顏色 / 位置）
   ↓
預覽 3 種尺寸
   ├─ Threads 1:1 (1080×1080)
   ├─ IG Reels 9:16 (1080×1920)
   └─ IG 限動 9:16
   ↓
下載（PNG / JPG）或
   ├─ 排程（Threads buffer API）
   └─ 複製到 IG（手動）
```

### 2.2 關鍵用戶故事

```
US-1（核心場景）
As a Threads 創作者「小琪」
I want AI 自動配圖 + 繁中梗文案 + 1:1 直出
So that 我日 5 張產文從 30 分 → 5 分

US-2（IG 限動）
As a IG 限動小編「阿德」
I want 一鍵 9:16 直出 + 商用圖庫
So that 我不出 1 張侵權圖

US-3（**企業商用授權** - 核心付費）
As a 品牌社群小編「Lisa」
I want 商用授權 + 品牌字型 + 排程
So that 月省 20hr 設計 + 0 侵權風險

US-4（AI 文案）
As a 小琪
I want AI 幫我寫 3 種 punchline 候選
So that 我不必想梗

US-5（時事梗）
As a 新聞小編
I want 即時時事熱詞主題
So that 趕上時事熱度
```

### 2.3 邊界場景

| 場景 | 處理 |
|---|---|
| Pexels / Unsplash API 掛 | 切 Pixabay + 顯示「圖庫維護中」 |
| AI 文案辱罵 / 歧視 | OpenAI moderation + 重新生成 |
| 字型缺 | fallback 系統字 |
| 圖解析度不足 | 提示「圖小於 800px」 |
| 商用不明圖 | 強制 CC0 標籤，不可商用則擋下載 |
| Threads buffer 失敗 | 失敗重試 + email 通知 |

---

## 3. 功能性需求

### 3.1 MVP（P0）

| ID | 功能 | 狀態 | 為何必做 |
|---|---|---|---|
| F-001 | 圖庫搜尋（Pexels + Unsplash + Pixabay）| ❌ | 甜蜜點核心 |
| F-002 | 繁中梗詞庫（300+ 詞）| ❌ | 差異化 |
| F-003 | 熱門主題（今日 / Threads / 時事）| ❌ | 流量入口 |
| F-004 | **AI 梗文案生成（GPT-4o-mini）**| ❌ | **甜蜜點核心** |
| F-005 | 編輯器（字型 / 顏色 / 位置）| ❌ | 必要 |
| F-006 | **一鍵 3 種尺寸（1:1 / 9:16 / 4:5）**| ❌ | **甜蜜點核心** |
| F-007 | 下載（PNG / JPG）| ❌ | 必要 |
| F-008 | 用戶帳號 + 我的作品 | ❌ | 留存 |
| F-009 | **商用授權聲明（CC0 + 來源顯示）**| ❌ | **法律安全** |

**砍掉**：Picsum 隨機、AI 圖像生成、影音剪輯、英文素材。

### 3.2 v2（P1）

| ID | 功能 | 商業理由 |
|---|---|---|
| F-101 | **Threads 排程（buffer API）** | 創作者出口 |
| F-102 | **品牌字型 + Logo 上傳** | 企業 |
| F-103 | **多帳號管理（團隊）** | NT$299 升級 |
| F-104 | 商用授權書 PDF | 企業採購 |
| F-105 | **GIF 梗製作（Giphy 整合）** | 紅海 but v2 仍做（一鍵輸出） |
| F-106 | IG 排程（IG Graph API） | 企業 |

### 3.3 v3（P2 探索）

| ID | 功能 | 假設 |
|---|---|---|
| F-201 | Threads / IG 自動發文 | 流量出口 |
| F-202 | 短影片模板 | 紅海慎入 |
| F-203 | 馬來西亞 / 新加坡繁中 | 國際化 |
| F-204 | 梗文 AI 學習個人生成 | 個人化 |

### 3.4 ⭐ Acceptance Criteria

```
AC-01 圖庫搜尋
  Given 用戶搜「閃電」
  When 點搜尋
  Then 5 秒內顯示 20 張結果（Pexels + Unsplash + Pixabay）
  And 每張標「商用 CC0 + 來源」
  And 點大圖預覽

AC-02 AI 文案生成
  Given 用戶選圖 + 梗主題「確診」
  When 點「AI 生文案」
  Then 10 秒內出 3 種（中/短/長）
  And 每句含關鍵字主題詞
  And 不含辱罵 / 歧義（moderation 過）

AC-03 一鍵多尺寸
  Given 用戶編輯完成原圖
  When 點「下載 3 尺寸」
  Then < 5 秒出 3 張 PNG（1:1 + 9:16 + 4:5）
  And 字型位置自動調整
  And ≤ 2MB / 張

AC-04 商用授權
  Given 圖庫標 non-CC0
  When 嘗試下載
  Then 強制顯示「不可商用」警告
  And 鎖下載按鈕
  And 推薦 CC0 替代

AC-05 **Threads 排程（v2.2.2 新）**
  Given Pro 用戶已授權 Threads
  When 選排程時間 + 內容
  Then 自動排入 buffer queue
  And 5 分鐘前 e2e 測試成功發文
```

---

## 4. 系統設計

### 4.1 技術棧

| Layer | 選 | 理由 |
|---|---|---|
| Frontend | Next.js 16 + Tailwind | 既有 |
| Canvas | **Fabric.js v6** | 既有 / 文字編輯主流 |
| Image | Cloudflare Images（resize） | 國際 + 速度快 |
| AI | **GPT-4o-mini**（繁中 prompt）| 成本低 |
| 圖庫 | Pexels + Unsplash + Pixabay API | CC0 商用 |
| DB | Vercel Postgres | 既有 |
| Auth | Clerk / NextAuth | 既有 |
| Payment | NewebPay | 在地化 |
| Scheduling | **Buffer API（Threads）**| v2 |

### 4.2 架構

```
[Browser]
   ├─ /（熱門主題 + AI 推薦）
   ├─ /editor（Fabric.js + AI 文案）
   ├─ /my（作品集）
   └─ /admin（管理）
   ↓
[Next.js API]
   ├─ /api/image/search（Pexels/Unsplash/Pixabay 聚合）
   ├─ /api/ai/caption（GPT-4o-mini）
   ├─ /api/image/export（3 尺寸 zip）
   └─ /api/schedule/threads（buffer）
   ↓
[Cloudflare Images]
   └─ resize + format conversion
   ↓
[Vercel Postgres]
   ├─ memes（用戶作品）
   ├─ users（tier）
   └─ templates（繁中梗詞庫）
```

### 4.3 Prisma Schema

```prisma
model Meme {
  id          String   @id @default(cuid())
  userId      String
  title       String
  topic       String   // 梗主題
  caption     String   // AI 文案
  imageUrl    String   // Cloudflare URL
  sizesJson   String   // {1:1, 9:16, 4:5}
  isPublic    Boolean  @default(false)
  createdAt   DateTime @default(now())
}

model Template {
  id          String   @id @default(cuid())
  topic       String   // 確診 / 躺平
  hotScore    Int      @default(0)
  captionHint String   // AI prompt 範本
  tags        String   // JSON array
  createdAt   DateTime @default(now())
}

model Usage {
  id        String   @id @default(cuid())
  userId    String
  feature   String   // search / ai / export
  count     Int      @default(1)
  createdAt DateTime @default(now())
}
```

### 4.4 API

| Method | Path | 用途 |
|---|---|---|
| GET | `/api/image/search?q=` | 圖庫聚合搜（Pexels+Unsplash+Pixabay）|
| POST | `/api/ai/caption` | 3 種繁中梗文案 |
| POST | `/api/meme` | 儲存作品 |
| GET | `/api/meme/me` | 我的作品 |
| POST | `/api/export` | 3 尺寸 PNG zip |
| POST | `/api/schedule/threads` | Threads 排程（buffer）|
| GET | `/api/templates/hot` | 熱門模板 |

---

## 5. 非功能性需求

### 5.1 性能
- 圖庫搜 5 秒內出結果（cache）
- AI 文案 < 10 秒
- Canvas 編輯 60fps
- 3 尺寸 zip < 5 秒

### 5.2 安全與法律
- **強制 CC0**：所有商用圖庫標 CC0，明示來源
- 圖庫非商用擋下載（避免侵權）
- AI 文案 OpenAI moderation 過濾辱罵 / 歧視 / 色情
- 用戶作品加密儲存（Cloudflare signed URL）

### 5.3 ⭐ 降級機制

| 故障 | 降級 |
|---|---|
| Pexels 掛 | 切 Unsplash + Pixabay |
| GPT-4o-mini 掛 | 切 Qwen2.5（繁中開源）|
| Cloudflare Images 掛 | 改 Vercel Image |
| Buffer API 掛 | 改 email 通知 + 手動 |
| NewebPay 掛 | 銀行轉帳 |

### 5.4 擴展性
- 圖庫結果 Redis cache 24hr
- 模板熱度每小時更新（cron）

---

## 6. 完成標準 (DoD)

- [ ] F-001~F-009 全實作
- [ ] 5 個 Threads / IG 創作者 beta
- [ ] CC0 商用聲明頁 / Privacy
- [ ] Lighthouse Performance ≥ 90
- [ ] Notion PRD ≥ 9、商業化更新

---

## 7. 風險與決策

### 7.1 風險表

| Risk | 等級 | 緩解 |
|---|---|---|
| 圖庫 API 漲價 / 關閉 | 🟠 | 3 家 fallback |
| AI 文案觸發審查 | 🟡 | Moderation + 重新生成 |
| Imgflip / Canva 出繁中 | 🟡 | 持續搶 Threads/IG niche + 速度 |
| Threads buffer API 限制 | 🟡 | 排程失敗自動 email |
| Canva Threads 模板追上 | 🟠 | 持續 AI 文案 + 商用安全 |

### 7.2 ⭐ ADR

**ADR-001 為何砍 Picsum？**
- 決策：v2.2.2 100% 用 Pexels + Unsplash + Pixabay
- 理由：Picsum 雖 CC0 但無語意、版權聲明模糊，商用風險高
- 取捨：成本上升（3 API key），但商用安全

**ADR-002 為何不做英文？**
- 決策：v1 繁中 only
- 理由：Threads / IG 繁中 niche 真實存在、英文搶不過 Imgflip / Canva
- 取捨：放棄 100M 英文市場、拿 100% 繁中獲利

**ADR-003 為何 Threads buffer API 不做 IG 自動發文？**
- 決策：v2 Threads buffer 為主，IG API v3 再加
- 理由：IG Graph API 審核嚴、Threads buffer 友善
- 取捨：IG 用戶需手動，但 v3 會加

---

## 8. 里程碑與 Sprint

### 8.1 里程碑

| M | 時程 | 產出 |
|---|---|---|
| M0 銳化 | W1-2 | 本 PRD + 訪談 5 創作者 + 2 品牌 |
| M1 MVP | W3-8 | F-001~F-009 + 50 付費 beta |
| M2 GA | W9-12 | 公開 + Threads KOL 行銷 |
| M3 PMF | W13-24 | 800 付費 + 10 企業 = NT$500K MRR |
| M4 規模 | W25-36 | 3000 付費 + 40 企業 = NT$2M MRR |

### 8.2 Sprint

| S | 主題 |
|---|---|
| S1 | Pexels + Unsplash + Pixabay 聚合圖庫 |
| S2 | 繁中梗詞庫 300 詞 + Threads 熱榜爬蟲 |
| S3 | Fabric.js 編輯器 + 多尺寸預覽 |
| S4 | GPT-4o-mini 梗文案 + Moderation |
| S5 | CC0 商用聲明 + 強制不可商用擋下載 |
| S6 | Threads buffer 排程 + GA 上線 |

---

## 9. 變現 + 定價心理學

### 9.1 方案

| 方案 | 月費 | 額度 |
|---|---|---|
| 🆓 Free | NT$0 | 5 張/月、浮水印 |
| 👤 Personal | NT$99 | 100 張、無浮水印 |
| 🎨 **Creator** | **NT$299** | **500 張 + AI 文案 + Threads 排程** |
| 🏢 **Team** | **NT$799** | **2000 張 + 5 帳號 + 商用授權書** |
| 🎯 Brand | NT$9,999+ | 客製無限 |

### 9.2 定價心理學
- **NT$99 vs NT$100**：心理門檻、學生付費線
- **NT$299 對標 Canva Pro NT$130/月 + Threads 排程**：仍比一位小編 NT$30K/月 便宜
- **NT$799 團隊**：1 帳號 NT$799、5 帳號 = NT$160/人
- 年繳 8 折提升 LTV

---

## 10. 附錄

### 10.1 Quadrant

```
       高 AI 整合
         │
  Imgflip│  ★ 本產品
         │   (繁中 + AI 文案 + Threads 尺寸)
         │
低月費 ───┼── 高月費
         │
  Canva  │  Buffer
         │   排程專業
       低 AI 整合
```

### 10.2 術語表

| 術語 | 定義 |
|---|---|
| Threads | Meta 文字社群（前 Twitter）|
| IG Reels | Instagram 短影音 |
| CC0 | Creative Commons Zero，無版權 |
| Fabric.js | HTML5 canvas 編輯函式庫 |
| Buffer | 社群排程工具 |

---

## 11. ⭐ 市場驗證計畫

### 11.1 假設

| 假設 | 驗證 | 成功 |
|---|---|---|
| **H1**: 5/5 Threads 創作者想用（省時） | 訪談 + beta | 5 yes |
| **H2**: AI 文案 80% 可用 | 內部測 | ≥80% |
| **H3**: 1 品牌小編願付 NT$799/月 | 訪談 2 品牌 | 1 yes |

### 11.2 訪談（W1-2）
- 3 Threads 創作者 (>5K followers)
- 2 IG 限動小編
- 2 品牌 / 企業社群小編

---

## 12. ⭐ 失敗模式 SOP

### F1. Pexels / Unsplash API 漲價 / 關閉
- 切 Pixabay 為主 + 提示「圖庫維護中」
- 蒐集自營 CC0 圖庫（成自家資產）

### F2. Threads buffer API 變動
- 切排程到 e2e 測試後 email 通知手動發
- 評估自建 Threads scraper（但禁止）

### F3. AI 文案觸發審查
- 重新生成 + 提示用戶
- 冷卻 30s 後再試

### F4. Canva 上 Threads 1:1 模板
- 持續 AI 文案 + 商用授權 + 速度護城河
- 進軍 Canva 沒做的 AI 個人化訓練

### F5. 商用侵權事件
- 全 CC0 標章 + 來源顯示
- 提供「侵權保險」（企業版 NT$799/月含）

---

## 13. ⭐ MetaGPT / spec-kit 對齊

### 13.1 Pool
- **P0**：F-001~F-009
- **P1**：F-101~F-106
- **P2**：F-201~F-204

### 13.2 MUST / SHOULD / MAY

| 標籤 | 項目 |
|---|---|
| MUST | 3 圖庫聚合、AI 文案、3 尺寸直出、CC0 商用 |
| SHOULD | Threads 排程、企業商用授權書、品牌字型 |
| MAY | 短影音模板、GIF 梗、馬來西亞繁中 |

### 13.3 Quadrant

```
      高 LTV
       │
  Free │  ★ Team / Brand
       │
低可行性─┼─ 高可行性
       │
       │  Personal / Creator
      低 LTV
```

### 13.4 Open Questions

| # | 問題 | 待 |
|---|---|---|
| Q1 | Pexels / Unsplash / Pixabay API 成本比較 | Alan |
| Q2 | Buffer Threads API 限制 | 業務 |
| Q3 | 商用授權書法律細節 | 律師 |
| Q4 | Threads / IG 自動發文風險 | 業務 |

---

## 15. ⭐ 深度市調報告 (Sweet Spot 5 問)

### 15.1 5 問體檢

**最終商業化評分**：**69 / 100**
- 公式：(PRD × 0.3 + sweet × 0.7) × 10
- PRD 規格 = 9 / 10（v2.2.2 14 區塊 + AC + 降級 + 法律 CC0）
- Sweet Spot = 6 / 10（銳化繁中 Threads/IG + AI 文案 + 商用安全，從 5 升 6）
- 計算：(9×0.3 + 6×0.7) × 10 = **69**

#### Q1 市場已有誰？

| 競品 | 用戶 | 月費 | 繁中 Threads |
|---|---|---|---|
| **Imgflip** | 30M+ | Free-$6 | ⚠️ 英文 |
| **Canva** | 200M+ | Free-$13 | ✅ 通用非梗圖 |
| **Figma** | 4M+ | Free-$12 | ✅ |
| **Picsum** | — | Free | ❌ 無語意 |
| **Threads buffer / Later** | 1M+ | $6+ | ⚠️ 排程非作圖 |
| **繁中梗圖 + Threads 1:1 + AI 文案** | — | — | **空白** |

#### Q2 甜蜜點？
**甜蜜點 = 繁中唯一 Threads / IG 梗圖工廠（一條龍）**
- Imgflip：英文紅海
- Canva：通用工具、無 AI 文案
- Figma：設計工具非梗圖

#### Q3 紅海（不做）
- ❌ 英文 / 日文（v1 繁中 niche）
- ❌ AI 圖像生成（Midjourney / DALL-E 紅海）
- ❌ 影音剪輯（CapCut 紅海）
- ❌ 短影音生成（Sora / Veo 紅海）
- ❌ GIF / Giphy 紅海
- ❌ 進階排程（Buffer / Later 紅海）

#### Q4 紅海外差異化？
> **「繁中唯一 Threads/IG 梗圖工廠 — 商用圖 + AI 文案 + 一鍵 9:16 / 1:1 直出」**
1. **3 圖庫 CC0 聚合**（Pexels + Unsplash + Pixabay）
2. **GPT-4o-mini 繁中 3 種梗文案**
3. **一鍵 3 尺寸直出**（Threads 1:1 + IG Reels 9:16 + IG 限動 9:16）
4. **強制 CC0 + 來源標示**（無侵權）
5. **Threads buffer API 排程**

#### Q5 一人公司能否負擔？
- 開發：MVP ~25 人天 → Sean 5 週可完成
- 營運：M12 預估 NT$12K/月（GPT-4o-mini + Vercel + Postgres + 3 圖庫 API）
- GPT 成本佔比 30%，毛利 65%
- CAC：Threads KOL + SEO 自然流量，趨近零

**結論**：可負擔，毛利 65%，甜蜜點清晰。**M1 招募 5 Threads 創作者 + M3 1 品牌小編付費**才進入規模。

### 15.2 重寫決策

| 改變 | v2.2.1 | v2.2.2 |
|---|---|---|
| 圖源 | Picsum / Unsplash | **3 圖庫聚合 + 強制 CC0** |
| AI | 無 | **GPT-4o-mini 繁中梗文案** |
| 變現 | 4 方案 | **+ 團隊 NT$799 企業版** |
| TA | Threads / IG / 行銷 | **鎖定小琪 + 阿德 + Lisa** |

### 15.3 與 v1 差異

| 面向 | v1 | v2.2.1 | v2.2.2 |
|---|---|---|---|
| 圖源 | Picsum 隨機 | Pexels+Unsplash | **3 圖庫 + CC0** |
| AI | ❌ | ❌ | **GPT 文案** |
| 變現 | 4 | 4 | **+ 團隊 NT$799** |
| 商用 | 不明 | 標示 | **強制 CC0 + 擋下載** |

### 15.4 後續驗證
- [ ] W1-2 訪談 7 人
- [ ] W3-8 MVP + 50 付費 beta
- [ ] W9-12 GA + Threads KOL 行銷
- [ ] W13-24 PMF：800 付費 + 10 企業 = NT$500K MRR → 規模化

---

> 對接 Repo：https://github.com/openclawsean024-create/tw-meme-generator
