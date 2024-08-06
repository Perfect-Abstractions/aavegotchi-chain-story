import { StoryPartCard } from "./StoryPartCard";

export const StoryPartListCard = ({ storyParts, cardName }: any) => {
  const elements = storyParts?.map((submission: any, index: number) => {
    return <StoryPartCard key={`${cardName}-submission-` + index} submission={submission} cardName={cardName} />;
  });

  return (
    <div className="flex flex-col bg-secondary">
      <p className="text-2xl">{cardName} Submissions</p>
      {elements}
    </div>
  );
};
