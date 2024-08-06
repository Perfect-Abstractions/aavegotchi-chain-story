export const SubmissionCard = ({ submission, uuiv, cardName }: any) => {
  return (
    <div className="flex flex-col">
      <p className="text-xl">
        {cardName} Submission #{uuiv}
      </p>
      <p className="text-lg">Author Address</p>
      <p className="text-sm">{submission.authorAddress}</p>
      <p className="text-lg">Author Name</p>
      <p className="text-sm">{submission.authorName}</p>
      <p className="text-lg">Author Contact</p>
      <p className="text-sm">{submission.authorContact}</p>
      <p className="text-lg">Note</p>
      <p className="text-sm">{submission.note}</p>
      <p className="text-lg">Story Part</p>
      <p className="text-sm">{submission.storyPart}</p>
      <p className="text-lg">Gltr Amount</p>
      <p className="text-sm">{submission.gltrAmount.toString()}</p>
      <p className="text-lg">Vote Score</p>
      <p className="text-sm">{submission.voteScore.toString()}</p>
      <p className="text-lg">Story Part Id</p>
      <p className="text-sm">{submission.storyPartId.toString()}</p>
      <p className="text-lg">Round</p>
      <p className="text-sm">{submission.round.toString()}</p>
      <p className="text-lg">Published</p>
      <p className="text-sm">{submission.published.toString()}</p>
    </div>
  );
};
