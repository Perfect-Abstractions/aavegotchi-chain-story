import { FormEvent } from "react";

export const SetGltrMinimumForm = ({ writeAavegotchiChainStoryAsync, refetchAll }: any) => {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const gltrMinimum = BigInt(Number(formData.get("gltrMinimum")!));

    await writeAavegotchiChainStoryAsync({
      functionName: "setGltrMinimum",
      args: [gltrMinimum],
    });

    await refetchAll();
  }

  return (
    <form className="flex flex-col bg-secondary" onSubmit={onSubmit}>
      <p>Gltr Minimum</p>
      <input type="number" id="gltrMinimum" name="gltrMinimum" />

      <button className="btn btn-primary">
        {"Set Gltr Minimum (does not work - admin currently never set on smart contract)"}
      </button>
    </form>
  );
};
