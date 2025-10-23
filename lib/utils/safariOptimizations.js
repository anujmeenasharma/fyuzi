"use client"

// Comprehensive Safari optimization utilities

import { isSafari, isIOS, isSafariMobile, isSafariDesktop } from './safariDetection.js';

/**
 * Safari-specific scroll behavior optimization
 */
export const optimizeScrollBehavior = () => {
  if (typeof window === 'undefined') return;

  const safari = isSafari();
  
  if (safari) {
    // Disable smooth scrolling for Safari to improve performance
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';
    
    // Add Safari-specific classes
    document.body.classList.add('safari-browser');
    
    if (isIOS()) {
      document.body.classList.add('ios-device');
    }
    
    if (isSafariMobile()) {
      document.body.classList.add('safari-mobile');
    }
    
    if (isSafariDesktop()) {
      document.body.classList.add('safari-desktop');
    }
  }
};

/**
 * Safari-specific texture size optimization
 */
export const optimizeTextureSizes = (maxSize = 2048) => {
  const safari = isSafari();
  const mobile = isIOS();
  
  if (safari && mobile) {
    // Reduce texture sizes for Safari mobile
    return Math.min(maxSize, 1024);
  } else if (safari) {
    // Slightly reduced for Safari desktop
    return Math.min(maxSize, 1536);
  }
  
  return maxSize;
};

/**
 * Safari-specific requestAnimationFrame throttling
 */
export const createSafariThrottledRAF = (callback, targetFPS = 30) => {
  const safari = isSafari();
  const frameInterval = 1000 / (safari ? targetFPS : 60);
  let lastTime = 0;
  let rafId = null;

  const throttledCallback = (currentTime) => {
    if (currentTime - lastTime >= frameInterval) {
      callback(currentTime);
      lastTime = currentTime;
    }
    rafId = requestAnimationFrame(throttledCallback);
  };

  const start = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(throttledCallback);
  };

  const stop = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  return { start, stop };
};

/**
 * Safari-specific event listener optimization
 */
export const addSafariOptimizedEventListener = (element, event, handler, options = {}) => {
  if (!element || typeof window === 'undefined') return;

  const safari = isSafari();
  
  // Safari-specific event options
  const safariOptions = {
    passive: safari && (event.includes('touch') || event.includes('scroll')) ? false : true,
    capture: false,
    ...options
  };

  element.addEventListener(event, handler, safariOptions);
  
  return () => {
    element.removeEventListener(event, handler, safariOptions);
  };
};

/**
 * Safari-specific WebGL context optimization
 */
export const getSafariWebGLOptions = () => {
  const safari = isSafari();
  const mobile = isIOS();
  
  return {
    antialias: mobile ? false : (safari ? true : false),
    alpha: true,
    powerPreference: safari ? 'default' : 'high-performance',
    precision: safari ? 'mediump' : 'highp',
    failIfMajorPerformanceCaveat: false,
    preserveDrawingBuffer: true,
    depth: true,
    stencil: false,
    antialias: safari && !mobile,
    premultipliedAlpha: false,
    preserveDrawingBuffer: safari
  };
};

/**
 * Safari-specific performance monitoring
 */
export const createSafariPerformanceMonitor = () => {
  const safari = isSafari();
  let frameCount = 0;
  let lastTime = performance.now();
  let fps = 0;
  
  const measureFPS = (currentTime) => {
    frameCount++;
    
    if (currentTime - lastTime >= 1000) {
      fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      frameCount = 0;
      lastTime = currentTime;
      
      // Log performance warnings for Safari
      if (safari && fps < 30) {
        console.warn(`Safari performance warning: FPS dropped to ${fps}`);
      }
    }
  };

  const getFPS = () => fps;
  
  return { measureFPS, getFPS };
};

/**
 * Safari-specific memory management
 */
export const createSafariMemoryManager = () => {
  const safari = isSafari();
  const objects = new Set();
  
  const register = (obj) => {
    objects.add(obj);
  };
  
  const dispose = (obj) => {
    if (obj && typeof obj.dispose === 'function') {
      obj.dispose();
    }
    objects.delete(obj);
  };
  
  const disposeAll = () => {
    objects.forEach(obj => {
      if (obj && typeof obj.dispose === 'function') {
        obj.dispose();
      }
    });
    objects.clear();
  };
  
  // Safari-specific garbage collection hint
  const forceGC = () => {
    if (safari && window.gc) {
      window.gc();
    }
  };
  
  return { register, dispose, disposeAll, forceGC };
};

/**
 * Safari-specific animation optimization
 */
export const createSafariAnimationOptimizer = () => {
  const safari = isSafari();
  const mobile = isIOS();
  
  const getOptimalSettings = () => ({
    // Reduce iterations for Safari
    iterations: safari ? 16 : 32,
    // Lower resolution for mobile Safari
    resolution: mobile ? 0.3 : (safari ? 0.4 : 0.5),
    // Adjust frame rate
    targetFPS: mobile ? 30 : (safari ? 45 : 60),
    // Reduce complexity
    complexity: safari ? 0.8 : 1.0
  });
  
  const shouldReduceQuality = () => {
    return safari && mobile;
  };
  
  return { getOptimalSettings, shouldReduceQuality };
};

/**
 * Initialize all Safari optimizations
 */
export const initializeSafariOptimizations = () => {
  if (typeof window === 'undefined') return;
  
  // Optimize scroll behavior
  optimizeScrollBehavior();
  
  // Add performance monitoring
  const performanceMonitor = createSafariPerformanceMonitor();
  
  // Add memory management
  const memoryManager = createSafariMemoryManager();
  
  // Add animation optimizer
  const animationOptimizer = createSafariAnimationOptimizer();
  
  return {
    performanceMonitor,
    memoryManager,
    animationOptimizer
  };
};

export default {
  optimizeScrollBehavior,
  optimizeTextureSizes,
  createSafariThrottledRAF,
  addSafariOptimizedEventListener,
  getSafariWebGLOptions,
  createSafariPerformanceMonitor,
  createSafariMemoryManager,
  createSafariAnimationOptimizer,
  initializeSafariOptimizations
};
