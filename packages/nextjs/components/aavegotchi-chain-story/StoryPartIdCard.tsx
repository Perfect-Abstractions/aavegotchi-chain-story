export const StoryPartIdCard = ({ storyId, cardName }: any) => {
  return (
    <div>
      <p className="text-xl">
        {cardName} Story Id: {storyId}
      </p>
    </div>
  );
};
