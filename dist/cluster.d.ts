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
export interface ClusterOptions {
    position?: google.maps.LatLng | google.maps.LatLngLiteral;
    markers?: google.maps.Marker[];
}
export declare class Cluster {
    marker: google.maps.Marker;
    readonly markers?: google.maps.Marker[];
    protected _position: google.maps.LatLng;
    constructor({ markers, position }: ClusterOptions);
    get bounds(): google.maps.LatLngBounds | undefined;
    get position(): google.maps.LatLng;
    /**
     * Get the count of **visible** markers.
     */
    get count(): number;
    /**
     * Add a marker to the cluster.
     */
    push(marker: google.maps.Marker): void;
    /**
     * Cleanup references and remove marker from map.
     */
    delete(): void;
}
