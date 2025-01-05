export default function Hero() {
  return (
    <section className="p-page flex h-[calc(100vh_-_8rem)] items-center overflow-hidden">
     <img
  src="/images/family.png"
  alt="Family traveling"
  className="relative w-1/2 bg-transparent object-cover"
/>
      <div className="relative flex basis-1/2 flex-col items-center gap-y-11">
        <div className="flex flex-col items-center gap-y-2 text-center font-raleway text-5xl font-semibold text-primary">
        <h1 className="font-bold brightness-75">
         Travel Smarter, Fly Safer
        </h1>
     <h2 className="saturate-150">for provably fair rates on</h2>
     <h2 className="saturate-150">flight insurance</h2>
    </div>
  <p className="px-2 text-sm">
    At WingSurance, we are revolutionizing the way travelers protect their trips. 
    We understand the challenges and uncertainties that come with air travel, 
    and we are committed to providing innovative solutions through our decentralized 
    application (dApp) powered by Chainlink. <br /> <br /> 
    Our mission is simple: to provide travelers with transparent, reliable, and efficient 
    flight insurance. We believe that every traveler deserves access to affordable insurance 
    that is tailored to their specific needs and backed by advanced technology.
  </p>
      </div>
    </section>
  );
}
