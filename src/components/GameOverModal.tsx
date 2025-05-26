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

  const handleShare = async () => {
    try {
      const scoreText = (totalDistanceKm != null) ? `${totalDistanceKm.toFixed(2)} km` : `${score}`;
      if (navigator.share) {
        await navigator.share({
          title: `GaliGuessr - ${datasetName} - ${t("modes." + modeName)}:`,
          text: scoreText,
          url: "https://galiguessr.gal"
        });
      } else {
        await navigator.clipboard.writeText(`GaliGuessr - ${datasetName} - ${t("modes." + modeName)}:\n${scoreText}\nhttps://galiguessr.gal`);
        alert(t("gameovermodal.copiedToClipboard"));
      }
    } catch (err) {
      console.log("Share failed: ", err);
    }
  };

  return (
    <dialog
      className="overflow-visible backdrop:bg-black/85 bg-transparent"
      ref={ref}
    >
      <div className="rounded-xl overflow-hidden bg-white p-8 flex flex-col gap-8 items-center">
        <img
          src="./logo.svg"
          alt="Galiguessr logo"
          width={280}
          height={56}
        />
        <p className="text-center font-[family-name:var(--font-geist-mono)]">
          {datasetName + " - " + t("modes." + modeName)}
        </p>
        {scoreLabel}
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
    </dialog>
  );
}
