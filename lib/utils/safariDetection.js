"use client"

// Safari detection utility
export const isSafari = () => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent;
  const isSafariUA = /^((?!chrome|android).)*safari/i.test(userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isWebKit = /WebKit/.test(userAgent);
  
  return isSafariUA || (isIOS && isWebKit);
};

export const isIOS = () => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isSafariMobile = () => {
  return isIOS() && isSafari();
};

export const isSafariDesktop = () => {
  return isSafari() && !isIOS();
};

// Safari-specific optimizations
export const getSafariOptimizedSettings = () => {
  const safari = isSafari();
  
  return {
    // WebGL settings
    antialias: safari,
    powerPreference: safari ? 'default' : 'high-performance',
    precision: safari ? 'mediump' : 'highp',
    pixelRatio: safari ? 1 : Math.min(window.devicePixelRatio, 1.5),
    
    // Animation settings
    targetFPS: safari ? 30 : 60,
    frameInterval: safari ? 1000 / 30 : 1000 / 60,
    
    // Performance settings
    reduceIterations: safari,
    lowerResolution: safari,
    
    // Touch settings
    passiveEvents: !safari,
  };
};

// Add Safari-specific CSS class to body
export const addSafariClass = () => {
  if (typeof document === 'undefined') return;
  
  if (isSafari()) {
    document.body.classList.add('safari-browser');
  }
  
  if (isIOS()) {
    document.body.classList.add('ios-device');
  }
  
  if (isSafariMobile()) {
    document.body.classList.add('safari-mobile');
  }
};

// Safari-specific event handling
export const addSafariEventListeners = (element, events, handler) => {
  if (!element || typeof window === 'undefined') return;
  
  const safari = isSafari();
  
  events.forEach(eventType => {
    const options = safari && (eventType.includes('touch') || eventType.includes('scroll')) 
      ? { passive: false } 
      : { passive: true };
    
    element.addEventListener(eventType, handler, options);
  });
};

// Remove Safari event listeners
export const removeSafariEventListeners = (element, events, handler) => {
  if (!element || typeof window === 'undefined') return;
  
  events.forEach(eventType => {
    element.removeEventListener(eventType, handler);
  });
};

export default {
  isSafari,
  isIOS,
  isSafariMobile,
  isSafariDesktop,
  getSafariOptimizedSettings,
  addSafariClass,
  addSafariEventListeners,
  removeSafariEventListeners,
};
