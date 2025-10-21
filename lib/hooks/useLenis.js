'use client';
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const useLenis = (options = {}) => {
  const lenisRef = useRef(null)
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    // Updated options for Lenis based on the provided config
    const defaultOptions = {
      duration: 1.2, // Reduced from 1.8 for better performance
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.08, // Increased from 0.001 for smoother 60fps
      wheelMultiplier: 0.8,
      touchMultiplier: 0.8,
      infinite: false,
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
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
    gsap.ticker.lagSmoothing(60, 16) // Optimize for 60fps with 16ms threshold

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