export const site = {
  name: '温水の收藏站',
  englishName: 'QwQwind Archive',
  description: '温水の个人收藏站：NovelAI 作品、画师词条、网页书签、笔记与文件。',
  bio: '记录喜欢的东西：NovelAI 作品、画师词条、网页收藏和零散笔记。慢慢收，慢慢看。',
  avatar: '/images/avatar.svg',
  banner: '/images/banner.svg',
  announcement: '图鉴施工中，画廊和画师页先上线，书签与笔记陆续补。',
  links: [
    { label: 'GitHub', href: 'https://github.com/Q-wind520' },
    { label: '博客', href: 'https://blog.qwind.top/' },
    { label: 'RSS', href: '/rss.xml' },
  ],
  // 示例密码是 qwind；正式使用前替换哈希。
  protectedPasswordHash: '6fc0fccf335a068190743e17ece458a983aac2edff6d26fd607801fbaf9ec075',
} as const;
