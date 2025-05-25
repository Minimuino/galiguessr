/*
 * Copyright (c) 2025, Carlos Pérez Ramil
 *
 * This file is part of the GaliGuessr project and is licensed under the GNU GPL v3.0.
 * See LICENSE file in the root directory of this project or at <https://www.gnu.org/licenses/gpl-3.0>.
 */

import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import distance from "@turf/distance";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import polygonToLine from "@turf/polygon-to-line";
import type { Geometry, LineString } from "geojson";
import { LngLat } from "maplibre-gl";

interface DistanceToFeature {
  distance: number;
  linestring: LineString;
}

export function getDistanceToCurrentFeature(currentFeatureGeometry: Geometry, userGuess: LngLat): DistanceToFeature {

  let result: DistanceToFeature = { distance: 0, linestring: { type: "LineString", coordinates: [] } };
  const userGuessCoordinates = [userGuess.lng, userGuess.lat];

  if (currentFeatureGeometry?.type === "Point") {
    result.linestring.coordinates = [userGuessCoordinates, currentFeatureGeometry.coordinates];
    result.distance = distance(currentFeatureGeometry, userGuessCoordinates, { units: "kilometers" });
  }

  if (currentFeatureGeometry?.type === "LineString" || currentFeatureGeometry?.type === "MultiLineString") {
    const nearestPointOnPolygon = nearestPointOnLine(currentFeatureGeometry, userGuessCoordinates, { units: "kilometers" });
    result.linestring.coordinates = [userGuessCoordinates, nearestPointOnPolygon.geometry.coordinates];
    result.distance = nearestPointOnPolygon.properties.dist;
  }

  if (currentFeatureGeometry?.type === "Polygon" || currentFeatureGeometry?.type === "MultiPolygon") {
    if (booleanPointInPolygon(userGuessCoordinates, currentFeatureGeometry)) {
      return result;
    }
    const polygonAsLinestring = polygonToLine(currentFeatureGeometry);
    if (polygonAsLinestring.type === "Feature") {
      return getDistanceToCurrentFeature(polygonAsLinestring.geometry, userGuess);
    }
    if (polygonAsLinestring.type === "FeatureCollection") {
      return getDistanceToCurrentFeature(
        {
          type: "GeometryCollection",
          geometries: polygonAsLinestring.features.map(feature => feature.geometry)
        },
        userGuess);
    }
  }

  if (currentFeatureGeometry?.type === "MultiPoint") {
    return getDistanceToCurrentFeature(
      {
        type: "GeometryCollection",
        geometries: currentFeatureGeometry.coordinates.map(pos => ({ type: "Point", coordinates: pos }))
      },
      userGuess);
  }

  if (currentFeatureGeometry?.type === "GeometryCollection") {
    result = currentFeatureGeometry.geometries
      .map(geometry => getDistanceToCurrentFeature(geometry, userGuess))
      .reduce((prev, curr) => (curr.distance < prev.distance) ? curr : prev);
  }

  return result;
}

export function clampMapBounds(bounds: [number, number, number, number]): [number, number, number, number] | undefined {
  let [minLng, minLat, maxLng, maxLat] = bounds;

  minLng = ((minLng + 180) % 360 + 360) % 360 - 180;
  maxLng = ((maxLng + 180) % 360 + 360) % 360 - 180;
  if (minLng > maxLng) {
    return undefined;
  }

  minLat = Math.min(Math.max(minLat, -90.0), 90.0);
  maxLat = Math.min(Math.max(maxLat, -90.0), 90.0);

  return [minLng, minLat, maxLng, maxLat];
}
