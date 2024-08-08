import { FormEvent } from "react";
import { formatEther } from "viem";

export const SetGltrMinimumForm = ({ writeAavegotchiChainStoryAsync, refetchAll, gltrMinimum }: any) => {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const gltrMinimum = BigInt(Number(formData.get("gltrMinimum")));

    await writeAavegotchiChainStoryAsync({
      functionName: "setGltrMinimum",
      args: [gltrMinimum],
    });

    await refetchAll();
  }

  function numberWithCommas(x: any) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <form
      className="flex flex-col bg-secondary rounded-lg border-4 border-accent shadow-2xl p-1 text-center"
      onSubmit={onSubmit}
    >
      <p className="text-4xl kanit">Gltr Minimum</p>
      <input
        type="number"
        id="gltrMinimum"
        name="gltrMinimum"
        placeholder={numberWithCommas(formatEther(gltrMinimum || BigInt(0)))}
        className="text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-[#1A0335] dark:border-[#FEF87D] dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />

      <button className="btn btn-primary btn-lg m-2 kanit">
        {"Set Gltr Minimum (does not work - admin currently never set on smart contract)"}
      </button>
    </form>
  );
};
