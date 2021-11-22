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
/// <reference types="google.maps" />
import { Cluster } from "./cluster";
/**
 * Provides statistics on all clusters in the current render cycle for use in {@link Renderer.render}.
 */
export declare class ClusterStats {
    readonly markers: {
        sum: number;
    };
    readonly clusters: {
        count: number;
        markers: {
            mean: number;
            sum: number;
            min: number;
            max: number;
        };
    };
    constructor(markers: google.maps.Marker[], clusters: Cluster[]);
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
    render(cluster: Cluster, stats: ClusterStats): google.maps.Marker;
}
export declare class DefaultRenderer implements Renderer {
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
    render({ count, position }: Cluster, stats: ClusterStats): google.maps.Marker;
}
