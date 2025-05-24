# GaliGuessr

React geography quiz 🌍 Originally designed for [Galicia](https://en.wikipedia.org/wiki/Galicia_(Spain)) but customizable for any region in the world. Try it for yourself at ...

## Features

- Four game modes: Point & Click, Write Name, Guess Location and City Map.
- Load any valid geojson file and create a custom map quiz.
- Responsive design.

## Usage

1. Fork this repo.
2. Choose a name and logo for your project and set it in metadata properties.
3. Replace all files in `/data/geojson` with your own. Make sure each Feature item has an `id` field and a `properties` field that includes the `name` property.
4. Edit `/src/assets/settings.json` to reference each one of your geojson files.
5. Set your language to 'en' in `/src/i18n.ts`, or add new i18n files if you want so.
6. Edit `/src/components/CreditsModal.tsx` to add your own copyright notice.
7. Deploy and enjoy!

## License

[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

Every file in this project is licensed under the [GNU General Public License, version 3](https://www.gnu.org/licenses/gpl-3.0), Copyright (C) 2025 Carlos Pérez Ramil, except for those files in /public/fonts which have the following license:
  - /public/fonts/GeistMono-Variable.woff2 - SIL Open Font License, Version 1.1. This license is available with a FAQ at https://scripts.sil.org/OFL
