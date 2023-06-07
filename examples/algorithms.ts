/**
 * Copyright 2021 Google LLC
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

import {
  AbstractAlgorithm,
  GridAlgorithm,
  MarkerClusterer,
  NoopAlgorithm,
  SuperClusterAlgorithm,
} from "../src";
import { MAP_ID, createMarker, getLoaderOptions, sync } from "./config";

import { Loader } from "@googlemaps/js-api-loader";
import trees from "./trees.json";

const mapOptions: google.maps.MapOptions = {
  center: { lat: 40.7128, lng: -73.85 },
  zoom: 10,
  mapId: MAP_ID,
};

new Loader(getLoaderOptions()).load().then(() => {
  const maps: google.maps.Map[] = [];

  const panels: [HTMLElement, AbstractAlgorithm, string][] = [
    [
      document.getElementById("noop"),
      new NoopAlgorithm({}),
      `new NoopAlgorithm()`,
    ],
    [
      document.getElementById("grid"),
      new GridAlgorithm({ maxDistance: 40000 }),
      `new GridAlgorithm({})`,
    ],
    [
      document.getElementById("supercluster"),
      new SuperClusterAlgorithm({}),
      `new SuperClusterAlgorithm({})`,
    ],
  ];

  panels.forEach(([element, algorithm, text]) => {
    const map = new google.maps.Map(element, mapOptions);
    maps.push(map);

    const textElement = document.createElement("pre");
    textElement.innerText = text;
    textElement.classList.add("description");

    map.controls[google.maps.ControlPosition.LEFT_TOP].push(textElement);

    const markers = trees.map(({ geometry }) =>
      createMarker(map, geometry.coordinates[1], geometry.coordinates[0])
    );

    new MarkerClusterer({
      algorithm,
      map,
      markers,
    });
  });

  sync(...maps);
});
