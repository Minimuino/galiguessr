/*
 * Copyright (c) 2025, Carlos Pérez Ramil
 *
 * This file is part of the GaliGuessr project and is licensed under the GNU GPL v3.0.
 * See LICENSE file in the root directory of this project or at <https://www.gnu.org/licenses/gpl-3.0>.
 */

import bbox from "@turf/bbox";
import type { FeatureCollection } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useMemo, useRef } from "react";
import type { MapLayerMouseEvent, MapLayerTouchEvent, MapRef, StyleSpecification } from "react-map-gl/maplibre";
import Map, { AttributionControl, Layer, Source } from "react-map-gl/maplibre";
import { clampLat, clampLng } from "../utils/MapUtils";
import {
  hoverLineLayerStyle,
  hoverPointLayerStyle,
  hoverPolygonLayerStyle,
  outlinePolygonLayerStyle,
  rightGuessLineLayerStyle,
  rightGuessPointLayerStyle,
  rightGuessPolygonLayerStyle,
  wrongGuessLineLayerStyle,
  wrongGuessPointLayerStyle,
  wrongGuessPolygonLayerStyle
} from "./mapstyle";

import mapstylejson from "../assets/main-map-style.json";
const mapstyle = mapstylejson as StyleSpecification;

const setHoverFeatureState = (map: maplibregl.Map | MapRef | null, highlightedFeatureId: string | number | undefined) => {
  if (highlightedFeatureId != null) {
    map?.setFeatureState(
      { source: "hoverable", id: highlightedFeatureId },
      { hover: true }
    );
  }
}

interface Props {
  data: FeatureCollection;
  pendingGuessFeatures: FeatureCollection | undefined;
  rightGuessFeatures: FeatureCollection | undefined;
  wrongGuessFeatures: FeatureCollection | undefined;
  interactive: boolean;
  attributionOnTop: boolean | undefined;
  highlightedFeatureId: string | number | undefined;
  onClick?: (event: MapLayerMouseEvent) => void;
}

export default function MapView({ data, pendingGuessFeatures, rightGuessFeatures, wrongGuessFeatures, highlightedFeatureId, interactive, attributionOnTop, onClick }: Props) {
  const hoveredFeatureId = useRef<string | number | undefined>(undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [minLng, minLat, maxLng, maxLat] = useMemo(() => bbox(data), []); // Calculate bbox only on first render
  const mapRef = useRef<MapRef | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const onHover = (event: MapLayerMouseEvent) => {
    const { features, target } = event;
    const hoveredFeature = features && features[0];
    if (hoveredFeature) {
      if (hoveredFeatureId.current != null && hoveredFeatureId.current !== hoveredFeature.id) {
        target.setFeatureState(
          { source: "hoverable", id: hoveredFeatureId.current },
          { hover: false }
        );
      }
      hoveredFeatureId.current = hoveredFeature.id;
      target.setFeatureState(
        { source: "hoverable", id: hoveredFeatureId.current },
        { hover: true }
      );
    }
  };

  const onLeave = (event: MapLayerMouseEvent) => {
    const { target } = event;
    if (hoveredFeatureId.current != null) {
      target.setFeatureState(
        { source: "hoverable", id: hoveredFeatureId.current },
        { hover: false }
      );
    }
    hoveredFeatureId.current = undefined;
  };

  const onTouchEnd = (event: MapLayerTouchEvent) => {
    const { target } = event;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (hoveredFeatureId.current) {
        target.setFeatureState(
          { source: "hoverable", id: hoveredFeatureId.current },
          { hover: false }
        );
      }
    }, 1000);
  };

  // Cleanup timeout when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  setHoverFeatureState(mapRef.current, highlightedFeatureId);

  return (
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
      attributionControl={false}
      interactiveLayerIds={(interactive) ? ["hoverablePolygonLayer", "hoverableLineLayer", "hoverablePointLayer"] : undefined}
      onMouseMove={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      onTouchEnd={onTouchEnd}
      onLoad={event => {
        event.target.touchZoomRotate.disableRotation();
        setHoverFeatureState(event.target, highlightedFeatureId);
      }}
      ref={mapRef}
    >
      {pendingGuessFeatures && (
        <Source id="hoverable" type="geojson" data={pendingGuessFeatures}>
          <Layer {...hoverPolygonLayerStyle} />
          <Layer {...hoverLineLayerStyle} />
          <Layer {...hoverPointLayerStyle} />
        </Source>
      )}
      {rightGuessFeatures && (
        <Source id="rightGuess" type="geojson" data={rightGuessFeatures}>
          <Layer {...rightGuessPolygonLayerStyle} />
          <Layer {...rightGuessLineLayerStyle} />
          <Layer {...rightGuessPointLayerStyle} />
        </Source>
      )}
      {wrongGuessFeatures && (
        <Source id="wrongGuess" type="geojson" data={wrongGuessFeatures}>
          <Layer {...wrongGuessPolygonLayerStyle} />
          <Layer {...wrongGuessLineLayerStyle} />
          <Layer {...wrongGuessPointLayerStyle} />
        </Source>
      )}
      <Source id="outline" type="geojson" data={data}>
        <Layer {...outlinePolygonLayerStyle} />
      </Source>
      <AttributionControl
        position={attributionOnTop ? "top-right" : "bottom-right"}
        compact
      />
    </Map>
  );
}
