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

export const filterMarkersToPaddedViewport = (
  map: google.maps.Map,
  mapCanvasProjection: google.maps.MapCanvasProjection,
  markers: google.maps.Marker[],
  viewportPadding: number
): google.maps.Marker[] => {
  const extendedMapBounds = extendBoundsToPaddedViewport(
    map.getBounds(),
    mapCanvasProjection,
    viewportPadding
  );
  return markers.filter(marker =>
    extendedMapBounds.contains(marker.getPosition())
  );
};

/**
 * Extends a bounds by a number of pixels in each direction.
 */
export const extendBoundsToPaddedViewport = (
  bounds: google.maps.LatLngBounds,
  projection: google.maps.MapCanvasProjection,
  pixels: number
): google.maps.LatLngBounds => {
  const {northEast, southWest} = latLngBoundsToPixelBounds(bounds, projection);
  const extendedPixelBounds = extendPixelBounds({northEast, southWest}, pixels);
  return pixelBoundsToLatLngBounds(extendedPixelBounds, projection);
};

/**
 * @hidden
 */
export const distanceBetweenPoints = (
  p1: google.maps.LatLngLiteral,
  p2: google.maps.LatLngLiteral
): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLon = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

type PixelBounds = {
  northEast: google.maps.Point;
  southWest: google.maps.Point;
};

/**
 * @hidden
 */
const latLngBoundsToPixelBounds = (
  bounds: google.maps.LatLngBounds,
  projection: google.maps.MapCanvasProjection
): PixelBounds => {
  return {
    northEast: projection.fromLatLngToDivPixel(bounds.getNorthEast()),
    southWest: projection.fromLatLngToDivPixel(bounds.getSouthWest()),
  };
};

/**
 * @hidden
 */
export const extendPixelBounds = (
  {northEast, southWest}: PixelBounds,
  pixels: number
): PixelBounds => {
  northEast.x += pixels;
  northEast.y -= pixels;

  southWest.x -= pixels;
  southWest.y += pixels;

  return {northEast, southWest};
};

/**
 * @hidden
 */
export const pixelBoundsToLatLngBounds = (
  {northEast, southWest}: PixelBounds,
  projection: google.maps.MapCanvasProjection
): google.maps.LatLngBounds => {
  const bounds = new google.maps.LatLngBounds();
  bounds.extend(projection.fromDivPixelToLatLng(northEast));
  bounds.extend(projection.fromDivPixelToLatLng(southWest));
  return bounds;
};
