import { useState, useRef, useMemo } from "react";
import type { FeatureCollection } from "geojson";
import { Map as MaplibreMap } from "react-map-gl/maplibre";
import type { MapRef, StyleSpecification } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import bbox from "@turf/bbox";
import { Mode } from "@/app/enums";
import ScoreLabel from "@/components/ScoreLabel";
import GameOverModal from "@/components/GameOverModal";
import TextInput from "@/components/TextInput";
import { shuffle } from "@/utils/ArrayUtils";

import mapstylejson from "../../public/city-map-style.json";
const mapstyle = mapstylejson as StyleSpecification;

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { distance } = require("fastest-levenshtein");

interface QuestionHistoryEntry {
  featureName: string;
  isCorrect: boolean;
}

interface Props {
  data: FeatureCollection;
  datasetName?: string;
  onResetGame: () => void;
}

export default function StandardQuiz({ data, datasetName, onResetGame }: Props) {
  const [featureIds] = useState<(string | number | undefined)[]>(shuffle(data.features.map(feature => feature.id)));
  const [userGuess, setUserGuess] = useState<string | undefined>(undefined);
  const [rightGuessFeatureIds] = useState<(string | number | undefined)[]>([]);
  const [wrongGuessFeatureIds] = useState<(string | number | undefined)[]>([]);
  const [questionHistory] = useState<QuestionHistoryEntry[]>([]);

  const featureNamesById = useMemo(() => new Map(data.features.map(feature => [feature.id, feature.properties?.name])), [data]);
  const mapRef = useRef<MapRef | null>(null);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const currentFeatureId = featureIds.at(-1);
  const [minLng, minLat, maxLng, maxLat] = bbox(data.features.find(item => item.id === currentFeatureId) || data);
  mapRef.current?.fitBounds([minLng, minLat, maxLng, maxLat], { padding: 40, duration: 1000 });
  mapRef.current?.getMap().setMaxBounds([minLng, minLat, maxLng, maxLat]);

  const handleTextInput = (input: string) => {
    setUserGuess(input);
  };

  if (userGuess != null) {
    const isCorrect = distance(String(userGuess).replace(/\s+/g, "").toLowerCase(), featureNamesById.get(currentFeatureId).replace(/\s+/g, "").toLowerCase()) < 2;
    if (isCorrect) {
      rightGuessFeatureIds.push(currentFeatureId);
    } else {
      wrongGuessFeatureIds.push(currentFeatureId);
    }
    featureIds.pop();
    setUserGuess(undefined);
    questionHistory.push({ featureName: featureNamesById.get(currentFeatureId), isCorrect: isCorrect });
  }

  if (featureIds.length === 0) {
    modalRef.current?.showModal();
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <MaplibreMap
        initialViewState={{
          bounds: [minLng, minLat, maxLng, maxLat],
          fitBoundsOptions: {
            padding: { left: 12, top: 12, right: 12, bottom: 12 }
          }
        }}
        maxBounds={[minLng, minLat, maxLng, maxLat]}
        doubleClickZoom={false}
        dragRotate={false}
        cursor="default"
        mapStyle={mapstyle}
        ref={mapRef}
      />
      <div className="absolute bottom-[6%] sm:bottom-[15%] left-50 sm:left-[10%]">
        <ul className="translate-x-6">
          {questionHistory.map((item: QuestionHistoryEntry, index: number) => (
            <li key={index} className={(item.isCorrect) ? "text-green-700" : "text-red-700"}>
              {item.featureName}
            </li>
          ))}
        </ul>
        <TextInput
          onEnterText={handleTextInput}
        />
        <ScoreLabel
          score={rightGuessFeatureIds.length}
          total={data.features.length}
        />
      </div>
      <GameOverModal
        score={rightGuessFeatureIds.length}
        datasetName={datasetName}
        modeName={Mode.CityMap}
        playAgainCallback={onResetGame}
        ref={modalRef}
      />
    </div >
  );
}
