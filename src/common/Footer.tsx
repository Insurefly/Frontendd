import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const hiddenAt = ["/auth"];

export default function Footer() {
  const [hideNav, setHideNav] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setHideNav(hiddenAt.includes(location.pathname));
  }, [location]);

  return (
    <footer
      className={twMerge(
        "p-page relative mt-10 py-20 text-back",
        hideNav ? "hidden" : ""
      )}
    >
      <div className="absolute bottom-6 left-6 right-6 top-6 -z-1 rounded-xl bg-primary brightness-50" />
      <div className="flex justify-between text-sm font-light tracking-tight">
        <div className="flex basis-[25%] flex-col items-center gap-y-5 text-xl">
          <img
            src="/brandv.png"
            alt="wingsurance logo"
          />
        
        </div>

        <div className="flex flex-col">
          <h5 className="font-semibold">Explore</h5>
          <div className="my-7 flex flex-col gap-y-3">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/methodology">Methodology</Link>
            <Link to="/stake">Become a Staker</Link>
          </div>
        </div>
        <div className="flex flex-col">
          <h5 className="font-semibold">For Payee</h5>
          <div className="my-7 flex flex-col gap-y-3">
            <Link to="/auth">Get Insured</Link>
            <Link to="/dashboard">Get a quote</Link>
            <Link to="/dashboard">Payee Dashboard</Link>
          </div>
        </div>
        <div className="flex flex-col">
          <h5 className="font-semibold">Resources</h5>
          <div className="my-7 flex flex-col gap-y-3">
            <Link to="/methodology">How it works</Link>
            <Link to="https://chain.link/">Chainlink</Link>
            <Link to="/calculation">Calculations</Link>
            <Link to="/help">Help</Link>
          </div>
        </div>

        <div className="flex flex-col items-center text-center text-back text-opacity-80">
          <h5 className="my-3 text-4xl font-bold tracking-tighter text-back">
           Sustainably Smart
          </h5>
          <p>We open doors</p>  
          <p>to a future that</p>  
          <p>redefines what’s possible</p>  

          {/* <p className="font-semibold text-back">Annapurna</p> */}
      
        </div>
      </div>
      <div className="my-2 flex gap-x-4">
        <p className="font-raleway text-xl font-bold">Follow Us</p>
        <div className="flex items-center gap-x-3 brightness-0 invert">
          <Link
            to="https://linkedin.com/in/kairveee"
            target="_blank"
            className=""
          >
            <img
              src="https://cdn4.iconfinder.com/data/icons/social-media-outline-3/60/Social-35-Linkedin-Outline-1024.png"
              alt="linkedin"
              className="aspect-square w-[2.5ch]"
            />
          </Link>
          <Link
            to="https://instagram.com/kairveeehh"
            target="_blank"
            className=""
          >
            <img
              src="https://cdn1.iconfinder.com/data/icons/social-media-2481/32/ic-social-media-instagram-128.png"
              alt="instagram"
              className="aspect-square w-[3ch]"
            />
          </Link>
          <Link to="https://www.github.com/kairveeehh" className="">
            <img
              src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-social-github-outline-128.png"
              alt="github"
              className="aspect-square w-[3ch]"
            />
          </Link>
        </div>
      </div>
      <div className="my-2 w-full border border-back"></div>
      <div className="mt-4 text-xs">© WingSurance 2025</div>
    </footer>
  );
}
