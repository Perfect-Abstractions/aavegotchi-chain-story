import { FormEvent } from "react";

export const StoryPartVoteForm = ({ writeAavegotchiChainStoryAsync, refetchAll }: any) => {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const storyPartId = BigInt(Number(formData.get("storyPartId")));

    await writeAavegotchiChainStoryAsync({
      functionName: "storyPartVote",
      args: [storyPartId],
    });

    await refetchAll();
  }

  return (
    <form
      className="flex flex-col bg-secondary rounded-lg border-4 border-accent shadow-2xl p-1 text-center"
      onSubmit={onSubmit}
    >
      <p className="text-4xl kanit">Story Part Vote</p>
      <input
        type="number"
        id="storyPartId"
        name="storyPartId"
        placeholder="3"
        className="text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-[#1A0335] dark:border-[#FEF87D] dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />

      <button className="btn btn-primary btn-lg m-2 kanit">{"Vote"}</button>
    </form>
  );
};
