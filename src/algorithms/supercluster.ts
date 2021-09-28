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

import { AbstractAlgorithm, AlgorithmInput } from "./core";
import SuperCluster, { ClusterFeature } from "supercluster";

import { Cluster } from "../cluster";
import equal from "fast-deep-equal/es6";

export type SuperClusterOptions = SuperCluster.Options<
  { [name: string]: any },
  { [name: string]: any }
>;

/**
 * A very fast JavaScript algorithm for geospatial point clustering using KD trees.
 *
 * @see https://www.npmjs.com/package/supercluster for more information on options.
 */
export class SuperClusterAlgorithm extends AbstractAlgorithm {
  protected superCluster: SuperCluster;
  protected markers: google.maps.Marker[];
  constructor({ maxZoom, ...options }: SuperClusterOptions) {
    super({ maxZoom });

    this.superCluster = new SuperCluster({
      maxZoom: this.maxZoom,
      radius: 60,
      ...options,
    });
  }
  public calculate(input: AlgorithmInput): Cluster[] {
    if (!equal(input.markers, this.markers)) {
      this.markers = input.markers;

      const points = this.markers.map((marker) => {
        return {
          type: "Feature" as const,
          geometry: {
            type: "Point" as const,
            coordinates: [
              marker.getPosition().lng(),
              marker.getPosition().lat(),
            ],
          },
          properties: { marker },
        };
      });

      this.superCluster.load(points);
    }
    return this.cluster(input);
  }

  public cluster({ map }: AlgorithmInput): Cluster[] {
    const { west, south, east, north } = map.getBounds().toJSON();
    return this.superCluster
      .getClusters([west, south, east, north], map.getZoom())
      .map(this.transformCluster.bind(this));
  }

  protected transformCluster({
    geometry: {
      coordinates: [lng, lat],
    },
    properties,
  }: ClusterFeature<{ marker: google.maps.Marker }>): Cluster {
    if (properties.cluster) {
      return new Cluster({
        markers: this.superCluster
          .getLeaves(properties.cluster_id, Infinity)
          .map((leaf) => leaf.properties.marker),
        position: new google.maps.LatLng({ lat, lng }),
      });
    } else {
      const marker = properties.marker;

      return new Cluster({
        markers: [marker],
        position: marker.getPosition(),
      });
    }
  }
}
