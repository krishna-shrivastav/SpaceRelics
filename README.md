# SPACE RELICS — The Forgotten Machines of Space

Responsive interactive educational space museum prototype.

## Run locally
No build step or backend required. Open `index.html` in a modern browser, or run `python -m http.server 8000` in this folder and visit `http://localhost:8000`.

## Included interactions
- Responsive landing page and destination selection
- Relic archive with Moon / Mars / Deep Space and status filters
- Apollo 11 featured relic panel
- Schematic Moon / Mars mission marker explorer with clickable markers and zoom
- Mission timeline with era filters
- Science Lab explainers
- Five-chapter Apollo 11 story mode
- Mission quiz with answer explanations
- Mission matching mini-game
- Mission comparison tool
- Educator discussion prompts
- Search across the relic archive
- Discovery progress tracker

## Image and source notes
`assets/eagle-hero.png` is an AI-generated artistic visualization created for this prototype. It is **not** a NASA archival photograph, engineering drawing or exact reconstruction. The page labels it accordingly.

Primary sources to consult for authentic NASA imagery and facts:
- https://science.nasa.gov/resource/apollo-11-landing-site/
- https://science.nasa.gov/resource/apollo-11-landing-site-from-dawn-to-dusk/
- https://www.nasa.gov/missions/apollo/apollo-11-mission-overview/
- https://www.nasa.gov/wp-content/uploads/static/history/alsj/a11/images11.html
- https://science.nasa.gov/wp-content/uploads/2023/09/Apollo_11.pdf
- https://images.nasa.gov/
- https://pds.nasa.gov/
- https://nasa3d.arc.nasa.gov/

NASA is not affiliated with or endorsing this independent educational concept. Check usage terms and credit requirements for every asset added. Map markers are schematic and must not be used for navigation or scientific geolocation. Verify exact coordinates, statuses and details against primary records before formal publication.

## Production recommendations
1. Replace or supplement the generated hero artwork with properly credited NASA archival images.
2. Add real NASA 3D models with verified provenance and optimize for mobile.
3. Replace schematic map markers with validated site coordinates and an appropriate map projection.
4. Attach exact source citations, dataset versions and access dates to every relic.
5. Test keyboard navigation, screen readers, image loading and mobile performance.
6. Add a backend only if user accounts, classroom dashboards or content management are required.


# SPACE RELICS V2 — Advanced Edition

V2 preserves the V1 museum and adds the following:

## New V2 modules
- Interactive 3D Moon and Mars globes (Three.js), with orbit drag, zoom, rotation controls and clickable mission-site markers.
- Mission-site reference coordinates for Apollo 11–17 and selected Mars missions. Values are rounded reference coordinates; the globe is schematic and is not a precision terrain map.
- NASA-hosted Apollo Lunar Module GLB model using Google's `<model-viewer>` component. Rotate, zoom and reset the camera.
- Engineering inspector for descent stage, ascent stage, landing gear, propulsion and crew systems.
- Live NASA Image and Video Library search using the public `images-api.nasa.gov` search endpoint.
- NASA media cards with original NASA record links, titles and descriptions.

## Run
Static website: open `index.html` in a modern browser or run `python -m http.server 8000` and open `http://localhost:8000`.

## External connections required for V2
The new 3D globe loads Three.js from jsDelivr. The Apollo Lunar Module model loads the official NASA GLB file from `assets.science.nasa.gov`. The NASA media gallery calls `images-api.nasa.gov`. These V2 features require an internet connection. V1 archive, story, quiz, timeline and other local features remain available without those services.

## Official model and data references
- NASA Apollo Lunar Module 3D model, source NASA / Michael D. Carbajal: https://science.nasa.gov/3d-resources/apollo-lunar-module/
- Direct NASA GLB asset: https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/model/apollo-lunar-module/Apollo%20Lunar%20Module.glb
- NASA 3D Resources collection: https://science.nasa.gov/3d-resources/
- NASA Image and Video Library API documentation: https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf
- NASA Open APIs: https://api.nasa.gov/

## Accuracy and attribution notes
- The Apollo Lunar Module GLB is a NASA-hosted model and is attributed in the interface.
- The 3D Moon/Mars globes are procedural educational visualizations with mission-site markers. They are not built from NASA DEM/LOLA/MOLA elevation datasets and must not be described as precision terrain or navigation maps.
- The site coordinates are rounded reference values for educational orientation. Check mission-specific primary sources and authoritative geospatial products before scientific or operational reuse.
- NASA media gallery results link back to NASA's individual records. Verify each asset's credit and usage guidance before downloading, publishing, or modifying it.
- This is an independent educational website and is not an official NASA product or endorsed by NASA.


# SPACE RELICS V3 — Complete Interactive Prototype

V3 preserves the V1 and V2 experience and adds:
- Mission Control registry with search, destination and decade filters; expandable mission dossiers.
- Planetary Data Lab with direct links to the USGS/NASA LOLA lunar DEM archive, ASU MOLA Mars data and NASA Mars global maps.
- NASA Astronomy Picture of the Day panel using the current NASA Science WordPress endpoint documented by the NASA API portal.
- Browser-local research workspace: field notes, saved items and JSON export.
- Student Expedition Planner with editable objectives, copy and downloadable plan.
- Ten-question assessment with answer explanations and locally saved best score.
- PWA manifest and service worker for caching the website shell and visited same-origin assets.

## Run locally
Use a local server (recommended):
`python -m http.server 8000`
Then visit `http://localhost:8000` and open `index.html`.

## Offline and online behaviour
The museum shell, local catalogue, mission registry, quiz, notes, saved collection and expedition planner are designed to work in the browser. First install/cache requires opening the site over HTTP(S). External NASA imagery, NASA model viewer, Three.js, APOD and media search require an internet connection. Browser localStorage is device/browser-specific; no account sync or remote database is included.

## Scientific integrity
- The Moon/Mars 3D globes remain schematic procedural educational globes with mission markers, not precision terrain reconstructions.
- LOLA and MOLA are linked as real public science data sources. The large elevation grids are not bundled in this ZIP; users can access them from the linked official data portals and use GIS tools.
- The NASA Apollo Lunar Module model is externally hosted by NASA. It requires an internet connection.
- The NASA Image and Video Library results and APOD are external live data and can be temporarily unavailable.
- Mission summaries are educational overviews. Verify details against the linked mission source before using them in formal scientific work.
- SPACE RELICS is an independent educational prototype, not an official NASA product or endorsed by NASA.

## Key primary data references
- NASA Open APIs: https://api.nasa.gov/
- NASA Image and Video Library API: https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf
- NASA Astronomy Picture of the Day current API information: https://api.nasa.gov/
- USGS Astropedia Moon LRO LOLA DEM 118m: https://astrogeology.usgs.gov/search/map/moon_lro_lola_dem_118m
- LOLA Planetary Geodesy Data Archive: https://imbrium.mit.edu/
- ASU Mars global data / MOLA shaded relief: https://www.mars.asu.edu/data/
- NASA Mars global data maps: https://marsoweb.nas.nasa.gov/globalData/
- NASA Planetary Data System: https://pds.nasa.gov/
