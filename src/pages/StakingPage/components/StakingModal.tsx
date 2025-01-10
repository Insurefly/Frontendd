import { useEffect, useState } from "react";
import useModal from "../../../hooks/useModal";
import { ethers } from "ethers";

export default function StakingModal() {
  const modal = useModal();

  const [totalStaked, setTotalStaked] = useState(ethers.BigNumber.from("1000000000000000000")); // Mocked: 1 ETH
  const [totalRewardRate, setTotalRewardRate] = useState(ethers.BigNumber.from("50000000000000000")); // Mocked: 0.05 ETH/month
  const [amount, setAmount] = useState<string>("0"); // Track input value as a string

  useEffect(() => {
    // Mock initialization
    setTotalStaked(ethers.BigNumber.from("1000000000000000000")); // 1 ETH
    setTotalRewardRate(ethers.BigNumber.from("50000000000000000")); // 0.05 ETH/month
  }, []);

  function calculateEarning() {
    if (!totalStaked || !totalRewardRate || !amount) return 0;

    const _amount = ethers.utils.parseEther(amount || "0");
    const finalStaked = _amount.add(totalStaked);

    const reward = totalRewardRate
      .mul(_amount)
      .mul(30 * 60 * 60 * 24) // Mock: 30 days
      .div(finalStaked);

    return Number(ethers.utils.formatEther(reward));
  }

  async function stake(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const parsedAmount = ethers.utils.parseEther(amount);

    // Mock staking: update state to simulate contract interaction
    setTotalStaked(totalStaked.add(parsedAmount));

    console.log(`Mock Staking: ${amount} ETH`);
    modal.hide();
  }

  return (
    <div className="relative flex min-w-[30%] flex-col items-center overflow-hidden rounded-xl bg-back pb-8">
      <button
        className="absolute right-4 top-4 scale-110 text-back duration-300 hover:scale-125"
        onClick={() => {
          modal.hide();
        }}
      >
        <span className="material-icons">&#xe5cd;</span>
      </button>
      <h2 className="mb-10 self-stretch bg-primary py-10 text-center font-raleway text-4xl font-bold tracking-tighter text-white">
        Overview
      </h2>
      <h4 className="text-md mb-2 px-10 font-medium">Stake</h4>
      <form
        onSubmit={stake}
        className="flex min-w-[40%] gap-x-2 gap-y-2 rounded-2xl px-10"
      >
        <div className="order-opacity-50 flex flex-row items-center rounded-xl border border-front">
          <span className="border border-r-front px-2 py-2 text-4xl">
            <img src="/logo.png" alt="logo" className="w-[1.5ch]" />
          </span>
          <input
            required
            type="number"
            value={amount} // Bind input value to state
            onChange={(e) => setAmount(e.target.value)} // Update state on input change
            placeholder="Enter the number of stakes"
            className="text-md w-full px-2"
            step={0.00001}
            min={0.00001}
            max={9999}
          />
        </div>
        <button className="w-max self-center rounded-lg border border-primary bg-primary bg-opacity-10 px-6 py-2 font-medium text-primary duration-500 hover:-translate-y-1 hover:bg-opacity-100 hover:text-background">
          Stake
        </button>
      </form>
      <div className="flex flex-col gap-y-2 px-10 py-8">
        <h6>You will receive:</h6>
        <div className="flex flex-row justify-center gap-x-8">
          <div className="flex aspect-square flex-col items-center justify-center rounded-full border-4 border-primary px-2 py-1 text-front">
            <span className="text-3xl font-bold">
              {calculateEarning().toFixed(2)}
            </span>
            <span>Wing-coins</span>
            <span className="text-xs text-front text-opacity-60">/month</span>
          </div>
        </div>
      </div>
    </div>
  );
}
