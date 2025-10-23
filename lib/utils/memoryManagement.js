"use client"

// Comprehensive memory management utilities for Safari optimization

import { isSafari } from './safariDetection.js';

/**
 * Memory management class for Three.js objects
 */
export class ThreeJSMemoryManager {
  constructor() {
    this.objects = new Set();
    this.geometries = new Set();
    this.materials = new Set();
    this.textures = new Set();
    this.renderers = new Set();
    this.scenes = new Set();
  }

  registerGeometry(geometry) {
    if (geometry) {
      this.geometries.add(geometry);
    }
  }

  registerMaterial(material) {
    if (material) {
      this.materials.add(material);
    }
  }

  registerTexture(texture) {
    if (texture) {
      this.textures.add(texture);
    }
  }

  registerRenderer(renderer) {
    if (renderer) {
      this.renderers.add(renderer);
    }
  }

  registerScene(scene) {
    if (scene) {
      this.scenes.add(scene);
    }
  }

  disposeGeometry(geometry) {
    if (geometry && geometry.dispose) {
      geometry.dispose();
      this.geometries.delete(geometry);
    }
  }

  disposeMaterial(material) {
    if (material && material.dispose) {
      material.dispose();
      this.materials.delete(material);
    }
  }

  disposeTexture(texture) {
    if (texture && texture.dispose) {
      texture.dispose();
      this.textures.delete(texture);
    }
  }

  disposeRenderer(renderer) {
    if (renderer) {
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      if (renderer.dispose) {
        renderer.dispose();
      }
      this.renderers.delete(renderer);
    }
  }

  disposeScene(scene) {
    if (scene) {
      // Clear all objects from scene
      while (scene.children.length > 0) {
        const child = scene.children[0];
        scene.remove(child);
        
        // Dispose child if it has dispose method
        if (child.dispose) {
          child.dispose();
        }
      }
      this.scenes.delete(scene);
    }
  }

  disposeAll() {
    // Dispose all geometries
    this.geometries.forEach(geometry => this.disposeGeometry(geometry));
    this.geometries.clear();

    // Dispose all materials
    this.materials.forEach(material => this.disposeMaterial(material));
    this.materials.clear();

    // Dispose all textures
    this.textures.forEach(texture => this.disposeTexture(texture));
    this.textures.clear();

    // Dispose all renderers
    this.renderers.forEach(renderer => this.disposeRenderer(renderer));
    this.renderers.clear();

    // Dispose all scenes
    this.scenes.forEach(scene => this.disposeScene(scene));
    this.scenes.clear();
  }
}

/**
 * GSAP memory management class
 */
export class GSAPMemoryManager {
  constructor() {
    this.timelines = new Set();
    this.tweens = new Set();
    this.scrollTriggers = new Set();
  }

  registerTimeline(timeline) {
    if (timeline) {
      this.timelines.add(timeline);
    }
  }

  registerTween(tween) {
    if (tween) {
      this.tweens.add(tween);
    }
  }

  registerScrollTrigger(trigger) {
    if (trigger) {
      this.scrollTriggers.add(trigger);
    }
  }

  killTimeline(timeline) {
    if (timeline && timeline.kill) {
      timeline.kill();
      this.timelines.delete(timeline);
    }
  }

  killTween(tween) {
    if (tween && tween.kill) {
      tween.kill();
      this.tweens.delete(tween);
    }
  }

  killScrollTrigger(trigger) {
    if (trigger && trigger.kill) {
      trigger.kill();
      this.scrollTriggers.delete(trigger);
    }
  }

  killAll() {
    // Kill all timelines
    this.timelines.forEach(timeline => this.killTimeline(timeline));
    this.timelines.clear();

    // Kill all tweens
    this.tweens.forEach(tween => this.killTween(tween));
    this.tweens.clear();

    // Kill all scroll triggers
    this.scrollTriggers.forEach(trigger => this.killScrollTrigger(trigger));
    this.scrollTriggers.clear();
  }
}

