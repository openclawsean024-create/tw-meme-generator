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
| 3 個月 | 200 付費 + 10K 月訪 + 1K 免費用戶 | 100K MRR |
| 6 個月 | 800 付費 + **10 企業** | 500K MRR |
| 12 個月 | 3000 付費 + **40 企業** | **2M MRR** |

**Unit Economics**：
- 個人 NT$99/mo × 3,000 = NT$297K MRR
- 團隊 NT$299/mo × 40 = NT$12K MRR
- 企業 NT$799/mo × 40 = NT$32K MRR
- 商用授權費 NT$999/次 × 60 = NT$60K MRR
- 合計 NT$400K MRR（12 個月 保守）

## 1.5 Non-Goals

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

## 3.1 MVP（P0）

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

## 3.2 v2（P1）

| ID | 功能 | 商業理由 |
|---|---|---|
| F-101 | **Threads 排程（buffer API）** | 創作者出口 |
| F-102 | **品牌字型 + Logo 上傳** | 企業 |
| F-103 | **多帳號管理（團隊）** | NT$299 升級 |
| F-104 | 商用授權書 PDF | 企業採購 |
| F-105 | **GIF 梗製作（Giphy 整合）** | 紅海 but v2 仍做（一鍵輸出） |
| F-106 | IG 排程（IG Graph API） | 企業 |

## 3.3 v3（P2 探索）

| ID | 功能 | 假設 |
|---|---|---|
| F-201 | Threads / IG 自動發文 | 流量出口 |
| F-202 | 短影片模板 | 紅海慎入 |
| F-203 | 馬來西亞 / 新加坡繁中 | 國際化 |
| F-204 | 梗文 AI 學習個人生成 | 個人化 |

## 3.4 ⭐ Acceptance Criteria

```
AC-0001 圖庫搜尋
  Given 用戶搜「閃電」
  When 點搜尋
  Then 5 秒內顯示 20 張結果（Pexels + Unsplash + Pixabay）
  And 每張標「商用 CC0 + 來源」
  And 點大圖預覽

AC-0002 AI 文案生成
  Given 用戶選圖 + 梗主題「確診」
  When 點「AI 生文案」
  Then 10 秒內出 3 種（中/短/長）
  And 每句含關鍵字主題詞
  And 不含辱罵 / 歧義（moderation 過）

AC-0003 一鍵多尺寸
  Given 用戶編輯完成原圖
  When 點「下載 3 尺寸」
  Then < 5 秒出 3 張 PNG（1:1 + 9:16 + 4:5）
  And 字型位置自動調整
  And ≤ 2MB / 張

AC-0004 商用授權
  Given 圖庫標 non-CC0
  When 嘗試下載
  Then 強制顯示「不可商用」警告
  And 鎖下載按鈕
  And 推薦 CC0 替代

AC-0005 **Threads 排程（v2.2.2 新）**
  Given Pro 用戶已授權 Threads
  When 選排程時間 + 內容
  Then 自動排入 buffer queue
  And 5 分鐘前 e2e 測試成功發文
```

---

## 4. 系統設計

## 4.1 技術棧

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

## 4.2 架構

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

## 4.3 資料模型

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

## 4.4 API

| Method | Path | 用途 |
|---|---|---|
| GET | /api/image/search | 用途說明 |
| POST | /api/ai/caption | 用途說明 |
| POST | /api/meme | 用途說明 |
| GET | /api/meme/me | 用途說明 |
| POST | /api/export | 用途說明 |
| POST | /api/schedule/threads | 用途說明 |
| GET | /api/templates/hot | 用途說明 |

---

## 5. 非功能性需求

## 5.1 性能指標
- 圖庫搜 5 秒內出結果（cache）
- AI 文案 < 10 秒
- Canvas 編輯 60fps
- 3 尺寸 zip < 5 秒

## 5.2 安全與隱私
- **強制 CC0**：所有商用圖庫標 CC0，明示來源
- 圖庫非商用擋下載（避免侵權）
- AI 文案 OpenAI moderation 過濾辱罵 / 歧視 / 色情
- 用戶作品加密儲存（Cloudflare signed URL）

## 5.3 ⭐ 降級機制

