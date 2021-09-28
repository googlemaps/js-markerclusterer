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

const calculate = jest.fn().mockImplementation(() => []);
const algorithm = { calculate };

const render = jest.fn().mockImplementation(() => new google.maps.Marker());
const renderer = { render };

let map: google.maps.Map;

beforeEach(() => {
  initialize();

  map = new google.maps.Map(document.createElement("div"));
});

afterEach(() => {
  calculate.mockClear();
  render.mockClear();
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
  const markers: google.maps.Marker[] = [];

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
  expect(markerClusterer["reset"]).toHaveBeenCalledTimes(1);
  expect(markerClusterer["renderClusters"]).toHaveBeenCalledTimes(1);
});

test("markerClusterer reset calls delete and setMap null", () => {
  const markers: google.maps.Marker[] = [new google.maps.Marker()];

  const markerClusterer = new MarkerClusterer({
    markers,
  });

  const clusters = [new Cluster({ markers })];
  const deleteSpy = spyOn(clusters[0], "delete");
  markerClusterer["clusters"] = clusters;

  markerClusterer["reset"]();

  expect(markers[0].setMap).toHaveBeenCalledWith(null);
  expect(deleteSpy).toHaveBeenCalledTimes(1);
});

test("markerClusterer renderClusters bypasses renderer if just one", () => {
  const markers: google.maps.Marker[] = [new google.maps.Marker()];

  const markerClusterer = new MarkerClusterer({
    markers,
  });

  markerClusterer.getMap = jest.fn().mockImplementation(() => map);

  const clusters = [new Cluster({ markers })];

  markerClusterer["clusters"] = clusters;
  markerClusterer["renderClusters"]();

  expect(clusters[0].marker).toBe(markers[0]);
  expect(markers[0].setMap).toBeCalledWith(map);
});

test("markerClusterer renderClusters calls renderer", () => {
  const markers: google.maps.Marker[] = [
    new google.maps.Marker(),
    new google.maps.Marker(),
  ];

  const markerClusterer = new MarkerClusterer({
    markers,
    renderer,
  });

  markerClusterer.getMap = jest.fn().mockImplementation(() => map);

  const clusters = [new Cluster({ markers }), new Cluster({ markers })];

  markerClusterer["clusters"] = clusters;
  markerClusterer["renderClusters"]();

  clusters.forEach((cluster) => {
    expect(cluster.marker.setMap).toBeCalledWith(map);
    expect(cluster.marker.addListener).toHaveBeenCalledWith(
      "click",
      expect.any(Function)
    );
  });

  expect(renderer.render).toBeCalledWith(clusters[0], expect.any(ClusterStats));
});

test("markerClusterer renderClusters does not set click handler", () => {
  const markers: google.maps.Marker[] = [
    new google.maps.Marker(),
    new google.maps.Marker(),
  ];

  const markerClusterer = new MarkerClusterer({
    markers,
    onClusterClick: null,
  });

  markerClusterer.getMap = jest.fn().mockImplementation(() => map);

  const clusters = [new Cluster({ markers }), new Cluster({ markers })];

  markerClusterer["clusters"] = clusters;
  markerClusterer["renderClusters"]();

  clusters.forEach((cluster) => {
    expect(cluster.marker.addListener).toBeCalledTimes(0);
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
  expect(markerClusterer["idleListener"]).toBeUndefined();
});

test("markerClusterer addMarker", () => {
  const markerClusterer = new MarkerClusterer({
    markers: [],
  });

  markerClusterer.render = jest.fn();

  markerClusterer.addMarker(new google.maps.Marker());
  expect(markerClusterer.render).toBeCalledTimes(1);
  expect(markerClusterer["markers"]).toHaveLength(1);
});

test("markerClusterer addMarkers", () => {
  const markerClusterer = new MarkerClusterer({
    markers: [],
  });

  markerClusterer.render = jest.fn();

  markerClusterer.addMarkers([
    new google.maps.Marker(),
    new google.maps.Marker(),
  ]);
  expect(markerClusterer.render).toBeCalledTimes(1);
  expect(markerClusterer["markers"]).toHaveLength(2);

  markerClusterer.addMarkers(
    [new google.maps.Marker(), new google.maps.Marker()],
    true
  );
  expect(markerClusterer.render).toBeCalledTimes(1);
});

test("markerClusterer removeMarker if present", () => {
  const markers = [new google.maps.Marker()];
  const markerClusterer = new MarkerClusterer({
    markers,
  });

  markerClusterer.render = jest.fn();

  expect(markerClusterer.removeMarker(markers[0])).toBe(true);
  expect(markerClusterer.render).toBeCalledTimes(1);
  expect(markerClusterer["markers"]).toHaveLength(0);
});

test("markerClusterer removeMarker if absent", () => {
  const markers = [new google.maps.Marker()];
  const markerClusterer = new MarkerClusterer({
    markers,
  });

  markerClusterer.render = jest.fn();

  expect(markerClusterer.removeMarker(new google.maps.Marker())).toBe(false);
  expect(markerClusterer.render).toBeCalledTimes(0);
  expect(markerClusterer["markers"]).toHaveLength(1);
});

test("markerClusterer removeMarkers if present", () => {
  const markers = [new google.maps.Marker()];
  const markerClusterer = new MarkerClusterer({
    markers,
  });

  markerClusterer.render = jest.fn();

  expect(markerClusterer.removeMarkers(markers)).toBe(true);
  expect(markerClusterer.render).toBeCalledTimes(1);
  expect(markerClusterer["markers"]).toHaveLength(0);
});

test("markerClusterer removeMarkers if absent", () => {
  const markers = [new google.maps.Marker()];
  const markerClusterer = new MarkerClusterer({
    markers,
  });

  markerClusterer.render = jest.fn();

  expect(markerClusterer.removeMarkers([new google.maps.Marker()])).toBe(false);
  expect(markerClusterer.render).toBeCalledTimes(0);
  expect(markerClusterer["markers"]).toHaveLength(1);
});

test("markerClusterer clearMarkers", () => {
  const markers = [new google.maps.Marker()];
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

  defaultOnClusterClickHandler({} as google.maps.MapMouseEvent, cluster, map);

  expect(map.fitBounds).toBeCalledWith(bounds);
});

test("markerClusterer calls setMap from constructor", () => {
  MarkerClusterer.prototype.setMap = jest.fn();
  new MarkerClusterer({
    map,
  });

  expect(MarkerClusterer.prototype.setMap).toBeCalledWith(map);
});
