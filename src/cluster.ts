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

import { MarkerUtils, Marker } from "./marker-utils";

export interface ClusterOptions {
  position?: google.maps.LatLng | google.maps.LatLngLiteral;
  markers?: Marker[];
}

export class Cluster {
  public marker?: Marker;
  public readonly markers: Marker[] = [];
  protected _position?: google.maps.LatLng;

  constructor({ markers, position }: ClusterOptions) {
    if (markers) this.markers = markers;
    if (position) {
      if (position instanceof google.maps.LatLng) {
        this._position = position;
      } else {
        this._position = new google.maps.LatLng(position);
      }
    }
  }

  public get bounds(): google.maps.LatLngBounds | undefined {
    if (this.markers.length === 0 && !this._position) {
      return;
    }

    const bounds = new google.maps.LatLngBounds(this._position, this._position);
    for (const marker of this.markers) {
      bounds.extend(MarkerUtils.getPosition(marker));
    }
    return bounds;
  }

  public get position(): google.maps.LatLng {
    // @ts-ignore
    return this._position || this.bounds.getCenter();
  }

  /**
   * Get the count of **visible** markers.
   */
  public get count(): number {
    return this.markers.filter((m: Marker) => MarkerUtils.getVisible(m)).length;
  }

  /**
   * Add a marker to the cluster.
   */
  public push(marker: Marker): void {
    this.markers.push(marker);
  }

  /**
   * Cleanup references and remove marker from map.
   */
  public delete(): void {
    if (this.marker) {
      MarkerUtils.setMap(this.marker, null);
      this.marker = undefined;
    }
    this.markers.length = 0;
  }
}
