"use client";

// import { FormEvent } from "react";
// import Link from "next/link";
import type { NextPage } from "next";
import { RoundData } from "~~/components/aavegotchi-chain-story/RoundData";
import { SetGltrMinimumForm } from "~~/components/aavegotchi-chain-story/SetGltrMinimumForm";
import { StoryPartVoteForm } from "~~/components/aavegotchi-chain-story/StoryPartVoteForm";
// import { SubmissionCard } from "~~/components/aavegotchi-chain-story/SubmissionCard";
import { SubmissionListCardCard } from "~~/components/aavegotchi-chain-story/SubmissionListCard";
import { SubmissionStoryIdListCard } from "~~/components/aavegotchi-chain-story/SubmissionStoryIdListCard";
import { SubmitStoryForm } from "~~/components/aavegotchi-chain-story/SubmitStoryForm";
// import { useAccount } from "wagmi";
// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContract, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  // const { address: connectedAddress } = useAccount();

  const { data: AavegotchiChainStory } = useScaffoldContract({ contractName: "AavegotchiChainStory" });

  const { writeContractAsync: writeAavegotchiChainStoryAsync } = useScaffoldWriteContract("AavegotchiChainStory");

  const { data: glitterMinimum, refetch: refetchGetGlitterMinimum } = useScaffoldReadContract({
    contractName: "AavegotchiChainStory",
    functionName: "getGltrMinimum",
  });

  const { data: roundData, refetch: refetchRoundData } = useScaffoldReadContract({
    contractName: "AavegotchiChainStory",
    functionName: "getRoundData",
  });

  const { data: roundSubmissions, refetch: refetchRoundSubmissions } = useScaffoldReadContract({
    contractName: "AavegotchiChainStory",
    functionName: "getRoundSubmissions",
    args: [BigInt(0)],
  });

  const { data: lastSubmissions, refetch: refetchLastSubmissions } = useScaffoldReadContract({
    contractName: "AavegotchiChainStory",
    functionName: "getLastSubmissions",
  });

  const { data: roundSubmissionStoryIds, refetch: refetchRoundSubmissionStoryIds } = useScaffoldReadContract({
    contractName: "AavegotchiChainStory",
    functionName: "getRoundSubmissionStoryIds",
    args: [BigInt(0)],
  });

  const { data: lastSubmissionStoryIds, refetch: refetchLastSubmissionStoryIds } = useScaffoldReadContract({
    contractName: "AavegotchiChainStory",
    functionName: "getLastSubmissionStoryIds",
  });

  const { data: canSubmitStoryPart, refetch: refetchCanSubmitStoryPart } = useScaffoldReadContract({
    contractName: "AavegotchiChainStory",
    functionName: "canSubmitStoryPart",
  });

  // const roundSubmissionStoryIdsElements = roundSubmissionStoryIds?.map((id, index) => {
  //   return (
  //     <div key={"round-submission-story-id-" + index} className="flex flex-col">
  //       <p className="text-xl">Round Submission Story Id: {id.toString()}</p>
  //     </div>
  //   );
  // });

  // const lastSubmissionStoryIdsElements = lastSubmissionStoryIds?.map((id, index) => {
  //   return (
  //     <div key={"last-submission-story-id-" + index} className="flex flex-col">
  //       <p className="text-xl">Last Submission Story Id: {id.toString()}</p>
  //     </div>
  //   );
  // });

  // const roundSubmissionsElements = roundSubmissions?.map((roundSubmission, index) => {
  //   return (
  //     <SubmissionCard key={"round-submission-" + index} submission={roundSubmission} cardName="Round Submission" />
  //   );
  // });

  // const lastSubmissionsElements = lastSubmissions?.map((lastSubmission, index) => {
  //   return <SubmissionCard key={"last-submission-" + index} submission={lastSubmission} cardName="Last Submission" />;
  // });

  async function refetchAll() {
    await refetchGetGlitterMinimum();
    await refetchRoundData();
    await refetchRoundSubmissions();
    await refetchLastSubmissions();
    await refetchRoundSubmissionStoryIds();
    await refetchLastSubmissionStoryIds();
    await refetchCanSubmitStoryPart();
  }

  // async function OnStoryPartVote(event: FormEvent<HTMLFormElement>) {
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);
  //   const storyPartId = BigInt(Number(formData.get("storyPartId")!));

  //   await writeAavegotchiChainStoryAsync({
  //     functionName: "storyPartVote",
  //     args: [storyPartId],
  //   });

  //   await refetchAll();
  // }

  // async function OnSetGltrMinimumSubmit(event: FormEvent<HTMLFormElement>) {
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);
  //   const gltrMinimum = BigInt(Number(formData.get("gltrMinimum")!));

  //   await writeAavegotchiChainStoryAsync({
  //     functionName: "setGltrMinimum",
  //     args: [gltrMinimum],
  //   });

  //   await refetchAll();
  // }

  // async function onSubmit(event: FormEvent<HTMLFormElement>) {
  //   event.preventDefault();

  //   const formData = new FormData(event.currentTarget);

  //   const authorName = formData.get("authorName")!.toString();
  //   const authorContact = formData.get("authorContact")!.toString();
  //   const note = formData.get("note")!.toString();
  //   const storyPart = formData.get("storyPart")!.toString();
  //   const gltrAmount = BigInt(Number(formData.get("gltrAmount")!));

  //   await writeAavegotchiChainStoryAsync({
  //     functionName: "submitStoryPart",
  //     args: [authorName, authorContact, note, storyPart, gltrAmount],
  //   });

  //   await refetchAll();
  // }

  async function onClick() {
    await writeAavegotchiChainStoryAsync({
      functionName: "updateRound",
    });

    await refetchAll();
  }

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="flex flex-col space-y-10">
          <p className="text-xl bg-secondary">AavegotchiChainStory Address: {AavegotchiChainStory?.address || "N/A"}</p>
          <p className="text-xl bg-secondary">Gltr Minimum: {glitterMinimum?.toString() || "N/A"}</p>
          <p className="text-2xl bg-secondary">Can Submit Story Part: {canSubmitStoryPart?.toString()}</p>

          <RoundData round={roundData} />

          <SubmissionListCardCard submissions={roundSubmissions} cardName={"Round"} />
          <SubmissionListCardCard submissions={lastSubmissions} cardName={"Last"} />
          <SubmissionStoryIdListCard submissions={roundSubmissionStoryIds} cardName={"Last"} />
          <SubmissionStoryIdListCard submissions={lastSubmissionStoryIds} cardName={"Last"} />

          <SubmitStoryForm writeAavegotchiChainStoryAsync={writeAavegotchiChainStoryAsync} refetchAll={refetchAll} />
          <SetGltrMinimumForm writeAavegotchiChainStoryAsync={writeAavegotchiChainStoryAsync} refetchAll={refetchAll} />
          <StoryPartVoteForm writeAavegotchiChainStoryAsync={writeAavegotchiChainStoryAsync} refetchAll={refetchAll} />

          <button className="btn btn-primary" onClick={onClick}>
            Update Round
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
