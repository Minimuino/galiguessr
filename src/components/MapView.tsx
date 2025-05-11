import { useRef, useMemo } from "react";
import Map, { Source, Layer } from "react-map-gl/maplibre";
import type { MapLayerMouseEvent, MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { FeatureCollection } from "geojson";
import bbox from "@turf/bbox";
import {
  hoverPolygonLayerStyle,
  hoverLineLayerStyle,
  hoverPointLayerStyle,
  outlinePolygonLayerStyle,
  rightGuessPolygonLayerStyle,
  rightGuessLineLayerStyle,
  rightGuessPointLayerStyle,
  wrongGuessPolygonLayerStyle,
  wrongGuessLineLayerStyle,
  wrongGuessPointLayerStyle
} from "./mapstyle";
import { clampLat, clampLng } from "../utils/MapUtils";

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
  highlightedFeatureId: string | number | undefined;
  onClick?: (event: MapLayerMouseEvent) => void;
}

export default function MapView({ data, pendingGuessFeatures, rightGuessFeatures, wrongGuessFeatures, highlightedFeatureId, interactive, onClick }: Props) {
  const hoveredFeatureId = useRef<string | number | undefined>(undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [minLng, minLat, maxLng, maxLat] = useMemo(() => bbox(data), []); // Calculate bbox only on first render
  const mapRef = useRef<MapRef | null>(null);

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

  setHoverFeatureState(mapRef.current, highlightedFeatureId);

  return (
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
      interactiveLayerIds={(interactive) ? ["hoverablePolygonLayer", "hoverableLineLayer", "hoverablePointLayer"] : undefined}
      onMouseMove={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      onLoad={event => setHoverFeatureState(event.target, highlightedFeatureId)}
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
    </Map>
  );
}
