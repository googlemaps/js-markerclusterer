/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import points from "./realworld.json";

declare let L: any; /* eslint-disable-line @typescript-eslint/no-explicit-any */

const tiles = L.tileLayer("//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution:
    '&copy; <a href="//openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ',
});

const map = L.map("map", {
  center: L.latLng(-37.89, 175.46),
  zoom: 8,
  layers: [tiles],
});

const mcg = L.markerClusterGroup({
  chunkedLoading: true,
  spiderfyOnMaxZoom: false,
});

for (const [lat, lng, title] of points as [number, number, string][]) {
  const marker = L.marker(new L.LatLng(lat, lng), { title });
  marker.bindPopup(title);
  mcg.addLayer(marker);
}

map.addLayer(mcg);
