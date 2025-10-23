"use client";
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import { useEffect, useRef } from "react";
import gsap from "gsap";

/* ----------------- Data Array ----------------- */
const defaultFeatures = [
  // New features from the uploaded images
  {
    icon: "/CubeFocus.svg", 
    title: "AI Visual Detection",
    desc: "Our advanced AI-powered algorithm identifies products visually in content videos, even when not explicitly mentioned."
  },
  {
    icon: "/Barcode.svg", 
    title: "AI Voice Recognition",
    desc: "Our advanced AI-powered algorithm detects precise product mentions and brand names in creator content with 99% accuracy."
  },
  {
    icon: "/Microscope.svg", 
    title: "Micro-Niche Targeting",
    desc: "Filter by ultra-specific categories like ‘vegan keto fitness coaches’ or ‘sustainable luxury travel’."
  },
  {
    icon: "/MathOperations.svg", 
    title: "Engagement Quality Score",
    desc: "Our proprietary algorithm measures genuine engagement vs fake followers and comments."
  },
  {
    icon: "/userFocus.svg", 
    title: "Audience Overlap Finder",
    desc: "Identify creators whose audiences match your ideal customer profile."
  },
  {
    icon: "/MagnifyingGlass.svg", // Changed to UserMinus for contrast
    title: "Competitor Analysis",
    desc: "Our advanced AI-powered algorithm finds creators who promote competing products in your specific niche, by detecting specific product mentions, brand names, and visual appearances."
  }
];

const slideTexts = [
  {
    heading: "Find	Creators	Who	Promote	Products	Like	Yours",
    paragraph: "Our	Ai-powered	platform analyzes	hundreds	of	millions	of	online	videos	in	 order	to	match	your	brand with	influencers	and	content	creators	who	already	promote	 products	similar	to	yours."
  },
  {
    heading: "Find	the Perfect	Influencers	with	Hyper-Specific	Targeting",
    paragraph: "Discover	exactly	the	right	creators	using	our	proprietary filtering	system	with	 120K+	micro-categories	that	go	far	beyond	standard	influencer	platforms."
  },
]

/* ----------------- Helpers ----------------- */
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}
function autoBind(instance) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (key !== "constructor" && typeof instance[key] === "function") {
      instance[key] = instance[key].bind(instance);
    }
  });
}