| Whisper worker 掛掉 | 自動排隊 + email 通知 + 切 Groq API 備援 |
| Modal GPU 漲價或滿載 | 切換 Replicate / Groq CPU 慢 2× 模式 |
| Vercel Postgres 故障 | 自動降級為本地 SQLite + 顯示「維護中」banner |
| GPT-4o-mini API 故障 | 切換 Qwen2.5-7B（繁中開源 LLM）備援 |
| Resend email 服務掛 | 切換 Discord webhook 通知替代 |
| NewebPay 金流掛掉 | 改為銀行轉帳 fallback + 手動審單 |

**降級設計原則**：所有第三方服務必須有 ≥ 1 個備援；不可降級的（如 Stripe/Legal）則改為「接受 downtime + 公告」。

| 故障 | 降級 |
|---|---|
| Pexels 掛 | 切 Unsplash + Pixabay |
| GPT-4o-mini 掛 | 切 Qwen2.5（繁中開源）|
| Cloudflare Images 掛 | 改 Vercel Image |
| Buffer API 掛 | 改 email 通知 + 手動 |
| NewebPay 掛 | 銀行轉帳 |

## 5.4 擴展性
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

## 7.2 ADR

### ADR-001 為何砍 Picsum？
- 決策：v2.2.2 100% 用 Pexels + Unsplash + Pixabay
- 理由：Picsum 雖 CC0 但無語意、版權聲明模糊，商用風險高
- 取捨：成本上升（3 API key），但商用安全

### ADR-002 為何不做英文？
- 決策：v1 繁中 only
- 理由：Threads / IG 繁中 niche 真實存在、英文搶不過 Imgflip / Canva
- 取捨：放棄 100M 英文市場、拿 100% 繁中獲利

### ADR-003 為何 Threads buffer API 不做 IG 自動發文？
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

## 8.2 Sprint 拆解

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

## 9.2 定價心理學
- **NT$99 vs NT$100**：心理門檻、學生付費線
- **NT$299 對標 Canva Pro NT$130/月 + Threads 排程**：仍比一位小編 NT$30K/月 便宜
- **NT$799 團隊**：1 帳號 NT$799、5 帳號 = NT$160/人
- 年繳 8 折提升 LTV

---

## 10. 附錄

### 10.1 競品分析 (Competitive Quadrant)

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


```mermaid
quadrantChart
    title 競爭象限：v2.2.2 / v3.0 甜蜜點定位
    x-axis 低月費 --> 高月費
    y-axis 高 LTV (B2B) --> 低 LTV (B2C)
    quadrant-1 紅海：通用整合
    quadrant-2 甜蜜點
    quadrant-3 紅海：廣告
    quadrant-4 高 LTV 但低月費（Startup 起步）
```

## 11. 市場驗證計畫

## 11.1 假設

| 假設 | 驗證 | 成功 |
|---|---|---|
| **H1**: 5/5 Threads 創作者想用（省時） | 訪談 + beta | 5 yes |
| **H2**: AI 文案 80% 可用 | 內部測 | ≥80% |
| **H3**: 1 品牌小編願付 NT$799/月 | 訪談 2 品牌 | 1 yes |

## 11.2 訪談（W1-2）
- 3 Threads 創作者 (>5K followers)
- 2 IG 限動小編
- 2 品牌 / 企業社群小編

---

## 12. 失敗模式 SOP

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

## 13. MetaGPT / spec-kit 對齊

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

## 16. 量化 KPI（時程 + 數字）

| 時間 | KPI 目標 | 量化指標 | 驗證方式 |
|---|---|---|---|
| M0 (W1-2) | 完成 7 個目標用戶訪談 + 本 PRD v2.2.2 上版 | 5 CIO/CTO + 2 顧問/內訓窗口 | 訪談記錄 + Notion 狀態推到「POC」 |
| M1 (W3-8) | MVP 上線（8 個 P0 features）+ 100 付費 beta | 50% WER 達標 + 5 券商 CSV 解析 100% | Plausible funnel + Stripe webhook |
| M2 (W9-12) | GA 公開上線 + KOL 行銷 | 1K 註冊 + 200 付費 + 1 企業客戶 | Notion 「已結案 / 進入 GA」 |
| M3 (W13-24) | PMF 驗證：NT$300K MRR | 500 付費 + 10 企業 + 50 導流 | Stripe MRR 報表 |
| M4 (W25-36) | 規模化：NT$2M MRR | 3000 付費 + 30 稅務顧問 + 500 導流 | Stripe ARR + CPA 報表 |

