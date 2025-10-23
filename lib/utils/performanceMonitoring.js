"use client"

// Performance monitoring utilities for Safari optimization

import { isSafari, isIOS } from './safariDetection.js';

/**
 * FPS Counter class for performance monitoring
 */
export class FPSCounter {
  constructor(options = {}) {
    this.fps = 0;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.isRunning = false;
    this.callbacks = new Set();
    this.options = {
      updateInterval: 1000, // Update FPS every 1000ms
      targetFPS: isSafari() ? 30 : 60,
      warningThreshold: isSafari() ? 20 : 30,
      ...options
    };
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.tick();
  }

  stop() {
    this.isRunning = false;
  }

  tick() {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    this.frameCount++;

    if (currentTime - this.lastTime >= this.options.updateInterval) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      this.frameCount = 0;
      this.lastTime = currentTime;

      // Notify callbacks
      this.callbacks.forEach(callback => callback(this.fps));

      // Log performance warnings
      if (this.fps < this.options.warningThreshold) {
        console.warn(`Performance warning: FPS dropped to ${this.fps} (target: ${this.options.targetFPS})`);
      }
    }

    requestAnimationFrame(() => this.tick());
  }

  onUpdate(callback) {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  getFPS() {
    return this.fps;
  }
}

/**
 * Performance metrics collector
 */
export class PerformanceMetrics {
  constructor() {
    this.metrics = {
      fps: 0,
      frameTime: 0,
      memoryUsage: 0,
      renderTime: 0,
      animationTime: 0
    };
    this.history = [];
    this.maxHistorySize = 100;
  }

  updateFPS(fps) {
    this.metrics.fps = fps;
    this.addToHistory('fps', fps);
  }

  updateFrameTime(frameTime) {
    this.metrics.frameTime = frameTime;
    this.addToHistory('frameTime', frameTime);
  }

  updateMemoryUsage() {
    if (performance.memory) {
      this.metrics.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
      this.addToHistory('memoryUsage', this.metrics.memoryUsage);
    }
  }

  updateRenderTime(renderTime) {
    this.metrics.renderTime = renderTime;
    this.addToHistory('renderTime', renderTime);
  }

  updateAnimationTime(animationTime) {
    this.metrics.animationTime = animationTime;
    this.addToHistory('animationTime', animationTime);
  }

  addToHistory(key, value) {
    if (!this.history[key]) {
      this.history[key] = [];
    }
    
    this.history[key].push({
      value,
      timestamp: performance.now()
    });

    // Keep only recent history
    if (this.history[key].length > this.maxHistorySize) {
      this.history[key].shift();
    }
  }

  getAverage(key, duration = 5000) {
    if (!this.history[key]) return 0;
    
    const now = performance.now();
    const recent = this.history[key].filter(
      entry => now - entry.timestamp <= duration
    );
    
    if (recent.length === 0) return 0;
    
    const sum = recent.reduce((acc, entry) => acc + entry.value, 0);
    return sum / recent.length;
  }

  getMetrics() {
    return {
      ...this.metrics,
      averageFPS: this.getAverage('fps'),
      averageFrameTime: this.getAverage('frameTime'),
      averageMemoryUsage: this.getAverage('memoryUsage'),
      averageRenderTime: this.getAverage('renderTime'),
      averageAnimationTime: this.getAverage('animationTime')
    };
  }
}

/**
 * Performance monitor component
 */
export class PerformanceMonitor {
  constructor(options = {}) {
    this.options = {
      showFPS: true,
      showMemory: true,
      showFrameTime: true,
      position: 'top-right',
      updateInterval: 1000,
      ...options
    };
    
    this.fpsCounter = new FPSCounter();
    this.metrics = new PerformanceMetrics();
    this.element = null;
    this.isVisible = false;
    this.updateInterval = null;
  }

