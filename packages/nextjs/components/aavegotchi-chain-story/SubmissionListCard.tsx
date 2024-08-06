import { SubmissionCard } from "./SubmissionCard";

export const SubmissionListCardCard = ({ submissions, cardName }: any) => {
  const submissionsElements = submissions?.map((submission: any, index: number) => {
    return <SubmissionCard key={`${cardName}-submission-` + index} submission={submission} cardName={cardName} />;
  });

  return (
    <div className="flex flex-col bg-secondary">
      <p className="text-2xl">{cardName} Submissions</p>
      {submissionsElements}
    </div>
  );
};
