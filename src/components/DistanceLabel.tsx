interface Props {
  distance: number;
};

export default function ScoreLabel({ distance }: Props) {
  return (
    <div className="text-inherit">
      <label
        className="flex items-center justify-center text-inherit h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44] font-[family-name:var(--font-geist-mono)]"
      >
        {`A ${distance.toFixed(2)} km da ubicación correcta`}
      </label>
    </div>
  );
}
