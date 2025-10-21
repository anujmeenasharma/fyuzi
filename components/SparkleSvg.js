import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function SparkleSvg() {
  const sparkleCont = useRef();
  const tl = useRef(null);
  useEffect(() => {
    const sparkles = sparkleCont.current.querySelectorAll(
      ".sparkle-1, .sparkle-2, .sparkle-3"
    );

    tl.current = gsap.timeline({ paused: true });

    const scales = [1.3, 1.2, 1.1, 1];

    scales.forEach((s, i) => {
      tl.current.to(
        sparkles,
        {
          scale: s,
          duration: 0.4,
          ease: "power1.inOut",
          stagger: 0.15,
        },
        i * 0.2
      );
    });

    tl.current.to(
      sparkles,
      {
        scale: 1,
        duration: 0.3,
        ease: "power1.inOut",
        stagger: 0.15,
      },
      "+=0"
    );

    tl.current.play();
  }, []);
  return (
    <div
      className="relative w-[42px] h-[42px] sparkle-cont cursor-pointer z-100"
      ref={sparkleCont}
      onMouseEnter={() => tl.current.restart()}
    >
      <Image
        src="/assets/sparkle.svg"
        alt="logo"
        width={28}
        height={28}
        className="relative top-[9px] left-[3.94px] sparkle-1"
      />
      <Image
        src="/assets/sparkle.svg"
        alt="logo"
        width={10}
        height={10}
        className="absolute top-[4px] left-[22px] sparkle-2"
      />
      <Image
        src="/assets/sparkle.svg"
        alt="logo"
        width={5}
        height={5}
        className="absolute top-[13px] left-[30px] sparkle-3"
      />
    </div>
  );
}
