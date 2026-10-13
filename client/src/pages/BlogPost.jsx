import { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { TransitionLink } from '@/Routes/TransitionLink'
import { getBlogBySlug } from '../data/blogs'
import Eyewear2026 from './blogs/Eyewear2026'

// Maps a blog slug to its article body.
const articles = {
  'eyewear-in-2026-trends-brands-new-india': Eyewear2026,
}

  
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!els.length) return
    const onScroll = () => {
      let current = els[0].id
      for (const el of els) if (el.getBoundingClientRect().top <= window.innerHeight * 0.3) current = el.id
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [ids])
  return active
}

export default function BlogPost() {
  const { slug } = useParams()
  const post = getBlogBySlug(slug)
  const Article = post && articles[slug]
  const active = useActiveSection(post ? post.sections.map((s) => s.id) : [])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!post || !Article) return <Navigate to="/blog" replace />

  const url = window.location.href
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }
  const pill = 'font-roboto rounded-full border border-[#d9d9d9] px-[4vw] md:px-[.9vw] py-[2vw] md:py-[.45vw] text-smallTextPhone md:text-regularText hover:bg-[#f2f2f0] transition-colors'
  const [lead, ...rest] = post.title.split(': ')

  return (
    <article className="px-[5vw] md:px-[10vw] pt-[6vw] md:pt-[3vw] pb-[14vw] md:pb-[6vw] mx-auto">
      <nav className="font-roboto text-smallTextPhone md:text-smallText text-[#5d6470]" aria-label="Breadcrumb">
        <TransitionLink to="/">Home</TransitionLink> / <TransitionLink to="/blog">Blogs</TransitionLink> / {post.category}
      </nav>

      <header className="relative mt-[6vw] md:mt-[2.5vw]">
        <h1 className="relative font-dyeLine text-[#1b2433] text-[11vw] font-bold font-instrumentSans md:text-[5.5vw] leading-[105%] font-light max-w-[90%] md:max-w-[75%]">
          {lead.replace(/ 2026$/, '')} <span className="text-[#7a4a28]">2026:</span> {rest.join(': ')}
        </h1>
        <p className="font-roboto text-regularTextPhone md:text-h6Text leading-[160%] text-[#5d6470] max-w-[100%] md:max-w-[50%] mt-[6vw] md:mt-[2.5vw]">{post.excerpt}</p>
        <p className="font-roboto text-smallTextPhone md:text-smallText text-[#5d6470] flex flex-wrap gap-x-[4vw] md:gap-x-[1.25vw] mt-[5vw] md:mt-[1.75vw]">
          <span>By <b className="text-[#1b2433] font-medium">{post.author}</b></span>
          <span>{post.date}</span>
          <span>{post.readTime}</span>
        </p>
      </header>

      <hr className="border-0 border-t border-[#e3e3e3] my-[8vw] md:my-[2.5vw]" />

      <div className="flex flex-row gap-[3vw] md:gap-[3vw] md:pl-[1vw]">
        <aside className="hidden md:block w-[14vw] shrink-0">
          <ul className="sticky top-[8vw] border-l border-[#e3e3e3]">
            {post.sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`block font-roboto text-smallText leading-[140%] py-[.45vw] pl-[1.1vw] -ml-px border-l ${active === s.id ? 'border-[#7a4a28] text-[#1b2433]' : 'border-transparent text-[#5d6470]'}`}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="w-full md:w-[45vw]">
          <Article />
          <div className="border-t border-[#e3e3e3] mt-[8vw] md:mt-[2.5vw] pt-[5vw] md:pt-[1.25vw] flex flex-wrap items-center gap-[3vw] md:gap-[.8vw]">
            <span className="font-roboto text-smallTextPhone md:text-regularText text-[#5d6470]">Share this article</span>
            <button type="button" onClick={copyLink} className={pill}>{copied ? 'Copied!' : 'Copy link'}</button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${post.title} ${url}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={pill}
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
