var markerClusterer = (function (exports) {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    function __rest(s, e) {
      var t = {};
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
      }
      return t;
    }

    /**
     * Copyright 2023 Google LLC
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
    /**
     * util class that creates a common set of convenience functions to wrap
     * shared behavior of Advanced Markers and Markers.
     */
    class MarkerUtils {
      static isAdvancedMarkerAvailable(map) {
        return google.maps.marker && map.getMapCapabilities().isAdvancedMarkersAvailable === true;
      }
      static isAdvancedMarker(marker) {
        return google.maps.marker && marker instanceof google.maps.marker.AdvancedMarkerElement;
      }
      static setMap(marker, map) {
        if (this.isAdvancedMarker(marker)) {
          marker.map = map;
        } else {
          marker.setMap(map);
        }
      }
      static getPosition(marker) {
        // SuperClusterAlgorithm.calculate expects a LatLng instance so we fake it for Adv Markers
        if (this.isAdvancedMarker(marker)) {
          if (marker.position) {
            if (marker.position instanceof google.maps.LatLng) {
              return marker.position;
            }
            // since we can't cast to LatLngLiteral for reasons =(
            if (marker.position.lat && marker.position.lng) {
              return new google.maps.LatLng(marker.position.lat, marker.position.lng);
            }
          }
          return new google.maps.LatLng(null);
        }
        return marker.getPosition();
      }
      static getVisible(marker) {
        if (this.isAdvancedMarker(marker)) {
          /**
           * Always return true for Advanced Markers because the clusterer
           * uses getVisible as a way to count legacy markers not as an actual
           * indicator of visibility for some reason. Even when markers are hidden
           * Marker.getVisible returns `true` and this is used to set the marker count
           * on the cluster. See the behavior of Cluster.count
           */
          return true;
        }
        return marker.getVisible();
      }
    }

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
    class Cluster {
      constructor(_ref) {
        let {
          markers,
          position
        } = _ref;
        this.markers = markers;
        if (position) {
          if (position instanceof google.maps.LatLng) {
            this._position = position;
          } else {
            this._position = new google.maps.LatLng(position);
          }
        }
      }
      get bounds() {
        if (this.markers.length === 0 && !this._position) {
          return;
        }
        const bounds = new google.maps.LatLngBounds(this._position, this._position);
        for (const marker of this.markers) {
          bounds.extend(MarkerUtils.getPosition(marker));
        }
        return bounds;
      }
      get position() {
        return this._position || this.bounds.getCenter();
      }
      /**
       * Get the count of **visible** markers.
       */
      get count() {
        return this.markers.filter(m => MarkerUtils.getVisible(m)).length;
      }
      /**
       * Add a marker to the cluster.
       */
      push(marker) {
        this.markers.push(marker);
      }
      /**
       * Cleanup references and remove marker from map.
       */
      delete() {
        if (this.marker) {
          MarkerUtils.setMap(this.marker, null);
          this.marker = undefined;
        }
        this.markers.length = 0;
      }
    }

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
    /**
     * Returns the markers visible in a padded map viewport
     *
     * @param map
     * @param mapCanvasProjection
     * @param markers The list of marker to filter
     * @param viewportPaddingPixels The padding in pixel
     * @returns The list of markers in the padded viewport
     */
    const filterMarkersToPaddedViewport = (map, mapCanvasProjection, markers, viewportPaddingPixels) => {
      const extendedMapBounds = extendBoundsToPaddedViewport(map.getBounds(), mapCanvasProjection, viewportPaddingPixels);
      return markers.filter(marker => extendedMapBounds.contains(MarkerUtils.getPosition(marker)));
    };
    /**
     * Extends a bounds by a number of pixels in each direction
     */
    const extendBoundsToPaddedViewport = (bounds, projection, numPixels) => {
      const {
        northEast,
        southWest
      } = latLngBoundsToPixelBounds(bounds, projection);
      const extendedPixelBounds = extendPixelBounds({
        northEast,
        southWest
      }, numPixels);
      return pixelBoundsToLatLngBounds(extendedPixelBounds, projection);
    };
    /**
     * Gets the extended bounds as a bbox [westLng, southLat, eastLng, northLat]
     */
    const getPaddedViewport = (bounds, projection, pixels) => {
      const extended = extendBoundsToPaddedViewport(bounds, projection, pixels);
      const ne = extended.getNorthEast();
      const sw = extended.getSouthWest();
      return [sw.lng(), sw.lat(), ne.lng(), ne.lat()];
    };
    /**
     * Returns the distance between 2 positions.
     *
     * @hidden
     */
    const distanceBetweenPoints = (p1, p2) => {
      const R = 6371; // Radius of the Earth in km
      const dLat = (p2.lat - p1.lat) * Math.PI / 180;
      const dLon = (p2.lng - p1.lng) * Math.PI / 180;
      const sinDLat = Math.sin(dLat / 2);
      const sinDLon = Math.sin(dLon / 2);
      const a = sinDLat * sinDLat + Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) * sinDLon * sinDLon;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };
    /**
     * Converts a LatLng bound to pixels.
     *
     * @hidden
     */
    const latLngBoundsToPixelBounds = (bounds, projection) => {
      return {
        northEast: projection.fromLatLngToDivPixel(bounds.getNorthEast()),
        southWest: projection.fromLatLngToDivPixel(bounds.getSouthWest())
      };
    };
    /**
     * Extends a pixel bounds by numPixels in all directions.
     *
     * @hidden
     */
    const extendPixelBounds = (_ref, numPixels) => {
      let {
        northEast,
        southWest
      } = _ref;
      northEast.x += numPixels;
      northEast.y -= numPixels;
      southWest.x -= numPixels;
      southWest.y += numPixels;
      return {
        northEast,
        southWest
      };
    };
    /**
     * @hidden
     */
    const pixelBoundsToLatLngBounds = (_ref2, projection) => {
      let {
        northEast,
        southWest
      } = _ref2;
      const sw = projection.fromDivPixelToLatLng(southWest);
      const ne = projection.fromDivPixelToLatLng(northEast);
      return new google.maps.LatLngBounds(sw, ne);
    };

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
    /**
     * @hidden
     */
    class AbstractAlgorithm {
      constructor(_ref) {
        let {
          maxZoom = 16
        } = _ref;
        this.maxZoom = maxZoom;
      }
      /**
       * Helper function to bypass clustering based upon some map state such as
       * zoom, number of markers, etc.
       *
       * ```typescript
       *  cluster({markers, map}: AlgorithmInput): Cluster[] {
       *    if (shouldBypassClustering(map)) {
       *      return this.noop({markers})
       *    }
       * }
       * ```
       */
      noop(_ref2) {
        let {
          markers
        } = _ref2;
        return noop(markers);
      }
    }
    /**
     * Abstract viewport algorithm proves a class to filter markers by a padded
     * viewport. This is a common optimization.
     *
     * @hidden
     */
    class AbstractViewportAlgorithm extends AbstractAlgorithm {
      constructor(_a) {
        var {
            viewportPadding = 60
          } = _a,
          options = __rest(_a, ["viewportPadding"]);
        super(options);
        this.viewportPadding = 60;
        this.viewportPadding = viewportPadding;
      }
      calculate(_ref3) {
        let {
          markers,
          map,
          mapCanvasProjection
        } = _ref3;
        if (map.getZoom() >= this.maxZoom) {
          return {
            clusters: this.noop({
              markers
            }),
            changed: false
          };
        }
        return {
          clusters: this.cluster({
            markers: filterMarkersToPaddedViewport(map, mapCanvasProjection, markers, this.viewportPadding),
            map,
            mapCanvasProjection
          })
        };
      }
    }
    /**
     * @hidden
     */
    const noop = markers => {
      const clusters = markers.map(marker => new Cluster({
        position: MarkerUtils.getPosition(marker),
        markers: [marker]
      }));
      return clusters;
    };

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    // do not edit .js files directly - edit src/index.jst

    var fastDeepEqual = function equal(a, b) {
      if (a === b) return true;
      if (a && b && typeof a == 'object' && typeof b == 'object') {
        if (a.constructor !== b.constructor) return false;
        var length, i, keys;
        if (Array.isArray(a)) {
          length = a.length;
          if (length != b.length) return false;
          for (i = length; i-- !== 0;) if (!equal(a[i], b[i])) return false;
          return true;
        }
        if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false;
        for (i = length; i-- !== 0;) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
        for (i = length; i-- !== 0;) {
          var key = keys[i];
          if (!equal(a[key], b[key])) return false;
        }
        return true;
      }

      // true if both NaN, false otherwise
      return a !== a && b !== b;
    };
    var equal = /*@__PURE__*/getDefaultExportFromCjs(fastDeepEqual);

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
    /**
     * The default Grid algorithm historically used in Google Maps marker
     * clustering.
     *
     * The Grid algorithm does not implement caching and markers may flash as the
     * viewport changes. Instead use {@link SuperClusterAlgorithm}.
     */
    class GridAlgorithm extends AbstractViewportAlgorithm {
      constructor(_a) {
        var {
            maxDistance = 40000,
            gridSize = 40
          } = _a,
          options = __rest(_a, ["maxDistance", "gridSize"]);
        super(options);
        this.clusters = [];
        this.state = {
          zoom: -1
        };
        this.maxDistance = maxDistance;
        this.gridSize = gridSize;
      }
      calculate(_ref) {
        let {
          markers,
          map,
          mapCanvasProjection
        } = _ref;
        const state = {
          zoom: map.getZoom()
        };
        let changed = false;
        if (this.state.zoom >= this.maxZoom && state.zoom >= this.maxZoom) ; else {
          changed = !equal(this.state, state);
        }
        this.state = state;
        if (map.getZoom() >= this.maxZoom) {
          return {
            clusters: this.noop({
              markers
            }),
            changed
          };
        }
        return {
          clusters: this.cluster({
            markers: filterMarkersToPaddedViewport(map, mapCanvasProjection, markers, this.viewportPadding),
            map,
            mapCanvasProjection
          })
        };
      }
      cluster(_ref2) {
        let {
          markers,
          map,
          mapCanvasProjection
        } = _ref2;
        this.clusters = [];
        markers.forEach(marker => {
          this.addToClosestCluster(marker, map, mapCanvasProjection);
        });
        return this.clusters;
      }
      addToClosestCluster(marker, map, projection) {
        let maxDistance = this.maxDistance; // Some large number
        let cluster = null;
        for (let i = 0; i < this.clusters.length; i++) {
          const candidate = this.clusters[i];
          const distance = distanceBetweenPoints(candidate.bounds.getCenter().toJSON(), MarkerUtils.getPosition(marker).toJSON());
          if (distance < maxDistance) {
            maxDistance = distance;
            cluster = candidate;
          }
        }
        if (cluster && extendBoundsToPaddedViewport(cluster.bounds, projection, this.gridSize).contains(MarkerUtils.getPosition(marker))) {
          cluster.push(marker);
        } else {
          const cluster = new Cluster({
            markers: [marker]
          });
          this.clusters.push(cluster);
        }
      }
    }

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
    /**
     * Noop algorithm does not generate any clusters or filter markers by the an extended viewport.
     */
    class NoopAlgorithm extends AbstractAlgorithm {
      constructor(_a) {
        var options = __rest(_a, []);
        super(options);
      }
      calculate(_ref) {
        let {
          markers,
          map,
          mapCanvasProjection
        } = _ref;
        return {
          clusters: this.cluster({
            markers,
            map,
            mapCanvasProjection
          }),
          changed: false
        };
      }
      cluster(input) {
        return this.noop(input);
      }
    }

    const ARRAY_TYPES = [Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array];

    /** @typedef {Int8ArrayConstructor | Uint8ArrayConstructor | Uint8ClampedArrayConstructor | Int16ArrayConstructor | Uint16ArrayConstructor | Int32ArrayConstructor | Uint32ArrayConstructor | Float32ArrayConstructor | Float64ArrayConstructor} TypedArrayConstructor */

    const VERSION = 1; // serialized format version
    const HEADER_SIZE = 8;
    class KDBush {
      /**
       * Creates an index from raw `ArrayBuffer` data.
       * @param {ArrayBuffer} data
       */
      static from(data) {
        if (!(data instanceof ArrayBuffer)) {
          throw new Error('Data must be an instance of ArrayBuffer.');
        }
        const [magic, versionAndType] = new Uint8Array(data, 0, 2);
        if (magic !== 0xdb) {
          throw new Error('Data does not appear to be in a KDBush format.');
        }
        const version = versionAndType >> 4;
        if (version !== VERSION) {
          throw new Error(`Got v${version} data when expected v${VERSION}.`);
        }
        const ArrayType = ARRAY_TYPES[versionAndType & 0x0f];
        if (!ArrayType) {
          throw new Error('Unrecognized array type.');
        }
        const [nodeSize] = new Uint16Array(data, 2, 1);
        const [numItems] = new Uint32Array(data, 4, 1);
        return new KDBush(numItems, nodeSize, ArrayType, data);
      }

      /**
       * Creates an index that will hold a given number of items.
       * @param {number} numItems
       * @param {number} [nodeSize=64] Size of the KD-tree node (64 by default).
       * @param {TypedArrayConstructor} [ArrayType=Float64Array] The array type used for coordinates storage (`Float64Array` by default).
       * @param {ArrayBuffer} [data] (For internal use only)
       */
      constructor(numItems, nodeSize = 64, ArrayType = Float64Array, data) {
        if (isNaN(numItems) || numItems < 0) throw new Error(`Unpexpected numItems value: ${numItems}.`);
        this.numItems = +numItems;
        this.nodeSize = Math.min(Math.max(+nodeSize, 2), 65535);
        this.ArrayType = ArrayType;
        this.IndexArrayType = numItems < 65536 ? Uint16Array : Uint32Array;
        const arrayTypeIndex = ARRAY_TYPES.indexOf(this.ArrayType);
        const coordsByteSize = numItems * 2 * this.ArrayType.BYTES_PER_ELEMENT;
        const idsByteSize = numItems * this.IndexArrayType.BYTES_PER_ELEMENT;
        const padCoords = (8 - idsByteSize % 8) % 8;
        if (arrayTypeIndex < 0) {
          throw new Error(`Unexpected typed array class: ${ArrayType}.`);
        }
        if (data && data instanceof ArrayBuffer) {
          // reconstruct an index from a buffer
          this.data = data;
          this.ids = new this.IndexArrayType(this.data, HEADER_SIZE, numItems);
          this.coords = new this.ArrayType(this.data, HEADER_SIZE + idsByteSize + padCoords, numItems * 2);
          this._pos = numItems * 2;
          this._finished = true;
        } else {
          // initialize a new index
          this.data = new ArrayBuffer(HEADER_SIZE + coordsByteSize + idsByteSize + padCoords);
          this.ids = new this.IndexArrayType(this.data, HEADER_SIZE, numItems);
          this.coords = new this.ArrayType(this.data, HEADER_SIZE + idsByteSize + padCoords, numItems * 2);
          this._pos = 0;
          this._finished = false;

          // set header
          new Uint8Array(this.data, 0, 2).set([0xdb, (VERSION << 4) + arrayTypeIndex]);
          new Uint16Array(this.data, 2, 1)[0] = nodeSize;
          new Uint32Array(this.data, 4, 1)[0] = numItems;
        }
      }

      /**
       * Add a point to the index.
       * @param {number} x
       * @param {number} y
       * @returns {number} An incremental index associated with the added item (starting from `0`).
       */
      add(x, y) {
        const index = this._pos >> 1;
        this.ids[index] = index;
        this.coords[this._pos++] = x;
        this.coords[this._pos++] = y;
        return index;
      }

      /**
       * Perform indexing of the added points.
       */
      finish() {
        const numAdded = this._pos >> 1;
        if (numAdded !== this.numItems) {
          throw new Error(`Added ${numAdded} items when expected ${this.numItems}.`);
        }
        // kd-sort both arrays for efficient search
        sort(this.ids, this.coords, this.nodeSize, 0, this.numItems - 1, 0);
        this._finished = true;
        return this;
      }

      /**
       * Search the index for items within a given bounding box.
       * @param {number} minX
       * @param {number} minY
       * @param {number} maxX
       * @param {number} maxY
       * @returns {number[]} An array of indices correponding to the found items.
       */
      range(minX, minY, maxX, maxY) {
        if (!this._finished) throw new Error('Data not yet indexed - call index.finish().');
        const {
          ids,
          coords,
          nodeSize
        } = this;
        const stack = [0, ids.length - 1, 0];
        const result = [];

        // recursively search for items in range in the kd-sorted arrays
        while (stack.length) {
          const axis = stack.pop() || 0;
          const right = stack.pop() || 0;
          const left = stack.pop() || 0;

          // if we reached "tree node", search linearly
          if (right - left <= nodeSize) {
            for (let i = left; i <= right; i++) {
              const x = coords[2 * i];
              const y = coords[2 * i + 1];
              if (x >= minX && x <= maxX && y >= minY && y <= maxY) result.push(ids[i]);
            }
            continue;
          }

          // otherwise find the middle index
          const m = left + right >> 1;

          // include the middle item if it's in range
          const x = coords[2 * m];
          const y = coords[2 * m + 1];
          if (x >= minX && x <= maxX && y >= minY && y <= maxY) result.push(ids[m]);

          // queue search in halves that intersect the query
          if (axis === 0 ? minX <= x : minY <= y) {
            stack.push(left);
            stack.push(m - 1);
            stack.push(1 - axis);
          }
          if (axis === 0 ? maxX >= x : maxY >= y) {
            stack.push(m + 1);
            stack.push(right);
            stack.push(1 - axis);
          }
        }
        return result;
      }

      /**
       * Search the index for items within a given radius.
       * @param {number} qx
       * @param {number} qy
       * @param {number} r Query radius.
       * @returns {number[]} An array of indices correponding to the found items.
       */
      within(qx, qy, r) {
        if (!this._finished) throw new Error('Data not yet indexed - call index.finish().');
        const {
          ids,
          coords,
          nodeSize
        } = this;
        const stack = [0, ids.length - 1, 0];
        const result = [];
        const r2 = r * r;

        // recursively search for items within radius in the kd-sorted arrays
        while (stack.length) {
          const axis = stack.pop() || 0;
          const right = stack.pop() || 0;
          const left = stack.pop() || 0;

          // if we reached "tree node", search linearly
          if (right - left <= nodeSize) {
            for (let i = left; i <= right; i++) {
              if (sqDist(coords[2 * i], coords[2 * i + 1], qx, qy) <= r2) result.push(ids[i]);
            }
            continue;
          }

          // otherwise find the middle index
          const m = left + right >> 1;

          // include the middle item if it's in range
          const x = coords[2 * m];
          const y = coords[2 * m + 1];
          if (sqDist(x, y, qx, qy) <= r2) result.push(ids[m]);

          // queue search in halves that intersect the query
          if (axis === 0 ? qx - r <= x : qy - r <= y) {
            stack.push(left);
            stack.push(m - 1);
            stack.push(1 - axis);
          }
          if (axis === 0 ? qx + r >= x : qy + r >= y) {
            stack.push(m + 1);
            stack.push(right);
            stack.push(1 - axis);
          }
        }
        return result;
      }
    }

    /**
     * @param {Uint16Array | Uint32Array} ids
     * @param {InstanceType<TypedArrayConstructor>} coords
     * @param {number} nodeSize
     * @param {number} left
     * @param {number} right
     * @param {number} axis
     */
    function sort(ids, coords, nodeSize, left, right, axis) {
      if (right - left <= nodeSize) return;
      const m = left + right >> 1; // middle index

      // sort ids and coords around the middle index so that the halves lie
      // either left/right or top/bottom correspondingly (taking turns)
      select(ids, coords, m, left, right, axis);

      // recursively kd-sort first half and second half on the opposite axis
      sort(ids, coords, nodeSize, left, m - 1, 1 - axis);
      sort(ids, coords, nodeSize, m + 1, right, 1 - axis);
    }

    /**
     * Custom Floyd-Rivest selection algorithm: sort ids and coords so that
     * [left..k-1] items are smaller than k-th item (on either x or y axis)
     * @param {Uint16Array | Uint32Array} ids
     * @param {InstanceType<TypedArrayConstructor>} coords
     * @param {number} k
     * @param {number} left
     * @param {number} right
     * @param {number} axis
     */
    function select(ids, coords, k, left, right, axis) {
      while (right > left) {
        if (right - left > 600) {
          const n = right - left + 1;
          const m = k - left + 1;
          const z = Math.log(n);
          const s = 0.5 * Math.exp(2 * z / 3);
          const sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
          const newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
          const newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
          select(ids, coords, k, newLeft, newRight, axis);
        }
        const t = coords[2 * k + axis];
        let i = left;
        let j = right;
        swapItem(ids, coords, left, k);
        if (coords[2 * right + axis] > t) swapItem(ids, coords, left, right);
        while (i < j) {
          swapItem(ids, coords, i, j);
          i++;
          j--;
          while (coords[2 * i + axis] < t) i++;
          while (coords[2 * j + axis] > t) j--;
        }
        if (coords[2 * left + axis] === t) swapItem(ids, coords, left, j);else {
          j++;
          swapItem(ids, coords, j, right);
        }
        if (j <= k) left = j + 1;
        if (k <= j) right = j - 1;
      }
    }

    /**
     * @param {Uint16Array | Uint32Array} ids
     * @param {InstanceType<TypedArrayConstructor>} coords
     * @param {number} i
     * @param {number} j
     */
    function swapItem(ids, coords, i, j) {
      swap(ids, i, j);
      swap(coords, 2 * i, 2 * j);
      swap(coords, 2 * i + 1, 2 * j + 1);
    }

    /**
     * @param {InstanceType<TypedArrayConstructor>} arr
     * @param {number} i
     * @param {number} j
     */
    function swap(arr, i, j) {
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }

    /**
     * @param {number} ax
     * @param {number} ay
     * @param {number} bx
     * @param {number} by
     */
    function sqDist(ax, ay, bx, by) {
      const dx = ax - bx;
      const dy = ay - by;
      return dx * dx + dy * dy;
    }

    const defaultOptions = {
      minZoom: 0,
      // min zoom to generate clusters on
      maxZoom: 16,
      // max zoom level to cluster the points on
      minPoints: 2,
      // minimum points to form a cluster
      radius: 40,
      // cluster radius in pixels
      extent: 512,
      // tile extent (radius is calculated relative to it)
      nodeSize: 64,
      // size of the KD-tree leaf node, affects performance
      log: false,
      // whether to log timing info

      // whether to generate numeric ids for input features (in vector tiles)
      generateId: false,
      // a reduce function for calculating custom cluster properties
      reduce: null,
      // (accumulated, props) => { accumulated.sum += props.sum; }

      // properties to use for individual points when running the reducer
      map: props => props // props => ({sum: props.my_value})
    };

    const fround = Math.fround || (tmp => x => {
      tmp[0] = +x;
      return tmp[0];
    })(new Float32Array(1));
    const OFFSET_ZOOM = 2;
    const OFFSET_ID = 3;
    const OFFSET_PARENT = 4;
    const OFFSET_NUM = 5;
    const OFFSET_PROP = 6;
    class Supercluster {
      constructor(options) {
        this.options = Object.assign(Object.create(defaultOptions), options);
        this.trees = new Array(this.options.maxZoom + 1);
        this.stride = this.options.reduce ? 7 : 6;
        this.clusterProps = [];
      }
      load(points) {
        const {
          log,
          minZoom,
          maxZoom
        } = this.options;
        if (log) console.time('total time');
        const timerId = `prepare ${points.length} points`;
        if (log) console.time(timerId);
        this.points = points;

        // generate a cluster object for each point and index input points into a KD-tree
        const data = [];
        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          if (!p.geometry) continue;
          const [lng, lat] = p.geometry.coordinates;
          const x = fround(lngX(lng));
          const y = fround(latY(lat));
          // store internal point/cluster data in flat numeric arrays for performance
          data.push(x, y,
          // projected point coordinates
          Infinity,
          // the last zoom the point was processed at
          i,
          // index of the source feature in the original input array
          -1,
          // parent cluster id
          1 // number of points in a cluster
          );

          if (this.options.reduce) data.push(0); // noop
        }

        let tree = this.trees[maxZoom + 1] = this._createTree(data);
        if (log) console.timeEnd(timerId);

        // cluster points on max zoom, then cluster the results on previous zoom, etc.;
        // results in a cluster hierarchy across zoom levels
        for (let z = maxZoom; z >= minZoom; z--) {
          const now = +Date.now();

          // create a new set of clusters for the zoom and index them with a KD-tree
          tree = this.trees[z] = this._createTree(this._cluster(tree, z));
          if (log) console.log('z%d: %d clusters in %dms', z, tree.numItems, +Date.now() - now);
        }
        if (log) console.timeEnd('total time');
        return this;
      }
      getClusters(bbox, zoom) {
        let minLng = ((bbox[0] + 180) % 360 + 360) % 360 - 180;
        const minLat = Math.max(-90, Math.min(90, bbox[1]));
        let maxLng = bbox[2] === 180 ? 180 : ((bbox[2] + 180) % 360 + 360) % 360 - 180;
        const maxLat = Math.max(-90, Math.min(90, bbox[3]));
        if (bbox[2] - bbox[0] >= 360) {
          minLng = -180;
          maxLng = 180;
        } else if (minLng > maxLng) {
          const easternHem = this.getClusters([minLng, minLat, 180, maxLat], zoom);
          const westernHem = this.getClusters([-180, minLat, maxLng, maxLat], zoom);
          return easternHem.concat(westernHem);
        }
        const tree = this.trees[this._limitZoom(zoom)];
        const ids = tree.range(lngX(minLng), latY(maxLat), lngX(maxLng), latY(minLat));
        const data = tree.data;
        const clusters = [];
        for (const id of ids) {
          const k = this.stride * id;
          clusters.push(data[k + OFFSET_NUM] > 1 ? getClusterJSON(data, k, this.clusterProps) : this.points[data[k + OFFSET_ID]]);
        }
        return clusters;
      }
      getChildren(clusterId) {
        const originId = this._getOriginId(clusterId);
        const originZoom = this._getOriginZoom(clusterId);
        const errorMsg = 'No cluster with the specified id.';
        const tree = this.trees[originZoom];
        if (!tree) throw new Error(errorMsg);
        const data = tree.data;
        if (originId * this.stride >= data.length) throw new Error(errorMsg);
        const r = this.options.radius / (this.options.extent * Math.pow(2, originZoom - 1));
        const x = data[originId * this.stride];
        const y = data[originId * this.stride + 1];
        const ids = tree.within(x, y, r);
        const children = [];
        for (const id of ids) {
          const k = id * this.stride;
          if (data[k + OFFSET_PARENT] === clusterId) {
            children.push(data[k + OFFSET_NUM] > 1 ? getClusterJSON(data, k, this.clusterProps) : this.points[data[k + OFFSET_ID]]);
          }
        }
        if (children.length === 0) throw new Error(errorMsg);
        return children;
      }
      getLeaves(clusterId, limit, offset) {
        limit = limit || 10;
        offset = offset || 0;
        const leaves = [];
        this._appendLeaves(leaves, clusterId, limit, offset, 0);
        return leaves;
      }
      getTile(z, x, y) {
        const tree = this.trees[this._limitZoom(z)];
        const z2 = Math.pow(2, z);
        const {
          extent,
          radius
        } = this.options;
        const p = radius / extent;
        const top = (y - p) / z2;
        const bottom = (y + 1 + p) / z2;
        const tile = {
          features: []
        };
        this._addTileFeatures(tree.range((x - p) / z2, top, (x + 1 + p) / z2, bottom), tree.data, x, y, z2, tile);
        if (x === 0) {
          this._addTileFeatures(tree.range(1 - p / z2, top, 1, bottom), tree.data, z2, y, z2, tile);
        }
        if (x === z2 - 1) {
          this._addTileFeatures(tree.range(0, top, p / z2, bottom), tree.data, -1, y, z2, tile);
        }
        return tile.features.length ? tile : null;
      }
      getClusterExpansionZoom(clusterId) {
        let expansionZoom = this._getOriginZoom(clusterId) - 1;
        while (expansionZoom <= this.options.maxZoom) {
          const children = this.getChildren(clusterId);
          expansionZoom++;
          if (children.length !== 1) break;
          clusterId = children[0].properties.cluster_id;
        }
        return expansionZoom;
      }
      _appendLeaves(result, clusterId, limit, offset, skipped) {
        const children = this.getChildren(clusterId);
        for (const child of children) {
          const props = child.properties;
          if (props && props.cluster) {
            if (skipped + props.point_count <= offset) {
              // skip the whole cluster
              skipped += props.point_count;
            } else {
              // enter the cluster
              skipped = this._appendLeaves(result, props.cluster_id, limit, offset, skipped);
              // exit the cluster
            }
          } else if (skipped < offset) {
            // skip a single point
            skipped++;
          } else {
            // add a single point
            result.push(child);
          }
          if (result.length === limit) break;
        }
        return skipped;
      }
      _createTree(data) {
        const tree = new KDBush(data.length / this.stride | 0, this.options.nodeSize, Float32Array);
        for (let i = 0; i < data.length; i += this.stride) tree.add(data[i], data[i + 1]);
        tree.finish();
        tree.data = data;
        return tree;
      }
      _addTileFeatures(ids, data, x, y, z2, tile) {
        for (const i of ids) {
          const k = i * this.stride;
          const isCluster = data[k + OFFSET_NUM] > 1;
          let tags, px, py;
          if (isCluster) {
            tags = getClusterProperties(data, k, this.clusterProps);
            px = data[k];
            py = data[k + 1];
          } else {
            const p = this.points[data[k + OFFSET_ID]];
            tags = p.properties;
            const [lng, lat] = p.geometry.coordinates;
            px = lngX(lng);
            py = latY(lat);
          }
          const f = {
            type: 1,
            geometry: [[Math.round(this.options.extent * (px * z2 - x)), Math.round(this.options.extent * (py * z2 - y))]],
            tags
          };

          // assign id
          let id;
          if (isCluster || this.options.generateId) {
            // optionally generate id for points
            id = data[k + OFFSET_ID];
          } else {
            // keep id if already assigned
            id = this.points[data[k + OFFSET_ID]].id;
          }
          if (id !== undefined) f.id = id;
          tile.features.push(f);
        }
      }
      _limitZoom(z) {
        return Math.max(this.options.minZoom, Math.min(Math.floor(+z), this.options.maxZoom + 1));
      }
      _cluster(tree, zoom) {
        const {
          radius,
          extent,
          reduce,
          minPoints
        } = this.options;
        const r = radius / (extent * Math.pow(2, zoom));
        const data = tree.data;
        const nextData = [];
        const stride = this.stride;

        // loop through each point
        for (let i = 0; i < data.length; i += stride) {
          // if we've already visited the point at this zoom level, skip it
          if (data[i + OFFSET_ZOOM] <= zoom) continue;
          data[i + OFFSET_ZOOM] = zoom;

          // find all nearby points
          const x = data[i];
          const y = data[i + 1];
          const neighborIds = tree.within(data[i], data[i + 1], r);
          const numPointsOrigin = data[i + OFFSET_NUM];
          let numPoints = numPointsOrigin;

          // count the number of points in a potential cluster
          for (const neighborId of neighborIds) {
            const k = neighborId * stride;
            // filter out neighbors that are already processed
            if (data[k + OFFSET_ZOOM] > zoom) numPoints += data[k + OFFSET_NUM];
          }

          // if there were neighbors to merge, and there are enough points to form a cluster
          if (numPoints > numPointsOrigin && numPoints >= minPoints) {
            let wx = x * numPointsOrigin;
            let wy = y * numPointsOrigin;
            let clusterProperties;
            let clusterPropIndex = -1;

            // encode both zoom and point index on which the cluster originated -- offset by total length of features
            const id = ((i / stride | 0) << 5) + (zoom + 1) + this.points.length;
            for (const neighborId of neighborIds) {
              const k = neighborId * stride;
              if (data[k + OFFSET_ZOOM] <= zoom) continue;
              data[k + OFFSET_ZOOM] = zoom; // save the zoom (so it doesn't get processed twice)

              const numPoints2 = data[k + OFFSET_NUM];
              wx += data[k] * numPoints2; // accumulate coordinates for calculating weighted center
              wy += data[k + 1] * numPoints2;
              data[k + OFFSET_PARENT] = id;
              if (reduce) {
                if (!clusterProperties) {
                  clusterProperties = this._map(data, i, true);
                  clusterPropIndex = this.clusterProps.length;
                  this.clusterProps.push(clusterProperties);
                }
                reduce(clusterProperties, this._map(data, k));
              }
            }
            data[i + OFFSET_PARENT] = id;
            nextData.push(wx / numPoints, wy / numPoints, Infinity, id, -1, numPoints);
            if (reduce) nextData.push(clusterPropIndex);
          } else {
            // left points as unclustered
            for (let j = 0; j < stride; j++) nextData.push(data[i + j]);
            if (numPoints > 1) {
              for (const neighborId of neighborIds) {
                const k = neighborId * stride;
                if (data[k + OFFSET_ZOOM] <= zoom) continue;
                data[k + OFFSET_ZOOM] = zoom;
                for (let j = 0; j < stride; j++) nextData.push(data[k + j]);
              }
            }
          }
        }
        return nextData;
      }

      // get index of the point from which the cluster originated
      _getOriginId(clusterId) {
        return clusterId - this.points.length >> 5;
      }

      // get zoom of the point from which the cluster originated
      _getOriginZoom(clusterId) {
        return (clusterId - this.points.length) % 32;
      }
      _map(data, i, clone) {
        if (data[i + OFFSET_NUM] > 1) {
          const props = this.clusterProps[data[i + OFFSET_PROP]];
          return clone ? Object.assign({}, props) : props;
        }
        const original = this.points[data[i + OFFSET_ID]].properties;
        const result = this.options.map(original);
        return clone && result === original ? Object.assign({}, result) : result;
      }
    }
    function getClusterJSON(data, i, clusterProps) {
      return {
        type: 'Feature',
        id: data[i + OFFSET_ID],
        properties: getClusterProperties(data, i, clusterProps),
        geometry: {
          type: 'Point',
          coordinates: [xLng(data[i]), yLat(data[i + 1])]
        }
      };
    }
    function getClusterProperties(data, i, clusterProps) {
      const count = data[i + OFFSET_NUM];
      const abbrev = count >= 10000 ? `${Math.round(count / 1000)}k` : count >= 1000 ? `${Math.round(count / 100) / 10}k` : count;
      const propIndex = data[i + OFFSET_PROP];
      const properties = propIndex === -1 ? {} : Object.assign({}, clusterProps[propIndex]);
      return Object.assign(properties, {
        cluster: true,
        cluster_id: data[i + OFFSET_ID],
        point_count: count,
        point_count_abbreviated: abbrev
      });
    }

    // longitude/latitude to spherical mercator in [0..1] range
    function lngX(lng) {
      return lng / 360 + 0.5;
    }
    function latY(lat) {
      const sin = Math.sin(lat * Math.PI / 180);
      const y = 0.5 - 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI;
      return y < 0 ? 0 : y > 1 ? 1 : y;
    }

    // spherical mercator to longitude/latitude
    function xLng(x) {
      return (x - 0.5) * 360;
    }
    function yLat(y) {
      const y2 = (180 - y * 360) * Math.PI / 180;
      return 360 * Math.atan(Math.exp(y2)) / Math.PI - 90;
    }

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
    /**
     * A very fast JavaScript algorithm for geospatial point clustering using KD trees.
     *
     * @see https://www.npmjs.com/package/supercluster for more information on options.
     */
    class SuperClusterAlgorithm extends AbstractAlgorithm {
      constructor(_a) {
        var {
            maxZoom,
            radius = 60
          } = _a,
          options = __rest(_a, ["maxZoom", "radius"]);
        super({
          maxZoom
        });
        this.state = {
          zoom: -1
        };
        this.superCluster = new Supercluster(Object.assign({
          maxZoom: this.maxZoom,
          radius
        }, options));
      }
      calculate(input) {
        let changed = false;
        const state = {
          zoom: input.map.getZoom()
        };
        if (!equal(input.markers, this.markers)) {
          changed = true;
          // TODO use proxy to avoid copy?
          this.markers = [...input.markers];
          const points = this.markers.map(marker => {
            const position = MarkerUtils.getPosition(marker);
            const coordinates = [position.lng(), position.lat()];
            return {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates
              },
              properties: {
                marker
              }
            };
          });
          this.superCluster.load(points);
        }
        if (!changed) {
          if (this.state.zoom <= this.maxZoom || state.zoom <= this.maxZoom) {
            changed = !equal(this.state, state);
          }
        }
        this.state = state;
        if (changed) {
          this.clusters = this.cluster(input);
        }
        return {
          clusters: this.clusters,
          changed
        };
      }
      cluster(_ref) {
        let {
          map
        } = _ref;
        return this.superCluster.getClusters([-180, -90, 180, 90], Math.round(map.getZoom())).map(feature => this.transformCluster(feature));
      }
      transformCluster(_ref2) {
        let {
          geometry: {
            coordinates: [lng, lat]
          },
          properties
        } = _ref2;
        if (properties.cluster) {
          return new Cluster({
            markers: this.superCluster.getLeaves(properties.cluster_id, Infinity).map(leaf => leaf.properties.marker),
            position: {
              lat,
              lng
            }
          });
        }
        const marker = properties.marker;
        return new Cluster({
          markers: [marker],
          position: MarkerUtils.getPosition(marker)
        });
      }
    }

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
    /**
     * A very fast JavaScript algorithm for geospatial point clustering using KD trees.
     *
     * @see https://www.npmjs.com/package/supercluster for more information on options.
     */
    class SuperClusterViewportAlgorithm extends AbstractViewportAlgorithm {
      constructor(_a) {
        var {
            maxZoom,
            radius = 60,
            viewportPadding = 60
          } = _a,
          options = __rest(_a, ["maxZoom", "radius", "viewportPadding"]);
        super({
          maxZoom,
          viewportPadding
        });
        this.superCluster = new Supercluster(Object.assign({
          maxZoom: this.maxZoom,
          radius
        }, options));
        this.state = {
          zoom: -1,
          view: [0, 0, 0, 0]
        };
      }
      calculate(input) {
        const state = {
          zoom: Math.round(input.map.getZoom()),
          view: getPaddedViewport(input.map.getBounds(), input.mapCanvasProjection, this.viewportPadding)
        };
        let changed = !equal(this.state, state);
        if (!equal(input.markers, this.markers)) {
          changed = true;
          // TODO use proxy to avoid copy?
          this.markers = [...input.markers];
          const points = this.markers.map(marker => {
            const position = MarkerUtils.getPosition(marker);
            const coordinates = [position.lng(), position.lat()];
            return {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates
              },
              properties: {
                marker
              }
            };
          });
          this.superCluster.load(points);
        }
        if (changed) {
          this.clusters = this.cluster(input);
          this.state = state;
        }
        return {
          clusters: this.clusters,
          changed
        };
      }
      cluster(_ref) {
        let {
          map,
          mapCanvasProjection
        } = _ref;
        /* recalculate new state because we can't use the cached version. */
        const state = {
          zoom: Math.round(map.getZoom()),
          view: getPaddedViewport(map.getBounds(), mapCanvasProjection, this.viewportPadding)
        };
        return this.superCluster.getClusters(state.view, state.zoom).map(feature => this.transformCluster(feature));
      }
      transformCluster(_ref2) {
        let {
          geometry: {
            coordinates: [lng, lat]
          },
          properties
        } = _ref2;
        if (properties.cluster) {
          return new Cluster({
            markers: this.superCluster.getLeaves(properties.cluster_id, Infinity).map(leaf => leaf.properties.marker),
            position: {
              lat,
              lng
            }
          });
        }
        const marker = properties.marker;
        return new Cluster({
          markers: [marker],
          position: MarkerUtils.getPosition(marker)
        });
      }
    }

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
    /**
     * Provides statistics on all clusters in the current render cycle for use in {@link Renderer.render}.
     */
    class ClusterStats {
      constructor(markers, clusters) {
        this.markers = {
          sum: markers.length
        };
        const clusterMarkerCounts = clusters.map(a => a.count);
        const clusterMarkerSum = clusterMarkerCounts.reduce((a, b) => a + b, 0);
        this.clusters = {
          count: clusters.length,
          markers: {
            mean: clusterMarkerSum / clusters.length,
            sum: clusterMarkerSum,
            min: Math.min(...clusterMarkerCounts),
            max: Math.max(...clusterMarkerCounts)
          }
        };
      }
    }
    class DefaultRenderer {
      /**
       * The default render function for the library used by {@link MarkerClusterer}.
       *
       * Currently set to use the following:
       *
       * ```typescript
       * // change color if this cluster has more markers than the mean cluster
       * const color =
       *   count > Math.max(10, stats.clusters.markers.mean)
       *     ? "#ff0000"
       *     : "#0000ff";
       *
       * // create svg url with fill color
       * const svg = window.btoa(`
       * <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
       *   <circle cx="120" cy="120" opacity=".6" r="70" />
       *   <circle cx="120" cy="120" opacity=".3" r="90" />
       *   <circle cx="120" cy="120" opacity=".2" r="110" />
       *   <circle cx="120" cy="120" opacity=".1" r="130" />
       * </svg>`);
       *
       * // create marker using svg icon
       * return new google.maps.Marker({
       *   position,
       *   icon: {
       *     url: `data:image/svg+xml;base64,${svg}`,
       *     scaledSize: new google.maps.Size(45, 45),
       *   },
       *   label: {
       *     text: String(count),
       *     color: "rgba(255,255,255,0.9)",
       *     fontSize: "12px",
       *   },
       *   // adjust zIndex to be above other markers
       *   zIndex: 1000 + count,
       * });
       * ```
       */
      render(_ref, stats, map) {
        let {
          count,
          position
        } = _ref;
        // change color if this cluster has more markers than the mean cluster
        const color = count > Math.max(10, stats.clusters.markers.mean) ? "#ff0000" : "#0000ff";
        // create svg literal with fill color
        const svg = `<svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="50" height="50">
<circle cx="120" cy="120" opacity=".6" r="70" />
<circle cx="120" cy="120" opacity=".3" r="90" />
<circle cx="120" cy="120" opacity=".2" r="110" />
<text x="50%" y="50%" style="fill:#fff" text-anchor="middle" font-size="50" dominant-baseline="middle" font-family="roboto,arial,sans-serif">${count}</text>
</svg>`;
        const title = `Cluster of ${count} markers`,
          // adjust zIndex to be above other markers
          zIndex = Number(google.maps.Marker.MAX_ZINDEX) + count;
        if (MarkerUtils.isAdvancedMarkerAvailable(map)) {
          // create cluster SVG element
          const parser = new DOMParser();
          const svgEl = parser.parseFromString(svg, "image/svg+xml").documentElement;
          svgEl.setAttribute("transform", "translate(0 25)");
          const clusterOptions = {
            map,
            position,
            zIndex,
            title,
            content: svgEl
          };
          return new google.maps.marker.AdvancedMarkerElement(clusterOptions);
        }
        const clusterOptions = {
          position,
          zIndex,
          title,
          icon: {
            url: `data:image/svg+xml;base64,${btoa(svg)}`,
            anchor: new google.maps.Point(25, 25)
          }
        };
        return new google.maps.Marker(clusterOptions);
      }
    }

    /**
     * Copyright 2019 Google LLC. All Rights Reserved.
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
    /**
     * Extends an object's prototype by another's.
     *
     * @param type1 The Type to be extended.
     * @param type2 The Type to extend with.
     * @ignore
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function extend(type1, type2) {
      /* istanbul ignore next */
      // eslint-disable-next-line prefer-const
      for (let property in type2.prototype) {
        type1.prototype[property] = type2.prototype[property];
      }
    }
    /**
     * @ignore
     */
    class OverlayViewSafe {
      constructor() {
        // MarkerClusterer implements google.maps.OverlayView interface. We use the
        // extend function to extend MarkerClusterer with google.maps.OverlayView
        // because it might not always be available when the code is defined so we
        // look for it at the last possible moment. If it doesn't exist now then
        // there is no point going ahead :)
        extend(OverlayViewSafe, google.maps.OverlayView);
      }
    }

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
    exports.MarkerClustererEvents = void 0;
    (function (MarkerClustererEvents) {
      MarkerClustererEvents["CLUSTERING_BEGIN"] = "clusteringbegin";
      MarkerClustererEvents["CLUSTERING_END"] = "clusteringend";
      MarkerClustererEvents["CLUSTER_CLICK"] = "click";
    })(exports.MarkerClustererEvents || (exports.MarkerClustererEvents = {}));
    const defaultOnClusterClickHandler = (_, cluster, map) => {
      map.fitBounds(cluster.bounds);
    };
    /**
     * MarkerClusterer creates and manages per-zoom-level clusters for large amounts
     * of markers. See {@link MarkerClustererOptions} for more details.
     *
     */
    class MarkerClusterer extends OverlayViewSafe {
      constructor(_ref) {
        let {
          map,
          markers = [],
          algorithmOptions = {},
          algorithm = new SuperClusterAlgorithm(algorithmOptions),
          renderer = new DefaultRenderer(),
          onClusterClick = defaultOnClusterClickHandler
        } = _ref;
        super();
        this.markers = [...markers];
        this.clusters = [];
        this.algorithm = algorithm;
        this.renderer = renderer;
        this.onClusterClick = onClusterClick;
        if (map) {
          this.setMap(map);
        }
      }
      addMarker(marker, noDraw) {
        if (this.markers.includes(marker)) {
          return;
        }
        this.markers.push(marker);
        if (!noDraw) {
          this.render();
        }
      }
      addMarkers(markers, noDraw) {
        markers.forEach(marker => {
          this.addMarker(marker, true);
        });
        if (!noDraw) {
          this.render();
        }
      }
      removeMarker(marker, noDraw) {
        const index = this.markers.indexOf(marker);
        if (index === -1) {
          // Marker is not in our list of markers, so do nothing:
          return false;
        }
        MarkerUtils.setMap(marker, null);
        this.markers.splice(index, 1); // Remove the marker from the list of managed markers
        if (!noDraw) {
          this.render();
        }
        return true;
      }
      removeMarkers(markers, noDraw) {
        let removed = false;
        markers.forEach(marker => {
          removed = this.removeMarker(marker, true) || removed;
        });
        if (removed && !noDraw) {
          this.render();
        }
        return removed;
      }
      clearMarkers(noDraw) {
        this.markers.length = 0;
        if (!noDraw) {
          this.render();
        }
      }
      /**
       * Recalculates and draws all the marker clusters.
       */
      render() {
        const map = this.getMap();
        if (map instanceof google.maps.Map && map.getProjection()) {
          google.maps.event.trigger(this, exports.MarkerClustererEvents.CLUSTERING_BEGIN, this);
          const {
            clusters,
            changed
          } = this.algorithm.calculate({
            markers: this.markers,
            map,
            mapCanvasProjection: this.getProjection()
          });
          // Allow algorithms to return flag on whether the clusters/markers have changed.
          if (changed || changed == undefined) {
            // Accumulate the markers of the clusters composed of a single marker.
            // Those clusters directly use the marker.
            // Clusters with more than one markers use a group marker generated by a renderer.
            const singleMarker = new Set();
            for (const cluster of clusters) {
              if (cluster.markers.length == 1) {
                singleMarker.add(cluster.markers[0]);
              }
            }
            const groupMarkers = [];
            // Iterate the clusters that are currently rendered.
            for (const cluster of this.clusters) {
              if (cluster.marker == null) {
                continue;
              }
              if (cluster.markers.length == 1) {
                if (!singleMarker.has(cluster.marker)) {
                  // The marker:
                  // - was previously rendered because it is from a cluster with 1 marker,
                  // - should no more be rendered as it is not in singleMarker.
                  MarkerUtils.setMap(cluster.marker, null);
                }
              } else {
                // Delay the removal of old group markers to avoid flickering.
                groupMarkers.push(cluster.marker);
              }
            }
            this.clusters = clusters;
            this.renderClusters();
            // Delayed removal of the markers of the former groups.
            requestAnimationFrame(() => groupMarkers.forEach(marker => MarkerUtils.setMap(marker, null)));
          }
          google.maps.event.trigger(this, exports.MarkerClustererEvents.CLUSTERING_END, this);
        }
      }
      onAdd() {
        this.idleListener = this.getMap().addListener("idle", this.render.bind(this));
        this.render();
      }
      onRemove() {
        google.maps.event.removeListener(this.idleListener);
        this.reset();
      }
      reset() {
        this.markers.forEach(marker => MarkerUtils.setMap(marker, null));
        this.clusters.forEach(cluster => cluster.delete());
        this.clusters = [];
      }
      renderClusters() {
        // Generate stats to pass to renderers.
        const stats = new ClusterStats(this.markers, this.clusters);
        const map = this.getMap();
        this.clusters.forEach(cluster => {
          if (cluster.markers.length === 1) {
            cluster.marker = cluster.markers[0];
          } else {
            // Generate the marker to represent the group.
            cluster.marker = this.renderer.render(cluster, stats, map);
            // Make sure all individual markers are removed from the map.
            cluster.markers.forEach(marker => MarkerUtils.setMap(marker, null));
            if (this.onClusterClick) {
              cluster.marker.addListener("click", /* istanbul ignore next */
              event => {
                google.maps.event.trigger(this, exports.MarkerClustererEvents.CLUSTER_CLICK, cluster);
                this.onClusterClick(event, cluster, map);
              });
            }
          }
          MarkerUtils.setMap(cluster.marker, map);
        });
      }
    }

    exports.AbstractAlgorithm = AbstractAlgorithm;
    exports.AbstractViewportAlgorithm = AbstractViewportAlgorithm;
    exports.Cluster = Cluster;
    exports.ClusterStats = ClusterStats;
    exports.DefaultRenderer = DefaultRenderer;
    exports.GridAlgorithm = GridAlgorithm;
    exports.MarkerClusterer = MarkerClusterer;
    exports.MarkerUtils = MarkerUtils;
    exports.NoopAlgorithm = NoopAlgorithm;
    exports.SuperClusterAlgorithm = SuperClusterAlgorithm;
    exports.SuperClusterViewportAlgorithm = SuperClusterViewportAlgorithm;
    exports.defaultOnClusterClickHandler = defaultOnClusterClickHandler;
    exports.distanceBetweenPoints = distanceBetweenPoints;
    exports.extendBoundsToPaddedViewport = extendBoundsToPaddedViewport;
    exports.extendPixelBounds = extendPixelBounds;
    exports.filterMarkersToPaddedViewport = filterMarkersToPaddedViewport;
    exports.getPaddedViewport = getPaddedViewport;
    exports.noop = noop;
    exports.pixelBoundsToLatLngBounds = pixelBoundsToLatLngBounds;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
