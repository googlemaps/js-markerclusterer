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

import { AbstractAlgorithm, AlgorithmInput, AlgorithmOutput } from "./core";
import SuperCluster, { ClusterFeature } from "supercluster";
import { MarkerUtils } from "../marker-utils";
import { Cluster } from "../cluster";
import equal from "fast-deep-equal";

export type SuperClusterOptions = SuperCluster.Options<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { [name: string]: any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { [name: string]: any }
>;

/**
 * A very fast JavaScript algorithm for geospatial point clustering using KD trees.
 *
 * @see https://www.npmjs.com/package/supercluster for more information on options.
 */
export class SuperClusterAlgorithm extends AbstractAlgorithm {
  protected superCluster: SuperCluster;
  protected markers: Marker[];
  protected clusters: Cluster[];
  protected state: { zoom: number | null };

  constructor({ maxZoom, radius = 60, ...options }: SuperClusterOptions) {
    super({ maxZoom });

    this.superCluster = new SuperCluster({
      maxZoom: this.maxZoom,
      radius,
      ...options,
    });

    this.state = { zoom: null };
  }

  public calculate(input: AlgorithmInput): AlgorithmOutput {
    let changed = false;
    const state = { zoom: input.map.getZoom() };

    if (!equal(input.markers, this.markers)) {
      changed = true;
      // TODO use proxy to avoid copy?
      this.markers = [...input.markers];

      const points = this.markers.map((marker) => {
        const position = MarkerUtils.getPosition(marker);
        const coordinates = [position.lng(), position.lat()];
        return {
          type: "Feature" as const,
          geometry: {
            type: "Point" as const,
            coordinates,
          },
          properties: { marker },
        };
      });
      this.superCluster.load(points);
    }

    if (!changed) {
      if (this.state.zoom <= this.maxZoom || state.zoom <= this.maxZoom) {
        changed = !equal(this.state, state);
      }
    }

    this.state = state;

    if (changed) {
      this.clusters = this.cluster(input);
    }

    return { clusters: this.clusters, changed };
  }

  public cluster({ map }: AlgorithmInput): Cluster[] {
    return this.superCluster
      .getClusters([-180, -90, 180, 90], Math.round(map.getZoom()))
      .map((feature: ClusterFeature<{ marker: Marker }>) =>
        this.transformCluster(feature)
      );
  }

  protected transformCluster({
    geometry: {
      coordinates: [lng, lat],
    },
    properties,
  }: ClusterFeature<{ marker: Marker }>): Cluster {
    if (properties.cluster) {
      return new Cluster({
        markers: this.superCluster
          .getLeaves(properties.cluster_id, Infinity)
          .map((leaf) => leaf.properties.marker),
        position: { lat, lng },
      });
    }

    const marker = properties.marker;

    return new Cluster({
      markers: [marker],
      position: MarkerUtils.getPosition(marker),
    });
  }
}
