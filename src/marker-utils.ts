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

/**
 * Supports markers of either "legacy" or "advanced" types.
 */
export type Marker =
  | google.maps.Marker
  | google.maps.marker.AdvancedMarkerElement;

/**
 * util class that creates a common set of convenience functions to wrap
 * shared behavior of Advanced Markers and Markers.
 */
export class MarkerUtils {
  public static isAdvancedMarkerAvailable(map: google.maps.Map): boolean {
    return (
      google.maps.marker &&
      map.getMapCapabilities().isAdvancedMarkersAvailable === true
    );
  }

  public static isAdvancedMarker(
    marker: Marker
  ): marker is google.maps.marker.AdvancedMarkerElement {
    return (
      google.maps.marker &&
      marker instanceof google.maps.marker.AdvancedMarkerElement
    );
  }

  public static setMap(marker: Marker, map: google.maps.Map | null) {
    if (this.isAdvancedMarker(marker)) {
      marker.map = map;
    } else {
      marker.setMap(map);
    }
  }

  public static getPosition(marker: Marker): google.maps.LatLng | null {
    // SuperClusterAlgorithm.calculate expects a LatLng instance so we fake it for Adv Markers
    if (this.isAdvancedMarker(marker)) {
      if (marker.position) {
        if (marker.position instanceof google.maps.LatLng) {
          return marker.position;
        }
        // since we can't cast to LatLngLiteral for reasons =(
        if (
          Number.isFinite(marker.position.lat) &&
          Number.isFinite(marker.position.lng)
        ) {
          return new google.maps.LatLng(
            marker.position.lat,
            marker.position.lng
          );
        }
      }

      return null;
    }

    return marker.getPosition()!;
  }

  public static getVisible(marker: Marker) {
    if (this.isAdvancedMarker(marker)) {
      /**
       * As per google.maps.marker.AdvancedMarkerElement documentation:
       * An AdvancedMarkerElement may be constructed without a position,
       * but will not be displayed until its position is provided.
       *
       * The same goes for the map property. But in case of clustering this
       * is always set to null as we don't want to show the marker on the map.
       */
      return marker.position !== null;
    }
    return marker.getVisible();
  }
}
