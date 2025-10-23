"use client"

// Comprehensive Safari optimization initialization

import { isSafari, isIOS, addSafariClass } from './safariDetection.js';
import { initializeSafariOptimizations } from './safariOptimizations.js';
import { useMemoryManagement } from './memoryManagement.js';
import { createPerformanceMonitor, createSafariOptimizer } from './performanceMonitoring.js';

/**
 * Initialize all Safari optimizations
 */
export const initializeSafariOptimization = () => {
  if (typeof window === 'undefined') return null;

  // Add Safari-specific CSS classes
  addSafariClass();

  // Initialize Safari optimizations
  const optimizations = initializeSafariOptimizations();

  // Create performance monitor (only in development)
  const performanceMonitor = process.env.NODE_ENV === 'development' 
    ? createPerformanceMonitor({
        showFPS: true,
        showMemory: true,
        showFrameTime: true
      })
    : null;

  // Create Safari optimizer
  const safariOptimizer = createSafariOptimizer();

  // Start performance monitoring in development
  if (performanceMonitor) {
    performanceMonitor.start();
  }

  return {
    optimizations,
    performanceMonitor,
    safariOptimizer
  };
};

/**
 * Safari-specific component wrapper
 */
export const withSafariOptimization = (Component) => {
  return function SafariOptimizedComponent(props) {
    const { manager, cleanup } = useMemoryManagement();
    
    // Initialize Safari optimizations for this component
    const safariOptimizations = initializeSafariOptimization();
    
    // Cleanup on unmount
    React.useEffect(() => {
      return () => {
        cleanup();
        if (safariOptimizations?.performanceMonitor) {
          safariOptimizations.performanceMonitor.stop();
        }
      };
    }, []);

    return React.createElement(Component, {
      ...props,
      safariOptimizations,
      memoryManager: manager
    });
  };
};

/**
 * Safari-specific hook for components
 */
export const useSafariOptimization = () => {
  const [optimizations, setOptimizations] = React.useState(null);
  const { manager, cleanup } = useMemoryManagement();

  React.useEffect(() => {
    const safariOptimizations = initializeSafariOptimization();
    setOptimizations(safariOptimizations);

    return () => {
      cleanup();
      if (safariOptimizations?.performanceMonitor) {
        safariOptimizations.performanceMonitor.stop();
      }
    };
  }, []);

  return {
    optimizations,
    memoryManager: manager,
    cleanup
  };
};

/**
 * Safari-specific GSAP configuration
 */
export const configureSafariGSAP = () => {
  if (typeof window === 'undefined') return;

  const safari = isSafari();
  
  if (safari) {
    // Configure GSAP for Safari
    gsap.config({
      force3D: true,
      nullTargetWarn: false
    });

    // Configure ScrollTrigger for Safari
    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
      ignoreMobileResize: true
    });
  }
};

/**
 * Safari-specific Three.js configuration
 */
export const configureSafariThreeJS = () => {
  if (typeof window === 'undefined') return {};

  const safari = isSafari();
  const mobile = isIOS();
  
  return {
    antialias: mobile ? false : (safari ? true : false),
    alpha: true,
    powerPreference: safari ? 'default' : 'high-performance',
    precision: safari ? 'mediump' : 'highp',
    failIfMajorPerformanceCaveat: false,
    preserveDrawingBuffer: true,
    pixelRatio: Math.min(window.devicePixelRatio || 1, 2)
  };
};

/**
 * Safari-specific CSS optimizations
 */
export const applySafariCSSOptimizations = () => {
  if (typeof document === 'undefined') return;

  const safari = isSafari();
  
  if (safari) {
    // Disable smooth scrolling for Safari
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';
    
    // Add Safari-specific classes
    document.body.classList.add('safari-browser');
    
    if (isIOS()) {
      document.body.classList.add('ios-device');
    }
  }
};

/**
 * Complete Safari optimization setup
 */
export const setupSafariOptimizations = () => {
  if (typeof window === 'undefined') return null;

  // Apply CSS optimizations
  applySafariCSSOptimizations();
  
  // Configure GSAP
  configureSafariGSAP();
  
  // Initialize optimizations
  const optimizations = initializeSafariOptimization();
  
  return optimizations;
};

export default {
  initializeSafariOptimization,
  withSafariOptimization,
  useSafariOptimization,
  configureSafariGSAP,
  configureSafariThreeJS,
  applySafariCSSOptimizations,
  setupSafariOptimizations
};
