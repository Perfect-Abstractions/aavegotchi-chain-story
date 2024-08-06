import { FormEvent } from "react";

export const StoryPartVoteForm = ({ writeAavegotchiChainStoryAsync, refetchAll }: any) => {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const storyPartId = BigInt(Number(formData.get("storyPartId")!));

    await writeAavegotchiChainStoryAsync({
      functionName: "storyPartVote",
      args: [storyPartId],
    });

    await refetchAll();
  }

  return (
    <form className="flex flex-col bg-secondary" onSubmit={onSubmit}>
      <p>Story Part Vote</p>
      <input type="number" id="storyPartId" name="storyPartId" />

      <button className="btn btn-primary">{"Vote"}</button>
    </form>
  );
};
