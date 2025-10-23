"use client"

// Hardware acceleration utilities for Safari optimization

/**
 * Apply hardware acceleration CSS properties to an element
 * @param {HTMLElement} element - The element to apply hardware acceleration to
 * @param {Object} options - Configuration options
 */
export const applyHardwareAcceleration = (element, options = {}) => {
  if (!element) return;

  const {
    enableTransform = true,
    enableOpacity = true,
    enableBackfaceVisibility = true,
    enableWillChange = true,
    willChangeProperties = ['transform', 'opacity']
  } = options;

  const styles = {
    // Force hardware acceleration
    transform: enableTransform ? 'translateZ(0)' : '',
    willChange: enableWillChange ? willChangeProperties.join(', ') : '',
    backfaceVisibility: enableBackfaceVisibility ? 'hidden' : '',
    WebkitBackfaceVisibility: enableBackfaceVisibility ? 'hidden' : '',
    WebkitTransform: enableTransform ? 'translateZ(0)' : '',
    // Safari-specific optimizations
    WebkitPerspective: '1000px',
    WebkitTransformStyle: 'preserve-3d',
    // Performance optimizations
    contain: 'layout style paint',
    isolation: 'isolate'
  };

  // Apply styles
  Object.assign(element.style, styles);
};

/**
 * Remove hardware acceleration properties from an element
 * @param {HTMLElement} element - The element to clean up
 */
export const removeHardwareAcceleration = (element) => {
  if (!element) return;

  const propertiesToRemove = [
    'transform',
    'willChange',
    'backfaceVisibility',
    'WebkitBackfaceVisibility',
    'WebkitTransform',
    'WebkitPerspective',
    'WebkitTransformStyle',
    'contain',
    'isolation'
  ];

  propertiesToRemove.forEach(prop => {
    element.style.removeProperty(prop);
  });
};

/**
 * Create a cleanup function for hardware acceleration
 * @param {HTMLElement} element - The element to create cleanup for
 * @returns {Function} Cleanup function
 */
export const createHardwareAccelerationCleanup = (element) => {
  return () => {
    removeHardwareAcceleration(element);
  };
};

/**
 * Apply hardware acceleration to multiple elements
 * @param {NodeList|Array} elements - Elements to apply hardware acceleration to
 * @param {Object} options - Configuration options
 * @returns {Function} Cleanup function for all elements
 */
export const applyHardwareAccelerationToMultiple = (elements, options = {}) => {
  if (!elements || elements.length === 0) return () => {};

  elements.forEach(element => {
    applyHardwareAcceleration(element, options);
  });

  return () => {
    elements.forEach(element => {
      removeHardwareAcceleration(element);
    });
  };
};

/**
 * Safari-specific CSS class utilities
 */
export const addSafariOptimizedClasses = (element) => {
  if (!element) return;

  // Add Safari-specific classes for CSS optimizations
  element.classList.add('safari-optimized');
  
  // Add hardware acceleration class
  element.classList.add('hardware-accelerated');
};

/**
 * Remove Safari-specific CSS classes
 */
export const removeSafariOptimizedClasses = (element) => {
  if (!element) return;

  element.classList.remove('safari-optimized', 'hardware-accelerated');
};

export default {
  applyHardwareAcceleration,
  removeHardwareAcceleration,
  createHardwareAccelerationCleanup,
  applyHardwareAccelerationToMultiple,
  addSafariOptimizedClasses,
  removeSafariOptimizedClasses
};
