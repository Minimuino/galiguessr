/*
 * Copyright (c) 2025, Carlos Pérez Ramil
 *
 * This file is part of the GaliGuessr project and is licensed under the GNU GPL v3.0.
 * See LICENSE file in the root directory of this project or at <https://www.gnu.org/licenses/gpl-3.0>.
 */

import bbox from "@turf/bbox";
import transformScale from "@turf/transform-scale";
import { distance } from "fastest-levenshtein";
import type { FeatureCollection } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMemo, useRef, useState } from "react";
import type { MapRef, StyleSpecification } from "react-map-gl/maplibre";
import { AttributionControl, Map as MaplibreMap } from "react-map-gl/maplibre";
import { Mode } from "../enums";
import { shuffle } from "../utils/ArrayUtils";
import GameOverModal from "./GameOverModal";
import QuestionHistory, { type QuestionHistoryEntry } from "./QuestionHistory";
import TextInput from "./TextInput";

import mapstylejson from "../assets/city-map-style.json";
const mapstyle = mapstylejson as StyleSpecification;

interface Props {
  data: FeatureCollection;
  datasetName?: string;
  onResetGame: () => void;
}

export default function CityMapQuiz({ data, datasetName, onResetGame }: Props) {
  const [featureIds] = useState<(string | number)[]>(shuffle(data.features.map(feature => {
    if (feature.id == null) {
      throw new Error(`Missing id in feature: ${JSON.stringify(feature).substring(0, 100)} ...`);
    }
    return feature.id;
  })));
  const [userGuess, setUserGuess] = useState<string | undefined>(undefined);
  const [rightGuessFeatureIds] = useState<(string | number)[]>([]);
  const [wrongGuessFeatureIds] = useState<(string | number)[]>([]);
  const [questionHistory] = useState<QuestionHistoryEntry[]>([]);

  const featureNamesById: Map<string | number, string> = useMemo(
    () => new Map(data.features.map(feature => [feature.id!, feature.properties?.name as string])),
    [data]
  );
  const mapRef = useRef<MapRef | null>(null);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const currentFeatureId = featureIds[featureIds.length - 1];
  const currentFeature = data.features.find(item => item.id === currentFeatureId) || data;
  const [initialMinLng, initialMinLat, initialMaxLng, initialMaxLat] = bbox(transformScale(currentFeature, 0.65));
  const [minLng, minLat, maxLng, maxLat] = bbox(transformScale(currentFeature, 2));
  mapRef.current?.fitBounds([initialMinLng, initialMinLat, initialMaxLng, initialMaxLat], { padding: 0, duration: 1000 });
  mapRef.current?.getMap().setMaxBounds([minLng, minLat, maxLng, maxLat]);

  const handleTextInput = (input: string) => {
    setUserGuess(input);
  };

  if (userGuess != null) {
    const currentFeatureName = featureNamesById.get(currentFeatureId) || "Missing feature name";
    const isCorrect = distance(String(userGuess).replace(/\s+/g, "").toLowerCase(), currentFeatureName.replace(/\s+/g, "").toLowerCase()) < 2;
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
      <MaplibreMap
        initialViewState={{
          bounds: [initialMinLng, initialMinLat, initialMaxLng, initialMaxLat]
        }}
        maxBounds={[minLng, minLat, maxLng, maxLat]}
        doubleClickZoom={false}
        dragRotate={false}
        touchPitch={false}
        cursor="default"
        mapStyle={mapstyle}
        attributionControl={false}
        ref={mapRef}
        onLoad={event => event.target.touchZoomRotate.disableRotation()}
      >
        <AttributionControl position="top-right" compact />
      </MaplibreMap>
      <div className="absolute bottom-0 sm:bottom-[15%] left-50 sm:left-[10%] pointer-events-none sm:pointer-events-auto overflow-clip sm:overflow-visible py-3 pb-[calc(env(safe-area-inset-bottom)+4px)]">
        <QuestionHistory
          entries={questionHistory}
        />
        <TextInput
          onEnterText={handleTextInput}
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
