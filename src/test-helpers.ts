/**
 * Copyright 2026 Google LLC
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

import { initialize } from "@googlemaps/jest-mocks";

/* eslint-disable @typescript-eslint/no-explicit-any */

initialize();

/**
 * Initializes the `@googlemaps/jest-mocks` namespace and enhances it with
 * basic functional behaviors (e.g. LatLng.equals value comparisons).
 */
export function initializeMocks() {
  initialize();

  // Replace the LatLng class with a functional mock!
  const OriginalLatLng = google.maps.LatLng;

  class FunctionalLatLng extends OriginalLatLng {
    private _lat: number;
    private _lng: number;

    constructor(
      latOrLiteral: number | google.maps.LatLngLiteral | any,
      lng?: number,
      noClampNoWrap?: boolean
    ) {
      super(latOrLiteral, lng, noClampNoWrap);

      let latVal = 0;
      let lngVal = 0;

      if (typeof latOrLiteral === "object" && latOrLiteral !== null) {
        if (typeof latOrLiteral.lat === "function") {
          latVal = latOrLiteral.lat();
        } else if (typeof latOrLiteral.lat === "number") {
          latVal = latOrLiteral.lat;
        }

        if (typeof latOrLiteral.lng === "function") {
          lngVal = latOrLiteral.lng();
        } else if (typeof latOrLiteral.lng === "number") {
          lngVal = latOrLiteral.lng;
        }
      } else if (typeof latOrLiteral === "number") {
        latVal = latOrLiteral;
        lngVal = lng || 0;
      }

      this._lat = latVal;
      this._lng = lngVal;

      this.lat = jest.fn().mockImplementation(() => this._lat);
      this.lng = jest.fn().mockImplementation(() => this._lng);
      this.equals = jest
        .fn()
        .mockImplementation((other?: google.maps.LatLng) => {
          if (!other) return false;
          return this.lat() === other.lat() && this.lng() === other.lng();
        });
    }
  }

  google.maps.LatLng = FunctionalLatLng as any;

  Object.defineProperty(FunctionalLatLng, Symbol.hasInstance, {
    value: function (instance: any) {
      return instance instanceof OriginalLatLng;
    },
  });
}

/**
 * Centralized list of marker classes for parameterized tests.
 */
export const testMarkerTypes = [
  ["Marker", google.maps.Marker],
  ["AdvancedMarker", google.maps.marker.AdvancedMarkerElement],
] as Array<[string, any]>;

/**
 * Helper to quickly configure a mock Google Map to return specific bounds.
 */
export function setupMapBounds(
  map: google.maps.Map,
  bounds: { west: number; south: number; east: number; north: number }
) {
  const northEast = new google.maps.LatLng(bounds.north, bounds.east);
  const southWest = new google.maps.LatLng(bounds.south, bounds.west);

  const mockBounds = new google.maps.LatLngBounds();
  mockBounds.getNorthEast = jest.fn().mockReturnValue(northEast);
  mockBounds.getSouthWest = jest.fn().mockReturnValue(southWest);
  mockBounds.toJSON = jest.fn().mockReturnValue(bounds);
  map.getBounds = jest.fn().mockReturnValue(mockBounds);

  return mockBounds;
}
