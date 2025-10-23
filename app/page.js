"use client";

import AboutComponent from "@/components/AboutComponent";
import HeroComponent from "@/components/HeroComponent";
import useLenis from "@/lib/hooks/useLenis";
import SocialPlatformsComponent from "@/components/SocialPlatformsComponent";
import FAQsection from "@/components/FAQsection";
import FeaturesComponent from "@/components/FeaturesComponent";
import FeatureCards from "@/components/FeatureCards";
import LogoLoop from "@/components/LogoLoop";
import ChatFold11 from "@/screens/ChatFold11";
import ChatFold12 from "@/screens/ChatFold12";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import LiquidEther from "@/components/LiquidEther";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Home() {

    useLenis()
    
    const [showContent, setShowContent] = useState(false);
    const [hideLoader, setHideLoader] = useState(false);
    const loaderRef = useRef();
    const counterRef = useRef();
    const progressLineRef = useRef();
    const brandNameRef = useRef();
    const counterGroupRef = useRef();

    useEffect(() => {
        const t = setTimeout(() => window.scrollTo(0, 0), 200);
        return () => clearTimeout(t);
    }, []);

    // Loader inside Home component
useGSAP(() => {
    if (!loaderRef.current) return;

    const loaderTimeline = gsap.timeline({
        onComplete: () => {
            gsap.to(loaderRef.current, {
                opacity: 0,
                duration: 0.6,
                ease: "power2.inOut",
                onComplete: () => {
                    setShowContent(true);
                    setHideLoader(true);
                },
            });
        },
    });

    // Logo fade-in
    loaderTimeline.from(brandNameRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
    });

    // Initialize counter
    counterRef.current.innerHTML = `
        <span class="text-white font-archivo font-medium tabular-nums text-sm">
            0%
        </span>
    `;

    const counterSpan = counterRef.current.querySelector("span");

    // Animate from 0 → 100 smoothly
    loaderTimeline.to(
        { value: 0 },
        {
            value: 101,
            duration: 4, // total duration
            ease: "power1.inOut",
            onUpdate: function () {
                const currentValue = Math.floor(this.targets()[0].value);
                counterSpan.textContent = currentValue + "%";

                // Update progress bar width
                gsap.to(progressLineRef.current, {
                    width: `${currentValue}%`,
                    duration: 0.1,
                    ease: "none",
                });

                gsap.to(counterRef.current, {
                    left: `${currentValue}%`,
                    duration: 0.1,
                    ease: "none"
                })
            }
        },
        "-=0.2"
    );

    // Fade out counter + logo together
    loaderTimeline.to(
        [counterGroupRef.current, brandNameRef.current],
        {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
        },
        "-=0.6"
    );
});


    const imageLogos = [
        { src: "/layers.svg", alt: "Company 1", href: "https://company1.com" },
        { src: "/sysphus.svg", alt: "Company 2", href: "https://company2.com" },
        { src: "/circooles.svg", alt: "Company 3", href: "https://company3.com" },
        { src: "/catelog.svg", alt: "Company 4", href: "https://company4.com" },
        { src: "/kosent.svg", alt: "Company 5", href: "https://company5.com" },
        { src: "/layers.svg", alt: "Company 6", href: "https://company6.com" },
    ];

    return (
        <>
            {/* LiquidEther Background - only show during loader */}
            {!hideLoader && (
                <div className="fixed inset-0 w-full h-full z-0 text-white">
                    <LiquidEther
                        colors={["#ee4f20", "#ff6b3a", "#ee4f20"]}
                        autoDemo={true}
                        autoSpeed={0.3}
                        autoIntensity={1.5}
                        mouseForce={15}
                        cursorSize={400}
                    />
                </div>
            )}

            {/* Loader Overlay */}
            {!hideLoader && (
                <div
                    ref={loaderRef}
                    className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
                    style={{ willChange: "opacity" }}
                >
                    <div className="flex flex-col items-center gap-12 relative z-10">
                        {/* Logo */}
                        <div
                            ref={brandNameRef}
                            className="relative w-[180px] h-[80px] flex items-center justify-center"
                            style={{ willChange: "opacity, transform" }}
                        >
                            <Image
                                src="/MONOGRAM.svg"
                                alt="Fyuze Logo"
                                width={180}
                                height={80}
                                className="object-contain invert"
                                priority
                            />
                        </div>

                        {/* Progress Line with Moving Counter */}
                        <div
                            ref={counterGroupRef}
                            className="relative w-80 text-white"
                        >
                            <div className="w-full h-[2px] bg-white/20 relative overflow-visible">
                                <div
                                    ref={progressLineRef}
                                    className="absolute left-0 top-0 h-full bg-white"
                                    style={{ width: "0%", willChange: "width" }}
                                />
                                {/* Counter moving with progress */}
                                <div
                                    ref={counterRef}
                                    className="absolute top-3.5 left-0 -translate-x-1/2"
                                    style={{ willChange: "left" }}
                                >
                                    <div className="relative h-6 w-12 overflow-hidden flex items-center justify-center">
                                        <span className="digit-container text-sm font-medium font-archivo text-white tabular-nums">
                                            0%
                                        </span>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            {showContent && (
                <>
                    <Navbar />

                    <div className="section theme-bg-secondary" data-text="light">
                        <HeroComponent />
                    </div>

                    <div
                        className="section relative w-full z-50 theme-bg-secondary"
                        data-text="dark"
                    >
                        <div className="flex-between w-full p-10 sticky top-[86vh] z-100">
                            <div className="relative group">
                                <button
                                    className="fill-button relative overflow-hidden"
                                    type="button"
                                >
                                    <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-20">
                                        Find Your Next Influencer
                                    </span>
                                    <span className="block absolute top-2 left-0 w-full translate-y-16 transition-transform duration-300 ease-in-out group-hover:translate-y-0">
                                        Find Your Next Influencer
                                    </span>
                                </button>
                                <Image
                                    width={120}
                                    height={110}
                                    alt="bgoverlay"
                                    src={"/assets/bgoverlaygrad.svg"}
                                    className="object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-0 opacity-0 group-hover:scale-200 group-hover:opacity-100 transition-all ease-in duration-200 pointer-events-none"
                                />
                            </div>

                            <div className="flex-center flex-col gap-1">
                                <div className="w-[0.5px] h-[20px] relative bg-gray-500 line1"></div>
                                <p className="text-xs text-center font-medium font-archivo leading-[100%] uppercase text-gray-500">
                                    Scroll to explore
                                </p>
                                <div className="w-[0.5px] h-[5px] relative bg-gray-500 line2"></div>
                            </div>
                        </div>

                        <div className="h-[380vh] theme-bg-secondary">
                            <AboutComponent />
                        </div>

                        <div className="theme-bg-secondary h-[220vh]">
                            <FeaturesComponent />
                            <FeatureCards />
                            <div className="h-[40vh] flex-center">
                                <LogoLoop
                                    logos={imageLogos}
                                    speed={120}
                                    direction="left"
                                    logoHeight={28}
                                    gap={40}
                                    pauseOnHover
                                    scaleOnHover
                                    fadeOut
                                    fadeOutColor="#ffffff"
                                    ariaLabel="Technology partners"
                                />
                            </div>
                        </div>

                        <div>
                            <SocialPlatformsComponent />
                        </div>
                        <div>
                            <ChatFold11 />
                        </div>
                        <div>
                            <ChatFold12 />
                        </div>
                    </div>

                    <div className="section theme-bg-secondary" data-text="light">
                        <FAQsection />
                    </div>
                </>
            )}
        </>
    );
}
