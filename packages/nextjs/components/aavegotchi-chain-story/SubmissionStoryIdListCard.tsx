import { SubmissionStoryIdCard } from "./SubmissionStoryIdCard";

export const SubmissionStoryIdListCard = ({ submissionStoryIds, cardName }: any) => {
  const storyIdsElements = submissionStoryIds?.map((id: any) => {
    return (
      <SubmissionStoryIdCard key={`${cardName}-submission-story-id-`} submissionStoryId={id} cardName={cardName} />
    );
  });
  return (
    <div className="flex flex-col bg-secondary">
      <p className="text-2xl">{cardName} Submissions Story Ids</p>
      {storyIdsElements}
    </div>
  );
};
