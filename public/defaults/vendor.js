// do not edit .js files directly - edit src/index.jst



var fastDeepEqual$1 = function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;

    var length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }



    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0;)
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0;) {
      var key = keys[i];

      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a!==a && b!==b;
};

/**
 * Copyright 2019 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at.
 *
 *      Http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const DEFAULT_ID = "__googleMapsScriptId";
/**
 * The status of the [[Loader]].
 */
var LoaderStatus;
(function (LoaderStatus) {
    LoaderStatus[LoaderStatus["INITIALIZED"] = 0] = "INITIALIZED";
    LoaderStatus[LoaderStatus["LOADING"] = 1] = "LOADING";
    LoaderStatus[LoaderStatus["SUCCESS"] = 2] = "SUCCESS";
    LoaderStatus[LoaderStatus["FAILURE"] = 3] = "FAILURE";
})(LoaderStatus || (LoaderStatus = {}));
/**
 * [[Loader]] makes it easier to add Google Maps JavaScript API to your application
 * dynamically using
 * [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
 * It works by dynamically creating and appending a script node to the the
 * document head and wrapping the callback function so as to return a promise.
 *
 * ```
 * const loader = new Loader({
 *   apiKey: "",
 *   version: "weekly",
 *   libraries: ["places"]
 * });
 *
 * loader.load().then((google) => {
 *   const map = new google.maps.Map(...)
 * })
 * ```
 */
