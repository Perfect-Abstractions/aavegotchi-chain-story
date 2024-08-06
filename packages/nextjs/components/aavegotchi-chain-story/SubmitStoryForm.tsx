import { FormEvent } from "react";

export const SubmitStoryForm = ({ writeAavegotchiChainStoryAsync, refetchAll }: any) => {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const authorName = formData.get("authorName")?.toString();
    const authorContact = formData.get("authorContact")?.toString();
    const note = formData.get("note")?.toString();
    const storyPart = formData.get("storyPart")?.toString();
    const gltrAmount = BigInt(Number(formData.get("gltrAmount")));

    await writeAavegotchiChainStoryAsync({
      functionName: "submitStoryPart",
      args: [authorName, authorContact, note, storyPart, gltrAmount],
    });

    await refetchAll();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col bg-secondary">
      <p className="text-xl">Create Story Part</p>
      <p>Name</p>
      <input type="text" id="authorName" name="authorName" />
      <p>Contact</p>
      <input type="text" id="authorContact" name="authorContact" />
      <p>Note</p>
      <input type="text" id="note" name="note" />
      <p>Story Part</p>
      <textarea className="h-[200px]" id="storyPart" name="storyPart" />
      <p>Gltr Amount</p>
      <input type="number" id="gltrAmount" name="gltrAmount" />
      <button className="btn btn-primary">Submit</button>
    </form>
  );
};
