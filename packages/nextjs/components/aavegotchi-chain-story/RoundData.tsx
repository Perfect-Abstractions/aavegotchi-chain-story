export const RoundData = ({ round }: any) => {
  const startDate = new Date(Number(round?.[1]) * 1000);
  const startDateString = startDate.toLocaleString();

  const endDate = new Date(Number(round?.[2]) * 1000);
  const endDateString = endDate.toLocaleString();

  const voteStartDate = new Date(Number(round?.[3]) * 1000);
  const voteStartDateString = voteStartDate.toLocaleString();

  const voteEndDate = new Date(Number(round?.[4]) * 1000);
  const voteEndDateString = voteEndDate.toLocaleString();

  return (
    <div className="flex flex-col bg-secondary rounded-lg border-4 border-accent shadow-2xl p-1 text-center space-y-2">
      <p className="text-4xl kanit">Round Data</p>

      <div className="bg-base-100 rounded-lg">
        <p className="text-2xl kanit">Round</p>
        <p className="text-xl kanit-light">{round?.[0].toString()}</p>
      </div>

      <div className="bg-base-100 rounded-lg">
        <p className="text-2xl kanit">Submission Start Time </p>
        <p className="text-xl kanit-light">
          {startDateString} ({round?.[1].toString()})
        </p>
      </div>

      <div className="bg-base-100 rounded-lg">
        <p className="text-2xl kanit">Submission End Time</p>
        <p className="text-xl kanit-light">
          {endDateString} ({round?.[2].toString()})
        </p>
      </div>
      <div className="bg-base-100 rounded-lg">
        <p className="text-2xl kanit">Vote Start Time</p>
        <p className="text-xl kanit-light">
          {voteStartDateString} ({round?.[3].toString()})
        </p>
      </div>

      <div className="bg-base-100 rounded-lg">
        <p className="text-2xl kanit">Vote End Time</p>
        <p className="text-xl kanit-light">
          {voteEndDateString} ({round?.[4].toString()})
        </p>
      </div>
    </div>
  );
};
