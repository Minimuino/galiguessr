
export default function TextInput({
  textToDisplay,
  handleTextInput,
}: {
  textToDisplay: string;
  handleTextInput: (input: string) => void;
}) {

  console.log(textToDisplay);

  return (
    <div style={{ position: "absolute" }}>
      <p>{textToDisplay}</p>

      <input
        type="text"
        onChange={(e) => handleTextInput(e.target.value)}
        placeholder="Escribe algo..."
      />
    </div>
  );
}