**DoD 量化門檻**：
- ✅ Lighthouse Performance ≥ 90 / SEO ≥ 95
- ✅ WER < 10%（Whisper 繁中微調）
- ✅ IRR/MWR 與 Excel ±0.5% 內
- ✅ CSV 解析 100% 成功率（8 券商）
- ✅ 5 個訪談 100% 同意試用 → 才進 GA

---

## 17. Competitive Quadrant Chart (Mermaid)

```mermaid
quadrantChart
    title 競爭象限：高 LTV 變現 vs 低月費甜頭
    x-axis 低月費 --> 高月費
    y-axis 高 LTV (B2B) --> 低 LTV (B2C)
    quadrant-1 紅海：通用整合
    quadrant-2 甜蜜點：本專案 ★
    quadrant-3 紅海：廣告收入
    quadrant-4 甜蜜點：高 LTV 但低月費 ★
    集保 e 手掌握: [0.85, 0.3]
    麻布 iMoney: [0.6, 0.4]
    CWMoney: [0.2, 0.15]
    Excel 自製: [0.1, 0.5]
    Empower: [0.85, 0.15]
    本專案 v3.0: [0.65, 0.85]
    本專案 v2.2.2: [0.4, 0.7]
```

**象限讀法**：
- 右上（高月費 + 高 LTV）= 企業客戶 + 收費服務 = ★ 本專案甜蜜點
- 左下（低月費 + 低 LTV）= 廣告 / 通用整合 = 紅海
- 縱軸觀察：麻布/集保在右上偏左、月費低 LTV 弱 → 無法打企業級

---

## 18. Requirement Pool（P0/P1/P2）

**P0（MVP 必做，W3-8 完成）**：
1. F-001 多券商 CSV 解析（8 家：富邦/元大/永豐/國泰/台新 + IBKR/嘉信/Firstrade）
2. F-002 多幣別成本基礎試算
3. F-003 30% 美股預扣稅自動計算
4. F-004 配息再投入（除息日收盤價）
5. F-005 含管理費 / 手續費的 IRR/MWR
6. F-006 Dashboard 總資產 + 趨勢圖
7. F-007 稅務 PDF 報告
8. F-008 券商導流（CPA NT$500）
9. F-009 用戶帳號 + 多券商管理

**P1（v2 加值，W9-24 完成）**：
- F-101 自動匯率（exchangerate.host）
- F-102 月配 / 季配 / 年配再投入
- F-103 FIFO / LIFO / 加權平均成本基礎
- F-104 多帳號管理（稅務顧問 view）
- F-105 OCR 券商月報 PDF
- F-106 稅務報表（個人 / 美國 1040-S / 台灣 800K 申報）

**P2（v3 探索）**：
- F-201 OAuth 自動匯入
- F-202 加密貨幣稅務
- F-203 馬來西亞 / 新加坡券商
- F-204 AI 投資分析（不做建議）

**優先級決策框架**（Sean 2026-07-19）：
- P0：完成不了的話，產品不能 launch
- P1：完成後能讓付費率 >10%
- P2：完成後能開新市場，但紅海風險

---

## 19. Must / Should / May 需求語言

| 標籤 | 需求描述 |
|---|---|
| **MUST** | 8 券商 CSV 多幣別解析、含息含費 IRR/MWR、含 30% 美股預扣稅、配息再投入、稅務 PDF 匯出 |
| **MUST** | 商用 CC0 + 來源顯示（無侵權） |
| **MUST** | GDPR：個資 7 年保存、刪除帳號清資料 |
| **MUST** | API rate limit 1 req/sec + 月 200hr 額度 |
| **MUST** | Slack / Email 通知 webhook |
| **SHOULD** | OCR 券商月報 PDF 自動轉 CSV |
| **SHOULD** | 自動匯率日終排程 |
| **SHOULD** | 稅務顧問多帳號 view |
| **MAY** | OAuth 自動匯入（券商同意後） |
| **MAY** | 馬來西亞 / 新加坡國際化 |
| **MAY** | 加密貨幣稅務（紅海慎入） |
| **MAY** | AI 投資分析（不做建議） |

---

## 20. 邊界場景補充（SOP 詳版）

**SOP-B1**：CSV 解析失敗
- 步驟 1：Logger 收集失敗 sample + 自動寄信 Alan
- 步驟 2：顯示「已知問題，請用手動修正」+ 舊版模板下載
- 步驟 3：48hr 內 patch parser + 自動補算用戶資料

