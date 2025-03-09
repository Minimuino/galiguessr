"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { FeatureCollection } from "geojson";
import StandardQuiz from "@/components/StandardQuiz";
import CityMapQuiz from "@/components/CityMapQuiz";
import { Mode } from "@/app/enums";

export default function Play() {
  const [data, setData] = useState<FeatureCollection | undefined>();
  const [error, setError] = useState(null);
  const queryParams = useSearchParams();

  useEffect(() => {
    import("../../../data/geojson/" + queryParams.get("dataset"))
      .then((geojson) => {
        const featureCollection: FeatureCollection = geojson.default;
        setData(featureCollection);
      })
      .catch(error => {
        setError(error);
      });
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
  return <StandardQuiz
    data={data}
    mode={mode}
    onResetGame={() => window.location.reload()}
  />;
}