  createUI() {
    if (this.element) return;

    const container = document.createElement('div');
    container.id = 'performance-monitor';
    container.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 12px;
      z-index: 10000;
      pointer-events: none;
      user-select: none;
    `;

    this.element = container;
    document.body.appendChild(container);
  }

  updateUI() {
    if (!this.element) return;

    const metrics = this.metrics.getMetrics();
    let content = '';

    if (this.options.showFPS) {
      content += `FPS: ${metrics.fps} (avg: ${metrics.averageFPS.toFixed(1)})\n`;
    }

    if (this.options.showFrameTime) {
      content += `Frame: ${metrics.frameTime.toFixed(2)}ms\n`;
    }

    if (this.options.showMemory && metrics.memoryUsage > 0) {
      content += `Memory: ${metrics.memoryUsage.toFixed(1)}MB\n`;
    }

    this.element.textContent = content;
  }

  start() {
    this.createUI();
    this.fpsCounter.start();
    
    // Update metrics
    this.fpsCounter.onUpdate((fps) => {
      this.metrics.updateFPS(fps);
      this.metrics.updateMemoryUsage();
    });

    // Update UI periodically
    this.updateInterval = setInterval(() => {
      this.updateUI();
    }, this.options.updateInterval);

    this.isVisible = true;
  }

  stop() {
    this.fpsCounter.stop();
    
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
      this.element = null;
    }

    this.isVisible = false;
  }

  toggle() {
    if (this.isVisible) {
      this.stop();
    } else {
      this.start();
    }
  }

  getMetrics() {
    return this.metrics.getMetrics();
  }
}

/**
 * Safari-specific performance optimizations
 */
export class SafariPerformanceOptimizer {
  constructor() {
    this.safari = isSafari();
    this.mobile = isIOS();
    this.optimizations = {
      reducedQuality: false,
      frameRate: this.safari ? 30 : 60,
      textureSize: this.mobile ? 1024 : 2048
    };
  }

  shouldReduceQuality() {
    return this.safari && this.mobile;
  }

  getOptimalFrameRate() {
    return this.optimizations.frameRate;
  }

  getOptimalTextureSize() {
    return this.optimizations.textureSize;
  }

  adaptToPerformance(metrics) {
    const { fps, memoryUsage } = metrics;
    
    // Reduce quality if performance is poor
    if (fps < 20 || memoryUsage > 100) {
      this.optimizations.reducedQuality = true;
      this.optimizations.frameRate = Math.max(15, this.optimizations.frameRate - 5);
      this.optimizations.textureSize = Math.max(512, this.optimizations.textureSize / 2);
      
      console.warn('Safari performance optimization: Reducing quality');
    } else if (fps > 45 && memoryUsage < 50) {
      // Increase quality if performance is good
      this.optimizations.reducedQuality = false;
      this.optimizations.frameRate = Math.min(60, this.optimizations.frameRate + 5);
      this.optimizations.textureSize = Math.min(2048, this.optimizations.textureSize * 1.5);
    }
  }
}

/**
 * Create a performance monitor instance
 */
export const createPerformanceMonitor = (options = {}) => {
  return new PerformanceMonitor(options);
};

/**
 * Create a Safari performance optimizer
 */
export const createSafariOptimizer = () => {
  return new SafariPerformanceOptimizer();
};

/**
 * Hook for performance monitoring in React components
 */
export const usePerformanceMonitoring = (options = {}) => {
  const monitor = new PerformanceMonitor(options);
  const optimizer = new SafariPerformanceOptimizer();
  
  const start = () => monitor.start();
  const stop = () => monitor.stop();
  const toggle = () => monitor.toggle();
  const getMetrics = () => monitor.getMetrics();
  
  return {
    start,
    stop,
    toggle,
    getMetrics,
    optimizer
  };
};

export default {
  FPSCounter,
  PerformanceMetrics,
  PerformanceMonitor,
  SafariPerformanceOptimizer,
  createPerformanceMonitor,
  createSafariOptimizer,
  usePerformanceMonitoring
};
