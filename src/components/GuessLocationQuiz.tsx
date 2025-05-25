/*
 * Copyright (c) 2025, Carlos Pérez Ramil
 *
 * This file is part of the GaliGuessr project and is licensed under the GNU GPL v3.0.
 * See LICENSE file in the root directory of this project or at <https://www.gnu.org/licenses/gpl-3.0>.
 */

import bbox from "@turf/bbox";
import type { Feature, FeatureCollection, LineString } from "geojson";
import { LngLat, type MapLayerMouseEvent } from "maplibre-gl";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import Map, { Layer, Marker, Source, type MapRef, type StyleSpecification } from "react-map-gl/maplibre";
import { Mode } from "../enums";
import { shuffle } from "../utils/ArrayUtils";
import { clampLat, clampLng, getDistanceToCurrentFeature } from "../utils/MapUtils";
import DistanceLabel from "./DistanceLabel";
import GameOverModal from "./GameOverModal";
import { hoverLineLayerStyle, hoverPointLayerStyle, hoverPolygonLayerStyle, outlinePolygonLayerStyle } from "./mapstyle";
import QuestionLabel from "./QuestionLabel";
import StatusLabel from "./StatusLabel";
import styles from "./styles.module.css";

import mapstylejson from "../assets/main-map-style.json";
const mapstyle = mapstylejson as StyleSpecification;

const apply_threshold = (distance: number, geometryType: string): number => {
  const thresholds_km = [
    { type: "Point", threshold: 1 },
    { type: "MultiPoint", threshold: 1 },
    { type: "LineString", threshold: 1 },
    { type: "MultiLineString", threshold: 1 }
  ];
  const t = thresholds_km.find(threshold => threshold.type === geometryType);
  return (t != null && distance < t.threshold) ? 0 : distance;
};

interface Props {
  data: FeatureCollection;
  datasetName?: string;
  onResetGame: () => void;
}

export default function GuessLocationQuiz({ data, datasetName, onResetGame }: Props) {
  const [features] = useState<Feature[]>(shuffle(Array.from(data.features)));
  const [userGuess, setUserGuess] = useState<LngLat | undefined>(undefined);
  const [totalDistanceKm, setTotalDistanceKm] = useState<number>(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [minLng, minLat, maxLng, maxLat] = useMemo(() => bbox(data), []); // Calculate bbox only on first render
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const mapRef = useRef<MapRef | null>(null);
  const { t } = useTranslation();

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
    const currentFeatureGeometry = features[features.length - 1]?.geometry;
    if (currentFeatureGeometry === undefined) {
      throw new Error('Current feature geometry is undefined');
    }
    const { distance, linestring } = getDistanceToCurrentFeature(currentFeatureGeometry, userGuess);
    currentDistanceKm = apply_threshold(distance, currentFeatureGeometry.type);
    distanceLine = linestring;
    if (currentDistanceKm > 0) {
      const [currentMinLng, currentMinLat, currentMaxLng, currentMaxLat] = bbox({
        type: "GeometryCollection",
        geometries: [currentFeatureGeometry, distanceLine]
      });
      mapRef.current?.fitBounds([currentMinLng, currentMinLat, currentMaxLng, currentMaxLat], { padding: 125, duration: 1000 });
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
        maxBounds={[clampLng(minLng - 5), clampLat(minLat - 3), clampLng(maxLng + 5), clampLat(maxLat + 3)]}
        maxZoom={16}
        doubleClickZoom={false}
        dragRotate={false}
        touchPitch={false}
        cursor="default"
        mapStyle={mapstyle}
        onClick={handleMouseClick}
        onLoad={event => event.target.touchZoomRotate.disableRotation()}
        ref={mapRef}
      >
        {userGuess && (
          <>
            <Source id="distance-line" type="geojson" data={distanceLine}>
              <Layer
                id="distanceLineLayer"
                type="line"
                paint={{
                  'line-width': 2,
                }}
              />
            </Source>
            <Source id="hoverable" type="geojson" data={{ features: features.slice(-1), type: "FeatureCollection" }}>
              <Layer {...hoverPolygonLayerStyle} />
              <Layer {...hoverLineLayerStyle} />
              <Layer {...hoverPointLayerStyle} />
            </Source>
            <Source id="outline" type="geojson" data={{ features: features.slice(-1), type: "FeatureCollection" }}>
              <Layer {...outlinePolygonLayerStyle} />
            </Source>
            <Marker
              key="userGuess"
              longitude={userGuess.lng}
              latitude={userGuess.lat}
            />
          </>
        )}
      </Map>
      <div className="absolute bottom-[85%] sm:bottom-[15%] left-50 sm:left-[10%]">
        <QuestionLabel
          textToDisplay={features[features.length - 1]?.properties?.name as string}
          disabled={userGuess != null}
        />
        <StatusLabel
          current={data.features.length - features.length + 1}
          total={data.features.length}
        />
      </div>
      {userGuess && (
        <div className="absolute bottom-[6%] sm:bottom-[10%] flex flex-col items-center gap-2 text-2xl pointer-events-none">
          <DistanceLabel distance={currentDistanceKm} />
          <StatusLabel
            distance={totalDistanceKm + currentDistanceKm}
          />
          <button className={styles.quizbutton}
            onClick={handleNextButtonClick}>
            {t("next")}
          </button>
        </div>
      )}
      <GameOverModal
        totalDistanceKm={totalDistanceKm}
        datasetName={datasetName}
        modeName={Mode.GuessLocation}
        playAgainCallback={onResetGame}
        ref={modalRef}
      />
    </div>
  );
}
