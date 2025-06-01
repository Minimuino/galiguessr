/*
 * Copyright (c) 2025, Carlos Pérez Ramil
 *
 * This file is part of the GaliGuessr project and is licensed under the GNU GPL v3.0.
 * See LICENSE file in the root directory of this project or at <https://www.gnu.org/licenses/gpl-3.0>.
 */

import type { Feature, FeatureCollection, GeoJsonProperties } from "geojson";
import { useCallback, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Mode } from "../enums";

export default function SelectFile() {
  const [fileContent, setFileContent] = useState<FeatureCollection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const featureCollection = JSON.parse(content) as FeatureCollection;
        featureCollection.features.forEach(sanitizeFeatures);
        setFileContent(featureCollection);
      } catch (err) {
        setError("Failed to parse JSON file");
        console.error("Error parsing JSON:", err);
      }
    };
    reader.onerror = () => {
      setError("Error reading file");
    };
    reader.readAsText(file);

    //TODO: Validate datasets are well formed geojsons with id and name fields

  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selectedMode = event.currentTarget.elements.namedItem("mode") as HTMLInputElement;
    void navigate(`/play?mode=${selectedMode.value}`, { state: { fileContent } });
  };

  return (
    <div className="flex flex-col items-center p-10 gap-8">
      <label className="text-xl"><b>Map Quiz Generator</b></label>
      <form
        className="flex flex-col items-left gap-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-row gap-5">
          <label>Select a valid GeoJSON File: </label>
          <input
            type="file"
            accept=".json,.geojson"
            onChange={handleFileChange}
          />
        </div>
        <div className="flex flex-row gap-5">
          <label>Select quiz mode: </label>
          <select id="mode" name="mode">
            {Object.values(Mode)
              .map((mode, index: number) => (
                <option
                  value={mode}
                  key={index}>
                  {t("modes." + mode, { lng: 'en' })}
                </option>
              ))
            }
          </select>
        </div>
        <button
          className="border border-solid border-black p-2"
          type="submit"
        >
          Play
        </button>
      </form>

      {error && <div style={{ color: "red" }}>{error}</div>}

    </div>
  );
};

const sanitizeFeatures = (feature: Feature, index: number) => {
  const featureProperties: GeoJsonProperties = feature.properties || { name: "Missing feature name" };
  const featureName = featureProperties[Object.keys(featureProperties).find(key => key.toLowerCase() === "name") || "name"] as string;
  feature.id = index;
  feature.properties = { name: featureName || "Missing feature name" };
};
