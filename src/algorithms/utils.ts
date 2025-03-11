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

import { MarkerUtils, Marker } from "../marker-utils";
import { assertNotNull } from "../utils";

/**
 * Returns the markers visible in a padded map viewport
 *
 * @param map
 * @param mapCanvasProjection
 * @param markers The list of marker to filter
 * @param viewportPaddingPixels The padding in pixel
 * @returns The list of markers in the padded viewport
 */
export const filterMarkersToPaddedViewport = (
  map: google.maps.Map,
  mapCanvasProjection: google.maps.MapCanvasProjection,
  markers: Marker[],
  viewportPaddingPixels: number
): Marker[] => {
  const bounds = map.getBounds();
  assertNotNull(bounds);

  const extendedMapBounds = extendBoundsToPaddedViewport(
    bounds,
    mapCanvasProjection,
    viewportPaddingPixels
  );

  return markers.filter((marker) => {
    const position = MarkerUtils.getPosition(marker);
    return position ? extendedMapBounds.contains(position) : false;
  });
};

/**
 * Extends bounds by a number of pixels in each direction
 */
export const extendBoundsToPaddedViewport = (
  bounds: google.maps.LatLngBounds,
  projection: google.maps.MapCanvasProjection,
  numPixels: number
): google.maps.LatLngBounds => {
  const { northEast, southWest } = latLngBoundsToPixelBounds(
    bounds,
    projection
  );
  const extendedPixelBounds = extendPixelBounds(
    { northEast, southWest },
    numPixels
  );
  return pixelBoundsToLatLngBounds(extendedPixelBounds, projection);
};

/**
 * Gets the extended bounds as a bbox [westLng, southLat, eastLng, northLat]
 */
export const getPaddedViewport = (
  bounds: google.maps.LatLngBounds,
  projection: google.maps.MapCanvasProjection,
  pixels: number
): [number, number, number, number] => {
  const extended = extendBoundsToPaddedViewport(bounds, projection, pixels);
  const ne = extended.getNorthEast();
  const sw = extended.getSouthWest();

  return [sw.lng(), sw.lat(), ne.lng(), ne.lat()];
};

/**
 * Returns the distance between 2 positions.
 *
 * @hidden
 */
export const distanceBetweenPoints = (
  p1: google.maps.LatLngLiteral,
  p2: google.maps.LatLngLiteral
): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLon = ((p2.lng - p1.lng) * Math.PI) / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const a =
    sinDLat * sinDLat +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      sinDLon *
      sinDLon;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

type PixelBounds = {
  northEast: google.maps.Point;
  southWest: google.maps.Point;
};

/**
 * Converts a LatLng bound to pixels.
 *
 * @hidden
 */
const latLngBoundsToPixelBounds = (
  bounds: google.maps.LatLngBounds,
  projection: google.maps.MapCanvasProjection
): PixelBounds => {
  const northEast = projection.fromLatLngToDivPixel(bounds.getNorthEast());
  const southWest = projection.fromLatLngToDivPixel(bounds.getSouthWest());

  assertNotNull(northEast);
  assertNotNull(southWest);

  return { northEast, southWest };
};

/**
 * Extends a pixel bounds by numPixels in all directions.
 *
 * @hidden
 */
export const extendPixelBounds = (
  { northEast, southWest }: PixelBounds,
  numPixels: number
): PixelBounds => {
  northEast.x += numPixels;
  northEast.y -= numPixels;

  southWest.x -= numPixels;
  southWest.y += numPixels;

  return { northEast, southWest };
};

/**
 * @hidden
 */
export const pixelBoundsToLatLngBounds = (
  { northEast, southWest }: PixelBounds,
  projection: google.maps.MapCanvasProjection
): google.maps.LatLngBounds => {
  const sw = projection.fromDivPixelToLatLng(southWest);
  const ne = projection.fromDivPixelToLatLng(northEast);
  return new google.maps.LatLngBounds(sw, ne);
};
