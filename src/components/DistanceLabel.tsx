import { useTranslation } from 'react-i18next';

interface Props {
  distance: number;
};

export default function DistanceLabel({ distance }: Props) {
  const { t } = useTranslation();
  return (
    <div className="text-inherit">
      <label
        className="flex items-center justify-center text-inherit text-center h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 font-[family-name:var(--font-geist-mono)]"
      >
        {(distance === 0) ? t("distancelabel.hit") : t("distancelabel.miss", { distance: distance.toFixed(2) })}
      </label>
    </div>
  );
}
