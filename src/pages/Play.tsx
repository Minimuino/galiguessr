/*
 * Copyright (c) 2025, Carlos Pérez Ramil
 *
 * This file is part of the GaliGuessr project and is licensed under the GNU GPL v3.0.
 * See LICENSE file in the root directory of this project or at <https://www.gnu.org/licenses/gpl-3.0>.
 */

import centroid from "@turf/centroid";
import type { Feature, FeatureCollection } from "geojson";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router";
import { useSearchParams } from "react-router-dom";
import CityMapQuiz from "../components/CityMapQuiz";
import GuessLocationQuiz from "../components/GuessLocationQuiz";
import StandardQuiz from "../components/StandardQuiz";
import { Mode } from "../enums";
import { shuffle } from "../utils/ArrayUtils";
import { removeFileExtension } from "../utils/StringUtils";

import settingsJson from "../assets/settings.json";

const selectRandomData = async (): Promise<FeatureCollection> => {
  let features: Feature[] = [];
  const datasets = settingsJson.datasets;

  for (const dataset of datasets) {
    if (dataset.data === "random") {
      continue;
    }
    const fileNameWithoutExtension = removeFileExtension(dataset.data);
    const geojson = await import(`../assets/geojson/${fileNameWithoutExtension}.json`) as { default: FeatureCollection };
    const featureCollection = structuredClone(geojson.default);
    featureCollection.features.forEach(feature => {
      feature.properties = feature.properties ?? {};
      feature.properties.name = dataset.name + ": " + (feature.properties?.name ?? '');
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
  const [error, setError] = useState<Error | null>(null);
  const [queryParams] = useSearchParams();
  const { t } = useTranslation();

  useEffect(() => {
    if (queryParams.get("dataset") === "random") {
      selectRandomData()
        .then((featureCollection) => {
          setData(featureCollection);
        })
        .catch((error: Error) => {
          setError(error);
        });
    } else {
      import(`../assets/geojson/${queryParams.get("dataset")}.json`)
        .then((geojson: { default: FeatureCollection }) => {
          const featureCollection = geojson.default;
          setData(featureCollection);
        })
        .catch((error: Error) => {
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
  const datasetName = settingsJson.datasets.find(dataset => removeFileExtension(dataset.data) === queryParams.get("dataset"))?.name;
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
        className="back-button absolute top-[3%] sm:top-[4%] left-[3%]"
        to="/"
      >
        <img
          className="-translate-x-[2px]"
          src="/back.svg"
          alt="Back"
          width={16}
          height={16}
        />
        <p className="p-2 hidden sm:inline">{t("back")}</p>
      </Link>
    </>);
}
