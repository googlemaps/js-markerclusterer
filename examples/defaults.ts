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

import {LOADER_OPTIONS} from './config';
import {Loader} from '@googlemaps/js-api-loader';
import {MarkerClusterer} from '../src';
import trees from './trees.json';

const mapOptions = {
  center: {lat: 40.7128, lng: -73.85},
  zoom: 12,
};

new Loader(LOADER_OPTIONS).load().then(() => {
  const element = document.getElementById('map');

  const map = new google.maps.Map(element, mapOptions);

  const markers = trees.map(
    ({geometry}) =>
      new google.maps.Marker({
        position: {
          lat: geometry.coordinates[1],
          lng: geometry.coordinates[0],
        },
        map,
      })
  );

  const markerCluster = new MarkerClusterer({
    markers,
  });

  markerCluster.setMap(map);
});
