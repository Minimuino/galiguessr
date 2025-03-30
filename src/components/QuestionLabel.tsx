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
