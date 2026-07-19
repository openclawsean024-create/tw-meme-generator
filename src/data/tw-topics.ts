/**
 * Taiwan culture meme database (F-002 of SPEC §3.1).
 *
 * Each entry represents a canonical Taiwanese internet meme concept with:
 * - id: stable slug
 * - topic: 中文 keyword
 * - captionHint: AI prompt hint
 * - tags: discovery tags
 * - hotScore: popularity (0-100)
 *
 * Hot topics are surfaced via the trending radar (see trending.ts).
 */

export interface TwTopic {
  id: string;
  topic: string;
  captionHint: string;
  tags: string[];
  hotScore: number;
}

export const TW_TOPICS: ReadonlyArray<TwTopic> = [
  {
    id: "que-ren",
    topic: "確診",
    captionHint: "中標相關的身體狀況或工作請假",
    tags: ["疫情", "工作", "心情"],
    hotScore: 88,
  },
  {
    id: "tang-ping",
    topic: "躺平",
    captionHint: "對努力的疲憊與放棄掙扎",
    tags: ["心情", "Z世代", "社會"],
    hotScore: 92,
  },
  {
    id: "shan-dian",
    topic: "閃電",
    captionHint: "光速打臉或神預測",
    tags: ["經典", "表情誇張", "預言"],
    hotScore: 76,
  },
  {
    id: "niu-nai",
    topic: "我阿嬤都比這強",
    captionHint: "嘲諷業餘水準",
    tags: ["經典", "嘲諷", "鄉土"],
    hotScore: 81,
  },
  {
    id: "wo-jiu-lan",
    topic: "我就爛",
    captionHint: "自嘲廢物風",
    tags: ["自嘲", "心情", "Z世代"],
    hotScore: 95,
  },
  {
    id: "wo-jiu-lan-2",
    topic: "我就懶",
    captionHint: "耍廢哲學",
    tags: ["自嘲", "心情", "耍廢"],
    hotScore: 87,
  },
  {
    id: "ou-yang-na-na",
    topic: "歐陽娜娜",
    captionHint: "名人也想躺平",
    tags: ["名人", "娛樂"],
    hotScore: 72,
  },
  {
    id: "chun-yu",
    topic: "純欲戰士",
    captionHint: "打扮的極致矛盾",
    tags: ["流行", "時尚"],
    hotScore: 70,
  },
  {
    id: "jo-jo",
    topic: "JoJo 立",
    captionHint: "姿勢奇特不放棄",
    tags: ["動漫", "姿勢"],
    hotScore: 68,
  },
  {
    id: "ji-ji-jiao",
    topic: "雞雞叫",
    captionHint: "激動叫囂",
    tags: ["情緒", "搞笑"],
    hotScore: 64,
  },
  {
    id: "la-ge-nan-ren",
    topic: "辣個男人",
    captionHint: "鄉土劇式英雄登場",
    tags: ["鄉土劇", "經典"],
    hotScore: 79,
  },
  {
    id: "nv-ren-men",
    topic: "女人們",
    captionHint: "鄉土劇式呼喊",
    tags: ["鄉土劇", "經典"],
    hotScore: 73,
  },
  {
    id: "xiao-zi-cai-xuan-ze",
    topic: "小孩子才選擇",
    captionHint: "我全都要的貪心宣言",
    tags: ["經典", "貪心"],
    hotScore: 90,
  },
  {
    id: "ting-zheng",
    topic: "聽證會",
    captionHint: "政治梗：認真回應無釐頭提問",
    tags: ["政治", "時事"],
    hotScore: 83,
  },
  {
    id: "tian-qi-bu-hui",
    topic: "天氣不會好",
    captionHint: "對週末的失望",
    tags: ["心情", "天氣", "日常"],
    hotScore: 71,
  },
  {
    id: "jia-ban",
    topic: "加班",
    captionHint: "社畜心聲",
    tags: ["工作", "心情", "社畜"],
    hotScore: 89,
  },
  {
    id: "shui-bu-hao",
    topic: "睡不好",
    captionHint: "凌晨的長文",
    tags: ["心情", "健康", "Z世代"],
    hotScore: 78,
  },
  {
    id: "pang-zi",
    topic: "胖了",
    captionHint: "對體重的掙扎",
    tags: ["日常", "身材"],
    hotScore: 66,
  },
  {
    id: "ke-tang",
    topic: "課堂",
    captionHint: "學生時代的厭世",
    tags: ["學生", "學校"],
    hotScore: 62,
  },
  {
    id: "jiehun",
    topic: "結婚",
    captionHint: "親友催婚的壓力",
    tags: ["親情", "社會", "Z世代"],
    hotScore: 74,
  },
  {
    id: "fang-jia",
    topic: "放假",
    captionHint: "期待連假",
    tags: ["日常", "心情"],
    hotScore: 67,
  },
  {
    id: "zhuan-qian",
    topic: "賺錢",
    captionHint: "對財務自由的渴望",
    tags: ["工作", "金錢"],
    hotScore: 86,
  },
  {
    id: "che-hui",
    topic: "撤回",
    captionHint: "LINE 群組的尷尬",
    tags: ["LINE", "日常", "搞笑"],
    hotScore: 91,
  },
  {
    id: "kuan-yi",
    topic: "寬衣",
    captionHint: "鄉土劇老梗",
    tags: ["鄉土劇", "經典"],
    hotScore: 60,
  },
  {
    id: "bu-dong",
    topic: "聽不懂",
    captionHint: "會議室日常",
    tags: ["工作", "會議"],
    hotScore: 69,
  },
  {
    id: "gan-xie",
    topic: "感恩",
    captionHint: "正能量的反諷用法",
    tags: ["心情", "反諷"],
    hotScore: 75,
  },
  {
    id: "mei-qian",
    topic: "沒錢",
    captionHint: "月底的哀號",
    tags: ["金錢", "心情"],
    hotScore: 82,
  },
  {
    id: "shou-yin-ji",
    topic: "收銀機",
    captionHint: "聽到價錢的聲音",
    tags: ["購物", "日常"],
    hotScore: 58,
  },
  {
    id: "wang-ji",
    topic: "忘記",
    captionHint: "說好的事情又沒做",
    tags: ["日常", "健忘"],
    hotScore: 65,
  },
  {
    id: "yong-geng",
    topic: "永耕",
    captionHint: "政治諧音哏",
    tags: ["政治", "時事"],
    hotScore: 77,
  },
  {
    id: "jie-ke",
    topic: "捷克",
    captionHint: "新聞國際事件梗",
    tags: ["新聞", "國際"],
    hotScore: 63,
  },
  {
    id: "cheng-de",
    topic: "承德",
    captionHint: "鄉土地名諧音",
    tags: ["鄉土", "地名"],
    hotScore: 61,
  },
];

export function findTopicById(id: string): TwTopic | null {
  return TW_TOPICS.find((t) => t.id === id) ?? null;
}

export function searchTopics(query: string, limit = 10): TwTopic[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return TW_TOPICS.filter(
    (t) =>
      t.topic.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q)),
  ).slice(0, limit);
}

export function getTopicsByTag(tag: string): TwTopic[] {
  return TW_TOPICS.filter((t) => t.tags.includes(tag));
}
