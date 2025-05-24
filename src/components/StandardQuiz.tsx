/*
 * Copyright (c) 2025, Carlos Pérez Ramil
 *
 * This file is part of the GaliGuessr project and is licensed under the GNU GPL v3.0.
 * See LICENSE file in the root directory of this project or at <https://www.gnu.org/licenses/gpl-3.0>.
 */

import { distance } from "fastest-levenshtein";
import type { FeatureCollection } from "geojson";
import type { MapLayerMouseEvent } from "maplibre-gl";
import { useMemo, useRef, useState } from "react";
import { Mode } from "../enums";
import { shuffle } from "../utils/ArrayUtils";
import GameOverModal from "./GameOverModal";
import MapView from "./MapView";
import QuestionHistory, { type QuestionHistoryEntry } from "./QuestionHistory";
import QuestionLabel from "./QuestionLabel";
import ScoreLabel from "./ScoreLabel";
import TextInput from "./TextInput";

interface Props {
  data: FeatureCollection;
  mode: Mode;
  datasetName?: string,
  onResetGame: () => void;
}

export default function StandardQuiz({ data, mode, datasetName, onResetGame }: Props) {
  const [featureIds] = useState<(string | number)[]>(shuffle(data.features.map(feature => {
    if (feature.id == null) {
      throw new Error(`Missing id in feature: ${JSON.stringify(feature).substring(0, 100)} ...`);
    }
    return feature.id;
  })));
  const [userGuess, setUserGuess] = useState<string | number | undefined>(undefined);
  const [rightGuessFeatureIds] = useState<(string | number)[]>([]);
  const [wrongGuessFeatureIds] = useState<(string | number)[]>([]);
  const [questionHistory] = useState<QuestionHistoryEntry[]>([]);

  const featureNamesById: Map<string | number, string> = useMemo(
    () => new Map(data.features.map(feature => [feature.id!, feature.properties?.name as string])),
    [data]
  );
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
    const currentFeatureId = featureIds[featureIds.length - 1];
    const currentFeatureName = featureNamesById.get(currentFeatureId) || "Missing feature name";
    const isCorrect = userGuess === currentFeatureId
      || distance(String(userGuess).replace(/\s+/g, "").toLowerCase(), currentFeatureName.replace(/\s+/g, "").toLowerCase()) < 2;
    if (isCorrect) {
      rightGuessFeatureIds.push(currentFeatureId);
    } else {
      wrongGuessFeatureIds.push(currentFeatureId);
    }
    featureIds.pop();
    setUserGuess(undefined);
    questionHistory.push({ featureName: currentFeatureName, isCorrect: isCorrect });
  }

  if (featureIds.length === 0) {
    modalRef.current?.showModal();
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <MapView
        data={data}
        pendingGuessFeatures={{ features: data.features.filter((feature) => featureIds.includes(feature.id!)), type: "FeatureCollection" }}
        rightGuessFeatures={{ features: data.features.filter((feature) => rightGuessFeatureIds.includes(feature.id!)), type: "FeatureCollection" }}
        wrongGuessFeatures={{ features: data.features.filter((feature) => wrongGuessFeatureIds.includes(feature.id!)), type: "FeatureCollection" }}
        interactive={(mode === Mode.PointAndClick)}
        attributionOnTop={(mode === Mode.WriteName)}
        onClick={(mode === Mode.PointAndClick) ? handleMouseClick : undefined}
        highlightedFeatureId={(mode === Mode.WriteName) ? featureIds[featureIds.length - 1] : undefined}
      />
      {mode === Mode.PointAndClick && (
        <div className="absolute bottom-[84%] sm:bottom-[15%] left-50 sm:left-[10%]">
          <QuestionLabel
            textToDisplay={data.features.find(feature => feature.id === featureIds[featureIds.length - 1])?.properties?.name as string}
          />
          <ScoreLabel
            score={rightGuessFeatureIds.length}
            total={data.features.length}
          />
        </div>
      )}
      {mode === Mode.WriteName && (
        <div className="absolute bottom-0 sm:bottom-[15%] left-50 sm:left-[10%] pointer-events-none sm:pointer-events-auto overflow-clip sm:overflow-visible py-3 pb-[calc(env(safe-area-inset-bottom)+4px)]">
          <QuestionHistory
            entries={questionHistory}
          />
          <TextInput
            onEnterText={handleTextInput}
          />
        </div>
      )}
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
