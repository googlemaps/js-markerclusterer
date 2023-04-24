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
 * util class that creates a common set of convenience functions to wrap
 * shared behavior of Advanced Markers and Markers.
 */

export class MarkerUtils {
  public static isAdvancedMarker (marker: Marker): boolean {
    if (marker instanceof google.maps.marker.AdvancedMarkerView) {
      return true;
    }
    return false;
  }

  public static setMap (marker: Marker, map: google.maps.Map | null) {
    if (this.isAdvancedMarker(marker)) {
      (marker as google.maps.marker.AdvancedMarkerView).map = map;
      return;
    }
    (marker as google.maps.Marker).setMap(map);
  }

  public static getPosition (marker: Marker): google.maps.LatLng {
    // SuperClusterAlgorithm.calculate expects a LatLng instance so we fake it for Adv Markers
    if (this.isAdvancedMarker(marker)) {
      marker = marker as google.maps.marker.AdvancedMarkerView;
      if (marker.position) {
        if (marker.position instanceof google.maps.LatLng) {
          return marker.position
        }
        // since we can't cast to LatLngLiteral for reasons =(
        if (marker.position.lat && marker.position.lng) {
          return new google.maps.LatLng(marker.position.lat, marker.position.lng);
        }
      }
      return new google.maps.LatLng(null);
    }
    return (marker as google.maps.Marker).getPosition();
  }
  
  public static getVisible (marker: Marker) {
    if (this.isAdvancedMarker(marker)) {
      /** 
       * Always return true for Advanced Markers because the clusterer
       * uses getVisible as a way to count legacy markers not as an actual 
       * indicator of visibility for some reason. Even when markers are hidden
       * Marker.getVisible returns `true` and this is used to set the marker count
       * on the cluster. See the behavior of Cluster.count
      */
      return true;
    }
    return (marker as google.maps.Marker).getVisible();
  }
}