/* draw rounded rect helper */
function roundRect(ctx, x, y, w, h, r) {
  const min = Math.min;
  r = min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* create card canvas (icon, title, desc) - returns canvas */
function createCardCanvas({ iconSrc, title, desc, width = 800, height = 1000 }) {
  const canvas = document.createElement("canvas");
  canvas.width = width; // high res for crispness
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // --- REFINED STYLES AND LAYOUT TO MATCH THE IMAGE ---

  const cardPadding = 20;
  const cardX = cardPadding;
  const cardY = cardPadding;
  const cardW = width - 2 * cardPadding;
  const cardH = height - 2 * cardPadding;
  const cardRadius = 160;

  // 1. Card Background: Set to the light beige/grey color from your image
  ctx.clearRect(0, 0, width, height); 
  ctx.save();
  ctx.fillStyle = "#E2E1DC"; // Light beige/off-white background
  ctx.globalAlpha = 1.0;
  roundRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
  ctx.fill();
  ctx.restore();

  // Border (Kept from previous style, slightly adjusted color for contrast)
  ctx.save();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#D1CDC4"; // Light, subtle border color
  roundRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
  ctx.stroke();
  ctx.restore();

  // Content positioning relative to the inner card space
  const contentInnerPadding = 100;
  const contentStartX = cardX + contentInnerPadding;
  const contentStartY = cardY + contentInnerPadding; // Top content starting Y
  const contentMaxW = cardW - 2 * contentInnerPadding;

  // Icon area (TOP ALIGNED)
  const iconSize = Math.floor(width * 0.10); // Significantly larger icon
  const iconX = contentStartX + 10;
  const iconY = contentStartY + 10;

  // Title and Desc (BOTTOM ALIGNED)

  // Setup text styles to calculate required height
  const titleFontSize = Math.floor(width * 0.061); 
  const descFontSize = Math.floor(width * 0.052); 
  const lineHeight = Math.floor(width * 0.058); 
  const titleSpacing = 50; 
  const textBlockBottomPadding = 70; 

  // --- 1. Calculate Description Height (Needed for total block position) ---
  ctx.font = `${descFontSize}px Arial`;
  const words = desc.split(" ");
  let line = "";
  let lineCount = 0;
  
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > contentMaxW && n > 0) {
      line = words[n] + " ";
      lineCount++;
    } else {
      line = testLine;
    }
  }
  lineCount++; // Count the last line
  const descHeight = lineCount * lineHeight;
  
  // --- 2. Calculate Total Text Block Height and Position ---
  const titleHeight = titleFontSize * 1.2; // Approximate title line height for spacing
  const totalTextHeight = titleHeight + titleSpacing + descHeight;

  // Calculate the starting Y for the whole text block (aligned to the bottom)
  const textBlockStartY = cardY + cardH - totalTextHeight - textBlockBottomPadding;
  
  // --- 3. Draw Text Block ---
  
  // Title
  ctx.save();
  ctx.fillStyle = "#1A1A1A"; // Dark Title Color
  ctx.font = `bold ${titleFontSize}px "Archivo", Arial`;
  ctx.textBaseline = "top";
  const titleY = textBlockStartY;
  ctx.fillText(title, contentStartX, titleY);
  ctx.restore();

  // Desc (wrapped)
  ctx.save();
  ctx.fillStyle = "#595959"; // Medium Grey Description Color
  ctx.font = `${descFontSize}px Arial`;
  ctx.textBaseline = "top";

  let drawDescY = titleY + titleHeight + titleSpacing;
  
  line = ""; // Reset line for drawing
  for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > contentMaxW && n > 0) {
          ctx.fillText(line, contentStartX, drawDescY);
          line = words[n] + " ";
          drawDescY += lineHeight;
      } else {
          line = testLine;
      }
  }
  ctx.fillText(line, contentStartX, drawDescY);
  ctx.restore();

  // Return canvas
  // Store the icon drawing area on the canvas object for Media.createCanvasTexture to use
  canvas.__iconArea = { x: iconX, y: iconY, w: iconSize, h: iconSize }; 
  return canvas;
}


/* ----------------- Media (one card plane) ----------------- */
class Media {
  constructor({
    geometry,
    gl,
    index,
    length,
    renderer,
    scene,
    screen,
    viewport,
    bend,
    cardData,
    borderRadius = 0.05,
    offsetY = 0
  }) {
    autoBind(this);
    this.extra = 0;
    this.geometry = geometry;
    this.gl = gl;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;
    this.bend = bend;
    this.cardData = cardData;
    this.borderRadius = borderRadius;
    this.offsetY = offsetY; 

    this.createCanvasTexture();
    this.createShader();
    this.createMesh();
    this.onResize();
  }

