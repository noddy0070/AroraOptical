import { useState } from 'react'
import statementFrame from '../../assets/images/blog/blog1/blog1-thumbnail.png'
import chapter6Img from '../../assets/images/blog/blog1/chapter6.png'
import retroFrames from '../../assets/images/blog/retro-frames.jpg'
import roundImg from '../../assets/images/blog/blog1/roundImg.png'
import { TransitionLink } from '@/Routes/TransitionLink'

const BROWN = 'text-[#7a4a28]'
const display = 'font-dyeLine text-[#1b2433]'

const Divider = () => <hr className="border-0 border-t border-[#e3e3e3] my-[10vw] md:my-[4.5vw]" />

const Chapter = ({ id, label, title }) => (
  <section id={id} className="scroll-mt-[8vw]">
    {label && <p className={`font-roboto text-regularTextPhone md:text-regularText ${BROWN} mb-[3vw] md:mb-[1vw]`}>{label}</p>}
    <h2 className={`${display} text-h3TextPhone md:text-h2Text leading-[115%] mb-[5vw] md:mb-[1.75vw]`}>{title}</h2>
  </section>
)

const H3 = ({ children }) => (
  <h3 className={`${display} text-h4TextPhone md:text-h4Text leading-[120%] mt-[8vw] md:mt-[2.5vw] mb-[3vw] md:mb-[1vw]`}>{children}</h3>
)

const P = ({ children, className = '' }) => (
  <p className={`font-roboto text-regularTextPhone md:text-mfediumText leading-[165%] text-[#1b2433] mb-[4vw] md:mb-[1.25vw] ${className}`}>{children}</p>
)

const Figure = ({ src, alt }) => (
  <img src={src} alt={alt} loading="lazy" className="w-full h-auto object-cover my-[5vw] md:my-[1.75vw]" />
)

const designs = [
  {
    name: 'Oversized frames',
    text: 'Particularly in softer square, rounded and butterfly shapes.',
    svg: <><rect x="4" y="12" width="44" height="34" rx="12" /><rect x="72" y="12" width="44" height="34" rx="12" /><path d="M48 26 Q60 20 72 26" /></>,
  },
  {
    name: 'Retro intellectual frames',
    text: 'Oval, tortoiseshell and softly rectangular silhouettes inspired by the 1960s–90s.',
    svg: <><ellipse cx="28" cy="29" rx="24" ry="17" /><ellipse cx="92" cy="29" rx="24" ry="17" /><path d="M52 26 Q60 22 68 26" /></>,
  },
  {
    name: 'Geometric frames',
    text: 'Hexagonal, angular and sculptural designs that make the frame itself the focal point.',
    svg: <><path d="M4 29 L16 12 H40 L52 29 L40 46 H16 Z" /><path d="M68 29 L80 12 H104 L116 29 L104 46 H80 Z" /><path d="M52 28 H68" /></>,
  },
]

const checklist = [
  ['An everyday optical frame', 'A versatile frame that works with almost everything. Think softly square, classic rectangular or understated tortoiseshell.'],
  ['A statement frame', 'This is where you can be more adventurous. Look for oversized proportions, bold acetate or distinctive geometric shapes.'],
  ['A retro-inspired frame', 'Oval, round, browline or vintage-inspired silhouettes remain an easy way to introduce character without going completely experimental.'],
  ['A premium sunglass', <>Invest in one pair that feels unmistakably <em>you</em>, whether that&apos;s a classic aviator, wayfarer, navigator or an oversized silhouette.</>],
  ['A frame with personality', "Don't overlook colour. Deep tortoiseshell, transparent tones, muted greens, burgundy and other considered colours can make an everyday frame far more interesting."],
  ['A prescription pair you actually enjoy wearing', "Prescription eyewear doesn't have to look clinical. Choose a frame you would happily wear even if you didn't need corrective lenses."],
  ['A frame that fits your face', 'Broadly, face shapes fall into two groups: rounded and angular. Use the guide below to find your match.'],
]

