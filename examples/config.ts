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

import { LoaderOptions } from "@googlemaps/js-api-loader";
import { MarkerUtils } from "../src/marker-utils";

export const MAP_ID = "DEMO_MAP_ID";

const DEFAULT_KEY = "AIzaSyDhRjl83cPVWeaEer-SnKIw7GTjBuqWxXI";

export const getLoaderOptions = (): LoaderOptions => ({
  apiKey: localStorage.getItem("gmaps-key") ?? DEFAULT_KEY,
  version: "weekly",
  libraries: ["marker"],
});

// helper function to keep maps in sync
export const sync = (...maps: google.maps.Map[]): void => {
  let center: google.maps.LatLng;
  let zoom: number;

  function update(changedMap: google.maps.Map) {
    maps.forEach((m) => {
      if (m === changedMap) {
        return;
      }

      m.setCenter(center);
      m.setZoom(zoom);
    });
  }

  maps.forEach((m) => {
    m.addListener("bounds_changed", () => {
      const changedCenter = m.getCenter();
      const changedZoom = m.getZoom();

      if (changedCenter !== center || changedZoom !== zoom) {
        center = changedCenter;
        zoom = changedZoom;
        update(m);
      }
    });
  });
};

// Creates a marker.
//
// Prefers advanced markers when they are available.
export function createMarker(map: google.maps.Map, lat: number, lng: number) {
  if (MarkerUtils.isAdvancedMarkerAvailable(map)) {
    return new google.maps.marker.AdvancedMarkerElement({
      map,
      position: { lat, lng },
    });
  }

  return new google.maps.Marker({
    position: { lat, lng },
    map,
  });
}