  createCanvasTexture() {
    // Create card canvas
    const canvas = createCardCanvas({
      iconSrc: this.cardData.icon,
      title: this.cardData.title,
      desc: this.cardData.desc,
      width: 1560,
      height: 1950
    });

    // Create texture and set image to canvas
    this.texture = new Texture(this.gl, { generateMipmaps: true });
    this.texture.image = canvas;

    // Load icon image and draw onto canvas when ready
    if (this.cardData.icon) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = this.cardData.icon;
      img.onload = () => {
        const ctx = canvas.getContext("2d");
        // Retrieve the stored icon area from the canvas object
        const area = canvas.__iconArea || { x: 70, y: 80, w: 64, h: 64 }; 
        
        // fit icon inside the area preserving aspect
        const { w: tw, h: th } = { w: img.naturalWidth, h: img.naturalHeight };
        const scale = Math.min(area.w / tw, area.h / th);
        const dw = tw * scale;
        const dh = th * scale;
        const dx = area.x + (area.w - dw) / 2;
        const dy = area.y + (area.h - dh) / 2;
        
        // Draw the icon onto the canvas
        ctx.save();
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();

        // update texture image and mark needs update
        // We set image again to re-upload the texture to the GPU with the icon now drawn
        this.texture.image = canvas;
        this.texture.needsUpdate = true;
      };
      // if fail, let placeholder remain
    }
  }

  createShader() {
    // store reference to the card texture (canvas)
    const tex = this.texture;

    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          // subtle wobble for organic feel
          p.z = (sin(p.x * 4.0 + uTime) * 1.0 + cos(p.y * 2.0 + uTime) * 1.0) * (0.05 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;

        // rounded box SDF (antialiased)
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          // Keep aspect fit behavior similar to earlier
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );

          vec4 color = texture2D(tMap, uv);

          // rounded mask
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);

          // output
          gl_FragColor = vec4(color.rgb, color.a * alpha);
          if (gl_FragColor.a < 0.01) discard;
        }
      `,
      uniforms: {
        tMap: { value: tex },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [this.texture.image.width, this.texture.image.height] },
        uSpeed: { value: 0 },
        uTime: { value: Math.random() * 100 },
        uBorderRadius: { value: this.borderRadius }
      },
      transparent: true
    });
  }

  createMesh() {
    this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program });
    this.plane.setParent(this.scene);
  }

  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    // Apply circular bend calculation
    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);
      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    // Apply the stored vertical offset (offsetY) AFTER the bend calculation.
    this.plane.position.y += this.offsetY; 

    this.speed = scroll.current - scroll.last;
    if (this.program.uniforms.uTime) this.program.uniforms.uTime.value += 0.03;
    if (this.program.uniforms.uSpeed) this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === "right" && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === "left" && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }

  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
      }
    }

    // scale card size relative to screen as before
    this.scale = this.screen.height / 1500;
    this.plane.scale.y = (this.viewport.height * (900 * this.scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (700 * this.scale)) / this.screen.width;

    if (this.program.uniforms.uPlaneSizes) {
      this.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    }
    if (this.program.uniforms.uImageSizes) {
      this.program.uniforms.uImageSizes.value = [this.texture.image.width, this.texture.image.height];
    }

    this.padding = 2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

/* ----------------- App (gallery) ----------------- */
class App {
  constructor(
    container,
    {
      items,
      bend = 3,
      borderRadius = 0.05,
      scrollSpeed = 2,
      scrollEase = 0.05,
      headingRef, paraRef
    } = {}
  ) {
    this.headingRef = headingRef;
  this.paraRef = paraRef;
    autoBind(this);
    this.container = container;
    this.items = items || [];
    this.bend = bend;
    this.borderRadius = borderRadius;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck, 200);

    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(this.items, this.bend);
    this.update();
    this.addEventListeners();
  }

  createRenderer() {
    // Safari detection for optimization
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    this.renderer = new Renderer({
      alpha: true,
      antialias: isMobile ? false : (isSafari ? true : false), // Disable antialias on mobile, enable on Safari desktop
      dpr: Math.min(window.devicePixelRatio || 1, 2) // Cap at 2 for better performance
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, { heightSegments: 50, widthSegments: 100 });
  }

  createMedias(items, bend = 1) {
    const galleryItems = items && items.length ? items : [];
    // duplicate to make infinite scroll
    this.mediasImages = galleryItems.concat(galleryItems);

    // Calculate the vertical offset for each card.
    const verticalOffsetValue = 0.5; 
    
    this.medias = this.mediasImages.map((data, index) => {
      // Logic for alternating up/down: 
      // index % 2 === 0 (even) -> 1 * offset
      // index % 2 === 1 (odd) -> -1 * offset
      const offsetSign = (index % 2 === 0) ? -1 : 1;
      const offsetY = offsetSign * verticalOffsetValue;

      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        cardData: { icon: data.icon, title: data.title, desc: data.desc },
        borderRadius: this.borderRadius,
        offsetY: offsetY // Pass the calculated offset
      });
    });
  }

  onTouchDown(e) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = e.touches ? e.touches[0].clientX : e.clientX;
  }
  onTouchMove(e) {
    if (!this.isDown) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const distance = (this.start - x) * (this.scrollSpeed * 0.08);
    this.scroll.target = this.scroll.position + distance;
  }
  onTouchUp() {
    this.isDown = false;
    this.onCheck();
  }

  onWheel(e) {
    const delta = e.deltaY || e.wheelDelta || e.detail;
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
  }

  onCheck() {
  if (!this.medias || !this.medias[0]) return;

  const cardWidth = this.medias[0].width;
  const groupSize = 3;
  const snapWidth = cardWidth * groupSize;

  // Calculate nearest group index
  const groupIndex = Math.round(Math.abs(this.scroll.target) / snapWidth);
  const snapTarget = snapWidth * groupIndex;
  this.scroll.target = this.scroll.target < 0 ? -snapTarget : snapTarget;

  // --- Update heading/paragraph dynamically ---
  const slideIndex = groupIndex % slideTexts.length;
  const nextHeading = slideTexts[slideIndex].heading;
  const nextParagraph = slideTexts[slideIndex].paragraph;

  if (this.headingRef?.current && this.paraRef?.current) {
    const headingEl = this.headingRef.current;
    const paraEl = this.paraRef.current;

    // Clear any previous SplitText instances
    if (headingEl.split) headingEl.split.revert();
    if (paraEl.split) paraEl.split.revert();

    const tl = gsap.timeline();

    // Fade & blur out existing text
    tl.to([headingEl, paraEl], {
      opacity: 0,
      filter: "blur(6px)",
      y: 10,
      duration: 0.4,
      ease: "power2.out",
      onComplete: () => {
        headingEl.textContent = nextHeading;
        paraEl.textContent = nextParagraph;

        // Split new text
        headingEl.split = new SplitText(headingEl, { type: "words" });
        paraEl.split = new SplitText(paraEl, { type: "lines" });

        // Set initial states for new split parts
        gsap.set(headingEl.split.words, {
          opacity: 0,
          y: 50,
          filter: "blur(4px)",
        });
        gsap.set(paraEl.split.lines, {
          opacity: 0,
          y: 40,
          filter: "blur(4px)",
        });
      },
    });

    // Animate new text in with word & line staggering
    tl.to(
      headingEl.split?.words || headingEl,
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.2,
      },
      "+=0.1"
    ).to(
      paraEl.split?.lines || paraEl,
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.2,
      },
      "-=0.3"
    );
  }
}




  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach((media) => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }
  }

  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? "right" : "left";
    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);

    window.addEventListener("resize", this.boundOnResize);
    // window.addEventListener("wheel", this.boundOnWheel);
    window.addEventListener("mousedown", this.boundOnTouchDown);
    window.addEventListener("mousemove", this.boundOnTouchMove);
    window.addEventListener("mouseup", this.boundOnTouchUp);
    window.addEventListener("touchstart", this.boundOnTouchDown, { passive: true });
    window.addEventListener("touchmove", this.boundOnTouchMove, { passive: true });
    window.addEventListener("touchend", this.boundOnTouchUp, { passive: true });
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.boundOnResize);
    window.removeEventListener("wheel", this.boundOnWheel);
    window.removeEventListener("mousedown", this.boundOnTouchDown);
    window.removeEventListener("mousemove", this.boundOnTouchMove);
    window.removeEventListener("mouseup", this.boundOnTouchUp);
    window.removeEventListener("touchstart", this.boundOnTouchDown);
    window.removeEventListener("touchmove", this.boundOnTouchMove);
    window.removeEventListener("touchend", this.boundOnTouchUp);
    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
    }
  }
}

/* ----------------- Exported Component ----------------- */
export default function CircularGalleryCardsOgl({
  items = null,
  bend = 0,
  borderRadius = 0.05,
  scrollSpeed = 2,
  scrollEase = 0.05,
  headingRef,
  paraRef
}) {
  const containerRef = useRef(null);

  useEffect(() => {
  const feed = items && items.length ? items : defaultFeatures;
  const app = new App(containerRef.current, { 
    items: feed, 
    bend, 
    borderRadius, 
    scrollSpeed, 
    scrollEase, 
    headingRef,      // ✅ forward the refs
    paraRef          // ✅ forward the refs
  });

  return () => {
    app.destroy();
  };
}, [items, bend, borderRadius, scrollSpeed, scrollEase, headingRef, paraRef]);


  // IMPORTANT: Ensure the parent div of this component gives it a defined width and height (e.g., h-screen w-full)
  return <div ref={containerRef} className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing scale-125" />;
}