const faceAdvice = {
  round: {
    title: 'Go for angular frames',
    text: 'Angular, structured shapes such as rectangular, square and geometric frames add definition to round and oval faces.',
    face: <rect x="22" y="38" width="76" height="28" rx="2" />,
  },
  angular: {
    title: 'Go for rounded frames',
    text: 'Round, oval and softly curved frames balance the strong lines of a square or triangular face.',
    face: <><ellipse cx="42" cy="52" rx="19" ry="15" /><ellipse cx="78" cy="52" rx="19" ry="15" /></>,
  },
}

function Checklist() {
  const [done, setDone] = useState([])
  const toggle = (i) => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]))
  return (
    <ul className="border-t border-[#e3e3e3] mb-[6vw] md:mb-[2vw]">
      {checklist.map(([title, text], i) => {
        const checked = done.includes(i)
        return (
          <li key={title} className="border-b border-[#e3e3e3]">
            <button type="button" onClick={() => toggle(i)} aria-pressed={checked} className="flex w-full gap-[4vw] md:gap-[1.25vw] py-[4vw] md:py-[1.1vw] text-left">
              <span className={`mt-[1vw] md:mt-[.3vw] shrink-0 w-[5.5vw] h-[5.5vw] md:w-[1.3vw] md:h-[1.3vw] rounded-full border border-[#1b2433] flex items-center justify-center ${checked ? 'bg-[#1b2433]' : ''}`}>
                {checked && (
                  <svg viewBox="0 0 12 12" className="w-[60%] h-[60%] text-white" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 6.5l2.5 2.5L10 3.5" /></svg>
                )}
              </span>
              <span>
                <span className={`${display} block text-h5TextPhone md:text-h5Text leading-[130%] ${checked ? 'line-through opacity-60' : ''}`}>{title}</span>
                <span className="font-roboto block text-smallTextPhone md:text-regularText leading-[160%] text-[#5d6470] mt-[1vw] md:mt-[.2vw]">{text}</span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function FaceShapeGuide() {
  const [shape, setShape] = useState('round')
  const advice = faceAdvice[shape]
  return (
    <div className="border border-[#d9d9d9] p-[5vw] md:p-[1.5vw] mb-[6vw] md:mb-[2vw]">
      <p className="font-roboto font-medium text-regularTextPhone md:text-regularText mb-[4vw] md:mb-[1.25vw]">Which best describes your face shape?</p>
      <div className="inline-flex rounded-full border border-[#1b2433] p-[.5vw] md:p-[.2vw] max-w-full" role="tablist">
        {[['round', 'Round or oval'], ['angular', 'Angular (square, triangle)']].map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={shape === key}
            onClick={() => setShape(key)}
            className={`font-roboto rounded-full px-[3.5vw] md:px-[.9vw] py-[2vw] md:py-[.45vw] text-smallTextPhone md:text-regularText transition-colors ${shape === key ? 'bg-[#1b2433] text-white' : 'text-[#1b2433]'}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex flex-row items-center gap-[5vw] md:gap-[2.5vw] mt-[6vw] md:mt-[2vw]">
        {/* <svg viewBox="0 0 120 150" className="w-[22vw] md:w-[6vw] shrink-0" fill="none" strokeWidth="3">
          {shape === 'round'
            ? <ellipse cx="60" cy="75" rx="42" ry="68" stroke="#9a9a9a" />
            : <path d="M20 20 H100 V95 Q100 140 60 145 Q20 140 20 95 Z" stroke="#9a9a9a" />}
          <g stroke="#7a4a28">{advice.face}</g>
        </svg> */}
        <img src={roundImg} alt="Face shape illustration" className="w-[22vw] md:w-[6vw] shrink-0" />
        <div>
          <h4 className={`${display} text-h5TextPhone md:text-h5Text mb-[1.5vw] md:mb-[.4vw]`}>{advice.title}</h4>
          <p className="font-roboto text-smallTextPhone md:text-regularText leading-[165%] text-[#5d6470]">{advice.text}</p>
        </div>
      </div>
    </div>
  )
}

function PriceSpectrum() {
  return (
    <figure className="my-[6vw] md:my-[2vw]">
      <div className="flex justify-between font-roboto text-tinyTextPhone md:text-smallText">
        <div><b className="block">₹1,500–₹2,000</b><span className="text-[#5d6470]">OPIUM mainstream styles</span></div>
        <div className="text-right"><b className="block">₹30,000–₹40,000</b><span className="text-[#5d6470]">Designer frame</span></div>
      </div>
      <div className="relative h-[2vw] md:h-[.55vw] bg-[#f0efec] rounded-full my-[2vw] md:my-[.4vw]">
        <span className="absolute top-[-.2vw] md:top-[-.1vw] left-[4%] w-[2.5vw] h-[2.5vw] md:w-[.7vw] md:h-[.7vw] rounded-full bg-[#7a4a28]" />
        <span className="absolute top-[-.2vw] md:top-[-.1vw] left-[17%] w-[2.5vw] h-[2.5vw] md:w-[.7vw] md:h-[.7vw] rounded-full bg-[#b39a82]" />
        <span className="absolute right-0 top-0 h-full w-[25%] rounded-full bg-[#7b1e3a]" />
      </div>
      <div className="ml-[12%] font-roboto text-tinyTextPhone md:text-smallText"><b className="block">≈ ₹7,000</b><span className="text-[#5d6470]">Limited-edition collaborations</span></div>
      <figcaption className="font-roboto text-tinyTextPhone md:text-smallText text-[#5d6470] mt-[2vw] md:mt-[.5vw]">Where accessible Indian design sits against European luxury, on a scale from ₹0 to ₹40,000.</figcaption>
    </figure>
  )
}

export default function Eyewear2026() {
  return (
    <>
      <P className="!text-h6TextPhone md:!text-h6Text 
      
      
      
      font-instrumentSans first-letter:float-left first-letter:text-[18vw] md:first-letter:text-[5.5vw] first-letter:leading-[80%] first-letter:pr-[2vw] md:first-letter:pr-[.6vw] first-letter:pt-[1vw]">
        There was a time when choosing spectacles was largely a functional decision: find a comfortable frame, put the lenses in, and get on with your day.
      </P>
      <p className={`${display} text-h5TextPhone md:text-h5Text mb-[4vw] md:mb-[1.25vw]`}>That is no longer the case.</p>
      <P>In 2026, eyewear sits somewhere between fashion, identity and personal preference. A pair of glasses can change the proportions of your face, communicate your taste before you say a word, and increasingly become as recognisable as the shoes or watch you wear.</P>
      <P>The global eyewear industry has responded accordingly. Luxury houses, specialised eyewear companies and ambitious Indian brands are all competing for the same piece of the consumer&apos;s attention. The result is one of the most interesting periods in eyewear design in decades.</P>
      <P>So, what exactly are we wearing in 2026?</P>

      <Divider />

      <Chapter id="statement-frame" title="2026 is the year of the Statement Frame" />
      <Figure src={statementFrame} alt="Man wearing bold black acetate frames" />
      <P>The biggest shift is simple: <b>eyewear is becoming less anonymous.</b></P>
      <P>The restrained, barely-there aesthetic has not disappeared, but 2026 is seeing considerably more confidence in frame shapes, colours and proportions. Fashion coverage this year has pointed towards a return to expressive styling, while eyewear trends continue to draw heavily from retro designs and deliberately distinctive shapes.</P>
      <P>Three designs that stand out:</P>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[6vw] md:gap-[1.25vw] my-[5vw] md:my-[1.5vw]">
        {designs.map((d) => (
          <div key={d.name} className="border-t-2 border-[#1b2433] pt-[3vw] md:pt-[.9vw]">
            <svg viewBox="0 0 120 58" className="w-full h-auto max-w-[60vw] md:max-w-none text-[#1b2433]" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round">{d.svg}</svg>
            <h4 className={`${display} text-h5TextPhone md:text-h6Text mt-[3vw] md:mt-[.8vw] mb-[1.5vw] md:mb-[.4vw]`}>{d.name}</h4>
            <p className="font-roboto text-smallTextPhone md:text-smallText leading-[160%] text-[#5d6470]">{d.text}</p>
          </div>
        ))}
      </div>
      <P>The important distinction is that these are not simply &quot;trends&quot; in isolation. They are tools for changing how you are perceived as a person.</P>
      <P>A thick acetate frame can add structure to softer facial features. An oval frame can soften a strong jawline. A larger lens can create a more relaxed, fashion-forward proportion. The best eyewear therefore does more than follow fashion. It uses <b>fashion strategically</b>.</P>

      <Divider />

      <Chapter id="luxury" label="Chapter 2" title="Luxury is giving way to confidence" />
      <P>Luxury eyewear has traditionally relied on subtlety: fine materials, restrained logos and impeccable finishing.</P>
      <P>That philosophy remains relevant, but the definition of understated luxury is changing. Instead of asking, <em>&quot;Can you see the logo?&quot;</em>, today&apos;s luxury consumer increasingly asks, <em>&quot;Do you have more unique designs?&quot;</em></P>
      <P>This is where houses such as Prada, Versace, Burberry, Dolce &amp; Gabbana, Giorgio Armani and Tiffany &amp; Co. have had enormous influence. The significance of this is bigger than the number of brands involved.</P>
      <P>Prada and Versace bring the language of luxury fashion. Maui Jim, on the other hand, brings Japanese craftsmanship and designs inspired by the state of Hawaii.</P>
      <P>The modern eyewear industry has effectively created a bridge between <b>fashion-house design and optical manufacturing.</b> A runway aesthetic can move into eyewear collections, into optical stores and finally onto consumers&apos; faces at extraordinary speed.</P>
      <P>That is why a frame can now feel unmistakably &quot;Prada&quot; or &quot;Versace&quot; without requiring an enormous logo.</P>
      <p className="font-dyeLine italic text-[#7b1e3a] text-h4TextPhone md:text-h3Text leading-[120%] my-[6vw] md:my-[2vw]">The design language does the branding.</p>

      <Divider />

      <Chapter id="retro" label="Chapter 3" title="The return of retro, but with better engineering" />
      <Figure src={retroFrames} alt="Tortoiseshell frames resting on driftwood" />
      <H3>Buying with purpose</H3>
      <P>As we move forward with the new eyewear trends, much of the new generation also looks for purpose in whatever they buy. Gen Z, for example, looks out for brands that are more environmentally friendly, and that is exactly what many big brands and companies have acted on, in both the frame materials they make and the packaging they use.</P>
      <P>One of the notable developments has been the adoption of <b>bio-acetate and other environment-friendly materials</b> in eyewear. EssilorLuxottica, for example, has incorporated bio-based acetate into selected eyewear collections, alongside initiatives aimed at reducing the use of animal-derived materials and improving the sustainability of product packaging. Other names such as Levi&apos;s, Marc Jacobs and Armani have also been exploring sustainable materials and production practices.</P>
      <P>As consumers become more purpose-driven, companies are making innovative products that are eco-friendly as well, bringing more variety across the product ranges they offer.</P>
      <H3>Looking backwards, moving forwards</H3>
      <P>One of 2026&apos;s most interesting contradictions is that eyewear looks backwards while manufacturing moves forward.</P>
      <P>Oval frames, vintage tortoiseshell, aviators, browline-inspired designs and narrow rectangular silhouettes all borrow heavily from previous decades. Yet modern acetate construction, titanium, improved hinges, lightweight materials and advanced lens technology make today&apos;s versions considerably more wearable.</P>
      <P>This is why retro eyewear has survived longer than many short-lived fashion trends. You aren&apos;t necessarily buying a vintage-looking frame. You&apos;re buying <b>a modern interpretation of a familiar shape</b>.</P>
      <P>The result is particularly visible in the comeback of oval and tortoiseshell optical frames, which have been closely associated with the <b>&quot;librarian-core&quot;</b> and <b>&quot;office siren&quot;</b> aesthetics of recent fashion cycles.</P>

      <Divider />

      <Chapter id="big-players" label="Chapter 4" title="Big players don't just follow trends. They build them." />
      <P>This is where the eyewear business becomes particularly fascinating.</P>
      <P>Companies such as EssilorLuxottica don&apos;t operate like a conventional fashion label. Their influence extends across design, manufacturing, distribution, retail and lenses.</P>
      <P>The company has spent decades building relationships with major fashion houses while also owning iconic eyewear names. Its history includes acquisitions such as Persol, Ray-Ban, Oakley and Oliver Peoples, alongside long-running licensing relationships with luxury brands.</P>
      <P>This vertical integration matters. When a global group can combine these, it becomes extraordinarily powerful at translating fashion into a product consumers can actually buy:</P>
      <div className="flex flex-wrap items-center gap-[2vw] md:gap-[.6vw] mb-[5vw] md:mb-[1.5vw] font-roboto text-smallTextPhone md:text-smallText">
        {['Brand recognition', 'Design', 'Manufacturing', 'Optical expertise', 'Retail distribution'].map((t, i, a) => (
          <span key={t} className="flex items-center gap-[2vw] md:gap-[.6vw]">
            <span className="rounded-full border border-[#d0d0d0] px-[3vw] md:px-[.8vw] py-[1.5vw] md:py-[.4vw]">{t}</span>
            {i < a.length - 1 && <span className="text-[#9a9a9a]">+</span>}
          </span>
        ))}
      </div>
      <P>Ray-Ban demonstrates this perfectly. Its strength is not simply the recognisable Wayfarer or Aviator. It is the ability to repeatedly reinterpret those icons, from classic sunglasses to prescription eyewear and now smart eyewear.</P>
      <aside className="border-l-[.5vw] md:border-l-[.2vw] border-[#7a4a28] bg-[#f2f2f0] px-[5vw] md:px-[1.5vw] py-[4vw] md:py-[1.25vw] mb-[4vw] md:mb-[1.25vw]">
        <p className="font-roboto text-regularTextPhone md:text-mediumText leading-[165%]">
          And this evolution is becoming increasingly accessible to Indian consumers. <b>At Arora Opticals, you can explore Ray-Ban Prescription, alongside Ray-Ban and Oakley customisation options</b>, bringing the same emphasis on personalisation and design into the optical experience.{' '}
          <span className={`${BROWN} underline`}><TransitionLink to="/shop/glasses/bestsellers">Explore the collection</TransitionLink></span>
        </p>
      </aside>
      <P>Oakley takes the opposite route: performance becomes fashion.</P>
      <P>Different identities, but one enormous advantage: <b>global distribution and decades of consumer recognition.</b></P>

      <Divider />

      <Chapter id="indian-eyewear" label="Chapter 5" title="The rise of Indian eyewear" />
      <P>This is where the story gets more interesting.</P>
      <P>India is no longer simply a market where international eyewear brands sell imported design ideas. A new generation of Indian eyewear companies is developing its own aesthetic, and some are beginning to take that identity beyond traditional optical retail.</P>
      <P>One particularly interesting example is <b>OPIUM Eyewear</b>.</P>
      <P>OPIUM deliberately positions itself as an affordable, fashion-oriented brand. Its current collections span everything from wayfarers, pilots and cat-eyes to round, square, hexagonal and navigator silhouettes, while collaborations such as its limited-edition collection with celebrity hairstylist Aalim Hakim push the brand further into lifestyle and design territory.</P>
      <P>But perhaps more telling is where OPIUM is selling. Its store network includes multiple Indian airports, including Mumbai, Hyderabad, Chennai, Jaipur, Goa, Guwahati and Nagpur, alongside malls and optical retailers.</P>
      <P>That is strategically significant. An airport is not merely another retail location. It puts an Indian eyewear brand in front of consumers who are travelling, spending and increasingly exposed to international fashion.</P>
      <P>In other words, OPIUM isn&apos;t positioning itself merely as an Indian alternative to an international brand. It is attempting to occupy the same <b>fashion-accessory environment</b>. And that distinction matters.</P>
      <p className={`${display} text-h5TextPhone md:text-h5Text leading-[130%] my-[5vw] md:my-[1.5vw]`}>The international luxury houses have heritage. Indian brands have something different: proximity to the Indian consumer.</p>
      <P>They understand local face shapes, climate, colour preferences, price sensitivity and the increasingly important middle ground between mass-market eyewear and European luxury.</P>
      <P>That creates an interesting opportunity. A consumer may admire a ₹30,000–₹40,000 designer frame but still want something more accessible for everyday casual wear. This is where emerging Indian brands can compete: not necessarily by copying luxury houses, but by offering strong design at a more approachable price.</P>
      <PriceSpectrum />
      <P>OPIUM&apos;s current range illustrates this spectrum particularly well: mainstream styles sit around the ₹1,500–₹2,000 range, while its more premium limited-edition collaborations reach approximately ₹7,000.</P>
      <P>That range allows the brand to participate in multiple consumer occasions rather than forcing every customer into a single price tier.</P>

      <Divider />

      <p className={`font-roboto text-regularTextPhone md:text-regularText ${BROWN} mb-[3vw] md:mb-[1vw]`}>Chapter 6</p>
      <Figure src={chapter6Img} alt="Woman holding glasses and thinking" />
      <section id="what-to-buy" className="scroll-mt-[8vw]">
        <h2 className={`${display} text-h3TextPhone md:text-h2Text leading-[115%] mt-[6vw] md:mt-[2vw] mb-[5vw] md:mb-[1.75vw]`}>What should you actually buy in 2026?</h2>
        <H3>Your 2026 eyewear shopping list</H3>
        <P>Tick off what you already own and see what&apos;s missing.</P>
      </section>
      <Checklist />
      <FaceShapeGuide />
      <H3>One rule before you buy</H3>
      <P>Don&apos;t choose a frame simply because it is trending.</P>
      <P>The right frame should complement your face, fit comfortably and work with the way you actually dress. Trends should give you <b>more options</b>, not dictate your style.</P>
      <P>After all, the goal isn&apos;t to own the most fashionable eyewear collection. It&apos;s to own a collection that feels unmistakably <b>yours</b>.</P>

      <Divider />

      <section id="closing" className="scroll-mt-[8vw]">
        <p className={`font-roboto text-regularTextPhone md:text-regularText ${BROWN} mb-[3vw] md:mb-[1vw]`}>In closing</p>
        <h2 className={`${display} text-h3TextPhone md:text-h2Text leading-[115%] mb-[5vw] md:mb-[1.75vw]`}>The real eyewear trend of 2026</h2>
      </section>
      <P>Consumers are becoming more educated about eyewear. They are comparing materials. They are noticing construction. They are thinking about lens quality. They are looking beyond logos and asking whether a frame actually suits their face.</P>
      <P>Global luxury groups have raised expectations for design and technology. Independent designers have pushed creativity further. Indian brands are increasingly proving that local companies can compete through design, accessibility and distribution.</P>
      <P>The result is healthy competition and, ultimately, better eyewear.</P>
      <P>In 2026, glasses are no longer something you simply <em>need</em> to wear. They are a style statement.</P>
      <p className={`${display} text-h3TextPhone md:text-h2Text leading-[115%] mt-[2vw]`}>They are something you can choose to be seen in.</p>
    </>
  )
}
