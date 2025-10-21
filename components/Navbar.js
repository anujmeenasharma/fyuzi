"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "@/lib/contexts/ThemeContext";

export default function Navbar() {
  const { theme, isDark } = useTheme();
  const [textColor, setTextColor] = useState("white");
  const [isDarkSection, setIsDarkSection] = useState(false);
  const [logoSrc, setLogoSrc] = useState("/assets/fyuze-logo.svg");
  const navRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.section');
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      let currentSection = null;
      let minDistance = Infinity;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        const sectionBottom = sectionTop + rect.height;
        const sectionCenter = sectionTop + rect.height / 2;
        const distance = Math.abs(scrollPosition - sectionCenter);
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          if (distance < minDistance) {
            minDistance = distance;
            currentSection = section;
          }
        }
      });

      if (currentSection) {
        const textAttribute = currentSection.getAttribute('data-text');
        if (textAttribute === 'dark') {
          // For dark sections, keep original colors in light mode
          setTextColor(isDark ? "#c5c5c5" : "#4f4f4f");
          setIsDarkSection(true);
          setLogoSrc("/assets/fyuze-dark.svg");
        } else {
          // For light sections, keep original white color in light mode
          setTextColor(isDark ? "#fafafa" : "white");
          setIsDarkSection(false);
          setLogoSrc("/assets/fyuze-logo.svg");
        }
      } else {
        // Default colors - keep original white in light mode
        setTextColor(isDark ? "#fafafa" : "white");
        setIsDarkSection(false);
        setLogoSrc("/assets/fyuze-logo.svg");
      }
    };

    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [isDark]);

  useGSAP(() => {
    const navelms = navRef.current.querySelectorAll('.navelm')

    gsap.from(navelms, {
      y: -40,
      opacity: 0,
      duration: 2,
      delay: 0,
      ease: "power2.inOut"
    })

  }, [])

  return (
    <nav
    ref={navRef}
      className="w-full fixed p-9 flex-between z-100 transition-colors duration-300"
      style={{ 
        color: textColor,
        backgroundColor: isDark ? 'var(--theme-bg-primary)' : 'transparent'
      }}
    >
      {/* Gradient overlay with opacity transition */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          background: isDark 
            ? 'linear-gradient(180deg, #262626 73.25%, rgba(38,38,38,0) 100%)'
            : 'linear-gradient(180deg, #E2E1DC 73.25%, rgba(226,225,220,0) 100%)',
          opacity: isDarkSection ? 1 : 0,
          transition: 'opacity 700ms ease-in-out'
        }}
      ></div>

      {/* Content */}
      <div className="relative flex-center gap-12 z-10">
        <div className="relative w-24 h-[30px] navelm">
          <Image
            src={logoSrc}
            alt="logo"
            fill
            className="object-contain"
          />
        </div>
        <div 
          className="w-[1px] h-[26px] relative transition-colors duration-300"
          style={{ backgroundColor: textColor }}
        ></div>
        <div className="flex-between gap-10 relativ">
          <Link
            href="/"
            className="group relative inline-block text-xs font-[300] leading-[100%] uppercase transition-colors duration-300 navelm"
            style={{ color: textColor }}
          >
            How it works
            <span
              className="absolute left-0 -bottom-2 h-[0.5px] w-0 transition-all duration-300 group-hover:w-full"
              style={{ backgroundColor: textColor }}
            ></span>
          </Link>
          <div 
            className="relative w-[2px] h-[2px] rounded-full transition-colors duration-300"
            style={{ backgroundColor: textColor }}
          ></div>
          <Link
            href="/"
            className="group relative inline-block text-xs font-[300] leading-[100%] uppercase transition-colors duration-300 navelm"
            style={{ color: textColor }}
          >
            Features
            <span
              className="absolute left-0 -bottom-2 h-[0.5px] w-0 transition-all duration-300 group-hover:w-full"
              style={{ backgroundColor: textColor }}
            ></span>
          </Link>
          <div 
            className="relative w-[2px] h-[2px] rounded-full transition-colors duration-300"
            style={{ backgroundColor: textColor }}
          ></div>
          <Link
            href="/"
            className="group relative inline-block text-xs font-[300] leading-[100%] uppercase transition-colors duration-300 navelm"
            style={{ color: textColor }}
          >
            pricing
            <span
              className="absolute left-0 -bottom-2 h-[0.5px] w-0 transition-all duration-300 group-hover:w-full"
              style={{ backgroundColor: textColor }}
            ></span>
          </Link>
          <div 
            className="relative w-[2px] h-[2px] rounded-full transition-colors duration-300"
            style={{ backgroundColor: textColor }}
          ></div>
          <Link
            href="/"
            className="group relative inline-block text-xs font-[300] leading-[100%] uppercase transition-colors duration-300 navelm"
            style={{ color: textColor }}
          >
            about
            <span
              className="absolute left-0 -bottom-2 h-[0.5px] w-0 transition-all duration-300 group-hover:w-full"
              style={{ backgroundColor: textColor }}
            ></span>
          </Link>
        </div>
      </div>
      <div className="relative flex-center gap-3 z-10 navelm">
        {/* <ThemeToggle /> */}
        <div className="w-[30px] h-[30px] relative overflow-hidden rounded-full">
          <Image
            src="/assets/profile.png"
            alt="logo"
            fill
            className="object-cover"
          />
        </div>
        <p 
          className="font-[500] text-base leading-[100%] transition-colors duration-300"
          style={{ color: textColor }}
        >
          Jenny Wilson
        </p>
      </div>
    </nav>
  );
}