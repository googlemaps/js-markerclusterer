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
import { AbstractAlgorithm, AlgorithmInput, AlgorithmOutput } from "./core";
import SuperCluster, { ClusterFeature } from "supercluster";
import { Marker } from "../marker-utils";
import { Cluster } from "../cluster";
export type SuperClusterOptions = SuperCluster.Options<{
    [name: string]: any;
}, {
    [name: string]: any;
}>;
/**
 * A very fast JavaScript algorithm for geospatial point clustering using KD trees.
 *
 * @see https://www.npmjs.com/package/supercluster for more information on options.
 */
export declare class SuperClusterAlgorithm extends AbstractAlgorithm {
    protected superCluster: SuperCluster;
    protected markers: Marker[];
    protected clusters: Cluster[];
    protected state: {
        zoom: number;
    };
    constructor({ maxZoom, radius, ...options }: SuperClusterOptions);
    calculate(input: AlgorithmInput): AlgorithmOutput;
    cluster({ map }: AlgorithmInput): Cluster[];
    protected transformCluster({ geometry: { coordinates: [lng, lat], }, properties, }: ClusterFeature<{
        marker: Marker;
    }>): Cluster;
}