**SOP-B2**：匯率資料延遲
- 步驟 1：Cache 24hr + 顯示「最後匯率更新：YYYY-MM-DD」
- 步驟 2：用戶可手動覆寫某日匯率（罕見外幣）
- 步驟 3：月報 / 稅務報告加註「匯率來源說明」

**SOP-B3**：證券代號衝突
- 步驟 1：強制 exchange prefix（`TW:2330` vs `US:NVDA`）
- 步驟 2：上傳時自動偵測 + 提示用戶選
- 步驟 3：儲存時強制 binding 不變

**SOP-B4**：配息計算錯誤
- 步驟 1：用戶回報 → 自動查除息日 + 收盤價比對
- 步驟 2：邀請會計師 double check（年 1 次）
- 步驟 3：演算法開源在 GitHub gist 增加信任

**SOP-B5**：30% 預扣稅爭議（特殊狀況）
- 步驟 1：聘請稅務顧問年繳 NT$20K 顧問費
- 步驟 2：演算法文檔明示計算邊界（含 / 不含 W-8BEN 已繳稅）
- 步驟 3：用戶申報時附 PDF 註明「此為試算，請諮詢會計師」免責聲明

---


## 14. 深度補充：技術棧 vs 替代方案比較

| Layer | 本專案選擇 | 替代方案 | 為何選本方案 |
|---|---|---|---|
| Frontend Framework | Next.js 16 (App Router) + Tailwind 4 | Remix / SvelteKit / Nuxt 4 | Sean 既有經驗 + Vercel 一鍵部署 + RSC 支援 + React 19 |
| Styling | Tailwind 4 + shadcn/ui | styled-components / Emotion | 樣式原子化、開發快、B 端好用、設計師友善 |
| ORM | Prisma + Vercel Postgres | Drizzle / Kysely / Supabase | 既已採用、type-safe、migrations 好管理 |
| Storage | Vercel Blob / Cloudflare R2 | S3 | 與 Next.js serverless 整合最好 |
| Job Queue | Inngest | Trigger.dev / Temporal | serverless-native、debug UI、retry 機制完善 |
| GPU Worker | Modal | Replicate / RunPod / Lambda | 冷啟動快、cost 低、自定義鏡像 |
| LLM | GPT-4o-mini | Claude Haiku / Qwen2.5-72B | 中文 prompt cost 1/3、推理 2 秒內 |
| Auth | Clerk | Auth.js / Supabase Auth | UI 元件齊全、社交登入一鍵、繁中文件 |
| Payment | NewebPay | Stripe / TapPay / 綠界 | 繁中唯一 full Taiwan support、本地信用卡支援、手續費 2.5% |
| Email | Resend | SendGrid / Postmark | DX 好、React Email 元件 |
| Monitoring | Sentry + Vercel Analytics | DataDog / LogRocket | 成本低、整合好、繁中 error tracking |
| CDN | Vercel Edge + Cloudflare | Netlify / 阿里雲 CDN | 全球 edge + 中華電信 HINET 加速台灣用戶 |

---

## 15.1 深度補充：使用者旅程地圖 (User Journey Map)

```
階段 1: 認知 (Awareness)
  - 觸達管道：Threads KOL (Wisdom 區塊鏈) / Discord (Hahow 學習社群) / Threads / IG 限動分享
  - 用戶動作：看到「10 秒做完一張繁中梗圖」影片
  - 情緒：好奇 (curious)
  - 痛點解決程度：0%

階段 2: 興趣 (Interest)
  - 觸達管道：Threads 推文連結 / IG 限動 swipe up
  - 用戶動作：進入首頁，瀏覽熱門主題
  - 情緒：驚艷 (wow)：哇～這個 GUI 好直覺！
  - 痛點解決程度：30%

階段 3: 試用 (Trial)
  - 觸達管道：點「免費試用」CTA
  - 用戶動作：上傳第一張梗圖 → AI 生成文案 → 1:1 + 9:16 直出
  - 情緒：滿足 (satisfied)
  - 痛點解決程度：90%

階段 4: 付費 (Conversion)
  - 觸達管道：完成 5 張後 CTA「升級個人版」
  - 用戶動作：NT$99/月 訂閱
  - 情緒：放心、安心、有面子
  - 痛點解決程度：100%（個人用戶）

階段 5: 留存 (Retention)
  - 觸達管道：每週電子報精選主題 + Discord 社群
  - 用戶動作：日均 1 張生成、排程發文
  - 情緒：依賴 (dependent on)
  - 痛點解決程度：120%（超過原本痛點）

階段 6: 推薦 (Advocacy)
  - 觸達管道：用戶被 Threads 推爆、其他小編 DM 詢問
  - 用戶動作：分享 Threads 連結、推薦朋友
  - 情緒：驕傲 (proud)：我是早期採用的！
  - 痛點解決程度：150%
```

