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

import {
  Cluster,
  ClusterStats,
  MarkerClusterer,
  defaultOnClusterClickHandler,
} from ".";

import { initialize } from "@googlemaps/jest-mocks";
import { MarkerUtils, Marker } from "./marker-utils";

initialize();
const markerClasses = [
  google.maps.Marker,
  google.maps.marker.AdvancedMarkerElement,
];

describe.each(markerClasses)(
  "MarkerClusterer works with legacy and Advanced Markers",
  (markerClass) => {
    const calculate = jest.fn().mockReturnValue({ clusters: [] });
    const algorithm = { calculate };

    const render = jest.fn().mockImplementation(() => new markerClass());
    const renderer = { render };

    let map: google.maps.Map;
    let rafSpy: jest.SpyInstance;

    beforeEach(() => {
      map = new google.maps.Map(document.createElement("div"));
      // Runs the raf callback immediately.
      rafSpy = jest
        .spyOn(window, "requestAnimationFrame")
        .mockImplementation((cb) => {
          cb(performance.now());
          return 0;
        });
    });

    afterEach(() => {
      calculate.mockClear();
      render.mockClear();
      rafSpy.mockRestore();
    });

    test("markerClusterer does not render if no map", () => {
      const calculate = jest.fn();
      const markerClusterer = new MarkerClusterer({
        markers: [],
        algorithm: { calculate },
      });
      markerClusterer.getMap = jest.fn().mockImplementation(() => null);
      markerClusterer.getProjection = jest.fn().mockImplementation(() => null);

      markerClusterer.render();
      expect(calculate).toHaveBeenCalledTimes(0);
    });

    test("markerClusterer calls calculate correctly", () => {
      const mapCanvasProjection = jest.fn();
      const markers: Marker[] = [];

      const markerClusterer = new MarkerClusterer({
        markers,
        algorithm,
      });

      markerClusterer.getMap = jest.fn().mockImplementation(() => map);
      markerClusterer.getProjection = jest
        .fn()
        .mockImplementation(() => mapCanvasProjection);
      markerClusterer["reset"] = jest.fn();
      markerClusterer["renderClusters"] = jest.fn();
      markerClusterer.render();

      expect(calculate).toBeCalledWith({ map, markers, mapCanvasProjection });
      expect(markerClusterer["reset"]).toHaveBeenCalledTimes(0);
      expect(markerClusterer["renderClusters"]).toHaveBeenCalledTimes(1);
    });

    test("markerClusterer does not reset and renderClusters if no change", () => {
      const mapCanvasProjection = jest.fn();
      const markers: Marker[] = [];
      const algorithm = {
        calculate: jest.fn().mockReturnValue({ clusters: [], changed: false }),
      };
      const markerClusterer = new MarkerClusterer({
        markers,
        algorithm,
      });

      markerClusterer.getMap = jest.fn().mockImplementation(() => map);
      markerClusterer.getProjection = jest
        .fn()
        .mockImplementation(() => mapCanvasProjection);
      markerClusterer["reset"] = jest.fn();
      markerClusterer["renderClusters"] = jest.fn();
      markerClusterer.render();

      expect(markerClusterer["reset"]).toHaveBeenCalledTimes(0);
      expect(markerClusterer["renderClusters"]).toHaveBeenCalledTimes(0);
    });

    test("markerClusterer reset calls delete and setMap null", () => {
      const marker = new markerClass();
      const markers: Marker[] = [marker];

      const markerClusterer = new MarkerClusterer({
        markers,
      });
      const clusters = [new Cluster({ markers })];
      const deleteSpy = jest.spyOn(clusters[0], "delete");

      MarkerUtils.setMap = jest.fn().mockImplementation(() => null);

      markerClusterer["clusters"] = clusters;
      markerClusterer["reset"]();

      expect(MarkerUtils.setMap).toHaveBeenCalledWith(marker, null);
      expect(deleteSpy).toHaveBeenCalledTimes(1);
    });

    test("markerClusterer render should not remove markers from the map if they were already rendered", () => {
      const marker = new markerClass();
      const markers: Marker[] = [marker];

      const algorithm = {
        calculate: jest.fn().mockReturnValue({
          clusters: [new Cluster({ markers })],
          changed: true,
        }),
      };
      const markerClusterer = new MarkerClusterer({
        markers,
        algorithm,
      });
      markerClusterer.getMap = jest.fn().mockImplementation(() => map);
      markerClusterer.getProjection = jest
        .fn()
        .mockImplementation(() => jest.fn());
      markerClusterer["renderClusters"] = jest.fn();
      markerClusterer["clusters"] = [new Cluster({ markers })];

      MarkerUtils.setMap = jest.fn().mockImplementation(() => null);

      markerClusterer["render"]();

      expect(MarkerUtils.setMap).toHaveBeenCalledTimes(0);
    });

    test("markerClusterer render should remove markers from the map if they are no more rendered", () => {
      const marker = new markerClass();
      const markers: Marker[] = [marker];

      const algorithm = {
        calculate: jest.fn().mockReturnValue({ clusters: [], changed: true }),
      };
      const markerClusterer = new MarkerClusterer({
        markers,
        algorithm,
      });
      markerClusterer.getMap = jest.fn().mockImplementation(() => map);
      markerClusterer.getProjection = jest
        .fn()
        .mockImplementation(() => jest.fn());
      markerClusterer["renderClusters"] = jest.fn();
      const cluster = new Cluster({ markers });
      cluster.marker = marker;
      markerClusterer["clusters"] = [cluster];

      MarkerUtils.setMap = jest.fn().mockImplementation(() => null);

      markerClusterer["render"]();

      expect(MarkerUtils.setMap).toHaveBeenCalledWith(marker, null);
    });

    test("markerClusterer render should remove all group cluster markers from the map", () => {
      const markers: Marker[] = [new markerClass(), new markerClass()];
      const algorithm = {
        calculate: jest.fn().mockReturnValue({ clusters: [], changed: true }),
      };
      const markerClusterer = new MarkerClusterer({
        markers,
        algorithm,
      });
      markerClusterer.getMap = jest.fn().mockImplementation(() => map);
      markerClusterer.getProjection = jest
        .fn()
        .mockImplementation(() => jest.fn());
      markerClusterer["renderClusters"] = jest.fn();
      const cluster = new Cluster({ markers });
      cluster.marker = new markerClass();
      markerClusterer["clusters"] = [cluster];

      MarkerUtils.setMap = jest.fn().mockImplementation(() => null);

      markerClusterer["render"]();

      expect(MarkerUtils.setMap).toHaveBeenCalledWith(cluster.marker, null);
    });

    test("markerClusterer renderClusters bypasses renderer if just one", () => {
      const markers: Marker[] = [new markerClass()];

      const markerClusterer = new MarkerClusterer({
        markers,
      });

      markerClusterer.getMap = jest.fn().mockImplementation(() => map);

      const clusters = [new Cluster({ markers })];

      markerClusterer["clusters"] = clusters;
      markerClusterer["renderClusters"]();

      expect(clusters[0].marker).toBe(markers[0]);
      expect(MarkerUtils.setMap).toBeCalledWith(markers[0], map);
    });

    test("markerClusterer renderClusters calls renderer", () => {
      const markers: Marker[] = [new markerClass(), new markerClass()];

      const markerClusterer = new MarkerClusterer({
        markers,
        renderer,
      });

      MarkerUtils.setMap = jest.fn();
      markerClusterer.getMap = jest.fn().mockImplementation(() => map);

      const clusters = [new Cluster({ markers }), new Cluster({ markers })];

      markerClusterer["clusters"] = clusters;
      markerClusterer["renderClusters"]();

      clusters.forEach((cluster) => {
        expect(MarkerUtils.setMap).toBeCalledWith(cluster.marker, map);
        expect(cluster.marker?.addListener).toHaveBeenCalledWith(
          /**
           * - Standard `google.maps.Marker` uses the `"click"` event.
             - `AdvancedMarkerElement` requires `"gmp-click"` instead.
           */
          MarkerUtils.isAdvancedMarker(cluster.marker!) ? "gmp-click" : "click",
          expect.any(Function)
        );
      });

      expect(renderer.render).toBeCalledWith(
        clusters[0],
        expect.any(ClusterStats),
        map
      );
    });

    test("markerClusterer renderClusters remove all individual markers from the map", () => {
      const marker1 = new markerClass();
      const marker2 = new markerClass();
      const markers: Marker[] = [marker1, marker2];

      const markerClusterer = new MarkerClusterer({
        markers,
        renderer,
      });

      MarkerUtils.setMap = jest.fn();
      markerClusterer.getMap = jest.fn().mockImplementation(() => map);

      const clusters = [new Cluster({ markers })];

      markerClusterer["clusters"] = clusters;
      markerClusterer["renderClusters"]();

      expect(MarkerUtils.setMap).toBeCalledWith(marker1, null);
      expect(MarkerUtils.setMap).toBeCalledWith(marker2, null);
    });

    test("markerClusterer renderClusters does not set click handler", () => {
      const markers: Marker[] = [new markerClass()];

      const markerClusterer = new MarkerClusterer({
        markers,
        onClusterClick: undefined,
      });

      markerClusterer.getMap = jest.fn().mockImplementation(() => map);

      const clusters = [new Cluster({ markers }), new Cluster({ markers })];

      markerClusterer["clusters"] = clusters;
      markerClusterer["renderClusters"]();

      clusters.forEach((cluster) => {
        expect(cluster.marker?.addListener).toBeCalledTimes(0);
      });
    });

    test("markerClusterer onAdd calls render and sets listener", () => {
      const markerClusterer = new MarkerClusterer({
        markers: [],
      });

      markerClusterer.getMap = jest.fn().mockImplementation(() => map);
      markerClusterer.render = jest.fn();
      markerClusterer.onAdd();

      expect(map.addListener).toBeCalledWith("idle", expect.any(Function));
      expect(markerClusterer.render).toBeCalledTimes(1);
    });

    test("markerClusterer onRemove calls reset and removes listener", () => {
      const markerClusterer = new MarkerClusterer({
        markers: [],
      });

      markerClusterer.getMap = jest.fn().mockImplementation(() => map);
      markerClusterer["reset"] = jest.fn();

      markerClusterer.onRemove();

      expect(markerClusterer["reset"]).toBeCalledTimes(1);
      expect(markerClusterer["idleListener"]).toBeNull();
    });

    test("markerClusterer addMarker", () => {
      const markerClusterer = new MarkerClusterer({
        markers: [],
      });

      markerClusterer.render = jest.fn();

      markerClusterer.addMarker(new markerClass());
      expect(markerClusterer.render).toBeCalledTimes(1);
      expect(markerClusterer["markers"]).toHaveLength(1);
    });

    test("markerClusterer addMarker does not add duplicate", () => {
      const markerClusterer = new MarkerClusterer({
        markers: [],
      });

      const marker = new markerClass();

      markerClusterer.addMarker(marker, true);
      markerClusterer.addMarker(marker, true);
      expect(markerClusterer["markers"]).toHaveLength(1);
    });

    test("markerClusterer addMarkers", () => {
      const markerClusterer = new MarkerClusterer({
        markers: [],
      });

      markerClusterer.render = jest.fn();

      markerClusterer.addMarkers([new markerClass(), new markerClass()]);
      expect(markerClusterer.render).toBeCalledTimes(1);
      expect(markerClusterer["markers"]).toHaveLength(2);

      markerClusterer.addMarkers(
        [
          new google.maps.Marker(),
          new google.maps.marker.AdvancedMarkerElement(),
        ],
        true
      );
      expect(markerClusterer.render).toBeCalledTimes(1);
    });

    test("markerClusterer removeMarker if present", () => {
      const markers = [new markerClass()];
      const markerClusterer = new MarkerClusterer({
        markers,
      });

      markerClusterer.render = jest.fn();

      expect(markerClusterer.removeMarker(markers[0])).toBe(true);
      expect(markerClusterer.render).toBeCalledTimes(1);
      expect(markerClusterer["markers"]).toHaveLength(0);
    });

    test("markerClusterer removeMarker if absent", () => {
      const markers = [new markerClass()];
      const markerClusterer = new MarkerClusterer({
        markers,
      });

      markerClusterer.render = jest.fn();

      expect(markerClusterer.removeMarker(new google.maps.Marker())).toBe(
        false
      );
      expect(
        markerClusterer.removeMarker(
          new google.maps.marker.AdvancedMarkerElement()
        )
      ).toBe(false);
      expect(markerClusterer.render).toBeCalledTimes(0);
      expect(markerClusterer["markers"]).toHaveLength(1);
    });

    test("markerClusterer removeMarkers if present", () => {
      const markers = [new markerClass()];
      const markerClusterer = new MarkerClusterer({
        markers,
      });

      markerClusterer.render = jest.fn();

      expect(markerClusterer.removeMarkers(markers)).toBe(true);
      expect(markerClusterer.render).toBeCalledTimes(1);
      expect(markerClusterer["markers"]).toHaveLength(0);
    });

    test("markerClusterer removeMarkers if absent", () => {
      const markers = [new markerClass()];
      const markerClusterer = new MarkerClusterer({
        markers,
      });

      markerClusterer.render = jest.fn();

      expect(markerClusterer.removeMarkers([new google.maps.Marker()])).toBe(
        false
      );
      expect(
        markerClusterer.removeMarkers([
          new google.maps.marker.AdvancedMarkerElement(),
        ])
      ).toBe(false);
      expect(markerClusterer.render).toBeCalledTimes(0);
      expect(markerClusterer["markers"]).toHaveLength(1);
    });

    test("markerClusterer removeMarkers if some absent", () => {
      const markers = [new markerClass()];
      const markerClusterer = new MarkerClusterer({
        markers,
      });

      markerClusterer.render = jest.fn();

      expect(
        markerClusterer.removeMarkers([
          new google.maps.Marker(),
          ...markers,
          new google.maps.marker.AdvancedMarkerElement(),
        ])
      ).toBe(true);
      expect(markerClusterer.render).toBeCalledTimes(1);
      expect(markerClusterer["markers"]).toHaveLength(0);
    });

    test("markerClusterer clearMarkers", () => {
      const markers = [new markerClass()];
      const markerClusterer = new MarkerClusterer({
        markers,
      });

      markerClusterer.render = jest.fn();

      markerClusterer.clearMarkers();
      expect(markerClusterer.render).toBeCalledTimes(1);
      expect(markerClusterer["markers"]).toHaveLength(0);

      markerClusterer.clearMarkers(true);
      expect(markerClusterer.render).toBeCalledTimes(1);
      expect(markerClusterer["markers"]).toHaveLength(0);
    });

    test("default click handler fitBounds", () => {
      const cluster = new Cluster({
        markers: [],
        position: new google.maps.LatLng(0, 0),
      });
      const bounds = new google.maps.LatLngBounds();

      jest.spyOn(cluster, "bounds", "get").mockImplementation(() => bounds);

      defaultOnClusterClickHandler(
        {} as google.maps.MapMouseEvent,
        cluster,
        map
      );

      expect(map.fitBounds).toBeCalledWith(bounds);
    });

    test("markerClusterer calls setMap from constructor", () => {
      MarkerClusterer.prototype.setMap = jest.fn();
      new MarkerClusterer({
        map,
      });

      expect(MarkerClusterer.prototype.setMap).toBeCalledWith(map);
    });
  }
);
