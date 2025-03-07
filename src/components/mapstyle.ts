import type { LayerProps } from 'react-map-gl/maplibre';

export const hoverLayerStyle: LayerProps = {
  id: "hoverableLayer",
  type: "fill",
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

export const outlineLayerStyle: LayerProps = {
  id: "outlineLayer",
  type: "line",
  paint: {
    "line-width": 1,
    "line-color": "#075c8a",
  }
};

export const rightGuessLayerStyle: LayerProps = {
  id: "rightGuessLayer",
  type: "fill",
  paint: {
    "fill-color": "#1e9622",
    "fill-opacity": 0.4
  }
};

export const wrongGuessLayerStyle: LayerProps = {
  id: "wrongGuessLayer",
  type: "fill",
  paint: {
    "fill-color": "#961e1e",
    "fill-opacity": 0.4
  }
};