**關鍵轉捩點**：
- 試用 → 付費：5 張免費不夠，必須把用戶帶到「拍大腿」魔法時刻 → 在做完第 3 張推薦付費
- 付費 → 留存：每週精選 + Discord 社群互動，推升 30 日留存率至 60%
- 留存 → 推薦：NPS ≥ 70 才會自然推薦；問卷 N=50 才能驗證

---

## 15.2 深度補充：商業模式 Unit Economics 詳算

**收入項拆解（M12 預估）**：

| 收入來源 | 單價 | 月數量 | 月總額 | 年總額 |
|---|---|---|---|---|
| 個人版（NT$99/mo）| NT$99 | 3,000 | NT$297,000 | NT$3,564,000 |
| 創作者版（NT$299/mo）| NT$299 | 500 | NT$149,500 | NT$1,794,000 |
| 團隊版（NT$799/mo）| NT$799 | 40 | NT$31,960 | NT$383,520 |
| 企業版（NT$9,999/mo）| NT$9,999 | 5 | NT$49,995 | NT$599,940 |
| **小計**| — | — | **NT$528,455** | **NT$6,341,460** |

**成本項拆解（M12 預估）**：

| 成本類別 | 月金額 | 備註 |
|---|---|---|
| Vercel Pro | NT$1,500 | NT$45,000 / 年 |
| Vercel Postgres | NT$2,000 | 200 GB |
| Cloudflare R2 | NT$500 | 100 GB + egress |
| Inngest | NT$500 | 50K events |
| GPT-4o-mini | NT$3,500 | 30K reqs/day |
| Modal GPU | NT$2,000 | 200 GPU-hr |
| Resend Email | NT$500 | 50K emails |
| NewebPay 手續費 2.5% | NT$13,200 | 2.5% × NT$528K |
| Sentry / Plausible | NT$500 | 既已採用 |
| 客服 / 行銷 / 業務 | NT$20,000 | Sean 50% time |
| **小計**| **NT$44,200** | — |

**毛利計算**：
- 月毛收入 NT$528K
- 月總成本 NT$44K
- 月毛利 NT$484K
- 毛利率 91.6%

**LTV / CAC 計算**：
- 平均 ARPU NT$205/月（C 端）+ NT$1,648/月（B 端，含團隊）+ NT$9,999（企業）
- 平均 churn 5%/月 → 平均壽命 20 月
- LTV = NT$205 × 20 = NT$4,100（保守只算 C 端，B 端 10× 起跳）
- CAC = NT$300-500（KOL + SEO + 口碑）
- LTV/CAC = 8.2×-13.7× 健康

**Payback Period**：
- NT$300 CAC / NT$205 月費 = 1.46 個月 = 健康

---

## 15.3 深度補充：技術債務與擴展性限制

**已知技術債務**：
1. Whisper 繁中 WER 在背景噪音、專業術語、廣東話混雜時下降到 18-25%（目標 8%）
2. GPT 章節命名在訪談類場景（無明確 topic shift）有時不佳，需 RAG 補強
3. Cloudflare Images resize 在高併發下 200ms P99，需切 CF Image Resizing v2

**擴展性天花板**：
1. Modal GPU 8 顆 A10 = 同時 50 jobs，超過需排隊
2. Vercel Postgres 200GB，超過需 sharding（v4 才考慮）
3. Inngest 50K events/month = 1500 jobs/day，超過升 enterprise

**v4 預期硬體升級**：
- GPU 切 Modal H100（成本 +3× 但 WER → 5%）
- DB 切 Supabase（支援 better JSON indexing）

---

## 15.4 深度補充：競品詳細雷達圖

```
                  功能完整度 (1-10)
                       10
                        │
                NotionLM│
                        │
                  Otter  │
                        │
                ElevenLab│
          ★ 本產品 v2.2.2│
          (繁中 + 章節 + API)│
                        │
                  Descript│
                        │
                  Vrew    │
                 1 ──────┼────── 10
                       繁中支援度
```

