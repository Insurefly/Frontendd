import useModal from "../../../hooks/useModal";
import AddLand from "./modals/AddLand";

export default function Header() {
  const modal = useModal();
  return (
    <header className="p-page my-3 flex items-stretch">
      <div
        className="relative flex h-max basis-2/3 items-end before:absolute before:bottom-0 before:left-0 before:-z-1 before:h-[90%] before:w-[95%] before:rounded-3xl before:bg-primary
      before:bg-opacity-70 before:content-visible"
      >
        <div className="flex">
          <div className="w-min pb-8 pl-10 pt-12">
          <h1 className="whitespace-nowrap text-xl font-semibold tracking-wider text-back">
            Welcome Back to WingSurance
         </h1>
        <p className="my-3 text-xs font-medium text-back text-opacity-80">
         We hope your recent travels have been absolutely wonderful! If anything 
         unexpected occurred, don’t hesitate to make a claim.  
         <br />
        Ensure all your upcoming trips are registered and insured with us for a 
        worry-free travel experience.
        </p>
            <button className="rounded-md bg-secondary px-4 py-1 font-medium text-back shadow duration-300 hover:-translate-y-1 hover:shadow-lg hover:brightness-110">
              Learn More
            </button>
          </div>
        </div>
        <div
          className="pointer-events-none relative h-full flex-1 selection:hidden"
          draggable={false}
        >
          <div className="absolute left-0 top-0 z-1 h-3/4 w-3/4 content-visible" />
          <img
            src="/images/plane.webp"
            alt="flights across the world"
            className="pointer-events-none object-bottom selection:hidden"
            draggable={false}
          />
        </div>
      </div>
      <div className="flex max-h-full min-h-full flex-1 flex-col items-center justify-between gap-y-2 px-14 py-10">
        <button
          onClick={() => {
            modal.show(<AddLand />);
          }}
          className="flex items-center justify-between rounded-xl bg-primary bg-opacity-20 p-3 px-6 text-2xl text-primary duration-300 hover:bg-opacity-70 hover:text-back"
        >
          <img
            src="/images/placeholder-land.png"
            alt="land"
            className="w-[38%]"
          />
          <h3 className="font-raleway font-semibold tracking-tight">
            Add Flight
          </h3>
        </button>
        <button className="relative flex items-center justify-between rounded-xl bg-secondary bg-opacity-20 p-3 px-6 text-2xl text-secondary duration-300 hover:bg-opacity-70 hover:text-back">
          <img src="/images/ruined-land.png" alt="land" className="w-[38%]" />
          <h3 className="font-raleway font-semibold tracking-tight">
            Make Claim
          </h3>
        </button>
      </div>
    </header>
  );
}
