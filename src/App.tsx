/*
 * Copyright (c) 2025, Carlos Pérez Ramil
 *
 * This file is part of the GaliGuessr project and is licensed under the GNU GPL v3.0.
 * See LICENSE file in the root directory of this project or at <https://www.gnu.org/licenses/gpl-3.0>.
 */

import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import CreditsModal from "./components/CreditsModal";
import { Mode } from "./enums";
import { removeFileExtension } from "./utils/StringUtils";

import settingsJson from "./assets/settings.json";
const settings: { datasets: Dataset[] } = settingsJson;

interface Dataset {
  name: string;
  data: string;
  availableModes: string[];
}

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<Dataset>();
  const [selectedMode, setSelectedMode] = useState<Mode>();
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const onClickStart = () => {
    setShowMenu(true);
  };
  const onClickDataset = (ds: Dataset) => {
    setSelectedDataset(ds);
    setSelectedMode(undefined);
  };
  const onClickMode = (mode: Mode) => {
    setSelectedMode(mode);
  };
  const onClickBack = () => {
    if (selectedMode) {
      setSelectedMode(undefined);
    } else if (selectedDataset) {
      setSelectedDataset(undefined);
    }
  }

  return (
    <div className={`grid grid-rows-[20px_1fr_20px] ${showMenu ? 'items-start' : 'items-center'} justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20`}>
      <main className="flex flex-col gap-16 row-start-2 items-center">
        <div className="flex flex-col gap-6">
          <img
            src="./logo.svg"
            alt="Galiguessr logo"
            width={450}
            height={76}
          />
          <p className="text-center font-mono">
            {t("title")}
          </p>
        </div>

        <div className="flex w-full items-start flex-row">
          {!showMenu && (
            <button
              className="basic-button mx-auto"
              onClick={onClickStart}
            >
              {t("start")}
            </button>
          )}
          {showMenu && !selectedDataset && (
            <div className="flex gap-4 items-center flex-col mx-auto">
              {settings.datasets.map((item: Dataset, index: number) => (
                <button
                  key={index}
                  className="basic-button"
                  onClick={() => onClickDataset(item)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
          {selectedDataset && (
            <>
              <button
                className="back-button absolute"
                onClick={onClickBack}
              >
                <img
                  src="./back.svg"
                  alt="Back"
                  width={14}
                  height={14}
                />
              </button>
            </>
          )}
          {selectedDataset && !selectedMode && (
            <div className="flex gap-4 items-center flex-col mx-auto">
              <label className="basic-label bg-[var(--custom-blue)]">
                {selectedDataset.name}
              </label>
              {Object.values(Mode)
                .filter((mode) => selectedDataset.availableModes.includes(mode))
                .map((mode, index: number) => (
                  <button
                    key={index}
                    className="basic-button"
                    onClick={() => onClickMode(mode)}
                  >
                    {t("modes." + mode)}
                  </button>
                ))
              }
            </div>
          )}
          {selectedMode && selectedDataset && (
            <div className="flex gap-4 items-center flex-col mx-auto">
              <label className="basic-label bg-[var(--custom-blue)]">
                {selectedDataset.name}
              </label>
              <label className="basic-label bg-[var(--custom-blue)]">
                {t("modes." + selectedMode)}
              </label>
              <Link
                className="highlighted-button"
                to={{
                  pathname: "/play",
                  search: `?dataset=${removeFileExtension(selectedDataset?.data)}&mode=${selectedMode}`,
                }}
              >
                {t("play")}
              </Link>
            </div>
          )}
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/Minimuino/galiguessr"
          target="_blank"
          rel="noopener"
        >
          <img
            aria-hidden
            src="./github-mark.svg"
            alt="Github icon"
            width={16}
            height={16}
          />
          {t("github")}
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/Minimuino/galiguessr"
          target="_blank"
          rel="noopener"
        >
          <img
            aria-hidden
            src="./globe.svg"
            alt="Error icon"
            width={16}
            height={16}
          />
          {t("contact")}
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          onClick={() => modalRef.current?.showModal()}
        >
          <img
            aria-hidden
            src="./file.svg"
            alt="Credits icon"
            width={16}
            height={16}
          />
          {t("credits")}
        </a>
        <CreditsModal
          ref={modalRef}
        />
      </footer>
    </div>
  );
}
