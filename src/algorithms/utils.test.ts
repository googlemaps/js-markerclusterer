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

import { MapCanvasProjection, initialize } from "@googlemaps/jest-mocks";
import {
  distanceBetweenPoints,
  extendPixelBounds,
  pixelBoundsToLatLngBounds,
} from "./utils";

beforeEach(() => {
  initialize();
});

describe("distanceBetweenPoints", () => {
  test("is correct", () => {
    expect(
      distanceBetweenPoints({ lng: 0, lat: 0 }, { lng: 1, lat: 1 })
    ).toMatchInlineSnapshot(`157.24938127194397`);

    expect(
      distanceBetweenPoints({ lng: 0, lat: 0 }, { lng: -1, lat: 1 })
    ).toMatchInlineSnapshot(`157.24938127194397`);

    expect(
      distanceBetweenPoints({ lng: 0, lat: 0 }, { lng: -1, lat: -1 })
    ).toMatchInlineSnapshot(`157.24938127194397`);

    expect(
      distanceBetweenPoints({ lng: 0, lat: 0 }, { lng: 1, lat: -1 })
    ).toMatchInlineSnapshot(`157.24938127194397`);
  });
});

describe("extendPixelBounds", () => {
  test("is correct", () => {
    const northEast = { x: 0, y: 0 } as google.maps.Point;
    const southWest = { x: 0, y: 0 } as google.maps.Point;
    expect(extendPixelBounds({ northEast, southWest }, 1)).toEqual({
      northEast: {
        x: 1,
        y: -1,
      },
      southWest: {
        x: -1,
        y: 1,
      },
    });
  });
});

describe("pixelBoundsToLatLngBounds", () => {
  test("is correct", () => {
    const northEast = { x: 1, y: 1 } as google.maps.Point;
    const southWest = { x: -1, y: -1 } as google.maps.Point;
    const projection = new MapCanvasProjection();
    const bounds = pixelBoundsToLatLngBounds(
      { northEast, southWest },
      projection
    );
    expect(projection.fromDivPixelToLatLng).toHaveBeenCalledWith(northEast);
    expect(projection.fromDivPixelToLatLng).toHaveBeenCalledWith(southWest);
    expect(bounds.extend).toHaveBeenCalledTimes(2);
  });
});
