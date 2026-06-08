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
import SuperCluster, { ClusterFeature } from "supercluster";
import { deepEqual } from "fast-equals";
import { AbstractAlgorithm, AlgorithmInput, AlgorithmOutput } from "./core";
import { MarkerUtils, Marker } from "../marker-utils";
import { Cluster } from "../cluster";
import { assertNotNull } from "../utils";
import { areClustersEqual, areMarkersEqual } from "./utils";

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
  protected markers: Marker[] = [];
  protected clusters: Cluster[] = [];
  protected state = { zoom: -1 };

  constructor({ maxZoom, radius = 60, ...options }: SuperClusterOptions) {
    super({ maxZoom });

    this.superCluster = new SuperCluster({
      maxZoom: this.maxZoom,
      radius,
      ...options,
    });
  }

  public calculate(input: AlgorithmInput): AlgorithmOutput {
    let inputsChanged = false;
    let zoom = input.map.getZoom();

    assertNotNull(zoom);

    zoom = Math.round(zoom);

    const state = { zoom: zoom };

    if (!areMarkersEqual(input.markers, this.markers)) {
      inputsChanged = true;

      this.markers = [...input.markers];

      const points = this.markers.map((marker) => {
        const position = MarkerUtils.getPosition(marker);
        const coordinates = [position.lng(), position.lat()];

        return {
          type: "Feature",
          geometry: { type: "Point", coordinates },
          properties: { marker },
        } as const;
      });
      this.superCluster.load(points);
    }

    if (!inputsChanged) {
      if (this.state.zoom <= this.maxZoom || state.zoom <= this.maxZoom) {
        inputsChanged = !deepEqual(this.state, state);
      }
    }

    this.state = state;

    // when input is empty, return right away
    if (input.markers.length === 0) {
      this.clusters = [];

      return { clusters: this.clusters, changed: inputsChanged };
    }

    let clustersChanged = false;
    if (inputsChanged) {
      const newClusters = this.cluster(input);

      clustersChanged = !areClustersEqual(this.clusters, newClusters);

      this.clusters = newClusters;
    }

    return { clusters: this.clusters, changed: clustersChanged };
  }

  public cluster({ map }: AlgorithmInput): Cluster[] {
    const zoom = map.getZoom();
    assertNotNull(zoom);

    return this.superCluster
      .getClusters([-180, -90, 180, 90], Math.round(zoom))
      .map((feature) =>
        this.transformCluster(feature as ClusterFeature<{ marker: Marker }>)
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
