import type { Geometry, LineString } from "geojson";
import { LngLat } from "maplibre-gl";
import distance from "@turf/distance";
import polygonToLine from "@turf/polygon-to-line";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";

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


export function clampLng(lng: number): number {
  return Math.min(Math.max(lng, -180.0), 180.0);
}

export function clampLat(lat: number): number {
  return Math.min(Math.max(lat, -90.0), 90.0);
}
