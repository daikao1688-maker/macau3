import { defineConfig } from 'tinacms';

declare const process: {
  env: Record<string, string | undefined>;
};

const env = process.env;
const branch = env.TINA_BRANCH || env.CF_PAGES_BRANCH || env.GITHUB_REF_NAME || env.HEAD || 'main';

const textField = (name: string, label: string, component: 'text' | 'textarea' = 'text') => ({
  type: 'string',
  name,
  label,
  ui: { component }
});

const imageField = (name: string, label: string) => ({
  type: 'image',
  name,
  label
});

const gameFields = [
  textField('id', '唯一 ID'),
  textField('title', '遊戲名稱'),
  textField('slug', '網址 Slug'),
  {
    type: 'string',
    name: 'category',
    label: '分類',
    options: [
      { label: 'Slots', value: 'slots' },
      { label: 'Table Games', value: 'table-games' },
      { label: 'Live Casino', value: 'live-casino' },
      { label: 'Jackpots', value: 'jackpots' },
      { label: 'Poker', value: 'poker' },
      { label: 'Game Shows', value: 'game-shows' }
    ]
  },
  textField('subcategory', '子分類'),
  textField('provider', '供應商 ID'),
  imageField('image', '主圖片'),
  imageField('thumbnail', '縮圖'),
  { type: 'number', name: 'jackpot', label: 'Jackpot 金額' },
  { type: 'number', name: 'rating', label: '評分' },
  { type: 'number', name: 'players', label: '玩家數' },
  { type: 'boolean', name: 'hot', label: '熱門' },
  { type: 'boolean', name: 'new', label: '新遊戲' },
  { type: 'boolean', name: 'featured', label: '首頁推薦' },
  { type: 'number', name: 'rtp', label: 'RTP' },
  {
    type: 'string',
    name: 'volatility',
    label: '波動性',
    options: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' }
    ]
  },
  { type: 'number', name: 'minBet', label: '最低投注' },
  { type: 'number', name: 'maxBet', label: '最高投注' },
  { type: 'number', name: 'paylines', label: '賠付線' },
  { type: 'number', name: 'reels', label: 'Reels' },
  { type: 'string', name: 'features', label: '特色', list: true },
  textField('description', '描述', 'textarea'),
  textField('releaseDate', '發布日期'),
  { type: 'string', name: 'tags', label: '標籤', list: true },
  { type: 'number', name: 'popularity', label: '人氣分數' },
  textField('lastPlayed', '最後遊玩時間')
];

export default defineConfig({
  branch,
  clientId: env.TINA_PUBLIC_CLIENT_ID,
  token: env.TINA_TOKEN,
  build: {
    outputFolder: 'admin',
    publicFolder: 'public'
  },
  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public'
    }
  },
  schema: {
    collections: [
      {
        name: 'home',
        label: '首頁內容',
        path: 'content/casino',
        format: 'json',
        match: {
          include: 'home'
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        },
        fields: [
          {
            type: 'object',
            name: 'seo',
            label: 'SEO',
            fields: [
              textField('title', '網頁標題'),
              textField('description', '網頁描述', 'textarea')
            ]
          },
          {
            type: 'object',
            name: 'hero',
            label: '首頁主視覺',
            fields: [
              imageField('backgroundImage', '背景圖片'),
              textField('backgroundAlt', '背景圖片 Alt'),
              textField('badge', '頂部徽章'),
              textField('headlineTop', '主標題第一行'),
              textField('headlineMain', '主標題第二行'),
              textField('headlineKicker', '主標題小字'),
              textField('subheading', '副標題', 'textarea'),
              textField('primaryCta', '主要按鈕'),
              textField('secondaryCta', '次要按鈕'),
              textField('searchTitle', '搜尋區標題'),
              textField('searchSubtitle', '搜尋區副標題'),
              textField('liveActivityTitle', '動態區標題'),
              textField('liveActivitySubtitle', '動態區副標題')
            ]
          },
          {
            type: 'object',
            name: 'trustBadges',
            label: '信任標籤',
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.label })
            },
            fields: [
              textField('label', '文字'),
              {
                type: 'string',
                name: 'icon',
                label: '圖標',
                options: [
                  { label: 'Shield', value: 'shield' },
                  { label: 'Lock', value: 'lock' },
                  { label: 'Cash', value: 'cash' },
                  { label: 'Check', value: 'check' }
                ]
              }
            ]
          },
          {
            type: 'object',
            name: 'stats',
            label: '統計數字',
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.label })
            },
            fields: [
              textField('value', '數字'),
              textField('label', '文字')
            ]
          },
          {
            type: 'object',
            name: 'featuredGames',
            label: '推薦遊戲區塊',
            fields: [
              textField('eyebrow', '小標籤'),
              textField('titleAccent', '彩色標題'),
              textField('title', '標題'),
              textField('description', '描述', 'textarea'),
              textField('buttonLabel', '按鈕文字')
            ]
          }
        ]
      },
      {
        name: 'promotions',
        label: '優惠活動',
        path: 'content/casino',
        format: 'json',
        match: {
          include: 'promotions'
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        },
        fields: [
          {
            type: 'object',
            name: 'section',
            label: '區塊設定',
            fields: [
              textField('eyebrow', '小標籤'),
              textField('titleAccent', '彩色標題'),
              textField('title', '標題'),
              textField('description', '描述', 'textarea'),
              textField('terms', '條款提示', 'textarea'),
              textField('disclaimer', '免責聲明', 'textarea'),
              textField('buttonLabel', '按鈕文字')
            ]
          },
          {
            type: 'object',
            name: 'promotions',
            label: '優惠列表',
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.title })
            },
            fields: [
              textField('id', '唯一 ID'),
              textField('title', '標題'),
              textField('description', '描述', 'textarea'),
              textField('badge', '標籤'),
              textField('color', '背景色 class'),
              textField('icon', 'Emoji 圖標'),
              textField('code', '優惠碼'),
              imageField('image', '圖片')
            ]
          }
        ]
      },
      {
        name: 'games',
        label: '遊戲資料',
        path: 'content/casino',
        format: 'json',
        match: {
          include: 'games'
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        },
        fields: [
          {
            type: 'object',
            name: 'games',
            label: '遊戲列表',
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.title })
            },
            fields: gameFields
          }
        ]
      },
      {
        name: 'providers',
        label: '遊戲供應商',
        path: 'content/casino',
        format: 'json',
        match: {
          include: 'providers'
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        },
        fields: [
          {
            type: 'object',
            name: 'providers',
            label: '供應商列表',
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.name })
            },
            fields: [
              textField('id', '唯一 ID'),
              textField('name', '名稱'),
              imageField('logo', 'Logo'),
              { type: 'number', name: 'established', label: '成立年份' },
              textField('description', '描述', 'textarea')
            ]
          }
        ]
      }
    ]
  }
});
