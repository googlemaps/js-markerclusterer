/**
 * Copyright 2024 Google LLC
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

import { Cluster } from "./cluster";
import { ClusterStats, DefaultRenderer } from "./renderer";
import { Marker, MarkerUtils } from "./marker-utils";
import { initializeMocks } from "./test-helpers";

initializeMocks();

beforeEach(() => {
  initializeMocks();
  jest.spyOn(MarkerUtils, "getVisible").mockReturnValue(true);
});

describe("ClusterStats", () => {
  test("computes statistics correctly for non-empty clusters", () => {
    const markers: Marker[] = [
      new google.maps.Marker(),
      new google.maps.Marker(),
      new google.maps.Marker(),
      new google.maps.Marker(),
      new google.maps.Marker(),
      new google.maps.Marker(),
    ];

    const clusters = [
      new Cluster({ markers: markers.slice(0, 1) }),
      new Cluster({ markers: markers.slice(1, 3) }),
      new Cluster({ markers: markers.slice(3, 6) }),
    ];

    const stats = new ClusterStats(markers, clusters);

    expect(stats.markers.sum).toBe(6);
    expect(stats.clusters.count).toBe(3);
    expect(stats.clusters.markers.sum).toBe(6);
    expect(stats.clusters.markers.mean).toBe(2);
    expect(stats.clusters.markers.min).toBe(1);
    expect(stats.clusters.markers.max).toBe(3);
  });

  test("computes stats lazily only when cluster marker properties are accessed", () => {
    const countGetterSpies: jest.Mock[] = [];
    const clusters = [1, 5, 9].map((count) => {
      const spy = jest.fn().mockReturnValue(count);
      countGetterSpies.push(spy);
      const cluster = new Cluster({ markers: [] });
      Object.defineProperty(cluster, "count", {
        get: spy,
      });
      return cluster;
    });

    const stats = new ClusterStats([], clusters);

    // Initial construction must not access cluster counts
    countGetterSpies.forEach((spy) => expect(spy).not.toHaveBeenCalled());

    // Accessing markers.sum must not access cluster counts
    expect(stats.markers.sum).toBe(0);
    countGetterSpies.forEach((spy) => expect(spy).not.toHaveBeenCalled());

    // Accessing clusters.count must not access cluster counts
    expect(stats.clusters.count).toBe(3);
    countGetterSpies.forEach((spy) => expect(spy).not.toHaveBeenCalled());

    // Accessing clusters.markers.mean triggers computation once
    expect(stats.clusters.markers.mean).toBe(5);
    countGetterSpies.forEach((spy) => expect(spy).toHaveBeenCalledTimes(1));

    // Subsequent accesses must use the cached values and not recompute
    expect(stats.clusters.markers.sum).toBe(15);
    expect(stats.clusters.markers.min).toBe(1);
    expect(stats.clusters.markers.max).toBe(9);
    countGetterSpies.forEach((spy) => expect(spy).toHaveBeenCalledTimes(1));
  });

  test("handles empty clusters and markers array without error", () => {
    const stats = new ClusterStats([], []);

    expect(stats.markers.sum).toBe(0);
    expect(stats.clusters.count).toBe(0);
    expect(Number.isNaN(stats.clusters.markers.mean)).toBe(true);
    expect(stats.clusters.markers.sum).toBe(0);
    expect(stats.clusters.markers.min).toBe(Infinity);
    expect(stats.clusters.markers.max).toBe(-Infinity);
  });

  test("computes statistics correctly for a single cluster", () => {
    const markers: Marker[] = [
      new google.maps.Marker(),
      new google.maps.Marker(),
    ];
    const clusters = [new Cluster({ markers })];
    const stats = new ClusterStats(markers, clusters);

    expect(stats.markers.sum).toBe(2);
    expect(stats.clusters.count).toBe(1);
    expect(stats.clusters.markers.mean).toBe(2);
    expect(stats.clusters.markers.sum).toBe(2);
    expect(stats.clusters.markers.min).toBe(2);
    expect(stats.clusters.markers.max).toBe(2);
  });
});

describe("DefaultRenderer", () => {
  let map: google.maps.Map;
  let renderer: DefaultRenderer;

  beforeEach(() => {
    map = new google.maps.Map(document.createElement("div"));
    renderer = new DefaultRenderer();
  });

  test("renders a standard marker when advanced markers are not available", () => {
    jest.spyOn(MarkerUtils, "isAdvancedMarkerAvailable").mockReturnValue(false);

    const cluster = new Cluster({
      markers: [new google.maps.Marker(), new google.maps.Marker()],
      position: new google.maps.LatLng(10, 20),
    });
    const stats = new ClusterStats([], [cluster]);

    const marker = renderer.render(cluster, stats, map);
    expect(marker).toBeInstanceOf(google.maps.Marker);
  });

  test("renders an advanced marker when advanced markers are available", () => {
    jest.spyOn(MarkerUtils, "isAdvancedMarkerAvailable").mockReturnValue(true);

    const cluster = new Cluster({
      markers: [new google.maps.Marker(), new google.maps.Marker()],
      position: new google.maps.LatLng(10, 20),
    });
    const stats = new ClusterStats([], [cluster]);

    const marker = renderer.render(cluster, stats, map);
    expect(marker).toBeInstanceOf(google.maps.marker.AdvancedMarkerElement);
  });
});
