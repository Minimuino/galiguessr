"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { FeatureCollection, Feature } from "geojson";
import centroid from "@turf/centroid";
import { Mode } from "@/app/enums";
import StandardQuiz from "@/components/StandardQuiz";
import GuessLocationQuiz from "@/components/GuessLocationQuiz";
import CityMapQuiz from "@/components/CityMapQuiz";
import { shuffle } from "@/utils/ArrayUtils";

import settingsJson from "../../../data/settings.json";

const selectRandomData = async (): Promise<FeatureCollection> => {
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
  const datasetName = settingsJson.datasets.find(dataset => dataset.data === queryParams.get("dataset"))?.name;
  let quiz = null;
  if (mode === "city-map") {
    quiz = <CityMapQuiz
      data={data}
      datasetName={datasetName}
      onResetGame={() => window.location.reload()}
    />;
  } else if (mode === "guess-location") {
    quiz = <GuessLocationQuiz
      data={data}
      datasetName={datasetName}
      onResetGame={() => window.location.reload()}
    />;
  } else {
    const processedData = {
      ...data,
      features: data.features.map(feature => (feature.properties?.renderAsPoint)
        ? { ...centroid(feature.geometry), id: feature.id, properties: feature.properties }
        : feature
      )
    };
    quiz = <StandardQuiz
      data={processedData}
      mode={mode}
      datasetName={datasetName}
      onResetGame={() => window.location.reload()}
    />;
  }
  return (
    <>
      {quiz}
      <Link
        className="back-button absolute top-[2%] sm:top-[4%] left-[3%]"
        href="/"
      >
        <Image
          className="-translate-x-[2px]"
          src="/back.svg"
          alt="Back"
          width={16}
          height={16}
        />
      </Link>
    </>);
}
