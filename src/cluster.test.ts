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

import { Cluster } from "./cluster";
import { initialize } from "@googlemaps/jest-mocks";

beforeEach(() => {
  initialize();
});

test("bounds should be undefined if no markers or position", () => {
  const cluster = new Cluster({ markers: [] });
  expect(cluster.bounds).toBeUndefined();
});

test("bounds should be undefined if position", () => {
  const cluster = new Cluster({ markers: [], position: { lat: 0, lng: 0 } });
  expect(cluster.bounds).toBeDefined();
});

test("bounds should be undefined if markers", () => {
  const cluster = new Cluster({ markers: [new google.maps.Marker()] });
  expect(cluster.bounds).toBeDefined();
});

test("can push additional markers", () => {
  const cluster = new Cluster({ markers: [] });
  cluster.push(new google.maps.Marker());
  expect(cluster["markers"].length).toBe(1);
});

test("count visible markers", () => {
  const cluster = new Cluster({ markers: [new google.maps.Marker()] });
  cluster["markers"][0].getVisible = jest.fn().mockReturnValue(true);
  expect(cluster["markers"].length).toBe(1);
});

test("delete if marker set", () => {
  const cluster = new Cluster({ markers: [new google.maps.Marker()] });
  cluster["markers"][0].getVisible = jest.fn().mockReturnValue(true);
  cluster.marker = new google.maps.Marker();
  expect(cluster.count).toBe(1);
  cluster.delete();
  expect(cluster.count).toBe(0);
  expect(cluster.marker).toBeUndefined();
});

test("delete if marker not set", () => {
  const cluster = new Cluster({ markers: [] });
  cluster.delete();
  expect(cluster.marker).toBeUndefined();
});
