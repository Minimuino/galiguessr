/*
 * Copyright (c) 2025, Carlos Pérez Ramil
 *
 * This file is part of the GaliGuessr project and is licensed under the GNU GPL v3.0.
 * See LICENSE file in the root directory of this project or at <https://www.gnu.org/licenses/gpl-3.0>.
 */

import { useTranslation } from 'react-i18next';
import styles from "./styles.module.css";

interface Props {
  onEnterText: (input: string) => void;
};

export default function TextInput({ onEnterText }: Props) {
  const { t } = useTranslation();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const inputElement = event.currentTarget.elements.namedItem("textInput") as HTMLInputElement;
    onEnterText(inputElement.value);
    inputElement.value = ""; // Clear the input
    inputElement.focus();
  };
  return (
    <div>
      <form
        className="flex flex-row items-center pointer-events-auto"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <input
          className={styles.textinput}
          name="textInput"
          placeholder={t("textinput.placeholder")}
        />
        <button
          className="rounded-[13px] transition-colors flex items-center justify-center bg-[var(--galician-blue)] hover:bg-[var(--custom-blue)] h-10 sm:h-12 px-3 sm:px-4 absolute right-1"
          type="submit"
        >
          <img
            src="./send.svg"
            alt="Submit icon"
            width={28}
            height={28}
          />
        </button>
      </form>
    </div>
  );
}
