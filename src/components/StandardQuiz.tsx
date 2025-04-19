import { useState, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { MapLayerMouseEvent } from "maplibre-gl";
import type { FeatureCollection } from "geojson";
import MapView from "@/components/MapView";
import ScoreLabel from "@/components/ScoreLabel";
import GameOverModal from "@/components/GameOverModal";
import TextInput from "@/components/TextInput";
import { shuffle } from "@/utils/ArrayUtils";
import { Mode } from "@/app/enums";

const QuestionLabel = dynamic(() => import("@/components/QuestionLabel"), { ssr: false });

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { distance } = require("fastest-levenshtein");

interface QuestionHistoryEntry {
  featureName: string;
  isCorrect: boolean;
}

interface Props {
  data: FeatureCollection;
  mode: Mode;
  datasetName?: string,
  onResetGame: () => void;
}

export default function StandardQuiz({ data, mode, datasetName, onResetGame }: Props) {
  const [featureIds] = useState<(string | number | undefined)[]>(shuffle(data.features.map(feature => feature.id)));
  const [userGuess, setUserGuess] = useState<string | number | undefined>(undefined);
  const [rightGuessFeatureIds] = useState<(string | number | undefined)[]>([]);
  const [wrongGuessFeatureIds] = useState<(string | number | undefined)[]>([]);
  const [questionHistory] = useState<QuestionHistoryEntry[]>([]);

  const featureNamesById = useMemo(() => new Map(data.features.map(feature => [feature.id, feature.properties?.name])), [data]);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const handleTextInput = (input: string) => {
    setUserGuess(input);
  };
  const handleMouseClick = (event: MapLayerMouseEvent) => {
    const clickedFeature = event.features && event.features[0];
    if (clickedFeature != null) {
      setUserGuess(clickedFeature.id);
    }
  };

  if (userGuess != null) {
    const currentFeatureId = featureIds.at(-1);
    const isCorrect = userGuess === currentFeatureId
      || distance(String(userGuess).replace(/\s+/g, "").toLowerCase(), featureNamesById.get(currentFeatureId).replace(/\s+/g, "").toLowerCase()) < 2;
    if (isCorrect) {
      rightGuessFeatureIds.push(currentFeatureId);
    } else {
      wrongGuessFeatureIds.push(currentFeatureId);
    }
    featureIds.pop();
    setUserGuess(undefined);
    questionHistory.unshift({ featureName: featureNamesById.get(currentFeatureId), isCorrect: isCorrect });
  }

  if (featureIds.length === 0) {
    modalRef.current?.showModal();
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <MapView
        data={data}
        pendingGuessFeatures={{ features: data.features.filter((feature) => featureIds.includes(feature.id)), type: "FeatureCollection" }}
        rightGuessFeatures={{ features: data.features.filter((feature) => rightGuessFeatureIds.includes(feature.id)), type: "FeatureCollection" }}
        wrongGuessFeatures={{ features: data.features.filter((feature) => wrongGuessFeatureIds.includes(feature.id)), type: "FeatureCollection" }}
        interactive={(mode === Mode.PointAndClick)}
        onClick={(mode === Mode.PointAndClick) ? handleMouseClick : undefined}
        highlightedFeatureId={(mode === Mode.WriteName) ? featureIds.at(-1) : undefined}
      />
      <div className="absolute bottom-[6%] sm:bottom-[15%] left-50 sm:left-[10%]">
        {mode === Mode.PointAndClick && (
          <QuestionLabel
            textToDisplay={data.features.find(feature => feature.id === featureIds.at(-1))?.properties?.name}
          />
        )}
        {mode === Mode.WriteName && (
          <>
            <ul className="translate-x-6 max-h-24 sm:max-h-[400px] overflow-auto flex flex-col-reverse">
              {questionHistory.map((item: QuestionHistoryEntry, index: number) => (
                <li key={index} className={(item.isCorrect) ? "text-green-700" : "text-red-700"}>
                  {item.featureName}
                </li>
              ))}
            </ul>
            <TextInput
              onEnterText={handleTextInput}
            />
          </>
        )}
        <ScoreLabel
          score={rightGuessFeatureIds.length}
          total={data.features.length}
        />
      </div>
      <GameOverModal
        score={rightGuessFeatureIds.length}
        datasetName={datasetName}
        modeName={mode}
        playAgainCallback={onResetGame}
        ref={modalRef}
      />
    </div>
  );
}
