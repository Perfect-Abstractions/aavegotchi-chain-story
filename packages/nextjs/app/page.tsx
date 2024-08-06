"use client";

import type { NextPage } from "next";
import { RoundData } from "~~/components/aavegotchi-chain-story/RoundData";
import { SetGltrMinimumForm } from "~~/components/aavegotchi-chain-story/SetGltrMinimumForm";
import { StoryPartVoteForm } from "~~/components/aavegotchi-chain-story/StoryPartVoteForm";
import { SubmissionListCardCard } from "~~/components/aavegotchi-chain-story/SubmissionListCard";
import { SubmissionStoryIdListCard } from "~~/components/aavegotchi-chain-story/SubmissionStoryIdListCard";
import { SubmitStoryForm } from "~~/components/aavegotchi-chain-story/SubmitStoryForm";
import { useScaffoldContract, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
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

  const { data: publishedStoryParts, refetch: refetchPublishedStoryParts } = useScaffoldReadContract({
    contractName: "AavegotchiChainStory",
    functionName: "getPublishedStoryParts",
  });

  const { data: publishedStoryPartIds, refetch: refetchPublishedStoryPartIds } = useScaffoldReadContract({
    contractName: "AavegotchiChainStory",
    functionName: "getPublishedStoryPartIds",
  });

  async function refetchAll() {
    await refetchGetGlitterMinimum();
    await refetchRoundData();
    await refetchRoundSubmissions();
    await refetchLastSubmissions();
    await refetchRoundSubmissionStoryIds();
    await refetchLastSubmissionStoryIds();
    await refetchCanSubmitStoryPart();
    await refetchPublishedStoryParts();
    await refetchPublishedStoryPartIds();
  }

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
          <SubmissionListCardCard submissions={publishedStoryParts} cardName={"Published"} />
          <SubmissionStoryIdListCard submissions={roundSubmissionStoryIds} cardName={"Round"} />
          <SubmissionStoryIdListCard submissions={lastSubmissionStoryIds} cardName={"Last"} />
          <SubmissionStoryIdListCard submissions={publishedStoryPartIds} cardName={"Published"} />

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
