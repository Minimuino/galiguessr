/*
 * Copyright (c) 2025, Carlos Pérez Ramil
 *
 * This file is part of the GaliGuessr project and is licensed under the GNU GPL v3.0.
 * See LICENSE file in the root directory of this project or at <https://www.gnu.org/licenses/gpl-3.0>.
 */

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
