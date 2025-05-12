import { Link } from "react-router";
import type { RefObject } from "react";
import { useTranslation } from 'react-i18next';

interface Props {
  score?: number;
  totalDistanceKm?: number;
  datasetName?: string;
  modeName?: string;
  ref: RefObject<HTMLDialogElement | null>;
  playAgainCallback: () => void;
};

export default function GameOverModal({ score, totalDistanceKm, datasetName, modeName, ref, playAgainCallback }: Props) {
  const { t } = useTranslation();
  const scoreLabel = (totalDistanceKm != null) ? (
    <>
      <p>
        {t("gameovermodal.totalDistance")}
      </p>
      <label className="text-2xl sm:text-6xl text-[var(--custom-blue)]">
        {totalDistanceKm.toFixed(2) + " km"}
      </label>
    </>)
    : (
      <>
        <p>
          {t("gameovermodal.finalScore")}
        </p>
        <label className="text-2xl sm:text-6xl text-[var(--custom-blue)]">
          {score}
        </label>
      </>
    );
  return (
    <dialog
      className="overflow-visible backdrop:bg-black/85 bg-transparent"
      ref={ref}
    >
      <div className="rounded-xl overflow-hidden bg-white p-8 flex flex-col gap-8 items-center">
        <img
          src="/logo.svg"
          alt="Galiguessr logo"
          width={280}
          height={56}
        />
        <p className="text-center font-[family-name:var(--font-geist-mono)]">
          {datasetName + " - " + modeName}
        </p>
        {scoreLabel}
        <button
          className="basic-button"
        >
          {t("gameovermodal.share")}
        </button>
        <button
          className="basic-button"
          onClick={playAgainCallback}
        >
          {t("gameovermodal.tryAgain")}
        </button>
        <Link
          className="basic-button"
          to="/"
        >
          {t("gameovermodal.backToMenu")}
        </Link>
      </div>
    </dialog>
  );
}