**雷達評分（5 個維度 1-10）**：

| 維度 | Otter | NotebookLM | ElevenLabs | Descript | Vrew | **本專案** |
|---|---|---|---|---|---|---|
| 繁中支援 | 4 | 5 | 7 | 3 | 8 | **9** |
| 章節切分 | 6 | 4 | 2 | 5 | 3 | **8** |
| 字幕生成 | 9 | 5 | 3 | 7 | 9 | **8** |
| API / Webhook | 7 | 3 | 9 | 6 | 4 | **7** |
| 月費$/NT$ | $20 | Free | $5+ | $24 | Free | **NT$199-499** |

**本專案甜蜜點維度**：
- 繁中 9/10（最高）
- 章節切分 8/10
- 月費區間 NT$199-499（中等）

**護城河**：繁中 niche + 章節 AI + 個人詞彙表，三項同時做的競品 = 0。

---

## 15.5 深度補充：Sean 個人 SOP

**SOP-001 每日時間分配**：
- 09:00-10:00 客服 / Discord 巡邏（30 分鐘）
- 10:00-12:00 開發（Sprint 任務）
- 12:00-13:00 午休
- 13:00-15:00 內容 / 文章撰寫
- 15:00-17:00 客戶開發 / 訪談 / 銷售
- 17:00-18:00 文件 / SpecKit 對齊 / Git

**SOP-002 訪談流程**：
1. 預約 Calendly 30 分鐘
2. 前 24 小時寄出產品簡介（5 個核心功能截圖）
3. 訪談開頭 5 分鐘自我介紹 + 痛點驗證
4. 中間 20 分鐘針對核心功能 demo（用戶導航）
5. 結尾 5 分鐘詢問 NT$199-499 付費意願
6. 24 小時內寄感謝 email + Notion 記錄

**SOP-003 Sprint Planning**：
- 每週一早上 10 點開 Sprint Planning 1 小時
- 從 Product backlog 中選 5-8 個 tasks
- 任務粒度：1 人天以內，過大則拆
- 每天 standup 5 分鐘（昨日 / 今日 / 卡點）

**SOP-004 Incident Response**：
- Sev 1：Service 全掛 + 30 分鐘內回應，公開 status page
- Sev 2：單一功能故障 + 1 小時內修補，內部公告
- Sev 3：UI bug + 24 小時內修補，下個 Sprint 釋出

**SOP-005 Release Train**：
- 每週二、四 14:00 部署（如無 Sev 1 暫停）
- 部署前必跑 6 個 smoke tests
- 部署後 30 分鐘監控錯誤率 < 0.5%
- 失敗 1 分鐘內 rollback

---

## 15.6 深度補充：品牌敘事與定位聲明

**一句話定位**：**「繁中唯一 [功能] 一條龍工廠」**

**品牌人格**：
- 像 Hahow 老師：繁中、教育、empowerment
- 像 Threads 創作者：直白、繁中、speed
- 像 SaaS：B2B、professional、delightful

**Tone of Voice**：
- ✅ 簡潔、繁中優先、繁體中文不用中國用語
- ✅ 主動動詞：做、做完、做出
- ❌ 不寫「您」（過度正式）
- ❌ 不寫 emoji 過多（一段最多 2 個）

**對外文案範本**：
- 首頁 Hero：「繁中唯一 [功能] — [時間] 完成 [目標]，不 [失敗情境]。」
- 定價頁：「NT$199 / 月 — 對標 [真人外包] NT$1,600，省 [百分比]。」
- 行銷 email：「你上週用了 [X] 次，這週再省 [Y] hr。」

**禁用詞**：
- 「永久免費」（誘餌 → 失信用）
- 「完全 AI」（過度承諾 → 法規）
- 「世界最棒」（浮誇）

---

## 15. 深度市調報告

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

## 14. Threads IG 創作情境詳細拆解

### 場景 1：時事梗圖（News Cycle Meme）
觸發在新聞事件發生後 1-2 小時內，用戶是小琪（W1 早起 8:00 看新聞 + 9:00 發）。操作流程是 1. 複製新聞標題到「梗主題」。2. AI 自動建議 5 個梗文案（中英對照）。3. 選最 punch 的 1 個。4. AI 配 Pexels 圖（自動）。5. 一鍵 1:1 輸出。6. Threads 直接 post（buffer API）。目標時間 3 分鐘。

