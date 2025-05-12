import { Link } from "react-router";
import React, { useState } from "react";
import { removeFileExtension } from "./utils/StringUtils";

import settingsJson from "./assets/settings.json";
const settings: { modes: Mode[], datasets: Dataset[] } = settingsJson;

interface Mode {
  name: string;
  label: string;
}

interface Dataset {
  name: string;
  data: string;
  availableModes: string[];
}

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<Dataset>();
  const [selectedMode, setSelectedMode] = useState<Mode>();

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
            src="/logo.svg"
            alt="Galiguessr logo"
            width={450}
            height={76}
          />
          <p className="text-center font-mono">
            Quiz de xeografía de Galicia.
          </p>
        </div>

        <div className="flex w-full items-start flex-row">
          {!showMenu && (
            <button
              className="basic-button mx-auto"
              onClick={onClickStart}
            >
              Comezar
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
                  src="/back.svg"
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
              {settings.modes
                .filter((mode: Mode) => selectedDataset.availableModes.includes(mode.name))
                .map((mode: Mode, index: number) => (
                  <button
                    key={index}
                    className="basic-button"
                    onClick={() => onClickMode(mode)}
                  >
                    {mode.label}
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
                {selectedMode.label}
              </label>
              <Link
                className="highlighted-button"
                to={{
                  pathname: "/play",
                  search: `?dataset=${removeFileExtension(selectedDataset?.data)}&mode=${selectedMode?.name}`,
                }}
              >
                Xogar!
              </Link>
            </div>
          )}
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            aria-hidden
            src="/github-mark.svg"
            alt="Github icon"
            width={16}
            height={16}
          />
          Proxecto en GitHub
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            aria-hidden
            src="/globe.svg"
            alt="Error icon"
            width={16}
            height={16}
          />
          Informar dun erro
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            aria-hidden
            src="/file.svg"
            alt="Credits icon"
            width={16}
            height={16}
          />
          Créditos
        </a>
      </footer>
    </div>
  );
}
