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

import { Algorithm, AlgorithmOptions, SuperClusterAlgorithm } from "./algorithms";
import { ClusterStats, DefaultRenderer, Renderer } from "./renderer";

import { Cluster } from "./cluster";
import { OverlayViewSafe } from "./overlay-view-safe";

export type onClusterClickHandler = (
  event: google.maps.MapMouseEvent,
  cluster: Cluster,
  map: google.maps.Map
) => void;
export interface MarkerClustererOptions {
  markers?: google.maps.Marker[];
  /**
   * An algorithm to cluster markers. Default is {@link SuperClusterAlgorithm}. Must
   * provide a `calculate` method accepting {@link AlgorithmInput} and returning
   * an array of {@link Cluster}.
   */
  algorithm?: Algorithm;
  algorithmOptions?: AlgorithmOptions,
  map?: google.maps.Map | null;
  /**
   * An object that converts a {@link Cluster} into a `google.maps.Marker`.
   * Default is {@link DefaultRenderer}.
   */
  renderer?: Renderer;
  onClusterClick?: onClusterClickHandler;
}

export enum MarkerClustererEvents {
  CLUSTERING_BEGIN = "clusteringbegin",
  CLUSTERING_END = "clusteringend",
  CLUSTER_CLICK = "click",
}

export const defaultOnClusterClickHandler: onClusterClickHandler = (
  _: google.maps.MapMouseEvent,
  cluster: Cluster,
  map: google.maps.Map
): void => {
  map.fitBounds(cluster.bounds);
};
/**
 * MarkerClusterer creates and manages per-zoom-level clusters for large amounts
 * of markers. See {@link MarkerClustererOptions} for more details.
 *
 */
export class MarkerClusterer extends OverlayViewSafe {
  /** @see {@link MarkerClustererOptions.onClusterClick} */
  public onClusterClick: onClusterClickHandler;
  /** @see {@link MarkerClustererOptions.algorithm} */
  protected algorithm: Algorithm;
  protected clusters: Cluster[];
  protected markers: google.maps.Marker[];
  /** @see {@link MarkerClustererOptions.renderer} */
  protected renderer: Renderer;
  /** @see {@link MarkerClustererOptions.map} */
  protected map: google.maps.Map | null;
  protected idleListener: google.maps.MapsEventListener;

  constructor({
    map,
    markers = [],
    algorithmOptions = {},
    algorithm = new SuperClusterAlgorithm(algorithmOptions),
    renderer = new DefaultRenderer(),
    onClusterClick = defaultOnClusterClickHandler,
  }: MarkerClustererOptions) {
    super();
    this.markers = [...markers];
    this.clusters = [];

    this.algorithm = algorithm;
    this.renderer = renderer;

    this.onClusterClick = onClusterClick;

    if (map) {
      this.setMap(map);
    }
  }

  public addMarker(marker: google.maps.Marker, noDraw?: boolean): void {
    if (this.markers.includes(marker)) {
      return;
    }

    this.markers.push(marker);
    if (!noDraw) {
      this.render();
    }
  }

  public addMarkers(markers: google.maps.Marker[], noDraw?: boolean): void {
    markers.forEach((marker) => {
      this.addMarker(marker, true);
    });

    if (!noDraw) {
      this.render();
    }
  }

  public removeMarker(marker: google.maps.Marker, noDraw?: boolean): boolean {
    const index = this.markers.indexOf(marker);

    if (index === -1) {
      // Marker is not in our list of markers, so do nothing:
      return false;
    }

    marker.setMap(null);
    this.markers.splice(index, 1); // Remove the marker from the list of managed markers

    if (!noDraw) {
      this.render();
    }

    return true;
  }

  public removeMarkers(
    markers: google.maps.Marker[],
    noDraw?: boolean
  ): boolean {
    let removed = false;

    markers.forEach((marker) => {
      removed = this.removeMarker(marker, true) || removed;
    });

    if (removed && !noDraw) {
      this.render();
    }

    return removed;
  }

  public clearMarkers(noDraw?: boolean): void {
    this.markers.length = 0;

    if (!noDraw) {
      this.render();
    }
  }

  /**
   * Recalculates and draws all the marker clusters.
   */
  public render(): void {
    const map = this.getMap();
    if (map instanceof google.maps.Map && this.getProjection()) {
      google.maps.event.trigger(
        this,
        MarkerClustererEvents.CLUSTERING_BEGIN,
        this
      );
      const { clusters, changed } = this.algorithm.calculate({
        markers: this.markers,
        map,
        mapCanvasProjection: this.getProjection(),
      });

      // allow algorithms to return flag on whether the clusters/markers have changed
      if (changed || changed == undefined) {
        // reset visibility of markers and clusters
        this.reset();

        // store new clusters
        this.clusters = clusters;

        this.renderClusters();
      }
      google.maps.event.trigger(
        this,
        MarkerClustererEvents.CLUSTERING_END,
        this
      );
    }
  }

  public onAdd(): void {
    this.idleListener = this.getMap().addListener(
      "idle",
      this.render.bind(this)
    );
    this.render();
  }

  public onRemove(): void {
    google.maps.event.removeListener(this.idleListener);
    this.reset();
  }

  protected reset(): void {
    this.markers.forEach((marker) => marker.setMap(null));
    this.clusters.forEach((cluster) => cluster.delete());
    this.clusters = [];
  }

  protected renderClusters(): void {
    // generate stats to pass to renderers
    const stats = new ClusterStats(this.markers, this.clusters);
    const map = this.getMap() as google.maps.Map;

    this.clusters.forEach((cluster) => {
      if (cluster.markers.length === 1) {
        cluster.marker = cluster.markers[0];
      } else {
        cluster.marker = this.renderer.render(cluster, stats);

        if (this.onClusterClick) {
          cluster.marker.addListener(
            "click",
            /* istanbul ignore next */
            (event: google.maps.MapMouseEvent) => {
              google.maps.event.trigger(
                this,
                MarkerClustererEvents.CLUSTER_CLICK,
                cluster
              );
              this.onClusterClick(event, cluster, map);
            }
          );
        }
      }

      cluster.marker.setMap(map);
    });
  }
}
