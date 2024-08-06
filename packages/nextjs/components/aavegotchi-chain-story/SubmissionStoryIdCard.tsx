export const SubmissionStoryIdCard = ({ submissionStoryId, cardName }: any) => {
  return (
    <div>
      <p className="text-xl">
        {cardName} Story Id: {submissionStoryId}
      </p>
    </div>
  );
};
