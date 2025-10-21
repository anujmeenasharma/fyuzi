"use client";

import { useState } from "react";

const vwToPx = (vw) => {
  if (typeof window !== "undefined") {
    return (vw / 100) * window.innerWidth;
  }
  return (vw / 100) * 1920;
};

const GlassElement = ({
  height = 2,
  width = 8,
  depth = 10,
  radius = 20,
  strength = 100,
  chromaticAberration = 0,
  blur = 2,
  children,
  debug = false,
}) => {
  const [clicked, setClicked] = useState(false);
  const activeDepth = depth / (clicked ? 0.7 : 1);

  const pxHeight = typeof window !== "undefined" ? vwToPx(height) : (height / 100) * 1920;
  const pxWidth = typeof window !== "undefined" ? vwToPx(width) : (width / 100) * 1920;

  const getDisplacementMap = () => {
    const svg = `<svg height="${pxHeight}" width="${pxWidth}" viewBox="0 0 ${pxWidth} ${pxHeight}" xmlns="http://www.w3.org/2000/svg">
      <style>.mix { mix-blend-mode: screen; }</style>
      <defs>
        <linearGradient id="Y" x1="0" x2="0" y1="${Math.ceil((radius / pxHeight) * 15)}%" y2="${Math.floor(100 - (radius / pxHeight) * 15)}%">
          <stop offset="0%" stop-color="#0F0" />
          <stop offset="100%" stop-color="#000" />
        </linearGradient>
        <linearGradient id="X" x1="${Math.ceil((radius / pxWidth) * 15)}%" x2="${Math.floor(100 - (radius / pxWidth) * 15)}%" y1="0" y2="0">
          <stop offset="0%" stop-color="#F00" />
          <stop offset="100%" stop-color="#000" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" height="${pxHeight}" width="${pxWidth}" fill="#808080" />
      <g filter="blur(2px)">
        <rect x="0" y="0" height="${pxHeight}" width="${pxWidth}" fill="#000080" />
        <rect x="0" y="0" height="${pxHeight}" width="${pxWidth}" fill="url(#Y)" class="mix" />
        <rect x="0" y="0" height="${pxHeight}" width="${pxWidth}" fill="url(#X)" class="mix" />
        <rect x="${activeDepth}" y="${activeDepth}" height="${pxHeight - 2 * activeDepth}" width="${pxWidth - 2 * activeDepth}" fill="#808080" rx="${radius}" ry="${radius}" filter="blur(${activeDepth}px)" />
      </g>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  const getDisplacementFilter = () => {
    const displacementMapUrl = getDisplacementMap();
    const svg = `<svg height="${pxHeight}" width="${pxWidth}" viewBox="0 0 ${pxWidth} ${pxHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="displace" color-interpolation-filters="sRGB">
          <feImage x="0" y="0" height="${pxHeight}" width="${pxWidth}" href="${displacementMapUrl}" result="displacementMap" />
          <feDisplacementMap transform-origin="center" in="SourceGraphic" in2="displacementMap" scale="${strength + chromaticAberration * 2}" xChannelSelector="R" yChannelSelector="G" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="displacedR" />
          <feDisplacementMap in="SourceGraphic" in2="displacementMap" scale="${strength + chromaticAberration}" xChannelSelector="R" yChannelSelector="G" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="displacedG" />
          <feDisplacementMap in="SourceGraphic" in2="displacementMap" scale="${strength}" xChannelSelector="R" yChannelSelector="G" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="displacedB" />
          <feBlend in="displacedR" in2="displacedG" mode="screen"/>
          <feBlend in2="displacedB" mode="screen"/>
        </filter>
      </defs>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}#displace`;
  };

  const style = {
    height: `${height}vw`,
    width: `${width}vw`,
    mixBlendMode: "diffrence",
    backdropFilter: `blur(${blur / 2}px) url('${getDisplacementFilter()}') blur(${blur}px) brightness(1.1) saturate(1.5)`,
    WebkitBackdropFilter: `blur(${blur / 2}px) url('${getDisplacementFilter()}') blur(${blur}px) brightness(1.1) saturate(1.5)`,
    background: debug ? `url("${getDisplacementMap()}")` : "rgba(255, 255, 255, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    userSelect: "none",
    position: "relative",
    overflow: "hidden",
  };

  return (
    <div
      style={style}
      onMouseDown={() => setClicked(true)}
      onMouseUp={() => setClicked(false)}
      onMouseLeave={() => setClicked(false)}
    >
      {children}
    </div>
  );
};

export default function GlassDemo() {
  return (
    <div className="min-h-screen absolute left-1/2 -translate-x-1/2">
        <GlassElement
          width={7.2}
          height={1}
          depth={0.8}
          radius={30}
          strength={20}
          chromaticAberration={5}
          blur={1}
        >
        </GlassElement>
    </div>
  );
}