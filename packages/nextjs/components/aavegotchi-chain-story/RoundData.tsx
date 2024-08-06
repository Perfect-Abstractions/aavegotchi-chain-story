export const RoundData = ({ round }: any) => {
  return (
    <div className="flex flex-col bg-secondary">
      <p className="text-xl">Round Data</p>
      <p>Round: {round?.[0].toString()}</p>

      <p>Submission Start Time: {round?.[1].toString()}</p>

      <p>Submission End Time: {round?.[2].toString()}</p>

      <p>Vote Start Time: {round?.[3].toString()}</p>

      <p>Vote End Time: {round?.[4].toString()}</p>
    </div>
  );
};