class Loader {
    /**
     * Creates an instance of Loader using [[LoaderOptions]]. No defaults are set
     * using this library, instead the defaults are set by the Google Maps
     * JavaScript API server.
     *
     * ```
     * const loader = Loader({apiKey, version: 'weekly', libraries: ['places']});
     * ```
     */
    constructor({ apiKey, authReferrerPolicy, channel, client, id = DEFAULT_ID, language, libraries = [], mapIds, nonce, region, retries = 3, url = "https://maps.googleapis.com/maps/api/js", version, }) {
        this.CALLBACK = "__googleMapsCallback";
        this.callbacks = [];
        this.done = false;
        this.loading = false;
        this.errors = [];
        this.apiKey = apiKey;
        this.authReferrerPolicy = authReferrerPolicy;
        this.channel = channel;
        this.client = client;
        this.id = id || DEFAULT_ID; // Do not allow empty string
        this.language = language;
        this.libraries = libraries;
        this.mapIds = mapIds;
        this.nonce = nonce;
        this.region = region;
        this.retries = retries;
        this.url = url;
        this.version = version;
        if (Loader.instance) {
            if (!fastDeepEqual$1(this.options, Loader.instance.options)) {
                throw new Error(`Loader must not be called again with different options. ${JSON.stringify(this.options)} !== ${JSON.stringify(Loader.instance.options)}`);
            }
            return Loader.instance;
        }
        Loader.instance = this;
    }
    get options() {
        return {
            version: this.version,
            apiKey: this.apiKey,
            channel: this.channel,
            client: this.client,
            id: this.id,
            libraries: this.libraries,
            language: this.language,
            region: this.region,
            mapIds: this.mapIds,
            nonce: this.nonce,
            url: this.url,
            authReferrerPolicy: this.authReferrerPolicy,
        };
    }
    get status() {
        if (this.errors.length) {
            return LoaderStatus.FAILURE;
        }
        if (this.done) {
            return LoaderStatus.SUCCESS;
        }
        if (this.loading) {
            return LoaderStatus.LOADING;
        }
        return LoaderStatus.INITIALIZED;
    }
    get failed() {
        return this.done && !this.loading && this.errors.length >= this.retries + 1;
    }
    /**
     * CreateUrl returns the Google Maps JavaScript API script url given the [[LoaderOptions]].
     *
     * @ignore
     */
    createUrl() {
        let url = this.url;
        url += `?callback=${this.CALLBACK}`;
        if (this.apiKey) {
            url += `&key=${this.apiKey}`;
        }
        if (this.channel) {
            url += `&channel=${this.channel}`;
        }
        if (this.client) {
            url += `&client=${this.client}`;
        }
        if (this.libraries.length > 0) {
            url += `&libraries=${this.libraries.join(",")}`;
        }
        if (this.language) {
            url += `&language=${this.language}`;
        }
        if (this.region) {
            url += `&region=${this.region}`;
        }
        if (this.version) {
            url += `&v=${this.version}`;
        }
        if (this.mapIds) {
            url += `&map_ids=${this.mapIds.join(",")}`;
        }
        if (this.authReferrerPolicy) {
            url += `&auth_referrer_policy=${this.authReferrerPolicy}`;
        }
        return url;
    }
    deleteScript() {
        const script = document.getElementById(this.id);
        if (script) {
            script.remove();
        }
    }
    /**
     * Load the Google Maps JavaScript API script and return a Promise.
     */
    load() {
        return this.loadPromise();
    }
    /**
     * Load the Google Maps JavaScript API script and return a Promise.
     *
     * @ignore
     */
    loadPromise() {
        return new Promise((resolve, reject) => {
            this.loadCallback((err) => {
                if (!err) {
                    resolve(window.google);
                }
                else {
                    reject(err.error);
                }
            });
        });
    }
    /**
     * Load the Google Maps JavaScript API script with a callback.
     */
    loadCallback(fn) {
        this.callbacks.push(fn);
        this.execute();
    }
    /**
     * Set the script on document.
     */
    setScript() {
        if (document.getElementById(this.id)) {
            // TODO wrap onerror callback for cases where the script was loaded elsewhere
            this.callback();
            return;
        }
        const url = this.createUrl();
        const script = document.createElement("script");
        script.id = this.id;
        script.type = "text/javascript";
        script.src = url;
        script.onerror = this.loadErrorCallback.bind(this);
        script.defer = true;
        script.async = true;
        if (this.nonce) {
            script.nonce = this.nonce;
        }
        document.head.appendChild(script);
    }
    /**
     * Reset the loader state.
     */
    reset() {
        this.deleteScript();
        this.done = false;
        this.loading = false;
        this.errors = [];
        this.onerrorEvent = null;
    }
    resetIfRetryingFailed() {
        if (this.failed) {
            this.reset();
        }
    }
    loadErrorCallback(e) {
        this.errors.push(e);
        if (this.errors.length <= this.retries) {
            const delay = this.errors.length * Math.pow(2, this.errors.length);
            console.log(`Failed to load Google Maps script, retrying in ${delay} ms.`);
            setTimeout(() => {
                this.deleteScript();
                this.setScript();
            }, delay);
        }
        else {
            this.onerrorEvent = e;
            this.callback();
        }
    }
    setCallback() {
        window.__googleMapsCallback = this.callback.bind(this);
    }
    callback() {
        this.done = true;
        this.loading = false;
        this.callbacks.forEach((cb) => {
            cb(this.onerrorEvent);
        });
        this.callbacks = [];
    }
    execute() {
        this.resetIfRetryingFailed();
        if (this.done) {
            this.callback();
        }
        else {
            // short circuit and warn if google.maps is already loaded
            if (window.google && window.google.maps && window.google.maps.version) {
                console.warn("Google Maps already loaded outside @googlemaps/js-api-loader." +
                    "This may result in undesirable behavior as options and script parameters may not match.");
                this.callback();
                return;
            }
            if (this.loading) ;
            else {
                this.loading = true;
                this.setCallback();
                this.setScript();
            }
        }
    }
}

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
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

// do not edit .js files directly - edit src/index.jst



var fastDeepEqual = function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;

    var length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }



    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0;)
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0;) {
      var key = keys[i];

      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a!==a && b!==b;
};

var kdbush = {exports: {}};

