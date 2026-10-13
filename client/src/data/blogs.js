import blog1Thumbnail from '../assets/images/blog/blog1/blog1-thumbnail.png'  
export const blogs = [
  {
    slug: 'eyewear-in-2026-trends-brands-new-india',
    category: 'Trends',
    title: 'Eyewear in 2026: the trends, brands & new India shaping what we wear',
    excerpt:
      "Statement frames, retro shapes built with modern engineering, and a new generation of Indian brands. Here's what we're wearing this year, and how to choose a frame that's unmistakably yours.",
    author: 'Arora Opticals',
    date: 'September 2026',
    readTime: '9 min read',
    image: blog1Thumbnail,
    sections: [
      { id: 'statement-frame', label: 'The year of the statement frame' },
      { id: 'luxury', label: 'Luxury is giving way to confidence' },
      { id: 'retro', label: 'Retro, with better engineering' },
      { id: 'big-players', label: 'Big players build trends' },
      { id: 'indian-eyewear', label: 'The rise of Indian eyewear' },
      { id: 'what-to-buy', label: 'What to buy in 2026' },
      { id: 'closing', label: 'The real trend of 2026' },
    ],
  },
]

export const getBlogBySlug = (slug) => blogs.find((b) => b.slug === slug)
