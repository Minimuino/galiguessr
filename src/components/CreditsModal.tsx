/*
 * Copyright (c) 2025, Carlos Pérez Ramil
 *
 * This file is part of the GaliGuessr project and is licensed under the GNU GPL v3.0.
 * See LICENSE file in the root directory of this project or at <https://www.gnu.org/licenses/gpl-3.0>.
 */

import type { RefObject } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  ref: RefObject<HTMLDialogElement | null>;
};

export default function CreditsModal({ ref }: Props) {
  const { t } = useTranslation();

  return (
    <dialog
      className="overflow-visible backdrop:bg-black/85 bg-transparent"
      ref={ref}
    >
      <div className="rounded-xl overflow-hidden bg-white p-8 flex flex-col gap-8 items-left">
        <img
          src="./logo.svg"
          alt="Galiguessr logo"
          width={280}
          height={56}
        />
        <p>Copyright (c) 2025, Carlos Pérez Ramil</p>
        <p>
          Este proxecto é software libre. Podes atopar <a className="text-blue-600 hover:underline" href="https://github.com/Minimuino/galiguessr" target="_blank" rel="noopener">aquí</a> o código fonte publicado baixo a licencia GNU GPL v3.
        </p>
        <ul className="text-left">
          <li>Orixe dos datos:</li>
          <li>Copyright (c) Xunta de Galicia - Instituto de Estudos do Territorio - Consellería de Medio Ambiente, Territorio e Infraestruturas <a className="text-blue-600 hover:underline" href="https://mapas.xunta.gal/gl" target="_blank" rel="noopener">mapas.xunta.gal/gl</a></li>
          <li>Copyright (c) Instituto Geográfico Nacional <a className="text-blue-600 hover:underline" href="https://www.ign.es" target="_blank" rel="noopener">www.ign.es</a></li>
          <li>Copyright (c) OpenStreetMap contributors <a className="text-blue-600 hover:underline" href="https://openstreetmap.org/copyright" target="_blank" rel="noopener">openstreetmap.org/copyright</a></li>
        </ul>
        <p>Ferramentas de software libre utilizadas: React, Vite, MapLibre GL JS, Turf.js</p>
        <button
          className="basic-button w-fit"
          onClick={() => ref.current?.close()}
        >
          {t("back")}
        </button>
      </div>
    </dialog >
  );
}
