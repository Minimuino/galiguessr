import type { LayerProps } from "react-map-gl/maplibre";

export const hoverPolygonLayerStyle: LayerProps = {
  id: "hoverablePolygonLayer",
  type: "fill",
  filter: ["in", "$type", "Polygon"],
  paint: {
    "fill-color": "#2a84a1",
    "fill-outline-color": "#075c8a",
    "fill-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      1,
      0.4
    ]
  }
};

export const outlinePolygonLayerStyle: LayerProps = {
  id: "outlinePolygonLayer",
  type: "line",
  filter: ["in", "$type", "Polygon"],
  paint: {
    "line-width": 1,
    "line-color": "#075c8a",
  }
};

export const rightGuessPolygonLayerStyle: LayerProps = {
  id: "rightGuessPolygonLayer",
  type: "fill",
  filter: ["in", "$type", "Polygon"],
  paint: {
    "fill-color": "#1e9622",
    "fill-opacity": 0.4
  }
};

export const wrongGuessPolygonLayerStyle: LayerProps = {
  id: "wrongGuessPolygonLayer",
  type: "fill",
  filter: ["in", "$type", "Polygon"],
  paint: {
    "fill-color": "#961e1e",
    "fill-opacity": 0.4
  }
};

export const hoverLineLayerStyle: LayerProps = {
  id: "hoverableLineLayer",
  type: "line",
  filter: ["in", "$type", "LineString"],
  layout: {
    "line-cap": "round",
    "line-join": "round"
  },
  paint: {
    "line-color": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      "#2a84a1",
      "#7bb3c3"
    ],
    "line-width": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      8,
      5
    ]
  }
};

export const rightGuessLineLayerStyle: LayerProps = {
  id: "rightGuessLineLayer",
  type: "line",
  filter: ["in", "$type", "LineString"],
  layout: {
    "line-cap": "round",
    "line-join": "round"
  },
  paint: {
    "line-width": 4,
    "line-color": "#1e9622",
  }
};

export const wrongGuessLineLayerStyle: LayerProps = {
  id: "wrongGuessLineLayer",
  type: "line",
  filter: ["in", "$type", "LineString"],
  layout: {
    "line-cap": "round",
    "line-join": "round"
  },
  paint: {
    "line-width": 4,
    "line-color": "#961e1e",
  }
};
