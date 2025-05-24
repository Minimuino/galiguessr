/*
 * Copyright (c) 2025, Carlos Pérez Ramil
 *
 * This file is part of the GaliGuessr project and is licensed under the GNU GPL v3.0.
 * See LICENSE file in the root directory of this project or at <https://www.gnu.org/licenses/gpl-3.0>.
 */

import styles from "./styles.module.css";

interface Props {
  textToDisplay: string;
  disabled?: boolean;
};

export default function QuestionLabel({ textToDisplay, disabled = false }: Props) {
  return (
    <div>
      <label
        className={`${styles.questionlabel} ${disabled ? styles["questionlabel-disabled"] : ""}`}
      >
        {textToDisplay}
      </label>
    </div>
  );
}
