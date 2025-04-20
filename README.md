# GaliGuessr

React geography quiz 🌍 Originally designed for [Galicia](https://en.wikipedia.org/wiki/Galicia_(Spain)) but customizable for any region in the world. Try it for yourself at ...

## Features

- Three game modes: Point & Click, Write Name and Guess Location.
- Load any valid geojson and create a custom map quiz.
- Responsive design.

## Usage

1. Fork this repo.
2. Choose a name and logo for your project and set it in metadata properties.
3. Replace all files in `/data/geojson` with your own. Make sure each Feature item has an `id` field and a `properties` field that includes the `name` property.
4. Edit `settings.json` to reference each one of your geojson files.
5. Set your language to 'en', or add new i18n files if you want so.
6. Deploy and enjoy!

## Next.js

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font).

## License

[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

Every file in this project is licensed under the [GNU General Public License, version 3](https://www.gnu.org/licenses/gpl-3.0), Copyright (C) 2025 Carlos Pérez Ramil.
