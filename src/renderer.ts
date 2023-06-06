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

import { Cluster } from "./cluster";
import { Marker } from "./marker-utils";

/**
 * Provides statistics on all clusters in the current render cycle for use in {@link Renderer.render}.
 */
export class ClusterStats {
  public readonly markers: { sum: number };
  public readonly clusters: {
    count: number;
    markers: {
      mean: number;
      sum: number;
      min: number;
      max: number;
    };
  };

  constructor(markers: Marker[], clusters: Cluster[]) {
    this.markers = { sum: markers.length };
    const clusterMarkerCounts = clusters.map((a) => a.count);
    const clusterMarkerSum = clusterMarkerCounts.reduce((a, b) => a + b, 0);

    this.clusters = {
      count: clusters.length,
      markers: {
        mean: clusterMarkerSum / clusters.length,
        sum: clusterMarkerSum,
        min: Math.min(...clusterMarkerCounts),
        max: Math.max(...clusterMarkerCounts),
      },
    };
  }
}

export interface Renderer {
  /**
   * Turn a {@link Cluster} into a `google.maps.Marker`.
   *
   * Below is a simple example to create a marker with the number of markers in the cluster as a label.
   *
   * ```typescript
   * return new google.maps.Marker({
   *   position,
   *   label: String(markers.length),
   * });
   * ```
   */
  render(cluster: Cluster, stats: ClusterStats, map: google.maps.Map): Marker;
}

export class DefaultRenderer implements Renderer {
  /**
   * The default render function for the library used by {@link MarkerClusterer}.
   *
   * Currently set to use the following:
   *
   * ```typescript
   * // change color if this cluster has more markers than the mean cluster
   * const color =
   *   count > Math.max(10, stats.clusters.markers.mean)
   *     ? "#ff0000"
   *     : "#0000ff";
   *
   * // create svg url with fill color
   * const svg = window.btoa(`
   * <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
   *   <circle cx="120" cy="120" opacity=".6" r="70" />
   *   <circle cx="120" cy="120" opacity=".3" r="90" />
   *   <circle cx="120" cy="120" opacity=".2" r="110" />
   *   <circle cx="120" cy="120" opacity=".1" r="130" />
   * </svg>`);
   *
   * // create marker using svg icon
   * return new google.maps.Marker({
   *   position,
   *   icon: {
   *     url: `data:image/svg+xml;base64,${svg}`,
   *     scaledSize: new google.maps.Size(45, 45),
   *   },
   *   label: {
   *     text: String(count),
   *     color: "rgba(255,255,255,0.9)",
   *     fontSize: "12px",
   *   },
   *   // adjust zIndex to be above other markers
   *   zIndex: 1000 + count,
   * });
   * ```
   */
  public render(
    { count, position }: Cluster,
    stats: ClusterStats,
    map: google.maps.Map
  ): Marker {
    // change color if this cluster has more markers than the mean cluster
    const color =
      count > Math.max(10, stats.clusters.markers.mean) ? "#ff0000" : "#0000ff";

    // create svg literal with fill color
    const svg = `<svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="50" height="50">
<circle cx="120" cy="120" opacity=".6" r="70" />
<circle cx="120" cy="120" opacity=".3" r="90" />
<circle cx="120" cy="120" opacity=".2" r="110" />
<text x="50%" y="50%" style="fill:#fff" text-anchor="middle" font-size="50" dominant-baseline="middle" font-family="roboto,arial,sans-serif">${count}</text>
</svg>`;

    const title = `Cluster of ${count} markers`,
      // adjust zIndex to be above other markers
      zIndex: number = Number(google.maps.Marker.MAX_ZINDEX) + count;

    if (
      google.maps.marker &&
      map.getMapCapabilities().isAdvancedMarkersAvailable
    ) {
      const div = document.createElement("div");
      div.innerHTML = svg;
      const svgEl = div.firstElementChild;
      svgEl.setAttribute("transform", "translate(0 25)");

      const clusterOptions: google.maps.marker.AdvancedMarkerElementOptions = {
        map,
        position,
        zIndex,
        title,
        content: svgEl,
      };
      return new google.maps.marker.AdvancedMarkerElement(clusterOptions);
    }

    const clusterOptions: google.maps.MarkerOptions = {
      position,
      zIndex,
      title,
      icon: {
        url: `data:image/svg+xml;base64,${btoa(svg)}`,
        anchor: new google.maps.Point(25, 25),
      },
    };
    return new google.maps.Marker(clusterOptions);
  }
}
