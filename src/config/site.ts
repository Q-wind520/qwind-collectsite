export const site = {
  name: '温水の收藏站',
  englishName: 'QwQwind Archive',
  description: '温水の个人收藏站：NovelAI 作品与生图实验记录、画师、网页书签、笔记与文件。',
  bio: '收集喜欢·AIGC·网页收藏·零散笔记',
  avatar: '/images/avatar.jpg',
  banner: '/images/banner.svg',
  announcement: '作品与生图笔记先去逛，书签和文件还在陆续补。',
  links: [
    { label: 'GitHub', href: 'https://github.com/Q-wind520', icon: 'github' },
    { label: '博客', href: 'https://blog.qwind.top/', icon: 'pen-line' },
    { label: 'RSS', href: '/rss.xml', icon: 'rss' },
  ],
  support: [
    {
      label: 'GitHub Sponsors',
      href: 'https://github.com/sponsors/Q-wind520',
      icon: 'heart',
      hint: '海外朋友可用 · 个人赞助 GitHub 不抽成',
    },
    {
      label: '爱发电',
      href: 'https://afdian.com/a/qwind520',
      icon: 'coffee',
      hint: '微信 / 支付宝 · 选 1 个月即一次性投喂',
    },
  ],
  license: {
    name: 'CC BY-NC 4.0',
    href: 'https://creativecommons.org/licenses/by-nc/4.0/deed.zh-hans',
  },
} as const;
