import styles from "./styles.module.css";

interface Props {
  textToDisplay: string;
};

export default function QuestionLabel({ textToDisplay }: Props) {
  return (
    <div>
      <label
        className={styles.questionlabel}
      >
        {textToDisplay}
      </label>
    </div>
  );
}
