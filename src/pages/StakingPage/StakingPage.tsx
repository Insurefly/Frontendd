import useModal from "../../hooks/useModal";
import StakingModal from "./components/StakingModal";
import WithdrawModal from "./components/WithdrawModal";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function StakingPage() {
  const modal = useModal();

  const [address, setAddress] = useState<string | null>();
  const [stakedValue, setStakedValue] = useState<string>("0");
  const [monthlyReward, setMonthlyReward] = useState<string>("0");



  return (
    <>
      <section className="p-page">
        <h1 className="flex items-center gap-x-3 font-raleway text-4xl font-semibold tracking-tight">
          <span className="material-icons text-5xl">&#xe871;</span> Staking
          Dashboard
        </h1>
        <div className="my-6 flex justify-between">
          <p className="flex items-center gap-x-2 rounded-lg bg-secondary bg-opacity-10 px-3 py-1 text-sm">
            <span className="material-icons text-3xl text-primary">
              &#xf8ff;
            </span>
            {address}
          </p>
          <div className="flex items-center gap-x-6">
            <button
              onClick={() => modal.show(<WithdrawModal />)}
              className="flex items-center gap-x-1 rounded-lg border border-secondary bg-secondary bg-opacity-10 px-5 py-1 font-medium tracking-tight text-secondary duration-500 hover:bg-opacity-100 hover:text-background"
            >
              <span className="material-icons text-3xl">&#xe8fb;</span> Withdraw
            </button>
            <button
              className="flex items-center gap-x-1 rounded-lg border border-primary bg-primary bg-opacity-10 px-5 py-1 font-medium tracking-tight text-primary duration-500 hover:bg-opacity-100 hover:text-background"
              onClick={() => modal.show(<StakingModal />)}
            >
              <span className="material-icons text-3xl">&#xe147;</span> Stake
            </button>
          </div>
        </div>
      </section>
      <section className="p-page my-14 flex justify-between">
        <div className="mx-auto flex w-[49%] flex-col  items-center rounded-[3rem] bg-foreground bg-opacity-10 p-8">
          <div
            className=" before:absolute-center pointer-events-none relative flex aspect-square min-w-[60%] flex-col items-center justify-center gap-y-3 rounded-full bg-red-600 bg-opacity-70 
          font-raleway text-xl font-medium tracking-tight text-back text-opacity-80 selection:hidden before:h-full before:w-full before:scale-110
          before:rounded-full before:border-[8px] before:border-primary before:content-visible"
          >
            <p>Staked Value</p>
            <h5 className="bg-gradient-to-br bg-clip-text font-poppins text-7xl text-back text-opacity-100">
              0.0375
            </h5>
            <p>ETH</p>
          </div>
        </div>
      </section>
      <section className="p-page text-center font-raleway font-semibold tracking-tight text-primary">
        <p>
          You're ranking in about
          <span className="font-poppins text-lg text-primary">
            {" "}
            300 WING-COINs{" "}
          </span>
          every months
        </p>
      </section>
    </>
  );
}
