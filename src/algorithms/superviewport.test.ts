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

import { SuperClusterViewportAlgorithm } from "./superviewport";
import {
  initializeMocks,
  testMarkerTypes,
  setupMapBounds,
} from "../test-helpers";
import { MapCanvasProjection } from "@googlemaps/jest-mocks";
import { Marker } from "../marker-utils";
import { ClusterFeature } from "supercluster";
import { Cluster } from "../cluster";

initializeMocks();

describe.each(testMarkerTypes)(
  "SuperClusterViewportAlgorithm works with %s",
  (_, markerClass) => {
    let map: google.maps.Map;
    let mapCanvasProjection: MapCanvasProjection;

    beforeEach(() => {
      map = new google.maps.Map(document.createElement("div"));
      mapCanvasProjection = new MapCanvasProjection();

      mapCanvasProjection.fromLatLngToDivPixel = jest
        .fn()
        .mockImplementation((latLng: google.maps.LatLng) => ({
          x: latLng.lng() * 100,
          y: latLng.lat() * 100,
        }));

      mapCanvasProjection.fromDivPixelToLatLng = jest
        .fn()
        .mockImplementation((point: google.maps.Point) => ({
          lat: () => point.y / 100,
          lng: () => point.x / 100,
        }));
    });

    test("should only call load if markers change", () => {
      const markers: Marker[] = [new markerClass()];

      const superCluster = new SuperClusterViewportAlgorithm({});
      superCluster["superCluster"].load = jest.fn();
      superCluster.cluster = jest.fn();

      superCluster.calculate({
        markers,
        map,
        mapCanvasProjection,
      });
      superCluster.calculate({
        markers,
        map,
        mapCanvasProjection,
      });
      expect(superCluster["superCluster"].load).toHaveBeenCalledTimes(1);
      expect(superCluster["superCluster"].load).toHaveBeenCalledWith([
        {
          type: "Feature",
          geometry: { coordinates: [0, 0], type: "Point" },
          properties: { marker: markers[0] },
        },
      ]);
    });

    test("should cluster markers", () => {
      const markers: Marker[] = [new markerClass(), new markerClass()];

      const superCluster = new SuperClusterViewportAlgorithm({});
      map.getZoom = jest.fn().mockReturnValue(0);

      setupMapBounds(map, { west: 103, south: 29, east: 34, north: -3 });

      const { clusters } = superCluster.calculate({
        markers,
        map,
        mapCanvasProjection,
      });

      expect(clusters).toHaveLength(1);
    });

    test("should transform to Cluster with single marker if not cluster", () => {
      const superCluster = new SuperClusterViewportAlgorithm({});
      const marker: Marker = new markerClass();
      const clusterFeature: ClusterFeature<{ marker: Marker }> = {
        type: "Feature",
        geometry: { coordinates: [0, 0], type: "Point" },
        properties: {
          marker,
          cluster: true,
          cluster_id: 0,
          point_count: 1,
          point_count_abbreviated: 1,
        },
      };

      jest
        .spyOn(superCluster["superCluster"], "getLeaves")
        .mockImplementation(() => [clusterFeature]);

      const cluster = superCluster["transformCluster"](clusterFeature);
      expect(cluster.markers?.length).toEqual(1);
      expect(cluster.markers?.at(0)).toBe(marker);
    });

    test("should not cluster if zoom didn't change", () => {
      const markers: Marker[] = [new markerClass(), new markerClass()];

      const superCluster = new SuperClusterViewportAlgorithm({});
      superCluster["markers"] = markers;
      superCluster["state"] = { zoom: 12, view: [1, 2, 3, 4] };
      superCluster.cluster = jest.fn().mockReturnValue([]);
      superCluster["clusters"] = [];

      map.getZoom = jest.fn().mockReturnValue(superCluster["state"].zoom);

      const { clusters, changed } = superCluster.calculate({
        markers,
        map,
        mapCanvasProjection,
      });

      expect(changed).toBeFalsy();
      expect(clusters).toBe(superCluster["clusters"]);
    });

    test("should not cluster if zoom beyond maxZoom", () => {
      const markers: Marker[] = [new markerClass(), new markerClass()];

      const superCluster = new SuperClusterViewportAlgorithm({});
      superCluster["markers"] = markers;
      superCluster["state"] = { zoom: 20, view: [1, 2, 3, 4] };
      superCluster.cluster = jest.fn().mockReturnValue([]);
      superCluster["clusters"] = [];

      map.getZoom = jest.fn().mockReturnValue(superCluster["state"].zoom + 1);

      setupMapBounds(map, { west: 0, south: 0, east: 0, north: 0 });

      const { clusters, changed } = superCluster.calculate({
        markers,
        map,
        mapCanvasProjection,
      });

      expect(changed).toBeFalsy();
      expect(clusters).toBe(superCluster["clusters"]);
      expect(superCluster["state"].zoom).toBe(21);
      expect(Array.isArray(superCluster["state"].view)).toBeTruthy();
    });

    test("should not cluster if markers array is empty", () => {
      const mapCanvasProjection = new MapCanvasProjection();
      const markers: Marker[] = [];

      const superCluster = new SuperClusterViewportAlgorithm({});
      const clusterSpy = jest.spyOn(superCluster, "cluster");

      const { clusters, changed } = superCluster.calculate({
        markers,
        map,
        mapCanvasProjection,
      });

      expect(changed).toBeTruthy();
      expect(clusters).toBe(superCluster["clusters"]);
      expect(clusterSpy).not.toHaveBeenCalled();
    });

    test("should round fractional zoom", () => {
      const markers: Marker[] = [new markerClass(), new markerClass()];

      setupMapBounds(map, { west: 103, south: 29, east: 34, north: -3 });

      const superCluster = new SuperClusterViewportAlgorithm({});
      superCluster["superCluster"].getClusters = jest.fn().mockReturnValue([]);
      superCluster["markers"] = markers;
      superCluster["state"] = { zoom: 4, view: [1, 2, 3, 4] };
      superCluster["clusters"] = [];

      map.getZoom = jest.fn().mockReturnValue(1.534);
      expect(
        superCluster.calculate({ markers, map, mapCanvasProjection })
      ).toEqual({ changed: false, clusters: [] });

      expect(superCluster["superCluster"].getClusters).toHaveBeenCalledWith(
        expect.any(Array),
        2
      );

      map.getZoom = jest.fn().mockReturnValue(3.234);
      superCluster.calculate({ markers, map, mapCanvasProjection });
      expect(superCluster["superCluster"].getClusters).toHaveBeenCalledWith(
        expect.any(Array),
        3
      );
    });

    test("should return changed=false when viewport changes but clusters remain the same", () => {
      const markers: Marker[] = [new markerClass(), new markerClass()];

      map.getZoom = jest.fn().mockReturnValue(10);

      setupMapBounds(map, { west: 0, south: 0, east: 10, north: 10 });

      const algorithm = new SuperClusterViewportAlgorithm({
        viewportPadding: 60,
      });

      const sameCluster = [
        new Cluster({
          markers: markers,
          position: { lat: 5, lng: 5 },
        }),
      ];

      algorithm.cluster = jest.fn().mockReturnValue(sameCluster);

      const firstResult = algorithm.calculate({
        markers,
        map,
        mapCanvasProjection,
      });

      expect(firstResult.changed).toBeTruthy();

      setupMapBounds(map, { west: 5, south: 5, east: 15, north: 15 });

      const secondResult = algorithm.calculate({
        markers,
        map,
        mapCanvasProjection,
      });

      expect(secondResult.changed).toBeFalsy();
      expect(secondResult.clusters).toEqual(sameCluster);
    });

    test("should detect cluster changes accurately with areClusterArraysEqual", () => {
      const markers: Marker[] = [new markerClass(), new markerClass()];

      map.getZoom = jest.fn().mockReturnValue(10);
      setupMapBounds(map, { west: 0, south: 0, east: 10, north: 10 });

      const algorithm = new SuperClusterViewportAlgorithm({});

      const cluster1 = [
        new Cluster({
          markers: [markers[0]],
          position: { lat: 2, lng: 2 },
        }),
        new Cluster({
          markers: [markers[1]],
          position: { lat: 8, lng: 8 },
        }),
      ];

      algorithm.cluster = jest.fn().mockReturnValueOnce(cluster1);

      const result1 = algorithm.calculate({
        markers,
        map,
        mapCanvasProjection,
      });
      expect(result1.changed).toBeTruthy();

      const cluster2 = [
        new Cluster({
          markers: [markers[0]],
          position: { lat: 2, lng: 2 },
        }),
        new Cluster({
          markers: [markers[1]],
          position: { lat: 8, lng: 8 },
        }),
      ];

      algorithm.cluster = jest.fn().mockReturnValueOnce(cluster2);

      const result2 = algorithm.calculate({
        markers,
        map,
        mapCanvasProjection,
      });
      expect(result2.changed).toBeFalsy();

      const cluster3 = [
        new Cluster({
          markers: markers,
          position: { lat: 5, lng: 5 },
        }),
      ];

      algorithm.cluster = jest.fn().mockReturnValueOnce(cluster3);

      const result3 = algorithm.calculate({
        markers,
        map,
        mapCanvasProjection,
      });
      expect(result3.changed).toBeTruthy();
    });

    test("should correctly calculate viewport state with getPaddedViewport", () => {
      const markers: Marker[] = [new markerClass()];

      map.getZoom = jest.fn().mockReturnValue(10);

      setupMapBounds(map, { west: 10, south: 0, east: 20, north: 10 });

      const algorithm = new SuperClusterViewportAlgorithm({
        viewportPadding: 60,
      });
      algorithm.cluster = jest.fn().mockReturnValue([]);

      algorithm.calculate({
        markers,
        map,
        mapCanvasProjection,
      });

      const state = algorithm["state"];

      expect(state.view).toEqual([0, 0, 0, 0]);
      expect(state.zoom).toBe(10);
    });
  }
);
