"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import SparkleSvg from "./SparkleSvg";
import SparkleSvg2 from "./SparkleSvg2";
import LiquidEther from "./LiquidEther";
import { ScrollTrigger } from "gsap/all";

export default function HeroComponent() {
  const homeContainer = useRef();
  const scrollBtn = useRef();
  const homeContRef = useRef();

  useGSAP(() => {

    gsap.registerPlugin(ScrollTrigger);

    // Safari-specific ScrollTrigger configuration
    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
      ignoreMobileResize: true
    });

    const bottomlinks = homeContRef.current.querySelectorAll(".bottomlink");
    const tl1 = gsap.timeline({
      repeat: -1,
      yoyo: true,
      repeatDelay: 0.5,
      defaults: { force3D: true, willChange: "clip-path" },
    });

    tl1
      .fromTo(
        ".line1",
        {
          clipPath: "inset(0 0 100% 0)",
          willChange: "clip-path",
        },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 0.5,
          willChange: "clip-path",
        }
      )
      .fromTo(
        ".line2",
        {
          clipPath: "inset(0 0 100% 0)",
          willChange: "clip-path",
        },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 0.5,
          willChange: "clip-path",
        }
      )
      .from(
        ".text",
        {
          opacity: 0,
          duration: 1,
          willChange: "opacity",
        },
        "-=1"
      );

    // Animate .home-cont with transformOrigin at center for proper zoom out
    gsap.to(homeContRef.current, {
      scaleX: 0.95,
      scaleY: 0.75,
      borderRadius: 56,
      transformOrigin: "50% 50%",
      force3D: true,
      willChange: "transform, border-radius",
      scrollTrigger: {
        trigger: homeContainer.current,
        start: "bottom bottom",
        end: "bottom top",
        scrub: 2,
      },
    });

    gsap.from(bottomlinks, {
      y: 40,
      opacity: 0,
      duration: 2,
      delay: 0.3,
      ease: "power2.inOut",
      force3D: true,
      willChange: "transform, opacity"
    })

    // Slight fade-in for hero text & input
    gsap.from(".hero-fade", {
      opacity: 0,
      y: 20,
      duration: 2,
      ease: "power3.out",
      delay: 0.3,
      force3D: true,
      willChange: "transform, opacity"
    });

  }, homeContainer);

  return (
    <div
      className="font-sans h-screen w-full relative text-white overflow-hidden flex-center"
      ref={homeContainer}
      style={{ willChange: "opacity" }}
    >
      <div
        className="w-full h-full home-cont overflow-hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl z-100"
        ref={homeContRef}
        style={{ willChange: "transform, border-radius" }}
      >
        <div className="absolute top-0 left-0 w-full h-full z-10" style={{ willChange: "opacity" }}>
          <div className="absolute top-0 left-0  w-full h-full opacity-60 pointer-events-none" style={{ willChange: "opacity" }}></div>
          <LiquidEther />
        </div>
        <div className="background w-full h-full pointer-events-none absolute top-0 left-0 z-20" style={{ willChange: "opacity" }}></div>
        <div className="absolute w-full h-full flex-center z-100 left-0 top-0 pointer-events-none" style={{ willChange: "opacity, transform" }}>
          <div className="relative flex-center flex-col w-1/2" style={{ willChange: "opacity, transform" }}>
            <div className="relative w-full flex-center flex-col gap-12" style={{ willChange: "opacity, transform" }}>
              <div className="flex-center flex-col gap-6 relative" style={{ willChange: "opacity, transform" }}>
                <h1 className="font-archivo text-[1.8vw] leading-[1.5vw] font-bold hero-fade" style={{ willChange: "opacity, transform" }}>
                  Ask Fyuze to find your next Influencer
                </h1>
                <p className="text-sm font-[300] leading-[110%] w-[58%] mx-auto text-center hero-fade" style={{ willChange: "opacity, transform" }}>
                  AI-powered influencer discovery that filters by niche,
                  authenticity & ROI so you spend less time searching and more
                  time growing.
                </p>
              </div>
              <div className="relative w-full h-full pointer-events-auto hero-fade" style={{ willChange: "opacity, transform" }}>
                <input
                  type="text"
                  className="w-[70%] h-full absolute z-90 outline-none text-white  placeholder:text-white ml-20"
                  style={{ willChange: "opacity, transform" }}
                />
                <div className="relative w-full flex-between p-5 h-full input-gradient rounded-[28px] backdrop-blur-[120px] z-80" style={{ willChange: "opacity, filter, transform" }}>
                  <SparkleSvg />
                  <div className="flex-center relative gap-3" style={{ willChange: "opacity, transform" }}>
                    <div className="relative flex-center p-3 rounded-2xl icon-gradient cursor-pointer hover:scale-105 transition" style={{ willChange: "opacity, transform" }}>
                      <div className="relative w-5 h-5" style={{ willChange: "opacity, transform" }}>
                        <Image
                          src="/assets/clip.svg"
                          alt="logo"
                          fill
                          className="object-contain"
                          style={{ willChange: "opacity, transform" }}
                        />
                      </div>
                    </div>
                    <div className="relative flex-center p-3 rounded-2xl icon-gradient cursor-pointer hover:scale-105 transition" style={{ willChange: "opacity, transform" }}>
                      <div className="relative w-5 h-5" style={{ willChange: "opacity, transform" }}>
                        <Image
                          src="/assets/arrow.svg"
                          alt="logo"
                          fill
                          className="object-contain"
                          style={{ willChange: "opacity, transform" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full absolute top-0 left-0 overflow-hidden custom-border h-full z-90 pointer-events-none" style={{ willChange: "opacity, transform" }}></div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-8 flex justify-start items-start w-full pl-10 pointer-events-auto" style={{ willChange: "opacity, transform" }}>
            <div className="flex-between gap-10 relative" style={{ willChange: "opacity, transform" }}>
              <Link
                href="/"
                className="text-sm font-[300] leading-[100%] uppercase hover:underline bottomlink"
                style={{ willChange: "opacity, transform" }}
              >
                terms
              </Link>
              <div className="relative w-[2px] h-[2px] rounded-full bg-white" style={{ willChange: "opacity, transform" }}></div>
              <Link
                href="/"
                className="text-sm font-[300] leading-[100%] uppercase hover:underline bottomlink"
                style={{ willChange: "opacity, transform" }}
              >
                privacy policy
              </Link>
            </div>
          </div>
          <div
            className="absolute bottom-8 flex-center flex-col gap-1 pointer-events-none"
            ref={scrollBtn}
            style={{ willChange: "opacity, transform" }}
          >
            <div className="w-[0.6px] h-[20px] relative bg-white line1" style={{ willChange: "clip-path, opacity, transform" }}></div>
            <p className="text-xs text-center font-medium font-archivo leading-[100%] uppercase text" style={{ willChange: "opacity, transform" }}>
              Scroll to explore
            </p>
            <div className="w-[0.6px] h-[5px] relative bg-white line2" style={{ willChange: "clip-path, opacity, transform" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
