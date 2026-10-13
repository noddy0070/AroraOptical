import shopBanner1 from '../assets/images/shopBanner1.png'
import { IconButton, TitleButton } from '../components/button'
import { TransitionLink } from '@/Routes/TransitionLink'
import { blogs } from '../data/blogs'

const ImagePlaceholder = ({ image, alt }) =>
  image ? (
    <img src={image} alt={alt} loading="lazy" className="w-full h-full object-cover rounded-2xl" />
  ) : (
    <div className="w-full h-full bg-[#D9D9D9] rounded-lg" role="img" aria-label={alt} />
  )

const ReadMore = ({ slug }) => (
  <div className="flex flex-row w-min group hover:cursor-pointer scale-100 hover:scale-105 active:scale-95 transition-transform duration-300 gap-[.1vw]">
    <TransitionLink to={`/blog/${slug}`}>
      <TitleButton
        btnTitle="Read More"
        btnHeightPhone={12.5} btnWidthPhone={40} btnRadiusPhone={9}
        btnHeight={4.25} btnWidth={14} btnRadius={3.125}
        className="z-[2] !bg-[#F3E9D2] !shadow-none transition-all duration-300"
        className2="!text-black text-[14px] md:text-regularText"
      />
    </TransitionLink>
    <TransitionLink to={`/blog/${slug}`}>
      <IconButton
        btnSizePhone={12.5} iconWidthPhone={20} paddingPhone={1}
        btnSize={4.25} iconWidth={2.1875} padding={0.85}
        className="!bg-[#F3E9D2] !text-black !shadow-none"
      />
    </TransitionLink>
  </div>
)

const PostText = ({ post }) => (
  <div className="flex flex-col gap-[3vw] md:gap-[1.25vw]">
    <span className="font-roboto text-smallTextPhone md:text-smallText leading-[150%]">
      {post.date} · {post.readTime}
    </span>
    <h2 className="font-dyeLine text-h4TextPhone md:text-h3Text leading-[120%] font-medium">{post.title}</h2>
    <p className="font-roboto text-regularTextPhone md:text-regularText leading-[150%]">{post.excerpt}</p>
    <ReadMore slug={post.slug} />
  </div>
)

// Text on one side, large image on the other; alternates down the list.
const FeaturedPost = ({ post, imageLeft }) => (
  <article className="flex flex-col md:flex-row items-center gap-[6vw] md:gap-[4vw]">
    <div className={`w-full md:w-[48%] md:px-[3vw] ${imageLeft ? 'md:order-2' : ''}`}>
      <PostText post={post} />
    </div>
    <div className={`w-full md:w-[48%] h-[70vw] md:h-[31.25vw] ${imageLeft ? 'md:order-1' : ''}`}>
      <ImagePlaceholder image={post.image} alt={post.title} />
    </div>
  </article>
)

export default function BlogPage() {
  return (
    <div className="flex flex-col gap-[10vw] md:gap-[4vw] pb-[12vw] md:pb-[6vw]">
      <div className="relative w-full h-[45vw] md:h-[25.25vw]">
        <img
          alt="New Year Sale"
          loading="eager"
          fetchPriority="high"
          className="w-full h-full object-cover rounded-[4vw] md:rounded-[1.5vw]"
          src={shopBanner1}
        />
        <IconButton
          className="absolute right-[4vw] top-[3vw]"
          btnSizePhone={9} paddingPhone={1} iconWidthPhone={14}
          btnSize={3.0625} padding={0.85} iconWidth={2.1875}
        />
      </div>

      <div className="flex flex-col gap-[10vw] md:gap-[4vw] px-[5vw] md:px-[2.5vw]">
        {blogs.map((post, i) => (
          <FeaturedPost key={post.slug} post={post} imageLeft={i % 2 === 1} />
        ))}
      </div>
    </div>
  )
}