(function (module, exports) {
	(function (global, factory) {
	module.exports = factory() ;
	}(commonjsGlobal, (function () {
	function sortKD(ids, coords, nodeSize, left, right, depth) {
	    if (right - left <= nodeSize) { return; }

	    var m = (left + right) >> 1;

	    select(ids, coords, m, left, right, depth % 2);

	    sortKD(ids, coords, nodeSize, left, m - 1, depth + 1);
	    sortKD(ids, coords, nodeSize, m + 1, right, depth + 1);
	}

	function select(ids, coords, k, left, right, inc) {

	    while (right > left) {
	        if (right - left > 600) {
	            var n = right - left + 1;
	            var m = k - left + 1;
	            var z = Math.log(n);
	            var s = 0.5 * Math.exp(2 * z / 3);
	            var sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
	            var newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
	            var newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
	            select(ids, coords, k, newLeft, newRight, inc);
	        }

	        var t = coords[2 * k + inc];
	        var i = left;
	        var j = right;

	        swapItem(ids, coords, left, k);
	        if (coords[2 * right + inc] > t) { swapItem(ids, coords, left, right); }

	        while (i < j) {
	            swapItem(ids, coords, i, j);
	            i++;
	            j--;
	            while (coords[2 * i + inc] < t) { i++; }
	            while (coords[2 * j + inc] > t) { j--; }
	        }

	        if (coords[2 * left + inc] === t) { swapItem(ids, coords, left, j); }
	        else {
	            j++;
	            swapItem(ids, coords, j, right);
	        }

	        if (j <= k) { left = j + 1; }
	        if (k <= j) { right = j - 1; }
	    }
	}

	function swapItem(ids, coords, i, j) {
	    swap(ids, i, j);
	    swap(coords, 2 * i, 2 * j);
	    swap(coords, 2 * i + 1, 2 * j + 1);
	}

	function swap(arr, i, j) {
	    var tmp = arr[i];
	    arr[i] = arr[j];
	    arr[j] = tmp;
	}

	function range(ids, coords, minX, minY, maxX, maxY, nodeSize) {
	    var stack = [0, ids.length - 1, 0];
	    var result = [];
	    var x, y;

	    while (stack.length) {
	        var axis = stack.pop();
	        var right = stack.pop();
	        var left = stack.pop();

	        if (right - left <= nodeSize) {
	            for (var i = left; i <= right; i++) {
	                x = coords[2 * i];
	                y = coords[2 * i + 1];
	                if (x >= minX && x <= maxX && y >= minY && y <= maxY) { result.push(ids[i]); }
	            }
	            continue;
	        }

	        var m = Math.floor((left + right) / 2);

	        x = coords[2 * m];
	        y = coords[2 * m + 1];

	        if (x >= minX && x <= maxX && y >= minY && y <= maxY) { result.push(ids[m]); }

	        var nextAxis = (axis + 1) % 2;

	        if (axis === 0 ? minX <= x : minY <= y) {
	            stack.push(left);
	            stack.push(m - 1);
	            stack.push(nextAxis);
	        }
	        if (axis === 0 ? maxX >= x : maxY >= y) {
	            stack.push(m + 1);
	            stack.push(right);
	            stack.push(nextAxis);
	        }
	    }

	    return result;
	}

	function within(ids, coords, qx, qy, r, nodeSize) {
	    var stack = [0, ids.length - 1, 0];
	    var result = [];
	    var r2 = r * r;

	    while (stack.length) {
	        var axis = stack.pop();
	        var right = stack.pop();
	        var left = stack.pop();

	        if (right - left <= nodeSize) {
	            for (var i = left; i <= right; i++) {
	                if (sqDist(coords[2 * i], coords[2 * i + 1], qx, qy) <= r2) { result.push(ids[i]); }
	            }
	            continue;
	        }

	        var m = Math.floor((left + right) / 2);

	        var x = coords[2 * m];
	        var y = coords[2 * m + 1];

	        if (sqDist(x, y, qx, qy) <= r2) { result.push(ids[m]); }

	        var nextAxis = (axis + 1) % 2;

	        if (axis === 0 ? qx - r <= x : qy - r <= y) {
	            stack.push(left);
	            stack.push(m - 1);
	            stack.push(nextAxis);
	        }
	        if (axis === 0 ? qx + r >= x : qy + r >= y) {
	            stack.push(m + 1);
	            stack.push(right);
	            stack.push(nextAxis);
	        }
	    }

	    return result;
	}

	function sqDist(ax, ay, bx, by) {
	    var dx = ax - bx;
	    var dy = ay - by;
	    return dx * dx + dy * dy;
	}

	var defaultGetX = function (p) { return p[0]; };
	var defaultGetY = function (p) { return p[1]; };

	var KDBush = function KDBush(points, getX, getY, nodeSize, ArrayType) {
	    if ( getX === void 0 ) getX = defaultGetX;
	    if ( getY === void 0 ) getY = defaultGetY;
	    if ( nodeSize === void 0 ) nodeSize = 64;
	    if ( ArrayType === void 0 ) ArrayType = Float64Array;

	    this.nodeSize = nodeSize;
	    this.points = points;

	    var IndexArrayType = points.length < 65536 ? Uint16Array : Uint32Array;

	    var ids = this.ids = new IndexArrayType(points.length);
	    var coords = this.coords = new ArrayType(points.length * 2);

	    for (var i = 0; i < points.length; i++) {
	        ids[i] = i;
	        coords[2 * i] = getX(points[i]);
	        coords[2 * i + 1] = getY(points[i]);
	    }

	    sortKD(ids, coords, nodeSize, 0, ids.length - 1, 0);
	};

	KDBush.prototype.range = function range$1 (minX, minY, maxX, maxY) {
	    return range(this.ids, this.coords, minX, minY, maxX, maxY, this.nodeSize);
	};

	KDBush.prototype.within = function within$1 (x, y, r) {
	    return within(this.ids, this.coords, x, y, r, this.nodeSize);
	};

	return KDBush;

	})));
} (kdbush));

