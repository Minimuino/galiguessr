/*
 * Copyright (c) 2025, Carlos Pérez Ramil
 *
 * This file is part of the GaliGuessr project and is licensed under the GNU GPL v3.0.
 * See LICENSE file in the root directory of this project or at <https://www.gnu.org/licenses/gpl-3.0>.
 */

export interface QuestionHistoryEntry {
  featureName: string;
  isCorrect: boolean;
};

interface Props {
  entries: QuestionHistoryEntry[];
};

export default function QuestionHistory({ entries }: Props) {
  return (
    <div className="translate-x-4 max-h-24 sm:max-h-[400px] overflow-auto flex flex-col-reverse [direction:rtl]">
      <ul className="translate-x-4 [direction:ltr]">
        {entries.map((item: QuestionHistoryEntry, index: number) => (
          <li key={index} className={(item.isCorrect) ? "text-green-700" : "text-red-700"}>
            {item.featureName}
          </li>
        ))}
      </ul>
    </div>
  );
}
