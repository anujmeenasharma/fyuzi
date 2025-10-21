"use client";
import Magnet from "@/components/Magnet";
import useLenis from "@/lib/hooks/useLenis";
import gsap from "gsap";
import { useRef } from "react";

const Page = () => {
  const hoverElements = useRef([]);
  const modeDivH1s = useRef([]);

  useLenis();
  const data = [
    { name: "Site from scratch" },
    { name: "Ai Automation" },
    { name: "Influencer Marketing" },
    { name: "Influencer research" },
    { name: "Social Media Management" },
  ];

  if (modeDivH1s.current.length !== data.length) {
    modeDivH1s.current = Array(data.length)
      .fill()
      .map(() => []);
  }

  const handleMouseEnter = (idx) => {
    if (modeDivH1s.current[idx]) {
      gsap.to(modeDivH1s.current[idx], {
        yPercent: -100,
        duration: 0.4,
        ease: "power2.inOut",
        stagger: 0,
      });
    }
  };

  const handleMouseLeave = (idx) => {
    if (modeDivH1s.current[idx]) {
      gsap.to(modeDivH1s.current[idx], {
        yPercent: 0,
        duration: 0.4,
        ease: "power2.inOut",
        stagger: 0,
      });
    }
  };

  return (
    <div className="min-h-screen w-full inter px-20 space-y-10 tracking-tighter pb-32 text-white">
      <h1 className="text-8xl font-medium text-center text-white pt-[20vh]">
        Hey! Tell us all <br />
        the things
      </h1>
      <p className="text-3xl pt-20 text-white">I&apos;m interested in.</p>
      <div className="selectionDivs flex flex-wrap gap-4 w-[65%]">
        {data.map((item, index) => (
          <Magnet magnetStrength={5} padding={5} key={index}>
            <div
              ref={el => (hoverElements.current[index] = el)}
              className="px-6 py-2 border-[1px] rounded-full text-2xl inline-block cursor-pointer text-white"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              <div className="h-8 overflow-hidden">
                <h1
                  ref={el => (modeDivH1s.current[index][0] = el)}
                  style={{ transform: "translateY(0%)" }}
                  className="text-white"
                >
                  {item.name}
                </h1>
                <h1
                  ref={el => (modeDivH1s.current[index][1] = el)}
                  style={{ transform: "translateY(0%)" }}
                  className="text-white"
                >
                  {item.name}
                </h1>
              </div>
            </div>
          </Magnet>
        ))}
      </div>
      <form className="inputs">
        <div className="space-y-10">
          <input
            className="block border-b-[1px] border-white/70 text-3xl py-6 w-[70%] outline-0 text-white placeholder-white"
            type="text"
            placeholder="Name"
            name="name"
          />
          <input
            className="block border-b-[1px] border-white/70 text-3xl py-6 w-[70%] outline-0 text-white placeholder-white"
            type="text"
            placeholder="Email"
            name="email"
          />
          <input
            className="block border-b-[1px] border-white/70 text-3xl py-6 w-[70%] outline-0 text-white placeholder-white"
            type="text"
            placeholder="Tell me about your project"
            name="project"
          />
        </div>
        <button
          type="submit"
          className="border-[1px] cursor-pointer border-white/70 text-2xl py-6 px-32 rounded-full mt-20 text-white"
        >
          Send request
        </button>
      </form>
    </div>
  );
};

export default Page;
