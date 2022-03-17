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
  DefaultRenderer,
  MarkerClusterer,
  Renderer,
} from "../src";
import { LOADER_OPTIONS, sync } from "./config";

import { Loader } from "@googlemaps/js-api-loader";
import { interpolateRgb } from "d3-interpolate";
import trees from "./trees.json";

const mapOptions = {
  center: { lat: 40.7128, lng: -73.85 },
  zoom: 10,
};

const interpolatedRenderer = {
  palette: interpolateRgb("red", "blue"),
  render: function (
    { count, position }: Cluster,
    stats: ClusterStats
  ): google.maps.Marker {
    // use d3-interpolateRgb to interpolate between red and blue
    const color = this.palette(count / stats.clusters.markers.max);

    // create svg url with fill color
    const svg = window.btoa(`
  <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
    <circle cx="120" cy="120" opacity=".8" r="70" />    
  </svg>`);

    // create marker using svg icon
    return new google.maps.Marker({
      position,
      icon: {
        url: `data:image/svg+xml;base64,${svg}`,
        scaledSize: new google.maps.Size(75, 75),
      },
      label: {
        text: String(count),
        color: "rgba(255,255,255,0.9)",
        fontSize: "12px",
      },
      // adjust zIndex to be above other markers
      zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
    });
  },
};

new Loader(LOADER_OPTIONS).load().then(() => {
  const maps: google.maps.Map[] = [];

  const panels: [HTMLElement, Renderer, string][] = [
    [
      document.getElementById("default"),
      new DefaultRenderer(),
      `new DefaultRenderer()`,
    ],
    [
      document.getElementById("simple"),
      {
        render: ({ count, position }: Cluster) =>
          new google.maps.Marker({
            label: { text: String(count), color: "white", fontSize: "10px" },
            position,
            // adjust zIndex to be above other markers
            zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
          }),
      },
      null,
    ],
    [document.getElementById("svg"), new DefaultRenderer(), null],
    [document.getElementById("interpolated"), interpolatedRenderer, null],
  ];

  panels.forEach(([element, renderer, text]) => {
    if (!text) {
      text = renderer.render.toString();
    }
    const map = new google.maps.Map(element, mapOptions);
    maps.push(map);

    const textElement = document.createElement("pre");
    // @ts-ignore
    textElement.innerHTML = window.hljs.highlight(text, {
      language: "typescript",
    }).value;
    textElement.classList.add("description");

    map.controls[google.maps.ControlPosition.LEFT_TOP].push(textElement);

    const markers = trees.map(
      ({ geometry }) =>
        new google.maps.Marker({
          position: {
            lat: geometry.coordinates[1],
            lng: geometry.coordinates[0],
          },
          map,
        })
    );

    new MarkerClusterer({
      renderer,
      map,
      markers,
    });
  });

  sync(...maps);
});
