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
import { initialize, MapCanvasProjection } from "@googlemaps/jest-mocks";
import { Marker } from "../marker-utils";
import { ClusterFeature } from "supercluster";
import { Cluster } from "../cluster";

initialize();
const markerClasses = [
  google.maps.Marker,
  google.maps.marker.AdvancedMarkerElement,
];

describe.each(markerClasses)(
  "SuperCluster works with legacy and Advanced Markers",
  (markerClass) => {
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

      const northEast = {
        lat: jest.fn().mockReturnValue(-3),
        lng: jest.fn().mockReturnValue(34),
      };
      const southWest = {
        lat: jest.fn().mockReturnValue(29),
        lng: jest.fn().mockReturnValue(103),
      };

      map.getBounds = jest.fn().mockReturnValue({
        toJSON: () => ({
          west: -180,
          south: -90,
          east: 180,
          north: 90,
        }),
        getNorthEast: jest.fn().mockReturnValue(northEast),
        getSouthWest: jest.fn().mockReturnValue(southWest),
      });

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

      const northEast = {
        lat: jest.fn().mockReturnValue(0),
        lng: jest.fn().mockReturnValue(0),
      };
      const southWest = {
        lat: jest.fn().mockReturnValue(0),
        lng: jest.fn().mockReturnValue(0),
      };
      map.getBounds = jest.fn().mockReturnValue({
        getNorthEast: jest.fn().mockReturnValue(northEast),
        getSouthWest: jest.fn().mockReturnValue(southWest),
      });

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

    test("should round fractional zoom", () => {
      const markers: Marker[] = [new markerClass(), new markerClass()];

      const northEast = {
        lat: jest.fn().mockReturnValue(-3),
        lng: jest.fn().mockReturnValue(34),
      };
      const southWest = {
        lat: jest.fn().mockReturnValue(29),
        lng: jest.fn().mockReturnValue(103),
      };

      map.getBounds = jest.fn().mockReturnValue({
        getNorthEast: jest.fn().mockReturnValue(northEast),
        getSouthWest: jest.fn().mockReturnValue(southWest),
      });

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

      const initialNorthEast = {
        lat: jest.fn().mockReturnValue(10),
        lng: jest.fn().mockReturnValue(10),
      };
      const initialSouthWest = {
        lat: jest.fn().mockReturnValue(0),
        lng: jest.fn().mockReturnValue(0),
      };
      const initialBounds = {
        getNorthEast: jest.fn().mockReturnValue(initialNorthEast),
        getSouthWest: jest.fn().mockReturnValue(initialSouthWest),
      };
      map.getBounds = jest.fn().mockReturnValue(initialBounds);

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

      const newNorthEast = {
        lat: jest.fn().mockReturnValue(15),
        lng: jest.fn().mockReturnValue(15),
      };
      const newSouthWest = {
        lat: jest.fn().mockReturnValue(5),
        lng: jest.fn().mockReturnValue(5),
      };
      const newBounds = {
        getNorthEast: jest.fn().mockReturnValue(newNorthEast),
        getSouthWest: jest.fn().mockReturnValue(newSouthWest),
      };
      map.getBounds = jest.fn().mockReturnValue(newBounds);

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
      map.getBounds = jest.fn().mockReturnValue({
        getNorthEast: jest
          .fn()
          .mockReturnValue({ lat: () => 10, lng: () => 10 }),
        getSouthWest: jest.fn().mockReturnValue({ lat: () => 0, lng: () => 0 }),
      });

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

      const northEast = {
        lat: jest.fn().mockReturnValue(10),
        lng: jest.fn().mockReturnValue(20),
      };
      const southWest = {
        lat: jest.fn().mockReturnValue(0),
        lng: jest.fn().mockReturnValue(10),
      };

      const bounds = {
        getNorthEast: jest.fn().mockReturnValue(northEast),
        getSouthWest: jest.fn().mockReturnValue(southWest),
      };
      map.getBounds = jest.fn().mockReturnValue(bounds);

      const algorithm = new SuperClusterViewportAlgorithm({
        viewportPadding: 60,
      });
      algorithm.cluster = jest.fn().mockReturnValue([]);

      const result = algorithm.calculate({
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
