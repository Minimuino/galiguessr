interface Props {
  score: number;
  total: number;
};

export default function ScoreLabel({ score, total }: Props) {
  return (
    <div>
      <label
        className="flex items-center justify-center text-base sm:text-lg h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 font-[family-name:var(--font-geist-mono)]"
      >
        {String(score) + "/" + String(total)}
      </label>
    </div>
  );
}
