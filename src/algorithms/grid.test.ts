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

import { GridAlgorithm } from "./grid";
import { initialize, MapCanvasProjection } from "@googlemaps/jest-mocks";

initialize();
const markers = [
  new google.maps.Marker(),
  new google.maps.marker.AdvancedMarkerElement(),
];

describe.each(markers)(
  "Grid works with legacy and Advanced Markers",
  (marker) => {
    let map: google.maps.Map;

    beforeEach(() => {
      map = new google.maps.Map(document.createElement("div"));
    });

    test("calculate should return changed: true for first call when zoom > max zoom", () => {
      const mapCanvasProjection = new MapCanvasProjection();
      const markers: Marker[] = [marker];

      const grid = new GridAlgorithm({ maxZoom: 16 });
      grid["noop"] = jest.fn();
      grid["cluster"] = jest.fn();

      map.getZoom = jest.fn().mockReturnValue(15);

      grid.calculate({
        markers,
        map,
        mapCanvasProjection,
      });

      map.getZoom = jest.fn().mockReturnValue(17);

      const { changed } = grid.calculate({
        markers,
        map,
        mapCanvasProjection,
      });

      expect(changed).toBe(true);
    });

    test("calculate should return changed: false for next calls above max zoom", () => {
      const mapCanvasProjection =
        jest.fn() as unknown as google.maps.MapCanvasProjection;
      const markers: Marker[] = [marker];

      const grid = new GridAlgorithm({ maxZoom: 16 });
      grid["noop"] = jest.fn();

      map.getZoom = jest.fn().mockReturnValue(16);

      let result = grid.calculate({
        markers,
        map,
        mapCanvasProjection,
      });

      expect(result.changed).toBe(true);

      result = grid.calculate({
        markers,
        map,
        mapCanvasProjection,
      });

      expect(result.changed).toBe(false);
    });

    test("calculate should return changed: false for next calls above max zoom, even if zoom changed", () => {
      const mapCanvasProjection =
        jest.fn() as unknown as google.maps.MapCanvasProjection;
      const markers: Marker[] = [marker];

      const grid = new GridAlgorithm({ maxZoom: 16 });
      grid["noop"] = jest.fn();

      map.getZoom = jest.fn().mockReturnValue(17);

      let result = grid.calculate({
        markers,
        map,
        mapCanvasProjection,
      });

      expect(result.changed).toBe(true);

      map.getZoom = jest.fn().mockReturnValue(18);

      result = grid.calculate({
        markers,
        map,
        mapCanvasProjection,
      });

      expect(result.changed).toBe(false);
    });
  }
);
