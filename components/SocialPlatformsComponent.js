"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

export default function SocialPlatformsComponent() {
  const headingRef = useRef(null);
  const paraRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {

    gsap.registerPlugin(ScrollTrigger, SplitText);

    // Safari-specific ScrollTrigger configuration
    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
      ignoreMobileResize: true
    });

    // --- Heading and paragraph animations ---
    const splitHeading = new SplitText(headingRef.current, { type: "words" });
    const splitPara = new SplitText(paraRef.current, { type: "lines" });

    let tl = gsap.timeline({
      defaults: { force3D: true, willChange: "transform, opacity" },
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 90%",
        scrub: true,
      },
    });

    tl.from(splitHeading.words, {
      y: 30,
      opacity: 0,
      stagger: 0.05,
      duration: 0.6,
      ease: "power3.out",
    });

    tl.from(
      splitPara.lines,
      {
        y: 15,
        opacity: 0,
        stagger: 0.05,
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.6"
    );

    // --- Marquee columns ---
    const columns = containerRef.current.querySelectorAll(".marquee-column");

    columns.forEach((col, index) => {
      const items = col.children;
      const totalHeight = Array.from(items).reduce(
        (acc, el) =>
          acc + el.offsetHeight + parseInt(getComputedStyle(el).marginBottom),
        0
      );

      // Duplicate content for seamless loop
      col.innerHTML += col.innerHTML;

      if (index === 1) {
        // Center column scrolls downward
        gsap.fromTo(
          col,
          { y: -totalHeight },
          {
            y: 0,
            ease: "linear",
            duration: totalHeight / 50,
            repeat: -1,
            force3D: true,
            willChange: "transform",
          }
        );
      } else {
        // Left and right columns scroll upward
        gsap.fromTo(
          col,
          { y: 0 },
          {
            y: -totalHeight,
            ease: "linear",
            duration: totalHeight / 50,
            repeat: -1,
            force3D: true,
            willChange: "transform",
          }
        );
      }
    });

    return () => {
      splitHeading.revert();
      splitPara.revert();
      tl.kill();
    };
  }, []);

  const socialPlatforms = [
    { icon: "/assets/insta.svg", title: "Instagram" },
    { icon: "/assets/fb.svg", title: "Facebook" },
    { icon: "/assets/tiktok.svg", title: "Tiktok" },
    { icon: "/assets/news.svg", title: "Newsletter" },
    { icon: "/assets/yt.svg", title: "Youtube" },
    { icon: "/assets/x.svg", title: "X" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen flex items-center pt-[10vh] flex-col gap-6"
    >
      <div className="relative w-5/12 text-center flex-center flex-col">
        <div className="relative w-full z-80">
          <h2
            ref={headingRef}
            className="text-[3.5vw] font-archivo leading-[4.2vw] mb-2 font-[700] text-dark-black z-50"
          >
            Supported Social Platforms
          </h2>
          <p
            ref={paraRef}
            className="text-gray-500 font-[300] w-11/12 mx-auto leading-[120%] text-xs z-50"
          >
            Search millions of creators in seconds using AI-powered filters:
            <span className="font-[500]">
              {" "}
              audience authenticity, geo-verification, sentiment, engagement
              quality, niche fit, and more.
            </span>
          </p>
        </div>
        <div className="w-[400px] absolute h-[300px] z-10 -top-20 opacity-50 gradient-4 border-black backdrop-blur-[120px]" />
      </div>

      <div className="w-1/2 relative flex flex-col gap-4 z-100">
        <div className="social-media flex-center gap-[10px]">
          {socialPlatforms.map((item) => (
            <div
              key={item.icon}
              className="flex-center py-[9px] px-4 border border-gray-400 gap-[10px] text-gray-500 rounded-4xl text-sm leading-[100%] font-[300]"
            >
              <Image
                src={item.icon}
                alt={item.title}
                width={10}
                height={10}
                className="relative object-contain"
              />
              <p>{item.title}</p>
            </div>
          ))}
        </div>

        <div className="relative flex-center gap-4">
          <div className="rounded-full py-[9px] text-xs leading-[100%] border uppercase font-medium min-w-[180px] cursor-pointer flex-center text-white bg-orange-500">
            Browse Creators
          </div>
          <div className="rounded-full py-[9px] text-xs leading-[100%] border-orange-500 border uppercase font-medium text-orange-500 min-w-[180px] cursor-pointer flex-center">
            SEE PRICING
          </div>
        </div>
      </div>

      <div className="w-[55%] relative h-[47vh] flex gap-7 -top-6 overflow-hidden">
        <div className="w-full absolute top-0 h-[18vh] gradient-6 z-60" />
        <div className="w-full absolute bottom-0 h-[18vh] gradient-7 z-60" />

        {/* Column 1 - Left */}
        <div className="w-1/3 relative">
          <div className="marquee-column">
            {["/assets/1.png", "/assets/img1.png", "/assets/img2.png", "/assets/img3.png"].map(
              (src, i) => (
                <div
                  key={i}
                  className="w-full relative h-[280px] rounded-4xl overflow-hidden mb-7"
                >
                  <Image src={src} alt="post" fill className="object-cover relative" />
                  <Image
                    src="/assets/ig-white.svg"
                    alt="post"
                    width={32}
                    height={32}
                    className="object-contain absolute z-80 left-4 bottom-4"
                  />
                </div>
              )
            )}
          </div>
        </div>

        {/* Column 2 - Center */}
        <div className="w-1/3 relative -top-4">
          <div className="marquee-column">
            {["/assets/2.png", "/assets/img4.png", "/assets/img5.png", "/assets/img6.png"].map(
              (src, i) => (
                <div
                  key={i}
                  className="w-full h-[270px] relative rounded-4xl overflow-hidden mb-7"
                >
                  <Image src={src} alt="post" fill className="object-cover relative" />
                  <Image
                    src="/assets/tiktok-white.svg"
                    alt="post"
                    width={32}
                    height={32}
                    className="object-contain absolute z-80 left-4 bottom-4"
                  />
                </div>
              )
            )}
          </div>
        </div>

        {/* Column 3 - Right */}
        <div className="w-1/3 relative top-2">
          <div className="marquee-column">
            {["/assets/3.png", "/assets/img7.png", "/assets/1.png", "/assets/2.png"].map(
              (src, i) => (
                <div
                  key={i}
                  className="w-full relative h-[280px] rounded-4xl overflow-hidden mb-7"
                >
                  <Image src={src} alt="post" fill className="object-cover relative" />
                  <Image
                    src="/assets/x-white.svg"
                    alt="post"
                    width={32}
                    height={32}
                    className="object-contain absolute z-80 left-4 bottom-4"
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>


    </div>
  );
}
