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
import { Units } from "@turf/helpers";
import { Cluster } from "../cluster";
export interface DBScanOptions {
    units?: Units;
    minPoints?: number;
    mutate?: boolean;
}
export interface DBScanAlgorithmOptions extends ViewportAlgorithmOptions {
    maxDistance?: number;
    minPoints?: number;
}
/**
 *
 * **This algorithm is not yet ready for use!**
 *
 * Experimental algorithm using DBScan.
 *
 * The Grid algorithm does not implement caching and markers may flash as the
 * viewport changes. Instead use {@link SuperClusterAlgorithm}.
 *
 * @see https://www.npmjs.com/package/@turf/clusters-dbscan
 */
export declare class DBScanAlgorithm extends AbstractViewportAlgorithm {
    protected maxDistance: number;
    protected options: DBScanOptions;
    constructor({ maxDistance, minPoints, ...options }: DBScanAlgorithmOptions);
    protected cluster({ markers, mapCanvasProjection, }: AlgorithmInput): Cluster[];
}
