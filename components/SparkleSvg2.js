import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function SparkleSvg2({ restart = false }) {
  const sparkleCont = useRef();
  const tl = useRef(null);

  useEffect(() => {
    const sparkles = sparkleCont.current.querySelectorAll(
      ".sparkle-1, .sparkle-2, .sparkle-3"
    );

    const timeline = gsap.timeline({ paused: true });

    const scales = [1.3, 1.2, 1.1, 1];
    scales.forEach((s, i) => {
      timeline.to(
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

    timeline.to(
      sparkles,
      {
        scale: 1,
        duration: 0.3,
        ease: "power1.inOut",
        stagger: 0.15,
      },
      "+=0"
    );

    tl.current = timeline;
    timeline.play(); // initial play
  }, []);

  // 🔑 Restart when parent tells us to
  useEffect(() => {
    if (restart && tl.current) {
      tl.current.restart();
    }
  }, [restart]);

  return (
    <div
      className="relative w-[18px] h-[18px] sparkle-cont cursor-pointer z-100 ml-[2px]"
      ref={sparkleCont}
      onMouseEnter={() => tl.current && tl.current.restart()}
    >
      <Image
        src="/assets/grey-sparkle.svg"
        alt="logo"
        width={12.37}
        height={12.37}
        className="relative top-[3.94px] left-[1.69px] sparkle-1"
      />
      <Image
        src="/assets/grey-sparkle.svg"
        alt="logo"
        width={4.29}
        height={4.29}
        className="absolute top-[1.71px] left-[10.29px] sparkle-2"
      />
      <Image
        src="/assets/grey-sparkle.svg"
        alt="logo"
        width={2.14}
        height={2.14}
        className="absolute top-[6.43px] left-[13.71px] sparkle-3"
      />
    </div>
  );
}
