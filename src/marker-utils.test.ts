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

import { MarkerUtils } from './marker-utils';
import { initialize } from '@googlemaps/jest-mocks';

initialize();
const markerClasses = [
  google.maps.Marker,
  google.maps.marker.AdvancedMarkerElement,
];

describe.each(markerClasses)(
  'MarkerUtils works with legacy and Advanced Markers',
  (markerClass) => {
    let map: google.maps.Map;

    beforeEach(() => {
      map = new google.maps.Map(document.createElement('div'));
    });

    test('identifies AdvancedMarker instances', () => {
      const isAdvancedMarker = MarkerUtils.isAdvancedMarker(new markerClass());
      if (markerClass === google.maps.marker.AdvancedMarkerElement) {
        expect(isAdvancedMarker).toBeTruthy;
        return;
      }
      expect(isAdvancedMarker).toBeFalsy;
    });

    test('sets the map', () => {
      const marker = new markerClass();
      MarkerUtils.setMap(marker, map);
      if (markerClass === google.maps.marker.AdvancedMarkerElement) {
        expect(
          (marker as google.maps.marker.AdvancedMarkerElement).map
        ).toEqual(map);
        return;
      }
      expect((marker as google.maps.Marker).setMap).toHaveBeenCalled;
    });

    test('gets the marker position and returns a LatLng', () => {
      // test markers created with LatLng and LatLngLiteral
      [
        new google.maps.LatLng(1, 1),
        { lat: 1, lng: 1 },
        new google.maps.LatLng(0, 0),
        { lat: 0, lng: 0 },
        new google.maps.LatLng(0, 1),
        { lat: 0, lng: 1 },
        new google.maps.LatLng(1, 0),
        { lat: 1, lng: 0 },
      ].forEach((position) => {
        const marker = new markerClass({ position: position });
        if (markerClass === google.maps.marker.AdvancedMarkerElement) {
          (marker as google.maps.marker.AdvancedMarkerElement).position =
            position;
        }

        const markerPosition = MarkerUtils.getPosition(marker);

        expect(markerPosition).toBeInstanceOf(google.maps.LatLng);

        if (typeof position.lat === 'number') {
          expect(markerPosition.lat()).toEqual(position.lat);
        } else if (typeof position.lat === 'function') {
          expect(markerPosition.lat()).toEqual(position.lat());
        }

        if (typeof position.lng === 'number') {
          expect(markerPosition.lng()).toEqual(position.lng);
        } else if (typeof position.lng === 'function') {
          expect(markerPosition.lng()).toEqual(position.lng());
        }
      });
    });

    test('detects the visibility of a marker', () => {
      const marker = new markerClass();
      expect(MarkerUtils.getVisible(marker)).toBeTruthy;
    });
  }
);
