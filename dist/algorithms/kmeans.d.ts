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
import { AbstractViewportAlgorithm, AlgorithmInput, ViewportAlgorithmOptions } from "./core";
import { Cluster } from "../cluster";
export interface KmeansAlgorithmOptions extends ViewportAlgorithmOptions {
    numberOfClusters: number | ((count: number, zoom: number) => number);
}
/**
 * Experimental algorithm using Kmeans.
 *
 * The Grid algorithm does not implement caching and markers may flash as the
 * viewport changes. Instead use {@link SuperClusterAlgorithm}.
 *
 * @see https://www.npmjs.com/package/@turf/clusters-kmeans
 */
export declare class KmeansAlgorithm extends AbstractViewportAlgorithm {
    protected numberOfClusters: number | ((count: number, zoom: number) => number);
    constructor({ numberOfClusters, ...options }: KmeansAlgorithmOptions);
    protected cluster({ markers, map }: AlgorithmInput): Cluster[];
}
