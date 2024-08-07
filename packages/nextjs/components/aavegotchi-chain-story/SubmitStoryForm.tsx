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
    <form
      onSubmit={onSubmit}
      className="flex flex-col bg-secondary rounded-lg border-4 border-accent shadow-2xl p-1 text-center"
    >
      <p className="text-4xl kanit">Submit Story Part</p>
      <p className="text-2xl kanit-light">Name</p>
      <input
        type="text"
        id="authorName"
        name="authorName"
        placeholder="Jacob Homanics"
        className="text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-[#1A0335] dark:border-[#FEF87D] dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      <p className="text-2xl kanit-light">Contact</p>
      <input
        type="text"
        id="authorContact"
        name="authorContact"
        placeholder="x.com/jacobhomanics"
        className="text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-[#1A0335] dark:border-[#FEF87D] dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      <p className="text-2xl kanit-light">Note</p>
      <input
        type="text"
        id="note"
        name="note"
        placeholder="Lets go Aavegotchis!!"
        className="text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-[#1A0335] dark:border-[#FEF87D] dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      <p className="text-2xl kanit-light">Gltr Amount</p>
      <input
        type="number"
        id="gltrAmount"
        name="gltrAmount"
        placeholder="50000000000000"
        className="text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-[#1A0335] dark:border-[#FEF87D] dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />

      <p className="text-2xl kanit-light">Story Part</p>
      <textarea
        id="storyPart"
        name="storyPart"
        placeholder="There once was an Aavegotchi..."
        className="h-[200px] block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-[#1A0335] dark:border-[#FEF87D] dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />

      <button className="btn btn-primary btn-lg m-2 kanit">Submit</button>
    </form>
  );
};
