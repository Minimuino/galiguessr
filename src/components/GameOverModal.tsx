import Link from "next/link";
import Image from "next/image";
import { RefObject } from "react";

interface Props {
  score?: number;
  totalDistanceKm?: number;
  datasetName?: string;
  modeName?: string;
  ref: RefObject<HTMLDialogElement | null>;
  playAgainCallback: () => void;
};

export default function GameOverModal({ score, totalDistanceKm, datasetName, modeName, ref, playAgainCallback }: Props) {
  const scoreLabel = (totalDistanceKm != null) ? (
    <>
      <p>
        Erro acumulado total:
      </p>
      <label className="text-2xl sm:text-6xl text-[var(--custom-blue)]">
        {totalDistanceKm.toFixed(2) + " km"}
      </label>
    </>)
    : (
      <>
        <p>
          A túa puntuación:
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
        <Image
          src="/logo.svg"
          alt="Galiguessr logo"
          width={280}
          height={56}
          priority
        />
        <p className="text-center font-[family-name:var(--font-geist-mono)]">
          {datasetName + " - " + modeName}
        </p>
        {scoreLabel}
        <button
          className="basic-button"
        >
          Compartir en redes
        </button>
        <button
          className="basic-button"
          onClick={playAgainCallback}
        >
          Xogar de novo
        </button>
        <Link
          className="basic-button"
          href="/"
        >
          Volver ao menú
        </Link>
      </div>
    </dialog>
  );
}
