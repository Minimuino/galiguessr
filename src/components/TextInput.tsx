import styles from "./styles.module.css";
import Image from "next/image";

interface Props {
  onEnterText: (input: string) => void;
};

export default function TextInput({ onEnterText }: Props) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const inputElement = event.currentTarget.elements.namedItem("textInput") as HTMLInputElement;
    onEnterText(inputElement.value);
    inputElement.value = ""; // Clear the input
  };
  return (
    <div>
      <form
        className="flex flex-row items-center"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <input
          className={styles.textinput}
          name="textInput"
          placeholder="Escribe o nome do lugar"
          autoFocus
        />
        <button
          className="rounded-full transition-colors flex items-center justify-center bg-[var(--galician-blue)] hover:bg-[var(--custom-blue)] h-10 sm:h-12 px-3 sm:px-4 absolute right-1"
          type="submit"
        >
          <Image
            src="/send.svg"
            alt="Submit icon"
            width={28}
            height={28}
          />
        </button>
      </form>
    </div>
  );
}
