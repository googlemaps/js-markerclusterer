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
  AlgorithmOutput,
  ViewportAlgorithmOptions,
} from "./core";
import { SuperClusterOptions } from "./supercluster";
import SuperCluster, { ClusterFeature } from "supercluster";
import { MarkerUtils, Marker } from "../marker-utils";
import { Cluster } from "../cluster";
import { getPaddedViewport } from "./utils";
import equal from "fast-deep-equal";

export interface SuperClusterViewportOptions
  extends SuperClusterOptions,
    ViewportAlgorithmOptions {
      radius?: number;
    }

export interface SuperClusterViewportState {
  /* The current zoom level */
  zoom: number;

  /* The current viewport as a bbox [westLng, southLat, eastLng, northLat] */
  view: [number, number, number, number];
}

/**
 * A very fast JavaScript algorithm for geospatial point clustering using KD trees.
 *
 * @see https://www.npmjs.com/package/supercluster for more information on options.
 */
export class SuperClusterViewportAlgorithm extends AbstractViewportAlgorithm {
  protected superCluster: SuperCluster;
  protected markers: Marker[];
  protected clusters: Cluster[];
  protected state: SuperClusterViewportState;

  constructor({
    maxZoom,
    radius = 60,
    viewportPadding = 60,
    ...options
  }: SuperClusterViewportOptions) {
    super({ maxZoom, viewportPadding });

    this.superCluster = new SuperCluster({
      maxZoom: this.maxZoom,
      radius,
      ...options,
    });

    this.state = { zoom: -1, view: [0, 0, 0, 0] };
  }

  public calculate(input: AlgorithmInput): AlgorithmOutput {
    const state: SuperClusterViewportState = {
      zoom: Math.round(input.map.getZoom()),
      view: getPaddedViewport(
        input.map.getBounds(),
        input.mapCanvasProjection,
        this.viewportPadding
      ),
    };

    let changed = !equal(this.state, state);
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

    if (changed) {
      this.clusters = this.cluster(input);
      this.state = state;
    }

    return { clusters: this.clusters, changed };
  }

  public cluster({ map, mapCanvasProjection }: AlgorithmInput): Cluster[] {
    /* recalculate new state because we can't use the cached version. */
    const state: SuperClusterViewportState = {
      zoom: Math.round(map.getZoom()),
      view: getPaddedViewport(
        map.getBounds(),
        mapCanvasProjection,
        this.viewportPadding
      ),
    };

    return this.superCluster
      .getClusters(state.view, state.zoom)
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