var KDBush = kdbush.exports;

const defaultOptions = {
    minZoom: 0,   // min zoom to generate clusters on
    maxZoom: 16,  // max zoom level to cluster the points on
    minPoints: 2, // minimum points to form a cluster
    radius: 40,   // cluster radius in pixels
    extent: 512,  // tile extent (radius is calculated relative to it)
    nodeSize: 64, // size of the KD-tree leaf node, affects performance
    log: false,   // whether to log timing info

    // whether to generate numeric ids for input features (in vector tiles)
    generateId: false,

    // a reduce function for calculating custom cluster properties
    reduce: null, // (accumulated, props) => { accumulated.sum += props.sum; }

    // properties to use for individual points when running the reducer
    map: props => props // props => ({sum: props.my_value})
};

const fround = Math.fround || (tmp => ((x) => { tmp[0] = +x; return tmp[0]; }))(new Float32Array(1));

class Supercluster {
    constructor(options) {
        this.options = extend(Object.create(defaultOptions), options);
        this.trees = new Array(this.options.maxZoom + 1);
    }

    load(points) {
        const {log, minZoom, maxZoom, nodeSize} = this.options;

        if (log) console.time('total time');

        const timerId = `prepare ${  points.length  } points`;
        if (log) console.time(timerId);

        this.points = points;

        // generate a cluster object for each point and index input points into a KD-tree
        let clusters = [];
        for (let i = 0; i < points.length; i++) {
            if (!points[i].geometry) continue;
            clusters.push(createPointCluster(points[i], i));
        }
        this.trees[maxZoom + 1] = new KDBush(clusters, getX, getY, nodeSize, Float32Array);

        if (log) console.timeEnd(timerId);

        // cluster points on max zoom, then cluster the results on previous zoom, etc.;
        // results in a cluster hierarchy across zoom levels
        for (let z = maxZoom; z >= minZoom; z--) {
            const now = +Date.now();

            // create a new set of clusters for the zoom and index them with a KD-tree
            clusters = this._cluster(clusters, z);
            this.trees[z] = new KDBush(clusters, getX, getY, nodeSize, Float32Array);

            if (log) console.log('z%d: %d clusters in %dms', z, clusters.length, +Date.now() - now);
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
        const clusters = [];
        for (const id of ids) {
            const c = tree.points[id];
            clusters.push(c.numPoints ? getClusterJSON(c) : this.points[c.index]);
        }
        return clusters;
    }

    getChildren(clusterId) {
        const originId = this._getOriginId(clusterId);
        const originZoom = this._getOriginZoom(clusterId);
        const errorMsg = 'No cluster with the specified id.';

        const index = this.trees[originZoom];
        if (!index) throw new Error(errorMsg);

        const origin = index.points[originId];
        if (!origin) throw new Error(errorMsg);

        const r = this.options.radius / (this.options.extent * Math.pow(2, originZoom - 1));
        const ids = index.within(origin.x, origin.y, r);
        const children = [];
        for (const id of ids) {
            const c = index.points[id];
            if (c.parentId === clusterId) {
                children.push(c.numPoints ? getClusterJSON(c) : this.points[c.index]);
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
        const {extent, radius} = this.options;
        const p = radius / extent;
        const top = (y - p) / z2;
        const bottom = (y + 1 + p) / z2;

        const tile = {
            features: []
        };

        this._addTileFeatures(
            tree.range((x - p) / z2, top, (x + 1 + p) / z2, bottom),
            tree.points, x, y, z2, tile);

        if (x === 0) {
            this._addTileFeatures(
                tree.range(1 - p / z2, top, 1, bottom),
                tree.points, z2, y, z2, tile);
        }
        if (x === z2 - 1) {
            this._addTileFeatures(
                tree.range(0, top, p / z2, bottom),
                tree.points, -1, y, z2, tile);
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

    _addTileFeatures(ids, points, x, y, z2, tile) {
        for (const i of ids) {
            const c = points[i];
            const isCluster = c.numPoints;

            let tags, px, py;
            if (isCluster) {
                tags = getClusterProperties(c);
                px = c.x;
                py = c.y;
            } else {
                const p = this.points[c.index];
                tags = p.properties;
                px = lngX(p.geometry.coordinates[0]);
                py = latY(p.geometry.coordinates[1]);
            }

            const f = {
                type: 1,
                geometry: [[
                    Math.round(this.options.extent * (px * z2 - x)),
                    Math.round(this.options.extent * (py * z2 - y))
                ]],
                tags
            };

            // assign id
            let id;
            if (isCluster) {
                id = c.id;
            } else if (this.options.generateId) {
                // optionally generate id
                id = c.index;
            } else if (this.points[c.index].id) {
                // keep id if already assigned
                id = this.points[c.index].id;
            }

            if (id !== undefined) f.id = id;

            tile.features.push(f);
        }
    }

    _limitZoom(z) {
        return Math.max(this.options.minZoom, Math.min(Math.floor(+z), this.options.maxZoom + 1));
    }

    _cluster(points, zoom) {
        const clusters = [];
        const {radius, extent, reduce, minPoints} = this.options;
        const r = radius / (extent * Math.pow(2, zoom));

        // loop through each point
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            // if we've already visited the point at this zoom level, skip it
            if (p.zoom <= zoom) continue;
            p.zoom = zoom;

            // find all nearby points
            const tree = this.trees[zoom + 1];
            const neighborIds = tree.within(p.x, p.y, r);

            const numPointsOrigin = p.numPoints || 1;
            let numPoints = numPointsOrigin;

            // count the number of points in a potential cluster
            for (const neighborId of neighborIds) {
                const b = tree.points[neighborId];
                // filter out neighbors that are already processed
                if (b.zoom > zoom) numPoints += b.numPoints || 1;
            }

            // if there were neighbors to merge, and there are enough points to form a cluster
            if (numPoints > numPointsOrigin && numPoints >= minPoints) {
                let wx = p.x * numPointsOrigin;
                let wy = p.y * numPointsOrigin;

                let clusterProperties = reduce && numPointsOrigin > 1 ? this._map(p, true) : null;

                // encode both zoom and point index on which the cluster originated -- offset by total length of features
                const id = (i << 5) + (zoom + 1) + this.points.length;

                for (const neighborId of neighborIds) {
                    const b = tree.points[neighborId];

                    if (b.zoom <= zoom) continue;
                    b.zoom = zoom; // save the zoom (so it doesn't get processed twice)

                    const numPoints2 = b.numPoints || 1;
                    wx += b.x * numPoints2; // accumulate coordinates for calculating weighted center
                    wy += b.y * numPoints2;

                    b.parentId = id;

                    if (reduce) {
                        if (!clusterProperties) clusterProperties = this._map(p, true);
                        reduce(clusterProperties, this._map(b));
                    }
                }

                p.parentId = id;
                clusters.push(createCluster(wx / numPoints, wy / numPoints, id, numPoints, clusterProperties));

            } else { // left points as unclustered
                clusters.push(p);

                if (numPoints > 1) {
                    for (const neighborId of neighborIds) {
                        const b = tree.points[neighborId];
                        if (b.zoom <= zoom) continue;
                        b.zoom = zoom;
                        clusters.push(b);
                    }
                }
            }
        }

        return clusters;
    }

    // get index of the point from which the cluster originated
    _getOriginId(clusterId) {
        return (clusterId - this.points.length) >> 5;
    }

    // get zoom of the point from which the cluster originated
    _getOriginZoom(clusterId) {
        return (clusterId - this.points.length) % 32;
    }

    _map(point, clone) {
        if (point.numPoints) {
            return clone ? extend({}, point.properties) : point.properties;
        }
        const original = this.points[point.index].properties;
        const result = this.options.map(original);
        return clone && result === original ? extend({}, result) : result;
    }
}

function createCluster(x, y, id, numPoints, properties) {
    return {
        x: fround(x), // weighted cluster center; round for consistency with Float32Array index
        y: fround(y),
        zoom: Infinity, // the last zoom the cluster was processed at
        id, // encodes index of the first child of the cluster and its zoom level
        parentId: -1, // parent cluster id
        numPoints,
        properties
    };
}

function createPointCluster(p, id) {
    const [x, y] = p.geometry.coordinates;
    return {
        x: fround(lngX(x)), // projected point coordinates
        y: fround(latY(y)),
        zoom: Infinity, // the last zoom the point was processed at
        index: id, // index of the source feature in the original input array,
        parentId: -1 // parent cluster id
    };
}

function getClusterJSON(cluster) {
    return {
        type: 'Feature',
        id: cluster.id,
        properties: getClusterProperties(cluster),
        geometry: {
            type: 'Point',
            coordinates: [xLng(cluster.x), yLat(cluster.y)]
        }
    };
}

function getClusterProperties(cluster) {
    const count = cluster.numPoints;
    const abbrev =
        count >= 10000 ? `${Math.round(count / 1000)  }k` :
        count >= 1000 ? `${Math.round(count / 100) / 10  }k` : count;
    return extend(extend({}, cluster.properties), {
        cluster: true,
        cluster_id: cluster.id,
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
    const y = (0.5 - 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI);
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

function extend(dest, src) {
    for (const id in src) dest[id] = src[id];
    return dest;
}

function getX(p) {
    return p.x;
}
function getY(p) {
    return p.y;
}

export { Loader as L, Supercluster as S, __rest as _, fastDeepEqual as f };
