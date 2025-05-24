/*
 * Copyright (c) 2025, Carlos Pérez Ramil
 *
 * This file is part of the GaliGuessr project and is licensed under the GNU GPL v3.0.
 * See LICENSE file in the root directory of this project or at <https://www.gnu.org/licenses/gpl-3.0>.
 */

import { useTranslation } from 'react-i18next';

interface Props {
  score?: number;
  total?: number;
  distance?: number;
};

export default function ScoreLabel({ score, total, distance }: Props) {
  const { t } = useTranslation();
  return (
    <div>
      {distance != null && (
        <label
          className="flex items-center justify-center text-base sm:text-lg h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 font-[family-name:var(--font-geist-mono)]"
        >
          {t("scorelabel.totalDistance", { distance: distance.toFixed(2) })}
        </label>
      )}
      {score != null && total && (
        <label
          className="flex items-center justify-center text-base sm:text-lg h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 font-[family-name:var(--font-geist-mono)]"
        >
          {String(score) + "/" + String(total)}
        </label>
      )}
    </div>
  );
}
