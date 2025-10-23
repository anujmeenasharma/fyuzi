'use client';
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { isSafari, isIOS } from '../utils/safariDetection.js'

const useLenis = (options = {}) => {
  const lenisRef = useRef(null)
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    
    // Safari-specific optimizations
    const safari = isSafari();
    const mobile = isIOS();
    
    // Safari-specific ScrollTrigger configuration
    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
      ignoreMobileResize: true
    });
    
    // Updated options for Lenis based on the provided config
    const defaultOptions = {
      duration: safari ? 0.8 : 1.2, // Reduced duration for Safari
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: safari ? 0.12 : 0.08, // Increased lerp for Safari
      wheelMultiplier: safari ? 0.6 : 0.8, // Reduced wheel sensitivity for Safari
      touchMultiplier: safari ? 0.6 : 0.8, // Reduced touch sensitivity for Safari
      infinite: false,
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: !safari, // Disable smooth scrolling for Safari
      smoothTouch: false,
      ...options
    }

    // Initialize Lenis
    lenisRef.current = new Lenis(defaultOptions)

    // Sync ScrollTrigger with Lenis
    lenisRef.current.on('scroll', ScrollTrigger.update)

    const gsapRaf = (time) => {
      // GSAP ticker uses seconds; Lenis expects ms
      lenisRef.current?.raf(time * 1000)
    }
    gsap.ticker.add(gsapRaf)
    // Safari-specific lag smoothing
    gsap.ticker.lagSmoothing(safari ? 30 : 60, safari ? 33 : 16) // Optimize for Safari

    // Refresh ScrollTrigger after setup
    ScrollTrigger.refresh()

    // Cleanup function
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy()
      }
      gsap.ticker.remove(gsapRaf)
    }
  }, [options])

  // Return the Lenis instance for advanced usage
  return lenisRef.current
}

export default useLenis