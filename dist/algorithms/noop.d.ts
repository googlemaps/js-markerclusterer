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
import { AbstractAlgorithm, AlgorithmInput, AlgorithmOptions, AlgorithmOutput } from "./core";
import { Cluster } from "../cluster";
/**
 * Noop algorithm does not generate any clusters or filter markers by the an extended viewport.
 */
export declare class NoopAlgorithm extends AbstractAlgorithm {
    constructor({ ...options }: AlgorithmOptions);
    calculate({ markers, map, mapCanvasProjection, }: AlgorithmInput): AlgorithmOutput;
    protected cluster(input: AlgorithmInput): Cluster[];
}
