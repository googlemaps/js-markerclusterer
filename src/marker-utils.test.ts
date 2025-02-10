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

import { MarkerUtils } from "./marker-utils";
import { initialize } from "@googlemaps/jest-mocks";

initialize();
const markerClasses = [
  google.maps.Marker,
  google.maps.marker.AdvancedMarkerElement,
];

beforeEach(() => {
  initialize();
});

describe.each(markerClasses)(
  "MarkerUtils works with legacy and Advanced Markers",
  (markerClass) => {
    let map: google.maps.Map;

    beforeEach(() => {
      map = new google.maps.Map(document.createElement("div"));
    });

    test(`${markerClass.name}: identifies AdvancedMarker instances`, () => {
      const isAdvancedMarker = MarkerUtils.isAdvancedMarker(new markerClass());
      if (markerClass === google.maps.marker.AdvancedMarkerElement) {
        expect(isAdvancedMarker).toBeTruthy();
        return;
      }
      expect(isAdvancedMarker).toBeFalsy();
    });

    test(`${markerClass.name}: sets the map`, () => {
      const marker = new markerClass();
      MarkerUtils.setMap(marker, map);
      if (markerClass === google.maps.marker.AdvancedMarkerElement) {
        expect(
          (marker as google.maps.marker.AdvancedMarkerElement).map
        ).toEqual(map);
        return;
      }
      expect((marker as google.maps.Marker).setMap).toHaveBeenCalled();
    });

    test.each([
      [{ lat: 0, lng: 0 }, false, 0, 0],
      [{ lat: 0, lng: 1 }, false, 0, 1],
      [{ lat: 1, lng: 0 }, false, 1, 0],
      [{ lat: 1, lng: 1 }, false, 1, 1],
      [{ lat: 2, lng: 2 }, true, 2, 2],
    ])(
      `${markerClass.name}: gets the marker position and returns a LatLng (%p)`,
      (input, convertToLatLng, lat, lng) => {
        // this test needs the partial implementation of the LatLng class that can be found below
        overwriteLatLngMock();

        const isAdvMarker =
          markerClass === google.maps.marker.AdvancedMarkerElement;
        let marker:
          | google.maps.Marker
          | google.maps.marker.AdvancedMarkerElement;

        if (isAdvMarker) {
          const m = new google.maps.marker.AdvancedMarkerElement();
          // in some test-cases, the advanced-marker version returns a
          // LatLng instance as well
          m.position = convertToLatLng ? new google.maps.LatLng(input) : input;

          marker = m;
        } else {
          const m = new google.maps.Marker();
          jest
            .mocked(m.getPosition)
            .mockReturnValue(new google.maps.LatLng(input));
          marker = m;
        }

        const res = MarkerUtils.getPosition(marker);

        expect(res).toBeInstanceOf(google.maps.LatLng);
        expect(res.lat()).toBe(lat);
        expect(res.lng()).toBe(lng);
      }
    );

    test(`${markerClass.name}: MarkerUtils.getVisible`, () => {
      const marker = new markerClass();

      const res = MarkerUtils.getVisible(marker);

      if (marker instanceof google.maps.Marker) {
        expect(marker.getVisible).toHaveBeenCalled();
      } else {
        expect(res).toBe(true);
      }
    });
  }
);

/* overwrites the google.maps.LatLng class with a partly functional version */
function overwriteLatLngMock() {
  const LatLngMock = class extends google.maps.LatLng {
    constructor(
      latOrLatLngOrLatLngLiteral:
        | number
        | google.maps.LatLngLiteral
        | google.maps.LatLng,
      lngOrNoClampNoWrap?: number | boolean | null,
      noClampNoWrap?: boolean
    ) {
      super(latOrLatLngOrLatLngLiteral, lngOrNoClampNoWrap, noClampNoWrap);

      let lat: number;
      let lng: number;

      if (typeof latOrLatLngOrLatLngLiteral === "object") {
        if (
          typeof latOrLatLngOrLatLngLiteral.lat === "function" &&
          typeof latOrLatLngOrLatLngLiteral.lng === "function"
        ) {
          lat = latOrLatLngOrLatLngLiteral.lat();
          lng = latOrLatLngOrLatLngLiteral.lng();
        } else {
          lat = latOrLatLngOrLatLngLiteral.lat as number;
          lng = latOrLatLngOrLatLngLiteral.lng as number;
        }
      } else {
        lat = latOrLatLngOrLatLngLiteral as number;
        lng = lngOrNoClampNoWrap as number;
      }

      this.lat = () => lat;
      this.lng = () => lng;
    }
  };
  google.maps.LatLng = LatLngMock;
}
