import Image from "next/image";

const PricingScreen = () => {
  return (
    <div className="h-screen pt-12 font-[Inter] bg-[#E2E1DC] flex flex-col justify-center items-center">
      <h1 className="text-7xl font-archivo font-bold leading-none">
        Pricing
      </h1>
      <p className="mt-6 text-sm font-[inter] font-light w-2/5 text-center">
        Search millions of creators in seconds using AI-powered filters:{" "}
        <span className="font-medium">
          audience authenticity, geo-verification, sentiment, engagement
          quality, niche fit, and more.
        </span>
      </p>

      <div className="w-full flex flex-wrap items-center justify-center gap-8 mt-10">
        {/* Starter */}
        <div className="relative w-[22%] group hover:cursor-pointer feature-card">
          {/* Glow Layer */}
          <div
            className="absolute inset-0 rounded-4xl opacity-0 group-hover:opacity-100 transition duration-300 
            before:content-[''] before:absolute before:inset-0 before:rounded-4xl 
            before:bg-[linear-gradient(302.64deg,rgba(221,51,5,0.4)_-0.83%,rgba(255,107,58,0.4)_49.95%,rgba(255,179,71,0.4)_100.74%)] 
            before:blur-[120px] before:opacity-100"
          ></div>

          {/* Actual Card */}
          <div
            className="relative aspect-[4/5] border border-black rounded-4xl p-5 flex flex-col justify-between 
            hover:bg-[#E2E1DC] transition duration-300 group-hover:shadow-xl bg-[#E2E1DC]"
          >
            <div className="text-sm">
              <h1 className="text-3xl leading-none font-archivo font-bold">
                Starter
              </h1>
              <p className="text-[#4F4F4F] font-medium mt-6 mb-3.5">Ideal For</p>
              <p className="text-[#4F4F4F] font-light">
                Small Brands <span className="mx-2">•</span> Individuals
              </p>
            </div>
            <div className="flex gap-3 absolute top-1/2 -translate-y-1/2">
              <h3 className="py-2 px-3 md:py-2.5 md:px-4 border border-[#828282] rounded-full leading-none text-[13px]">
                400 Credits
              </h3>
              <h3 className="py-2 px-3 md:py-2.5 md:px-4 border border-[#828282] rounded-full leading-none text-[13px]">
                $0.12 cost per credit
              </h3>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="text-[#828282] font-light font-archivo">
                <span className="text-3xl text-[#0D0D0D] font-bold">$49</span>
                /Month
              </h1>
              <button className="px-4 py-2.5 bg-[#FF6B3A] text-[12px] rounded-full text-white cursor-pointer leading-tight">
                START NOW
              </button>
            </div>
          </div>
        </div>

        {/* Growth - Recommended */}
        <div className="relative w-[22%] group hover:cursor-pointer feature-card">
          <div
            className="absolute inset-0 rounded-4xl opacity-0 group-hover:opacity-100 transition duration-300 
            before:content-[''] before:absolute before:inset-0 before:rounded-4xl 
            before:bg-[linear-gradient(302.64deg,rgba(221,51,5,0.4)_-0.83%,rgba(255,107,58,0.4)_49.95%,rgba(255,179,71,0.4)_100.74%)] 
            before:blur-[120px] before:opacity-100"
          ></div>

          <div
            className="relative aspect-[4/5] rounded-4xl p-5 flex flex-col justify-between transition duration-300 group-hover:shadow-xl"
            style={{
              background:
                "linear-gradient(302.64deg, #DD3305 -0.83%, #FF6B3A 49.95%, #FFB347 100.74%)",
              color: "white",
            }}
          >
            <div className="text-sm">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl leading-none font-archivo font-bold">
                  Growth
                </h1>
                <div className="flex items-center gap-1 font-bold font-archivo">
                  <Image className="invert" height={24} width={24} alt="logo" src={"/MONOGRAM.svg"} />
                  <span>Recommended</span>
                </div>
              </div>
              <p className="font-medium mt-6 mb-3.5">Ideal For</p>
              <p className="font-light">
                Marketing agencies testing campaigns
              </p>
            </div>
            <div className="flex gap-3 absolute top-1/2 -translate-y-1/2">
              <h3 className="py-2 px-3 md:py-2.5 md:px-4 bg-white text-black rounded-full leading-none text-[13px]">
                1500 Credits
              </h3>
              <h3 className="py-2 px-3 md:py-2.5 md:px-4 bg-white text-black rounded-full leading-none text-[13px]">
                $0.099 cost per credit
              </h3>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="font-light font-archivo">
                <span className="text-3xl font-bold">$149</span>/Month
              </h1>
              <button className="px-4 py-2.5 bg-[#E2E1DC] text-[12px] rounded-full text-black cursor-pointer leading-tight">
                START NOW
              </button>
            </div>
          </div>
        </div>

        {/* Pro */}
        <div className="relative w-[22%] group hover:cursor-pointer feature-card">
          <div
            className="absolute inset-0 rounded-4xl opacity-0 group-hover:opacity-100 transition duration-300 
            before:content-[''] before:absolute before:inset-0 before:rounded-4xl 
            before:bg-[linear-gradient(302.64deg,rgba(221,51,5,0.4)_-0.83%,rgba(255,107,58,0.4)_49.95%,rgba(255,179,71,0.4)_100.74%)] 
            before:blur-[120px] before:opacity-100"
          ></div>

          <div
            className="relative aspect-[4/5] border border-black rounded-4xl p-5 flex flex-col justify-between 
            hover:bg-[#E2E1DC] transition duration-300 group-hover:shadow-xl bg-[#E2E1DC]"
          >
            <div className="text-sm">
              <h1 className="text-3xl leading-none font-archivo font-bold">
                Pro
              </h1>
              <p className="text-[#4F4F4F] font-medium mt-6 mb-3.5">Ideal For</p>
              <p className="text-[#4F4F4F] font-light">
                Larger influencer platforms <span className="mx-2">•</span> SAAS
                Re-Sellers
              </p>
            </div>
            <div className="flex gap-3 absolute top-1/2 -translate-y-1/2">
              <h3 className="py-2 px-3 md:py-2.5 md:px-4 border border-[#828282] rounded-full leading-none text-[13px]">
                5000 Credits
              </h3>
              <h3 className="py-2 px-3 md:py-2.5 md:px-4 border border-[#828282] rounded-full leading-none text-[13px]">
                $0.079 cost per credit
              </h3>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="text-[#828282] font-light font-archivo">
                <span className="text-3xl text-[#0D0D0D] font-bold">$399</span>
                /Month
              </h1>
              <button className="px-4 py-2.5 bg-[#FF6B3A] text-[12px] rounded-full text-white cursor-pointer leading-tight">
                START NOW
              </button>
            </div>
          </div>
        </div>

        {/* Enterprise */}
        <div className="relative w-[22%] group hover:cursor-pointer feature-card">
          <div
            className="absolute inset-0 rounded-4xl opacity-0 group-hover:opacity-100 transition duration-300 
            before:content-[''] before:absolute before:inset-0 before:rounded-4xl 
            before:bg-[linear-gradient(302.64deg,rgba(221,51,5,0.4)_-0.83%,rgba(255,107,58,0.4)_49.95%,rgba(255,179,71,0.4)_100.74%)] 
            before:blur-[120px] before:opacity-100"
          ></div>

          <div
            className="relative aspect-[4/5] border border-black rounded-4xl p-5 flex flex-col justify-between 
            hover:bg-[#E2E1DC] transition duration-300 group-hover:shadow-xl bg-[#E2E1DC]"
          >
            <div className="text-sm">
              <h1 className="text-3xl leading-none font-archivo font-bold">
                Enterprise
              </h1>
              <p className="text-[#4F4F4F] font-medium mt-6 mb-3.5">Ideal For</p>
              <p className="text-[#4F4F4F] font-light">
                Agencies <span className="mx-2">•</span> Enterprises
              </p>
            </div>
            <div className="flex gap-3 absolute top-1/2 -translate-y-1/2">
              <h3 className="py-2 px-3 md:py-2.5 md:px-4 border border-[#828282] rounded-full leading-none text-[13px] text-nowrap">
                10,000+ Credits
              </h3>
              <h3 className="py-2 px-3 md:py-2.5 md:px-4 border border-[#828282] rounded-full leading-none text-[13px] text-nowrap">
                Negotiable (Bulk Rate)
              </h3>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="text-[#FF6B3A] font-bold font-archivo text-2xl">
                Custom
              </h1>
              <button className="px-4 py-2.5 bg-[#FF6B3A] text-[12px] rounded-full text-white cursor-pointer leading-tight">
                CONTACT US
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3 self-end items-center text-sm font-light font-[Inter] px-[2.5%]">
        <h3>ADD-ONS</h3>
        <p className="py-2.5 px-4 border border-[#828282] rounded-full text-[#4F4F4F]">
          Extra credits :{" "}
          <span className="text-xl font-medium leading-none">$0.15</span>/credit
          pay as you go
        </p>
        <p className="py-2.5 px-4 border border-[#828282] rounded-full text-[#4F4F4F]">
          Data enrichment (Audience demographics, Engagement analysis) : Bundle
          at +20% Plan cost
        </p>
      </div>
    </div>
  );
};

export default PricingScreen;
