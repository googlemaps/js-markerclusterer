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
/// <reference types="google.maps" />
export declare const filterMarkersToPaddedViewport: (map: google.maps.Map, mapCanvasProjection: google.maps.MapCanvasProjection, markers: google.maps.Marker[], viewportPadding: number) => google.maps.Marker[];
/**
 * Extends a bounds by a number of pixels in each direction.
 */
export declare const extendBoundsToPaddedViewport: (bounds: google.maps.LatLngBounds, projection: google.maps.MapCanvasProjection, pixels: number) => google.maps.LatLngBounds;
/**
 * @hidden
 */
export declare const distanceBetweenPoints: (p1: google.maps.LatLngLiteral, p2: google.maps.LatLngLiteral) => number;
type PixelBounds = {
    northEast: google.maps.Point;
    southWest: google.maps.Point;
};
/**
 * @hidden
 */
export declare const extendPixelBounds: ({ northEast, southWest }: PixelBounds, pixels: number) => PixelBounds;
/**
 * @hidden
 */
export declare const pixelBoundsToLatLngBounds: ({ northEast, southWest }: PixelBounds, projection: google.maps.MapCanvasProjection) => google.maps.LatLngBounds;
export {};
