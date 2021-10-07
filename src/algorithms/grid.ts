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

import {
  AbstractViewportAlgorithm,
  AlgorithmInput,
  ViewportAlgorithmOptions,
} from "./core";
import { distanceBetweenPoints, extendBoundsToPaddedViewport } from "./utils";

import { Cluster } from "../cluster";

export interface GridOptions extends ViewportAlgorithmOptions {
  gridSize?: number;
  /**
   * Max distance between cluster center and point in meters.
   * @default 10000
   */
  maxDistance?: number;
}

/**
 * The default Grid algorithm historically used in Google Maps marker
 * clustering.
 *
 * The Grid algorithm does not implement caching and markers may flash as the
 * viewport changes. Instead use {@link SuperClusterAlgorithm}.
 */
export class GridAlgorithm extends AbstractViewportAlgorithm {
  protected gridSize: number;
  protected maxDistance: number;
  protected clusters: Cluster[] = [];

  constructor({ maxDistance = 40000, gridSize = 40, ...options }: GridOptions) {
    super(options);

    this.maxDistance = maxDistance;
    this.gridSize = gridSize;
  }

  protected cluster({
    markers,
    map,
    mapCanvasProjection,
  }: AlgorithmInput): Cluster[] {
    this.clusters = [];
    markers.forEach((marker) => {
      this.addToClosestCluster(marker, map, mapCanvasProjection);
    });

    return this.clusters;
  }

  protected addToClosestCluster(
    marker: google.maps.Marker,
    map: google.maps.Map,
    projection: google.maps.MapCanvasProjection
  ): void {
    let maxDistance = this.maxDistance; // Some large number
    let cluster: Cluster = null;

    for (let i = 0; i < this.clusters.length; i++) {
      const candidate = this.clusters[i];
      const distance = distanceBetweenPoints(
        candidate.bounds.getCenter().toJSON(),
        marker.getPosition().toJSON()
      );

      if (distance < maxDistance) {
        maxDistance = distance;
        cluster = candidate;
      }
    }

    if (
      cluster &&
      extendBoundsToPaddedViewport(
        cluster.bounds,
        projection,
        this.gridSize
      ).contains(marker.getPosition())
    ) {
      cluster.push(marker);
    } else {
      const cluster = new Cluster({ markers: [marker] });
      this.clusters.push(cluster);
    }
  }
}
