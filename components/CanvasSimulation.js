"use client"

// CanvasSimulation.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  simulationVertexShader,
  simulationFragmentShader,
  renderVertexShader,
  renderFragmentShader,
} from "./shaders.js";
import { useMemoryManagement } from "../lib/utils/memoryManagement.js";

const CanvasSimulation = () => {
  const containerRef = useRef();
  const { manager, cleanup } = useMemoryManagement();

  useEffect(() => {
    const scene = new THREE.Scene();
    const simScene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Safari detection and compatibility fixes
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    const renderer = new THREE.WebGLRenderer({
      antialias: isMobile ? false : (isSafari ? true : false), // Disable antialias on mobile, enable on Safari desktop
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: isSafari ? "default" : "high-performance", // Safari has issues with high-performance mode
      precision: isSafari ? "mediump" : "highp", // Safari works better with medium precision
      failIfMajorPerformanceCaveat: false, // Allow fallback for Safari
    });

    // Cap pixelRatio at 2 for better performance
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth * pixelRatio;
    const height = window.innerHeight * pixelRatio;

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2();
    const mouseVelocity = new THREE.Vector2();
    const prevMouse = new THREE.Vector2();
    let frame = 0;
    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const options = {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      stencilBuffer: false,
      depthBuffer: false,
    };

    let rtA = new THREE.WebGLRenderTarget(width, height, options);
    let rtB = new THREE.WebGLRenderTarget(width, height, options);

    const simMaterial = new THREE.ShaderMaterial({
      uniforms: {
        textureA: { value: null },
        mouse: { value: mouse },
        mouseVelocity: { value: mouseVelocity },
        resolution: { value: new THREE.Vector2(width, height) },
        time: { value: 0 },
        frame: { value: 0 },
      },
      vertexShader: simulationVertexShader,
      fragmentShader: simulationFragmentShader,
    });

    const renderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        textureA: { value: null },
        textureB: { value: null },
      },
      vertexShader: renderVertexShader,
      fragmentShader: renderFragmentShader,
      transparent: true,
    });

    const plane = new THREE.PlaneGeometry(2, 2);
    const simQuad = new THREE.Mesh(plane, simMaterial);
    const renderQuad = new THREE.Mesh(plane, renderMaterial);

    // Register objects with memory manager
    manager.threeJS.registerGeometry(plane);
    manager.threeJS.registerMaterial(simMaterial);
    manager.threeJS.registerMaterial(renderMaterial);
    manager.threeJS.registerRenderer(renderer);
    manager.threeJS.registerScene(scene);
    manager.threeJS.registerScene(simScene);

    simScene.add(simQuad);
    scene.add(renderQuad);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { alpha: true });

    const textTexture = new THREE.CanvasTexture(canvas);
    textTexture.minFilter = THREE.LinearFilter;
    textTexture.magFilter = THREE.LinearFilter;
    textTexture.format = THREE.RGBAFormat;
    
    // Register texture with memory manager
    manager.threeJS.registerTexture(textTexture);

    const backgroundColor = "#fb7427";

    const drawSVGToCanvas = (img) => {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // Get original SVG size (intrinsic size)
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;

      if (!imgWidth || !imgHeight) return;

      // Calculate scaling to fit SVG into canvas (preserving aspect ratio)
      const maxCanvasSize = Math.min(width, height) * 1.2; // 75% of canvas
      const aspect = imgWidth / imgHeight;

      let drawWidth = maxCanvasSize;
      let drawHeight = maxCanvasSize;

      if (aspect > 1) {
        // Wide SVG
        drawHeight = maxCanvasSize / aspect;
      } else {
        // Tall SVG
        drawWidth = maxCanvasSize * aspect;
      }

      // Draw centered
      ctx.drawImage(
        img,
        (width - drawWidth) / 2,
        (height - drawHeight) / 2,
        drawWidth,
        drawHeight
      );

      textTexture.needsUpdate = true;
    };

    const svgImage = new Image();
    svgImage.src = "/assets/img.png"; // Update path if needed
    svgImage.onload = () => {
      drawSVGToCanvas(svgImage);
    };

    const handleResize = () => {
      const newWidth = window.innerWidth * window.devicePixelRatio;
      const newHeight = window.innerHeight * window.devicePixelRatio;

      renderer.setSize(window.innerWidth, window.innerHeight);
      rtA.setSize(newWidth, newHeight);
      rtB.setSize(newWidth, newHeight);
      simMaterial.uniforms.resolution.value.set(newWidth, newHeight);

      camera.width = newWidth;
      camera.height = newHeight;

      canvas.width = newWidth;
      canvas.height = newHeight;

      // Redraw SVG on resized canvas
      if (svgImage.complete) {
        drawSVGToCanvas(svgImage);
      }
    };

    const handleMouseMove = (event) => {
      prevMouse.copy(mouse);
      
      // Safari-compatible mouse position calculation
      const rect = renderer.domElement.getBoundingClientRect();
      const clientX = event.clientX || (event.touches && event.touches[0] ? event.touches[0].clientX : 0);
      const clientY = event.clientY || (event.touches && event.touches[0] ? event.touches[0].clientY : 0);
      
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((clientY - rect.top) / rect.height) * 2 - 1);
      
      // Clamp values to prevent Safari glitches
      mouse.x = Math.max(-1, Math.min(1, mouse.x));
      mouse.y = Math.max(-1, Math.min(1, mouse.y));
      
      mouseVelocity.x = mouse.x - prevMouse.x;
      mouseVelocity.y = mouse.y - prevMouse.y;
    };

    const handleMouseLeave = () => {
      mouse.set(0, 0);
      mouseVelocity.set(0, 0);
    };

    const handleTouchMove = (event) => {
      event.preventDefault(); // Prevent Safari scrolling
      handleMouseMove(event);
    };

    // Register event listeners with memory manager
    manager.events.addEventListener(renderer.domElement, "mousemove", handleMouseMove);
    manager.events.addEventListener(renderer.domElement, "mouseleave", handleMouseLeave);
    manager.events.addEventListener(renderer.domElement, "touchstart", handleTouchMove, { passive: false });
    manager.events.addEventListener(renderer.domElement, "touchmove", handleTouchMove, { passive: false });
    manager.events.addEventListener(renderer.domElement, "touchend", handleMouseLeave);
    manager.events.addEventListener(window, "resize", handleResize);

    const animate = (currentTime) => {
      // Frame limiting for consistent 60fps
      if (currentTime - lastTime < frameInterval) {
        requestAnimationFrame(animate);
        return;
      }
      lastTime = currentTime;

      simMaterial.uniforms.frame.value = frame++;
      simMaterial.uniforms.time.value = currentTime / 1000;

      simMaterial.uniforms.textureA.value = rtA.texture;
      renderer.setRenderTarget(rtB);
      renderer.render(simScene, camera);

      renderMaterial.uniforms.textureA.value = rtB.texture;
      renderMaterial.uniforms.textureB.value = textTexture;

      renderer.setRenderTarget(null);
      renderer.render(scene, camera);

      [rtA, rtB] = [rtB, rtA];

      manager.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      // Use comprehensive memory manager cleanup
      cleanup();
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default CanvasSimulation;
