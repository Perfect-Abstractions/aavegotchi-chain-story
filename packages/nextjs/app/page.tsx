"use client";

import type { NextPage } from "next";
import { formatEther } from "viem";
import { RoundData } from "~~/components/aavegotchi-chain-story/RoundData";
import { SetGltrMinimumForm } from "~~/components/aavegotchi-chain-story/SetGltrMinimumForm";
import { StoryPartListCard } from "~~/components/aavegotchi-chain-story/StoryPartListCard";
import { StoryPartVoteForm } from "~~/components/aavegotchi-chain-story/StoryPartVoteForm";
import { SubmissionStoryIdListCard } from "~~/components/aavegotchi-chain-story/SubmissionStoryIdListCard";
import { SubmitStoryForm } from "~~/components/aavegotchi-chain-story/SubmitStoryForm";
import { Address } from "~~/components/scaffold-eth";
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

  function numberWithCommas(x: any) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="flex items-center flex-col space-y-10">
          <p className="text-center text-3xl lg:text-9xl aavegotchi">Avegotchi chain story</p>
          <div className="flex flex-col bg-secondary rounded-lg border-4 border-accent shadow-2xl p-1">
            <p className="text-4xl kanit">Contract Address</p>
            <Address address={AavegotchiChainStory?.address} />
          </div>
          <div className="flex flex-col bg-secondary rounded-lg border-4 border-accent shadow-2xl p-1">
            <p className="text-4xl kanit">Gltr Minimum</p>
            <p className="kanit-light">
              {numberWithCommas(formatEther(glitterMinimum || BigInt(0))).toString() || "N/A"}
            </p>
          </div>

          <div className="flex flex-col bg-secondary rounded-lg border-4 border-accent shadow-2xl p-1">
            <p className="text-4xl">Can Submit Story Part</p>
            <p className="kanit-light">{canSubmitStoryPart?.toString()}</p>
          </div>
          <RoundData round={roundData} />

          <StoryPartListCard storyParts={roundSubmissions} cardName={"Round"} />
          <StoryPartListCard storyParts={lastSubmissions} cardName={"Last"} />
          <StoryPartListCard storyParts={publishedStoryParts} cardName={"Published"} />
          <SubmissionStoryIdListCard storyParts={roundSubmissionStoryIds} cardName={"Round"} />
          <SubmissionStoryIdListCard storyParts={lastSubmissionStoryIds} cardName={"Last"} />
          <SubmissionStoryIdListCard storyParts={publishedStoryPartIds} cardName={"Published"} />

          <SubmitStoryForm
            writeAavegotchiChainStoryAsync={writeAavegotchiChainStoryAsync}
            refetchAll={refetchAll}
            gltrMinimum={glitterMinimum}
          />
          <SetGltrMinimumForm
            writeAavegotchiChainStoryAsync={writeAavegotchiChainStoryAsync}
            refetchAll={refetchAll}
            gltrMinimum={glitterMinimum}
          />
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
