/*
 * Copyright (c) 2025, Carlos Pérez Ramil
 *
 * This file is part of the GaliGuessr project and is licensed under the GNU GPL v3.0.
 * See LICENSE file in the root directory of this project or at <https://www.gnu.org/licenses/gpl-3.0>.
 */

import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    plugins: [
      react(),
      {
        name: "custom-html-tags-injector",
        transformIndexHtml(html) {
          const tags = env.VITE_CUSTOM_HTML_TAGS || "";
          return html.replace("<!-- INJECT_CUSTOM_TAGS -->", tags);
        }
      }
    ],
    base: "/galiguessr/",
    define: {
      "process.env": {
        VITE_SUPPORT_EMAIL: JSON.stringify(env.VITE_SUPPORT_EMAIL),
      },
    },
  };
});
