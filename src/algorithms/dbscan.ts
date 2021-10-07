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
import { Units, featureCollection, point } from "@turf/helpers";

import { Cluster } from "../cluster";
import clustersDbscan from "@turf/clusters-dbscan";

export interface DBScanOptions {
  units?: Units;
  minPoints?: number;
  mutate?: boolean;
}

export interface DBScanAlgorithmOptions extends ViewportAlgorithmOptions {
  maxDistance?: number;
  minPoints?: number;
}

const DEFAULT_INTERNAL_DBSCAN_OPTION: DBScanOptions = {
  units: "kilometers",
  mutate: false,
  minPoints: 1,
};

/**
 *
 * **This algorithm is not yet ready for use!**
 *
 * Experimental algorithm using DBScan.
 *
 * The Grid algorithm does not implement caching and markers may flash as the
 * viewport changes. Instead use {@link SuperClusterAlgorithm}.
 *
 * @see https://www.npmjs.com/package/@turf/clusters-dbscan
 */
export class DBScanAlgorithm extends AbstractViewportAlgorithm {
  protected maxDistance: number;
  protected options: DBScanOptions;
  constructor({
    maxDistance = 200,
    minPoints = DEFAULT_INTERNAL_DBSCAN_OPTION.minPoints,
    ...options
  }: DBScanAlgorithmOptions) {
    super(options);
    this.maxDistance = maxDistance;
    this.options = {
      ...DEFAULT_INTERNAL_DBSCAN_OPTION,
      minPoints,
    };
  }

  protected cluster({
    markers,
    mapCanvasProjection,
  }: AlgorithmInput): Cluster[] {
    const points = featureCollection(
      markers.map((marker) => {
        const projectedPoint = mapCanvasProjection.fromLatLngToContainerPixel(
          marker.getPosition()
        );
        return point([projectedPoint.x, projectedPoint.y]);
      })
    );

    const grouped: google.maps.Marker[][] = [];

    clustersDbscan(points, this.maxDistance, this.options).features.forEach(
      (point, i) => {
        if (!grouped[point.properties.cluster]) {
          grouped[point.properties.cluster] = [];
        }

        grouped[point.properties.cluster].push(markers[i]);
      }
    );

    return grouped.map((markers) => new Cluster({ markers }));
  }
}
