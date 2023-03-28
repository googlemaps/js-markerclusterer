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

export interface ClusterOptions {
  position?: google.maps.LatLng | google.maps.LatLngLiteral;
  markers?: google.maps.Marker[];
}

export class Cluster {
  public marker: google.maps.Marker;
  public readonly markers?: google.maps.Marker[];
  protected _position: google.maps.LatLng;

  constructor({ markers, position }: ClusterOptions) {
    this.markers = markers;

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
      return undefined;
    }

    return this.markers.reduce((bounds, marker) => {
      // @ts-ignore
      return bounds.extend(marker.element instanceof Element ? marker.position : marker.getPosition());
    }, new google.maps.LatLngBounds(this._position, this._position));
  }

  public get position(): google.maps.LatLng {
    return this._position || this.bounds.getCenter();
  }

  /**
   * Get the count of **visible** markers.
   */
  public get count(): number {
    return this.markers.filter(function (m: google.maps.Marker) {

      // @ts-ignore
      if (m.element instanceof Element) {
        // @ts-ignore
        return m.map == null ? true : false;
      } else {
        return m.getVisible()
      }
    }).length;
  }

  /**
   * Add a marker to the cluster.
   */
  public push(marker: google.maps.Marker): void {
    this.markers.push(marker);
  }

  /**
   * Cleanup references and remove marker from map.
   */
  public delete(): void {
    if (this.marker) {
      // @ts-ignore
      if(this.marker.element instanceof Element){
        // @ts-ignore
        this.marker.map = null;
      } else {
        this.marker.setMap(null);
      }
      
      delete this.marker;
    }
    this.markers.length = 0;
  }
}
