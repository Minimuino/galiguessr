/*
 * Copyright (c) 2025, Carlos Pérez Ramil
 *
 * This file is part of the GaliGuessr project and is licensed under the GNU GPL v3.0.
 * See LICENSE file in the root directory of this project or at <https://www.gnu.org/licenses/gpl-3.0>.
 */

export const Mode = {
  PointAndClick: "point-and-click",
  GuessLocation: "guess-location",
  WriteName: "write-name",
  CityMap: "city-map",
} as const;

export type Mode = typeof Mode[keyof typeof Mode];
