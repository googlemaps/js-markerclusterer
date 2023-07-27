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
import { AbstractViewportAlgorithm, AlgorithmInput, AlgorithmOutput, ViewportAlgorithmOptions } from "./core";
import { SuperClusterOptions } from "./supercluster";
import SuperCluster, { ClusterFeature } from "supercluster";
import { Marker } from "../marker-utils";
import { Cluster } from "../cluster";
export interface SuperClusterViewportOptions extends SuperClusterOptions, ViewportAlgorithmOptions {
}
export interface SuperClusterViewportState {
    zoom: number;
    view: [number, number, number, number];
}
/**
 * A very fast JavaScript algorithm for geospatial point clustering using KD trees.
 *
 * @see https://www.npmjs.com/package/supercluster for more information on options.
 */
export declare class SuperClusterViewportAlgorithm extends AbstractViewportAlgorithm {
    protected superCluster: SuperCluster;
    protected markers: Marker[];
    protected clusters: Cluster[];
    protected state: SuperClusterViewportState;
    constructor({ maxZoom, radius, viewportPadding, ...options }: SuperClusterViewportOptions);
    calculate(input: AlgorithmInput): AlgorithmOutput;
    cluster({ map, mapCanvasProjection }: AlgorithmInput): Cluster[];
    protected transformCluster({ geometry: { coordinates: [lng, lat], }, properties, }: ClusterFeature<{
        marker: Marker;
    }>): Cluster;
}
