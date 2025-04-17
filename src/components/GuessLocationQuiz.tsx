import { useState, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { LngLat, MapLayerMouseEvent } from "maplibre-gl";
import Map, { Source, Layer, Marker, MapRef } from "react-map-gl/maplibre";
import type { Feature, FeatureCollection, LineString } from "geojson";
import bbox from "@turf/bbox";
import ScoreLabel from "@/components/ScoreLabel";
import GameOverModal from "@/components/GameOverModal";
import DistanceLabel from "@/components/DistanceLabel";
import { shuffle } from "@/utils/ArrayUtils";
import { clampLat, clampLng, getDistanceToCurrentFeature } from "@/utils/MapUtils";
import { hoverPolygonLayerStyle, hoverLineLayerStyle, outlinePolygonLayerStyle } from "./mapstyle";
import styles from "./styles.module.css";

const QuestionLabel = dynamic(() => import("@/components/QuestionLabel"), { ssr: false });

interface Props {
  data: FeatureCollection;
  onResetGame: () => void;
}

export default function GuessLocationQuiz({ data, onResetGame }: Props) {
  const [features] = useState<Feature[]>(shuffle(Array.from(data.features)));
  const [userGuess, setUserGuess] = useState<LngLat | undefined>(undefined);
  const [totalDistanceKm, setTotalDistanceKm] = useState<number>(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [minLng, minLat, maxLng, maxLat] = useMemo(() => bbox(data), []); // Calculate bbox only on first render
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const mapRef = useRef<MapRef | null>(null);

  const handleMouseClick = (event: MapLayerMouseEvent) => {
    if (!userGuess) {
      setUserGuess(event.lngLat);
    }
  };
  const handleNextButtonClick = () => {
    setTotalDistanceKm(totalDistanceKm + currentDistanceKm);
    features.pop();
    setUserGuess(undefined);
    mapRef.current?.fitBounds([minLng, minLat, maxLng, maxLat], { padding: 40, duration: 1000 });
  };

  let distanceLine: LineString = { type: "LineString", coordinates: [] };
  let currentDistanceKm = 0;
  if (userGuess != null) {
    const currentFeatureGeometry = features.at(-1)?.geometry;
    if (currentFeatureGeometry === undefined) {
      throw new Error('Current feature geometry is undefined');
    }
    const { distance, linestring } = getDistanceToCurrentFeature(currentFeatureGeometry, userGuess);
    currentDistanceKm = distance;
    distanceLine = linestring;
    if (currentDistanceKm > 0) {
      mapRef.current?.fitBounds([
        Math.min(linestring.coordinates[0][0], linestring.coordinates[1][0]),
        Math.min(linestring.coordinates[0][1], linestring.coordinates[1][1]),
        Math.max(linestring.coordinates[0][0], linestring.coordinates[1][0]),
        Math.max(linestring.coordinates[0][1], linestring.coordinates[1][1]),
      ], { padding: 225, duration: 1000 });
    }
  }

  if (features.length === 0) {
    modalRef.current?.showModal();
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <Map
        initialViewState={{
          bounds: [minLng, minLat, maxLng, maxLat],
          fitBoundsOptions: {
            padding: { left: 12, top: 12, right: 12, bottom: 12 }
          }
        }}
        maxBounds={[clampLng(minLng - 5), clampLat(minLat - 2), clampLng(maxLng + 5), clampLat(maxLat + 2)]}
        maxZoom={16}
        doubleClickZoom={false}
        dragRotate={false}
        cursor="default"
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-nolabels-gl-style/style.json"
        onClick={handleMouseClick}
        ref={mapRef}
      >
        {userGuess && (
          <>
            <Source id="hoverable" type="geojson" data={{ features: features.slice(-1), type: "FeatureCollection" }}>
              <Layer {...hoverPolygonLayerStyle} />
              <Layer {...hoverLineLayerStyle} />
            </Source>
            <Source id="outline" type="geojson" data={{ features: features.slice(-1), type: "FeatureCollection" }}>
              <Layer {...outlinePolygonLayerStyle} />
            </Source>
            <Source id="distance-line" type="geojson" data={distanceLine}>
              <Layer
                id="distanceLineLayer"
                type="line"
                paint={{
                  'line-width': 2,
                }}
              />
            </Source>
            <Marker
              key="userGuess"
              longitude={userGuess.lng}
              latitude={userGuess.lat}
            />
          </>
        )}
      </Map>
      <div className="absolute bottom-[6%] sm:bottom-[15%] left-50 sm:left-[10%]">
        <QuestionLabel
          textToDisplay={features.at(-1)?.properties?.name}
          disabled={userGuess != null}
        />
      </div>
      {userGuess && (
        <div className="absolute bottom-[6%] sm:bottom-[10%] left-50 flex flex-col items-center gap-2 text-2xl">
          <DistanceLabel distance={currentDistanceKm} />
          <ScoreLabel
            distance={totalDistanceKm + currentDistanceKm}
          />
          <button className={styles.quizbutton}
            onClick={handleNextButtonClick}>
            Seguinte
          </button>
        </div>
      )}
      <GameOverModal
        score={totalDistanceKm}
        datasetName="datasetName"
        modeName="modeName"
        playAgainCallback={onResetGame}
        ref={modalRef}
      />
    </div>
  );
}
