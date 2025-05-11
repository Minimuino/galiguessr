export const Mode = {
  PointAndClick: "point-and-click",
  GuessLocation: "guess-location",
  WriteName: "write-name",
  ChooseOption: "choose-option",
  CityMap: "city-map",
} as const;

export type Mode = typeof Mode[keyof typeof Mode];
