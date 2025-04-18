"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { FeatureCollection, Feature } from "geojson";
import { Mode } from "@/app/enums";
import StandardQuiz from "@/components/StandardQuiz";
import GuessLocationQuiz from "@/components/GuessLocationQuiz";
import CityMapQuiz from "@/components/CityMapQuiz";
import { shuffle } from "@/utils/ArrayUtils";

const selectRandomData = async (): Promise<FeatureCollection> => {
  const settingsJson = await import("../../../data/settings.json");
  let features: Feature[] = [];

  const datasets = settingsJson.datasets;
  for (let i = 0; i < datasets.length; i++) {
    if (datasets.at(i)?.data === "random") {
      continue;
    }
    const geojson = await import("../../../data/geojson/" + datasets.at(i)?.data);
    const featureCollection: FeatureCollection = structuredClone(geojson.default);
    featureCollection.features.forEach(feature => {
      feature.properties = feature.properties ?? {};
      feature.properties.name = datasets.at(i)?.name + ": " + (feature.properties?.name ?? '');
    });
    features = features.concat(featureCollection.features);
  }

  shuffle(features);
  features = features.slice(0, 100);

  let id = 0;
  features.forEach(feature => {
    feature.id = id;
    id++;
  });
  return { type: "FeatureCollection", features: features };
}

export default function Play() {
  const [data, setData] = useState<FeatureCollection | undefined>();
  const [error, setError] = useState(null);
  const queryParams = useSearchParams();

  useEffect(() => {
    if (queryParams.get("dataset") === "random") {
      selectRandomData()
        .then((featureCollection) => {
          setData(featureCollection);
        })
        .catch(error => {
          setError(error);
        });
    } else {
      import("../../../data/geojson/" + queryParams.get("dataset"))
        .then((geojson) => {
          const featureCollection: FeatureCollection = geojson.default;
          setData(featureCollection);
        })
        .catch(error => {
          setError(error);
        });
    }
  }, [queryParams]);

  if (error) {
    return <p className="h-screen flex items-center justify-center">{String(error)}</p>;
  }
  if (!data) {
    return <p className="h-screen flex items-center justify-center">Loading...</p>;
  }

  // Validate datasets are well formed geojsons with id and name fields

  const mode = (queryParams.get("mode") || Mode.PointAndClick) as Mode;
  if (mode === "city-map") {
    return <CityMapQuiz
      data={data}
      onResetGame={() => window.location.reload()}
    />;
  }
  if (mode === "guess-location") {
    return <GuessLocationQuiz
      data={data}
      onResetGame={() => window.location.reload()}
    />;
  }
  return <StandardQuiz
    data={data}
    mode={mode}
    onResetGame={() => window.location.reload()}
  />;
}
