"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FeaturesComponent = () => {
    const containerRef = useRef(null);
    const h1Refs = useRef([]);
    const paragraphRef = useRef(null);

    useEffect(() => {
        const h1Elements = h1Refs.current;
        const totalElements = h1Elements.length;

        // Set initial states for fade-up animation
        gsap.set(paragraphRef.current, { y: 100, backdropFilter: 'blur(10px)', opacity: 0 });
        gsap.set(h1Elements, { y: 50, opacity: 0 });

        h1Elements.forEach((h1) => {
            const blackSpan = h1.querySelector('.text-black');
            if (blackSpan) {
                gsap.set(blackSpan, { width: '0%' });
            }
        });

        // Fade-up animations
        gsap.to(paragraphRef.current, {
            y: 0,
            backdropFilter: 'blur(0px)',
            
            opacity: 1,
            duration: 0.8,
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: paragraphRef.current,
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });

        h1Elements.forEach((h1, index) => {
            gsap.to(h1, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: index * 0.001,
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: h1,
                    start: "top 99%",
                }
            });
        });

        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top 20%",
            end: "bottom 70%",
            duration: 10,
            scrub: true,
            ease: "expo.inOut",
            onUpdate: (self) => {
                const totalProgress = self.progress;
                const progressPerElement = 1 / totalElements;

        h1Elements.forEach((h1, index) => {
          const blackSpan = h1.querySelector(".text-black");
          if (blackSpan) {
            const elementStartProgress = index * progressPerElement;
            const elementEndProgress = (index + 1) * progressPerElement;
            let elementProgress = 0;
            if (totalProgress >= elementStartProgress) {
              if (totalProgress <= elementEndProgress) {
                elementProgress =
                  (totalProgress - elementStartProgress) / progressPerElement;
              } else {
                elementProgress = 1;
              }
            }
            gsap.to(blackSpan, {
              width: `${elementProgress * 100}%`,
              duration: 0.1,
              ease: "none",
            });
          }
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !h1Refs.current.includes(el)) {
      h1Refs.current.push(el);
    }
  };

    return (
        <div ref={containerRef} className="h-fit w-full relative py-20">
            <div className='pt-72 w-[80%] mx-auto'>
                <p ref={paragraphRef} className="text-xs uppercase w-[620px] mb-4 text-[#aaa]">
                    Boost	your	Business	Using	the	Power	of	Influencer	Marketing.
                </p>
                <div className="font-archivo">
                    <h1 ref={addToRefs} className="relative text-6xl font-bold font-archivo w-[620px] text-[#aaa] h-[45px] mb-4">
                        <span className="absolute whitespace-nowrap top-0 w-full overflow-hidden left-0">Fyuze	is	the	world&apos;s</span>
                        <span className="absolute whitespace-nowrap top-0 text-black w-[37%] overflow-hidden left-0">Fyuze	is	the	world&apos;s</span>
                    </h1>
                    <h1 ref={addToRefs} className="relative text-6xl font-bold font-archivo w-[620px] text-[#aaa] h-[45px] mb-4">
                        <span className="absolute whitespace-nowrap top-0 w-full overflow-hidden left-0">first	truly	AI-powered</span>
                        <span className="absolute whitespace-nowrap top-0 text-black w-[37%] overflow-hidden left-0">first	truly	AI-powered</span>
                    </h1>
                    <h1 ref={addToRefs} className="relative text-6xl font-bold font-archivo w-[620px] text-[#aaa] h-[45px] mb-4">
                        <span className="absolute whitespace-nowrap top-0 w-full overflow-hidden left-0">influencer	marketing</span>
                        <span className="absolute whitespace-nowrap top-0 text-black w-[37%] overflow-hidden left-0">influencer	marketing</span>
                    </h1>
                    <h1 ref={addToRefs} className="relative text-6xl font-bold font-archivo w-[620px] text-[#aaa] h-[45px] mb-4">
                        <span className="absolute whitespace-nowrap top-0 w-full overflow-hidden left-0">platform,	that	 scans</span>
                        <span className="absolute whitespace-nowrap top-0 text-black w-[37%] overflow-hidden left-0">platform,	that	 scans</span>
                    </h1>
                    <h1 ref={addToRefs} className="relative text-6xl font-bold font-archivo w-[620px] text-[#aaa] h-[45px] mb-4">
                        <span className="absolute whitespace-nowrap top-0 w-full overflow-hidden left-0">the	entire	social</span>
                        <span className="absolute whitespace-nowrap top-0 text-black w-[37%] overflow-hidden left-0">the	entire	social</span>
                    </h1>
                    <h1 ref={addToRefs} className="relative text-6xl font-bold font-archivo w-[620px] text-[#aaa] h-[45px] mb-4">
                        <span className="absolute whitespace-nowrap top-0 w-full overflow-hidden left-0">universe	in	real	time</span>
                        <span className="absolute whitespace-nowrap top-0 text-black w-[37%] overflow-hidden left-0">universe	in	real	time</span>
                    </h1>
                    <h1 ref={addToRefs} className="relative text-6xl font-bold font-archivo w-[620px] text-[#aaa] h-[45px] mb-4">
                        <span className="absolute whitespace-nowrap top-0 w-full overflow-hidden left-0">and	finds you the</span>
                        <span className="absolute whitespace-nowrap top-0 text-black w-[37%] overflow-hidden left-0">and	finds you the</span>
                    </h1>
                    <h1 ref={addToRefs} className="relative text-6xl font-bold font-archivo w-[620px] text-[#aaa] h-[45px] mb-4">
                        <span className="absolute whitespace-nowrap top-0 w-full overflow-hidden left-0">perfect	influencers	</span>
                        <span className="absolute whitespace-nowrap top-0 text-black w-[37%] overflow-hidden left-0">perfect	influencers	</span>
                    </h1>
                    <h1 ref={addToRefs} className="relative text-6xl font-bold font-archivo w-[620px] text-[#aaa] h-[45px] mb-4">
                        <span className="absolute whitespace-nowrap top-0 w-full overflow-hidden left-0">and content creators</span>
                        <span className="absolute whitespace-nowrap top-0 text-black w-[37%] overflow-hidden left-0">and content creators</span>
                    </h1>
                    <h1 ref={addToRefs} className="relative text-6xl font-bold font-archivo w-[620px] text-[#aaa] h-[45px] mb-4">
                        <span className="absolute whitespace-nowrap top-0 w-full overflow-hidden left-0">to work with.</span>
                        <span className="absolute whitespace-nowrap top-0 text-black w-[37%] overflow-hidden left-0">to work with.</span>
                    </h1>
                </div>
            </div>
        </div>
    )
}

export default FeaturesComponent;
