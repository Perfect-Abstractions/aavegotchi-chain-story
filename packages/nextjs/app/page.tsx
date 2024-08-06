"use client";

import { FormEvent } from "react";
// import Link from "next/link";
import type { NextPage } from "next";
// import { SubmissionCard } from "~~/components/aavegotchi-chain-story/SubmissionCard";
import { SubmissionListCardCard } from "~~/components/aavegotchi-chain-story/SubmissionListCard";
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

  const roundSubmissionStoryIdsElements = roundSubmissionStoryIds?.map((id, index) => {
    return (
      <div key={"round-submission-story-id-" + index} className="flex flex-col">
        <p className="text-xl">Round Submission Story Id: {id.toString()}</p>
      </div>
    );
  });

  const lastSubmissionStoryIdsElements = lastSubmissionStoryIds?.map((id, index) => {
    return (
      <div key={"last-submission-story-id-" + index} className="flex flex-col">
        <p className="text-xl">Last Submission Story Id: {id.toString()}</p>
      </div>
    );
  });

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

  async function OnStoryPartVote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const storyPartId = BigInt(Number(formData.get("storyPartId")!));

    await writeAavegotchiChainStoryAsync({
      functionName: "storyPartVote",
      args: [storyPartId],
    });

    await refetchAll();
  }

  async function OnSetGltrMinimumSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const gltrMinimum = BigInt(Number(formData.get("gltrMinimum")!));

    await writeAavegotchiChainStoryAsync({
      functionName: "setGltrMinimum",
      args: [gltrMinimum],
    });

    await refetchAll();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const authorName = formData.get("authorName")!.toString();
    const authorContact = formData.get("authorContact")!.toString();
    const note = formData.get("note")!.toString();
    const storyPart = formData.get("storyPart")!.toString();
    const gltrAmount = BigInt(Number(formData.get("gltrAmount")!));

    await writeAavegotchiChainStoryAsync({
      functionName: "submitStoryPart",
      args: [authorName, authorContact, note, storyPart, gltrAmount],
    });

    await refetchAll();
  }

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="flex flex-col space-y-10">
          <p className="text-xl bg-secondary">AavegotchiChainStory Address: {AavegotchiChainStory?.address || "N/A"}</p>

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

          <form className="flex flex-col bg-secondary" onSubmit={OnSetGltrMinimumSubmit}>
            <p>Gltr Minimum</p>
            <input type="number" id="gltrMinimum" name="gltrMinimum" />

            <button className="btn btn-primary">
              {"Set Gltr Minimum (does not work - admin currently never set on smart contract)"}
            </button>
          </form>

          <p className="text-xl bg-secondary">Gltr Minimum: {glitterMinimum?.toString() || "N/A"}</p>

          <div className="flex flex-col bg-secondary">
            <p className="text-xl">Round Data</p>
            <p>Round: {roundData?.[0].toString()}</p>

            <p>Submission Start Time: {roundData?.[1].toString()}</p>

            <p>Submission End Time: {roundData?.[2].toString()}</p>

            <p>Vote Start Time: {roundData?.[3].toString()}</p>

            <p>Vote End Time: {roundData?.[4].toString()}</p>
          </div>

          {/* <div className="flex flex-col bg-secondary">
            <p className="text-2xl">Round Submissions</p>
            {roundSubmissionsElements}
          </div> */}

          <SubmissionListCardCard submissions={roundSubmissions} cardName={"Round"} />
          <SubmissionListCardCard submissions={lastSubmissions} cardName={"Last"} />

          <div className="flex flex-col bg-secondary">
            <p className="text-2xl">Round Submissions Story Ids</p>
            {roundSubmissionStoryIdsElements}
          </div>

          {/* <div className="flex flex-col bg-secondary">
            <p className="text-2xl">Last Submissions</p>
            {lastSubmissionsElements}
          </div> */}

          <div className="flex flex-col bg-secondary">
            <p className="text-2xl">Last Submissions Story Ids</p>
            {lastSubmissionStoryIdsElements}
          </div>

          <div className="bg-secondary">
            <p className="text-2xl">Can Submit Story Part</p>
            {canSubmitStoryPart?.toString()}
          </div>

          <form className="flex flex-col bg-secondary" onSubmit={OnStoryPartVote}>
            <p>Story Part Vote</p>
            <input type="number" id="storyPartId" name="storyPartId" />

            <button className="btn btn-primary">{"Vote"}</button>
          </form>

          <button
            className="btn btn-primary"
            onClick={async () => {
              await writeAavegotchiChainStoryAsync({
                functionName: "updateRound",
              });

              await refetchAll();
            }}
          >
            {"Update Round"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
