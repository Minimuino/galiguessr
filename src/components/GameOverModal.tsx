/*
 * Copyright (c) 2025, Carlos Pérez Ramil
 *
 * This file is part of the GaliGuessr project and is licensed under the GNU GPL v3.0.
 * See LICENSE file in the root directory of this project or at <https://www.gnu.org/licenses/gpl-3.0>.
 */

import type { RefObject } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

interface Props {
  score?: number;
  totalDistanceKm?: number;
  numberOfQuestions: number;
  datasetName?: string;
  modeName?: string;
  ref: RefObject<HTMLDialogElement | null>;
  playAgainCallback: () => void;
};

export default function GameOverModal({ score, totalDistanceKm, numberOfQuestions, datasetName, modeName, ref, playAgainCallback }: Props) {
  const { t } = useTranslation();
  const scoreLabel = (totalDistanceKm != null) ? (
    <>
      <p>
        {t("gameovermodal.totalDistance")}
      </p>
      <label className="text-5xl sm:text-6xl text-[var(--custom-blue)]">
        {totalDistanceKm.toFixed(2) + " km"}
      </label>
      <label className="font-mono">
        {t("gameovermodal.distanceAverage", { avg: (totalDistanceKm / numberOfQuestions).toFixed(2) })}
      </label>
    </>)
    : (
      <>
        <p>
          {t("gameovermodal.finalScore")}
        </p>
        <label className="text-5xl sm:text-6xl text-[var(--custom-blue)]">
          {`${score} / ${numberOfQuestions}`}
        </label>
        <label className="font-mono">
          {((score || 0) / numberOfQuestions * 100).toFixed(0) + "%"}
        </label>
      </>
    );

  const handleShare = async () => {
    try {
      const scoreText = (totalDistanceKm != null) ? `${totalDistanceKm.toFixed(2)} km` : `${score} / ${numberOfQuestions}`;
      if (navigator.share) {
        await navigator.share({
          text: `GaliGuessr - ${datasetName} - ${t("modes." + modeName)}: ${scoreText}`,
          url: "https://minimuino.github.io/galiguessr/"
        });
      } else {
        await navigator.clipboard.writeText(`GaliGuessr - ${datasetName} - ${t("modes." + modeName)}:\n${scoreText}\nhttps://minimuino.github.io/galiguessr/`);
        alert(t("gameovermodal.copiedToClipboard"));
      }
    } catch (err) {
      console.log("Share failed: ", err);
    }
  };

  const closeModal = () => {
    ref.current?.close();
  };

  return (
    <dialog
      className="overflow-visible backdrop:bg-black/85 bg-transparent"
      ref={ref}
    >
      <div className="rounded-xl bg-white p-8 py-12 flex flex-col gap-8 items-center">
        <img
          src="./logo.svg"
          alt="Galiguessr logo"
          width={280}
          height={56}
        />
        <p className="text-center">
          {datasetName + " - " + t("modes." + modeName)}
        </p>
        {scoreLabel}
        <div className="flex flex-col gap-6 items-center">
          <button
            className="basic-button"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={handleShare}
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
        <button
          className="close-button"
          onClick={closeModal}
        >
          X
        </button>
      </div>
    </dialog>
  );
}
