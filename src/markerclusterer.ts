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
  Algorithm,
  AlgorithmOptions,
  SuperClusterAlgorithm,
} from "./algorithms";
import { ClusterStats, DefaultRenderer, Renderer } from "./renderer";
import { Cluster } from "./cluster";
import { OverlayViewSafe } from "./overlay-view-safe";
import { MarkerUtils, Marker } from "./marker-utils";
import { assertNotNull } from "./utils";

export type onClusterClickHandler = (
  event: google.maps.MapMouseEvent,
  cluster: Cluster,
  map: google.maps.Map
) => void;
export interface MarkerClustererOptions {
  markers?: Marker[];
  /**
   * An algorithm to cluster markers. Default is {@link SuperClusterAlgorithm}. Must
   * provide a `calculate` method accepting {@link AlgorithmInput} and returning
   * an array of {@link Cluster}.
   */
  algorithm?: Algorithm;
  algorithmOptions?: AlgorithmOptions;
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
  GMP_CLICK = "gmp-click",
}

export const defaultOnClusterClickHandler: onClusterClickHandler = (
  _: google.maps.MapMouseEvent,
  cluster: Cluster,
  map: google.maps.Map
): void => {
  if (cluster.bounds) map.fitBounds(cluster.bounds);
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
  protected markers: Marker[];
  /** @see {@link MarkerClustererOptions.renderer} */
  protected renderer: Renderer;
  /** @see {@link MarkerClustererOptions.map} */
  protected map: google.maps.Map | null = null;
  protected idleListener: google.maps.MapsEventListener | null = null;

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

  public addMarker(marker: Marker, noDraw?: boolean): void {
    if (this.markers.includes(marker)) {
      return;
    }

    this.markers.push(marker);
    if (!noDraw) {
      this.render();
    }
  }

  public addMarkers(markers: Marker[], noDraw?: boolean): void {
    markers.forEach((marker) => {
      this.addMarker(marker, true);
    });

    if (!noDraw) {
      this.render();
    }
  }

  public removeMarker(marker: Marker, noDraw?: boolean): boolean {
    const index = this.markers.indexOf(marker);

    if (index === -1) {
      // Marker is not in our list of markers, so do nothing:
      return false;
    }

    MarkerUtils.setMap(marker, null);
    this.markers.splice(index, 1); // Remove the marker from the list of managed markers

    if (!noDraw) {
      this.render();
    }

    return true;
  }

  public removeMarkers(markers: Marker[], noDraw?: boolean): boolean {
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
    if (map instanceof google.maps.Map && map.getProjection()) {
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

      // Allow algorithms to return flag on whether the clusters/markers have changed.
      if (changed || changed == undefined) {
        // Accumulate the markers of the clusters composed of a single marker.
        // Those clusters directly use the marker.
        // Clusters with more than one markers use a group marker generated by a renderer.
        const singleMarker = new Set<Marker>();
        for (const cluster of clusters) {
          if (cluster.markers.length == 1) {
            singleMarker.add(cluster.markers[0]);
          }
        }

        const groupMarkers: Marker[] = [];
        // Iterate the clusters that are currently rendered.
        for (const cluster of this.clusters) {
          if (cluster.marker == null) {
            continue;
          }
          if (cluster.markers.length == 1) {
            if (!singleMarker.has(cluster.marker)) {
              // The marker:
              // - was previously rendered because it is from a cluster with 1 marker,
              // - should no more be rendered as it is not in singleMarker.
              MarkerUtils.setMap(cluster.marker, null);
            }
          } else {
            // Delay the removal of old group markers to avoid flickering.
            groupMarkers.push(cluster.marker);
          }
        }

        this.clusters = clusters;
        this.renderClusters();

        // Delayed removal of the markers of the former groups.
        setTimeout(() => {
          groupMarkers.forEach((marker) => {
            MarkerUtils.setMap(marker, null);
          });
        }, 35);
      }
      google.maps.event.trigger(
        this,
        MarkerClustererEvents.CLUSTERING_END,
        this
      );
    }
  }

  public onAdd(): void {
    const map = this.getMap();
    assertNotNull(map);

    this.idleListener = map.addListener("idle", this.render.bind(this));
    this.render();
  }

  public onRemove(): void {
    if (this.idleListener) google.maps.event.removeListener(this.idleListener);
    this.reset();
  }

  protected reset(): void {
    this.markers.forEach((marker) => MarkerUtils.setMap(marker, null));
    this.clusters.forEach((cluster) => cluster.delete());
    this.clusters = [];
  }

  protected renderClusters(): void {
    // Generate stats to pass to renderers.
    const stats = new ClusterStats(this.markers, this.clusters);
    const map = this.getMap() as google.maps.Map;

    this.clusters.forEach((cluster) => {
      if (cluster.markers.length === 1) {
        cluster.marker = cluster.markers[0];
      } else {
        // Generate the marker to represent the group.
        cluster.marker = this.renderer.render(cluster, stats, map);
        // Make sure all individual markers are removed from the map.
        cluster.markers.forEach((marker) => MarkerUtils.setMap(marker, null));
        if (this.onClusterClick) {
          // legacy Marker uses 'click' events, whereas AdvancedMarkerElement uses 'gmp-click'
          const markerClickEventName = MarkerUtils.isAdvancedMarker(
            cluster.marker
          )
            ? MarkerClustererEvents.GMP_CLICK
            : MarkerClustererEvents.CLUSTER_CLICK;

          cluster.marker.addListener(
            markerClickEventName,
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
      MarkerUtils.setMap(cluster.marker, map);
    });
  }
}
