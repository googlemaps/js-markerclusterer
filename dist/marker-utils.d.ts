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
/// <reference types="google.maps" />
/**
 * util class that creates a common set of convenience functions to wrap
 * shared behavior of Advanced Markers and Markers.
 */
export type Marker = google.maps.Marker | google.maps.marker.AdvancedMarkerElement;
export declare class MarkerUtils {
    static isAdvancedMarkerAvailable(map: google.maps.Map): boolean;
    static isAdvancedMarker(marker: Marker): marker is google.maps.marker.AdvancedMarkerElement;
    static setMap(marker: Marker, map: google.maps.Map | null): void;
    static getPosition(marker: Marker): google.maps.LatLng;
    static getVisible(marker: Marker): boolean;
}
