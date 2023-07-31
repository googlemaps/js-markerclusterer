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

import { getLoaderOptions } from "./config";
import { Loader } from "@googlemaps/js-api-loader";
import { MarkerClusterer, SuperClusterViewportAlgorithm } from "../src";
import points from "./realworld.json";

// Do not set the mapId to force legacy markers
const mapOptions: google.maps.MapOptions = {
  center: { lat: -37.89, lng: 175.46 },
  zoom: 8,
  maxZoom: 18,
};

new Loader(getLoaderOptions()).load().then(() => {
  const element = document.getElementById("map");

  const map = new google.maps.Map(element, mapOptions);

  const markers = (points as [number, number, string][]).map(
    ([lat, lng, label]) =>
      new google.maps.Marker({ position: { lat, lng }, label })
  );

  const markerCluster = new MarkerClusterer({
    markers,
    algorithm: new SuperClusterViewportAlgorithm({
      maxZoom: 30,
      viewportPadding: 60,
    }),
  });

  markerCluster.setMap(map);
});