/**
 * Event listener memory management
 */
export class EventListenerManager {
  constructor() {
    this.listeners = new Map();
  }

  addEventListener(element, event, handler, options = {}) {
    if (!element || !event || !handler) return;

    const key = `${element}_${event}`;
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }

    element.addEventListener(event, handler, options);
    this.listeners.get(key).push({ element, event, handler, options });
  }

  removeEventListener(element, event, handler) {
    if (!element || !event || !handler) return;

    const key = `${element}_${event}`;
    const listeners = this.listeners.get(key);
    
    if (listeners) {
      const index = listeners.findIndex(
        listener => listener.element === element && 
                   listener.event === event && 
                   listener.handler === handler
      );
      
      if (index !== -1) {
        const { options } = listeners[index];
        element.removeEventListener(event, handler, options);
        listeners.splice(index, 1);
        
        if (listeners.length === 0) {
          this.listeners.delete(key);
        }
      }
    }
  }

  removeAllListeners() {
    this.listeners.forEach((listeners, key) => {
      listeners.forEach(({ element, event, handler, options }) => {
        element.removeEventListener(event, handler, options);
      });
    });
    this.listeners.clear();
  }
}

/**
 * Comprehensive memory manager
 */
export class ComprehensiveMemoryManager {
  constructor() {
    this.threeJS = new ThreeJSMemoryManager();
    this.gsap = new GSAPMemoryManager();
    this.events = new EventListenerManager();
    this.rafIds = new Set();
    this.timeouts = new Set();
    this.intervals = new Set();
  }

  // RAF management
  requestAnimationFrame(callback) {
    const id = requestAnimationFrame(callback);
    this.rafIds.add(id);
    return id;
  }

  cancelAnimationFrame(id) {
    if (id) {
      cancelAnimationFrame(id);
      this.rafIds.delete(id);
    }
  }

  // Timeout management
  setTimeout(callback, delay) {
    const id = setTimeout(() => {
      callback();
      this.timeouts.delete(id);
    }, delay);
    this.timeouts.add(id);
    return id;
  }

  clearTimeout(id) {
    if (id) {
      clearTimeout(id);
      this.timeouts.delete(id);
    }
  }

  // Interval management
  setInterval(callback, delay) {
    const id = setInterval(callback, delay);
    this.intervals.add(id);
    return id;
  }

  clearInterval(id) {
    if (id) {
      clearInterval(id);
      this.intervals.delete(id);
    }
  }

  // Cleanup all
  dispose() {
    // Cancel all RAF
    this.rafIds.forEach(id => cancelAnimationFrame(id));
    this.rafIds.clear();

    // Clear all timeouts
    this.timeouts.forEach(id => clearTimeout(id));
    this.timeouts.clear();

    // Clear all intervals
    this.intervals.forEach(id => clearInterval(id));
    this.intervals.clear();

    // Dispose Three.js objects
    this.threeJS.disposeAll();

    // Kill GSAP animations
    this.gsap.killAll();

    // Remove event listeners
    this.events.removeAllListeners();

    // Safari-specific garbage collection hint
    if (isSafari() && window.gc) {
      window.gc();
    }
  }
}

/**
 * Create a cleanup function for React components
 */
export const createCleanupFunction = (manager) => {
  return () => {
    if (manager) {
      manager.dispose();
    }
  };
};

/**
 * Hook for memory management in React components
 */
export const useMemoryManagement = () => {
  const manager = new ComprehensiveMemoryManager();
  
  const cleanup = () => {
    manager.dispose();
  };

  return {
    manager,
    cleanup,
    threeJS: manager.threeJS,
    gsap: manager.gsap,
    events: manager.events
  };
};

export default {
  ThreeJSMemoryManager,
  GSAPMemoryManager,
  EventListenerManager,
  ComprehensiveMemoryManager,
  createCleanupFunction,
  useMemoryManagement
};
