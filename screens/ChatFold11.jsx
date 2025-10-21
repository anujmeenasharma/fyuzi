"use client"
import { useEffect, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"

gsap.registerPlugin(ScrollTrigger, SplitText)

// Reusable Card Component
const FeatureCard = ({ icon, title, desc }) => {
  return (
    <div className="relative group hover:cursor-pointer feature-card">
      {/* Glow Layer */}
      <div className="absolute inset-0 rounded-4xl opacity-0 group-hover:opacity-100 transition duration-300 
        before:content-[''] before:absolute before:inset-0 before:rounded-4xl 
        before:bg-[linear-gradient(302.64deg,rgba(221,51,5,0.4)_-0.83%,rgba(255,107,58,0.4)_49.95%,rgba(255,179,71,0.4)_100.74%)] 
        before:blur-[120px] before:opacity-100">
      </div>

      {/* Actual Card */}
      <div className="relative h-80 aspect-[4/5] border border-black rounded-4xl px-4 py-6 flex flex-col justify-between 
        hover:bg-white transition duration-300 group-hover:shadow-xl">
        <Image src={icon} alt={title} width={32} height={32} className="object-contain"/>  
        <div>
          <h3 className="font-[Archivo] text-md font-semibold">{title}</h3>
          <p className="leading-tight mt-2 text-sm w-[90%]">{desc}</p>
        </div>
      </div>
    </div>
  )
}

const features = [
  { icon: "/MagnifyingGlass.svg", title: "Real-Time Discovery", desc: "Scan tens of millions of influencers and content creators across Instagram, TikTok, YouTube, and X." },
  { icon: "/ChartBar.svg", title: "Predictive ROI Analytics", desc: "Forecast campaign performance and potential even before you launch." },
  { icon: "/GlobeHemisphereEast.svg", title: "Micro-Niche Targeting", desc: "Filter searches by ultra-specific sub-categories like “TikTok Fashion Model” or “European Luxury Travel”." },
  { icon: "/MagicWand.svg", title: "Trend Prediction Engine", desc: "Stay ahead of social media viral movements and emerging creators." },
  { icon: "/MONOGRAM.svg", title: "Fyuze Score™", desc: "Our proprietary ranking system combining ROI potential, sentiment and fit, fraud detection, and audience trust." },
  { icon: "/ChartPieSlice.svg", title: "Enterprise-Grade Dashboards", desc: "Transparent data, brand-safe reporting, and white-label options." }
]

const ChatFold11 = () => {
  const headingRef = useRef(null)
  const paraRef = useRef(null)
  const containerRef = useRef(null)

    useEffect(() => {
    // Split heading into words
    const splitHeading = new SplitText(headingRef.current, { type: "words" })
    // Split paragraph into lines
    const splitPara = new SplitText(paraRef.current, { type: "lines" })

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 95%",
        scrub: true
      }
    })

    // Animate heading words
    tl.from(splitHeading.words, {
      y: 25,
      opacity: 0,
      stagger: 0.05,
      duration: 0.6,
      ease: "power3.out"
    }, "a-=0.6")

    // Animate paragraph lines
    tl.from(splitPara.lines, {
      y: 15,
      opacity: 0,
      stagger: 0.05,
      duration: 0.4,
      ease: "power2.out"
    }, "-=0.8")

    // Animate feature cards
    tl.from(".feature-card", {
      y: 40,
      opacity: 0,
      scale: 0.95,
      stagger: 0.025,
      duration: 0.2,
      ease: "power3.out"
    }, "a")

  }, [])


  return (
    <div ref={containerRef} className="h-[120vh] flex items-center justify-center gap-20">
      {/* Left Side */}
      <div className="w-[26%]">
        <h1 ref={headingRef} className="text-5xl font-archivo font-semibold leading-auto">
          The World’s Most Powerful Platform Features
        </h1>
        <p ref={paraRef} className="text-sm mt-6 leading-relaxed">
          Our advanced AI-powered platform and data-driven machine learning algorithms process vast amounts of creator data to deliver precise matches for your marketing campaigns.
        </p>
      </div>

      {/* Right Side */}
      <div className="w-1/2 h-4/5 flex gap-6 scale-90">
        <div className="flex flex-col gap-6 translate-y-12">
          {features.slice(0, 2).map((f, i) => <FeatureCard key={i} {...f} />)}
        </div>
        <div className="flex flex-col gap-6 -translate-y-6">
          {features.slice(2, 4).map((f, i) => <FeatureCard key={i} {...f} />)}
        </div>
        <div className="flex flex-col gap-6 translate-y-2">
          {features.slice(4, 6).map((f, i) => <FeatureCard key={i} {...f} />)}
        </div>
      </div>
    </div>
  )
}

export default ChatFold11
