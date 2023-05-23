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
import { Algorithm, AlgorithmOptions } from "./algorithms";
import { Renderer } from "./renderer";
import { Cluster } from "./cluster";
import { OverlayViewSafe } from "./overlay-view-safe";
import { Marker } from "./marker-utils";
export type onClusterClickHandler = (event: google.maps.MapMouseEvent, cluster: Cluster, map: google.maps.Map) => void;
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
export declare enum MarkerClustererEvents {
    CLUSTERING_BEGIN = "clusteringbegin",
    CLUSTERING_END = "clusteringend",
    CLUSTER_CLICK = "click"
}
export declare const defaultOnClusterClickHandler: onClusterClickHandler;
/**
 * MarkerClusterer creates and manages per-zoom-level clusters for large amounts
 * of markers. See {@link MarkerClustererOptions} for more details.
 *
 */
export declare class MarkerClusterer extends OverlayViewSafe {
    /** @see {@link MarkerClustererOptions.onClusterClick} */
    onClusterClick: onClusterClickHandler;
    /** @see {@link MarkerClustererOptions.algorithm} */
    protected algorithm: Algorithm;
    protected clusters: Cluster[];
    protected markers: Marker[];
    /** @see {@link MarkerClustererOptions.renderer} */
    protected renderer: Renderer;
    /** @see {@link MarkerClustererOptions.map} */
    protected map: google.maps.Map | null;
    protected idleListener: google.maps.MapsEventListener;
    constructor({ map, markers, algorithmOptions, algorithm, renderer, onClusterClick, }: MarkerClustererOptions);
    addMarker(marker: Marker, noDraw?: boolean): void;
    addMarkers(markers: Marker[], noDraw?: boolean): void;
    removeMarker(marker: Marker, noDraw?: boolean): boolean;
    removeMarkers(markers: Marker[], noDraw?: boolean): boolean;
    clearMarkers(noDraw?: boolean): void;
    /**
     * Recalculates and draws all the marker clusters.
     */
    render(): void;
    onAdd(): void;
    onRemove(): void;
    protected reset(): void;
    protected renderClusters(): void;
}
