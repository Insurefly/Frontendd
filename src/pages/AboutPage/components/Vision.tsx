import React from "react";

export default function Vision() {
  return (
    <section className="relative flex aspect-video flex-col items-center justify-center bg-[url('/images/illustrations/farmland.png')] bg-cover bg-fixed bg-top">
      <div className="absolute left-0 top-0 z-0 flex h-full w-full flex-col items-center bg-gradient-to-b from-transparent via-[#00000099] to-[#00000088] leading-snug tracking-wide" />

      <div className="p-page relative z-1 flex flex-col items-center gap-y-3 text-center text-white drop-shadow-lg">
        <div className="">
          <h1 className="my-8 text-7xl font-bold">OUR VISION</h1>
        </div>
        <div className="">
        <h4 className="">
          {`WingSurance envisions a future where travelers worldwide have seamless access 
           to transparent and reliable flight insurance. By utilizing advanced technologies 
           such as blockchain and Chainlink, we aim to revolutionize the insurance industry 
           and empower travelers to safeguard their journeys effectively. By simplifying the 
           insurance process, fostering transparency, and promoting trust, we strive to 
           contribute to a safer and more confident global travel experience.`}
        </h4>
        <h5 className="">
         {`We aspire to create a user-friendly dApp that enables travelers to 
          easily manage their insurance needs, from selecting coverage options to 
          receiving real-time quotes based on precise travel details. By leveraging 
          blockchain's immutability, we ensure transparency and trust throughout the 
          insurance journey, while our strategic collaborations with industry experts 
          and stakeholders drive ongoing innovation and improvement. With our 
          transformative approach to flight insurance, we aim to provide travelers 
          with the confidence and financial security necessary to make informed 
          decisions, explore the world, and enjoy peace of mind in an ever-changing 
          travel landscape. Together, we can shape a future where travel is safer, 
          and every journey is protected with the tools needed for a worry-free 
          experience.`}
        </h5>

        </div>
      </div>
    </section>
  );
}
