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
import { Cluster } from "../cluster";
import { Marker } from "../marker-utils";
export interface AlgorithmInput {
    /**
     * The map containing the markers and clusters.
     */
    map: google.maps.Map;
    /**
     * An array of markers to be clustered.
     *
     * There are some specific edge cases to be aware of including the following:
     * * Markers that are not visible.
     */
    markers: Marker[];
    /**
     * The `mapCanvasProjection` enables easy conversion from lat/lng to pixel.
     *
     * @see [MapCanvasProjection](https://developers.google.com/maps/documentation/javascript/reference/overlay-view#MapCanvasProjection)
     */
    mapCanvasProjection: google.maps.MapCanvasProjection;
}
export interface AlgorithmOutput {
    /**
     * The clusters returned based upon the {@link AlgorithmInput}.
     */
    clusters: Cluster[];
    /**
     * A boolean flag indicating that the clusters have not changed.
     */
    changed?: boolean;
}
export interface Algorithm {
    /**
     * Calculates an array of {@link Cluster}.
     */
    calculate: ({ markers, map }: AlgorithmInput) => AlgorithmOutput;
}
export interface AlgorithmOptions {
    maxZoom?: number;
}
/**
 * @hidden
 */
export declare abstract class AbstractAlgorithm implements Algorithm {
    protected maxZoom: number;
    constructor({ maxZoom }: AlgorithmOptions);
    /**
     * Helper function to bypass clustering based upon some map state such as
     * zoom, number of markers, etc.
     *
     * ```typescript
     *  cluster({markers, map}: AlgorithmInput): Cluster[] {
     *    if (shouldBypassClustering(map)) {
     *      return this.noop({markers})
     *    }
     * }
     * ```
     */
    protected noop<T extends Pick<AlgorithmInput, "markers">>({ markers, }: T): Cluster[];
    /**
     * Calculates an array of {@link Cluster}. Calculate is separate from
     * {@link cluster} as it does preprocessing on the markers such as filtering
     * based upon the viewport as in {@link AbstractViewportAlgorithm}. Caching
     * and other optimizations can also be done here.
     */
    abstract calculate({ markers, map }: AlgorithmInput): AlgorithmOutput;
    /**
     * Clusters the markers and called from {@link calculate}.
     */
    protected abstract cluster({ markers, map }: AlgorithmInput): Cluster[];
}
/**
 * @hidden
 */
export interface ViewportAlgorithmOptions extends AlgorithmOptions {
    /**
     * The number of pixels to extend beyond the viewport bounds when filtering
     * markers prior to clustering.
     */
    viewportPadding?: number;
}
/**
 * Abstract viewport algorithm proves a class to filter markers by a padded
 * viewport. This is a common optimization.
 *
 * @hidden
 */
export declare abstract class AbstractViewportAlgorithm extends AbstractAlgorithm {
    protected viewportPadding: number;
    constructor({ viewportPadding, ...options }: ViewportAlgorithmOptions);
    calculate({ markers, map, mapCanvasProjection, }: AlgorithmInput): AlgorithmOutput;
    protected abstract cluster({ markers, map }: AlgorithmInput): Cluster[];
}
/**
 * @hidden
 */
export declare const noop: (markers: Marker[]) => Cluster[];
