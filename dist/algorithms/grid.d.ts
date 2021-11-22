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
import { AbstractViewportAlgorithm, AlgorithmInput, ViewportAlgorithmOptions } from "./core";
import { Cluster } from "../cluster";
export interface GridOptions extends ViewportAlgorithmOptions {
    gridSize?: number;
    /**
     * Max distance between cluster center and point in meters.
     * @default 10000
     */
    maxDistance?: number;
}
/**
 * The default Grid algorithm historically used in Google Maps marker
 * clustering.
 *
 * The Grid algorithm does not implement caching and markers may flash as the
 * viewport changes. Instead use {@link SuperClusterAlgorithm}.
 */
export declare class GridAlgorithm extends AbstractViewportAlgorithm {
    protected gridSize: number;
    protected maxDistance: number;
    protected clusters: Cluster[];
    constructor({ maxDistance, gridSize, ...options }: GridOptions);
    protected cluster({ markers, map, mapCanvasProjection, }: AlgorithmInput): Cluster[];
    protected addToClosestCluster(marker: google.maps.Marker, map: google.maps.Map, projection: google.maps.MapCanvasProjection): void;
}
