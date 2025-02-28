"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import settingsJson from "../../data/settings.json";
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

  // First validate all datasets are well formed geojsons

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

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-center">
        <Image
          src="/logo.svg"
          alt="Galiguessr logo"
          width={380}
          height={76}
          priority
        />
        <p className="text-center font-[family-name:var(--font-geist-mono)]">
          Quiz de xeografía de Galicia.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {!showMenu && (
            <button
              className="basic-button"
              onClick={onClickStart}
            >
              Comezar
            </button>
          )}
          {showMenu && (
            <div className="flex gap-4 items-center flex-col">
              {settings.datasets.map((item: Dataset, index: number) => (
                <label
                  key={index}
                  className="basic-button"
                  style={{ backgroundColor: selectedDataset?.name === item.name ? "#47d2ff" : "" }}
                >
                  <input
                    type="radio"
                    value={item.name}
                    checked={selectedDataset?.name === item.name}
                    onChange={() => onClickDataset(item)}
                    style={{ display: "none" }}
                  />
                  {item.name}
                </label>
              ))}
            </div>
          )}
          {selectedDataset && (
            <div className="flex gap-4 items-center flex-col">
              {settings.modes
                .filter((mode: Mode) => selectedDataset.availableModes.includes(mode.name))
                .map((mode: Mode, index: number) => (
                  <label
                    key={index}
                    className="basic-button"
                    style={{ backgroundColor: selectedMode?.name === mode.name ? "#47d2ff" : "" }}
                  >
                    <input
                      type="radio"
                      value={mode.name}
                      checked={selectedMode?.name === mode.name}
                      onChange={() => onClickMode(mode)}
                      style={{ display: "none" }}
                    />
                    {mode.label}
                  </label>
                ))
              }
            </div>
          )}
          {selectedMode && (
            <Link
              className="highlighted-button"
              href="/play"
            >
              Xogar!
            </Link>
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
          <Image
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
          <Image
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
          <Image
            aria-hidden
            src="/globe.svg"
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
