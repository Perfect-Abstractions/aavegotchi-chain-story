import { StoryPartIdCard } from "./StoryPartIdCard";

export const SubmissionStoryIdListCard = ({ submissionStoryIds, cardName }: any) => {
  const elements = submissionStoryIds?.map((id: any) => {
    return <StoryPartIdCard key={`${cardName}-submission-story-id-`} storyId={id} cardName={cardName} />;
  });
  return (
    <div className="flex flex-col bg-secondary">
      <p className="text-2xl">{cardName} Submissions Story Ids</p>
      {elements}
    </div>
  );
};