### 場景 2：日常梗圖（Daily Vibes）
觸發在晚上 22:00 睡前刷手機，用戶是阿德（W2/W3 不想動腦想主題）。操作流程是 1. 點「隨機主題」。2. AI 生成 10 個熱門話題候選。3. 選 1 個 + 模板庫挑現成排版。4. 一鍵 9:16 直出（限動）+ 1:1（Threads 主 feed）。目標時間 1 分鐘。

### 場景 3：產品行銷圖（Marketing Visual）
觸發在新品上市、行銷活動，用戶是 Lisa（B2B 品牌社群小編）。操作流程是 1. 上傳自家產品照。2. 套品牌字型 + Logo。3. AI 生 3 種宣傳文案。4. 排程發文（Threads + IG）。5. 自動 IG 限動 + Threads 主 + IG Reels 封面。目標時間 5 分鐘。

每個場景都需要場景特化模板（不等於通用模板）、AI prompt 微調、字型自動對齊。

---

## 15. 商用圖庫 SOP Pexels Unsplash Pixabay 聚合

API 整合：每家提供 200 req/hr 免費層，統一 response schema 含 id、url、author、license、tags、size。搜尋時同時打 3 家，去重，結果依相似度排序，每張圖強制附「來源 + 商用授權」水印（可關閉但需付費版）。商用聲明頁：首頁底部「所有圖片均來自 Pexels Unsplash Pixabay 採 CC0 授權」，點進單圖顯示「來源 Pexels 作者 John Doe 授權 Pexels License」，月報 + 商用授權書 PDF 自動附上每張圖的授權明。API Rate Limit 處理 250 req/hr 超限自動切換（即使一家掛掉），結果 Redis cache 24hr，使用者搜尋結果頁加註「圖庫來源 Pexels 6 + Unsplash 8 + Pixabay 6」。

---

## 16. AI 梗文案 prompt 模板

You are a Traditional Chinese meme copywriter for Threads/IG creators in Taiwan. Topic {topic}, Tone {tone} (options: witty sarcastic wholesome ironic motivational), Audience {audience} (options: young adults professionals students parents). Generate 3 variations: 1. Short version (≤ 15 chars single punchline for 1:1 image). 2. Medium version (≤ 30 chars two sentences for Threads post). 3. Long version (≤ 60 chars three sentences for IG carousel caption). Constraints: Use 繁體中文 (not 簡體), Avoid politics religion discrimination, Include keyword {topic} naturally, Add 1-2 common Taiwanese expressions (e.g. 「真的假的」「很可以」), Make it shareable. Moderation flow：GPT-4o-mini 輸出後過 OpenAI Moderation API，有政治歧視色情重生 1 次（30s cooldown），仍失敗 fallback 通用模板「這梗太刺激了，換個主題試試」，紀錄失敗原因供日後 prompt 優化。

---

## 17. Threads buffer API 整合細節

Buffer 帳號設定個人版免費可連結 3 個社群帳號，Pro 版 NT$600/月可連結 10 個 + 排程時段分析，我們推薦用 Pro。API 流程是用戶在 editor 完成 + 點「排程」後我們呼叫 Buffer API POST updates 帶 text、media link、scheduled_at、profile_ids。Buffer 回傳 update_id 存到我們 DB，Threads 排程時間到 Buffer 自動發文，我們的 cron 每 15 分鐘拉 buffer 回報看哪些 update 已發標記。錯誤處理 Buffer 限流等待 + 重試，Threads API 變動 email 通知 + 緊急 patch，圖片太大（>5MB）自動壓縮。

---

## 18. 行銷 SOP 與 KOL 合作模板

KOL 合作每月找 3-5 位台灣 Threads/IG 創作者（5K-100K followers）做 1 對 1 訪談 30 分鐘，提供 3 個月免費 Pro 帳號，要求每週發 1 篇關於我們的限動 + 1 篇 Threads 主文，追蹤 UTM + Plausible + 邀請碼。Discord 社群經營 SOP 是每天 9:00 推當日熱門主題（AI 自動從 Ptt/Dcard 抓），每週 1 場 30 分鐘「創作小教室」直播，每月 1 場 KOL 來賓 AMA。SEO 內容策略是部落格每月 4 篇「如何做梗圖」教學文，鎖定關鍵字「梗圖製作 Threads 排程 IG 限動設計」預估每月自然流量 +2K visits。
