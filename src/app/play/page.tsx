"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapLayerMouseEvent } from "maplibre-gl";
import type { FeatureCollection } from "geojson";
import MapView from "@/components/MapView";
import ScoreLabel from "@/components/ScoreLabel";
import GameOverModal from "@/components/GameOverModal";
import { shuffle } from "@/utils/ArrayUtils";

const QuestionLabel = dynamic(() => import("@/components/QuestionLabel"), { ssr: false });

import comarcas from "../../../data/geojson/comarcas.json";
const data = comarcas as FeatureCollection;

export default function Play() {
  const [featureIds, setFeatureIds] = useState<(string | number | undefined)[]>(shuffle(data.features.map((feature) => feature.id)));
  const [userGuess, setUserGuess] = useState<string | number | undefined>(undefined);
  const [rightGuessFeatureIds, setRightGuessFeatureIds] = useState<(string | number | undefined)[]>([]);
  const [wrongGuessFeatureIds, setWrongGuessFeatureIds] = useState<(string | number | undefined)[]>([]);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  /*
  const handleTextInput = (input: string) => {
    setUserGuess(input);
  }*/
  const handleMouseClick = (event: MapLayerMouseEvent) => {
    const clickedFeature = event.features && event.features[0];
    if (clickedFeature != null) {
      setUserGuess(clickedFeature.id);
    }
  }
  const resetState = () => {
    setFeatureIds(shuffle(data.features.map((feature) => feature.id)));
    setUserGuess(undefined);
    setRightGuessFeatureIds([]);
    setWrongGuessFeatureIds([]);
    modalRef.current?.close();
  }

  if (userGuess != null) {
    const currentFeatureId = featureIds.at(-1);
    if (userGuess === currentFeatureId) {
      rightGuessFeatureIds.push(currentFeatureId);
    } else {
      wrongGuessFeatureIds.push(currentFeatureId);
    }
    featureIds.pop();
    setUserGuess(undefined);
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
        onClick={handleMouseClick}
      />
      <div className="absolute bottom-[6%] sm:bottom-[15%] left-50 sm:left-[10%]">
        <QuestionLabel
          textToDisplay={data.features.find(feature => feature.id === featureIds.at(-1))?.properties?.name}
        />
        <ScoreLabel
          score={rightGuessFeatureIds.length}
          total={data.features.length}
        />
      </div>
      <GameOverModal
        score={rightGuessFeatureIds.length}
        datasetName="datasetName"
        modeName="modeName"
        playAgainCallback={resetState}
        ref={modalRef}
      />
    </div>
  );
}
