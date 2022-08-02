import { _ as __rest, f as fastDeepEqual, S as Supercluster, L as Loader } from './vendor.js';

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
    constructor({ markers, position }) {
        this.markers = markers;
        if (position) {
            if (position instanceof google.maps.LatLng) {
                this._position = position;
            }
            else {
                this._position = new google.maps.LatLng(position);
            }
        }
    }
    get bounds() {
        if (this.markers.length === 0 && !this._position) {
            return undefined;
        }
        return this.markers.reduce((bounds, marker) => {
            return bounds.extend(marker.getPosition());
        }, new google.maps.LatLngBounds(this._position, this._position));
    }
    get position() {
        return this._position || this.bounds.getCenter();
    }
    /**
     * Get the count of **visible** markers.
     */
    get count() {
        return this.markers.filter((m) => m.getVisible())
            .length;
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
            this.marker.setMap(null);
            delete this.marker;
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
const filterMarkersToPaddedViewport = (map, mapCanvasProjection, markers, viewportPadding) => {
    const extendedMapBounds = extendBoundsToPaddedViewport(map.getBounds(), mapCanvasProjection, viewportPadding);
    return markers.filter((marker) => extendedMapBounds.contains(marker.getPosition()));
};
/**
 * Extends a bounds by a number of pixels in each direction.
 */
const extendBoundsToPaddedViewport = (bounds, projection, pixels) => {
    const { northEast, southWest } = latLngBoundsToPixelBounds(bounds, projection);
    const extendedPixelBounds = extendPixelBounds({ northEast, southWest }, pixels);
    return pixelBoundsToLatLngBounds(extendedPixelBounds, projection);
};
/**
 * @hidden
 */
const distanceBetweenPoints = (p1, p2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
    const dLon = ((p2.lng - p1.lng) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((p1.lat * Math.PI) / 180) *
            Math.cos((p2.lat * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
/**
 * @hidden
 */
const latLngBoundsToPixelBounds = (bounds, projection) => {
    return {
        northEast: projection.fromLatLngToDivPixel(bounds.getNorthEast()),
        southWest: projection.fromLatLngToDivPixel(bounds.getSouthWest()),
    };
};
/**
 * @hidden
 */
const extendPixelBounds = ({ northEast, southWest }, pixels) => {
    northEast.x += pixels;
    northEast.y -= pixels;
    southWest.x -= pixels;
    southWest.y += pixels;
    return { northEast, southWest };
};
/**
 * @hidden
 */
const pixelBoundsToLatLngBounds = ({ northEast, southWest }, projection) => {
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(projection.fromDivPixelToLatLng(northEast));
    bounds.extend(projection.fromDivPixelToLatLng(southWest));
    return bounds;
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
    constructor({ maxZoom = 16 }) {
        this.maxZoom = maxZoom;
    }
    /**
     * Helper function to bypass clustering based upon some map state such as
     * zoom, number of markers, etc.
     *
     * ```typescript
     *  cluster({markers, map}: AlgorithmInput): Cluster[] {
     *    if (shouldBypassClustering(map)) {
     *      return this.noop({markers, map})
     *    }
     * }
     * ```
     */
    noop({ markers }) {
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
        var { viewportPadding = 60 } = _a, options = __rest(_a, ["viewportPadding"]);
        super(options);
        this.viewportPadding = 60;
        this.viewportPadding = viewportPadding;
    }
    calculate({ markers, map, mapCanvasProjection, }) {
        if (map.getZoom() >= this.maxZoom) {
            return {
                clusters: this.noop({
                    markers,
                    map,
                    mapCanvasProjection,
                }),
                changed: false,
            };
        }
        return {
            clusters: this.cluster({
                markers: filterMarkersToPaddedViewport(map, mapCanvasProjection, markers, this.viewportPadding),
                map,
                mapCanvasProjection,
            }),
        };
    }
}
/**
 * @hidden
 */
const noop = (markers) => {
    const clusters = markers.map((marker) => new Cluster({
        position: marker.getPosition(),
        markers: [marker],
    }));
    return clusters;
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
 * The default Grid algorithm historically used in Google Maps marker
 * clustering.
 *
 * The Grid algorithm does not implement caching and markers may flash as the
 * viewport changes. Instead use {@link SuperClusterAlgorithm}.
 */
class GridAlgorithm extends AbstractViewportAlgorithm {
    constructor(_a) {
        var { maxDistance = 40000, gridSize = 40 } = _a, options = __rest(_a, ["maxDistance", "gridSize"]);
        super(options);
        this.clusters = [];
        this.maxDistance = maxDistance;
        this.gridSize = gridSize;
        this.state = { zoom: null };
    }
    calculate({ markers, map, mapCanvasProjection, }) {
        const state = { zoom: map.getZoom() };
        let changed = false;
        if (this.state.zoom > this.maxZoom && state.zoom > this.maxZoom) ;
        else {
            changed = !fastDeepEqual(this.state, state);
        }
        this.state = state;
        if (map.getZoom() >= this.maxZoom) {
            return {
                clusters: this.noop({
                    markers,
                    map,
                    mapCanvasProjection,
                }),
                changed: changed,
            };
        }
        return {
            clusters: this.cluster({
                markers: filterMarkersToPaddedViewport(map, mapCanvasProjection, markers, this.viewportPadding),
                map,
                mapCanvasProjection,
            }),
        };
    }
    cluster({ markers, map, mapCanvasProjection, }) {
        this.clusters = [];
        markers.forEach((marker) => {
            this.addToClosestCluster(marker, map, mapCanvasProjection);
        });
        return this.clusters;
    }
    addToClosestCluster(marker, map, projection) {
        let maxDistance = this.maxDistance; // Some large number
        let cluster = null;
        for (let i = 0; i < this.clusters.length; i++) {
            const candidate = this.clusters[i];
            const distance = distanceBetweenPoints(candidate.bounds.getCenter().toJSON(), marker.getPosition().toJSON());
            if (distance < maxDistance) {
                maxDistance = distance;
                cluster = candidate;
            }
        }
        if (cluster &&
            extendBoundsToPaddedViewport(cluster.bounds, projection, this.gridSize).contains(marker.getPosition())) {
            cluster.push(marker);
        }
        else {
            const cluster = new Cluster({ markers: [marker] });
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
    calculate({ markers, map, mapCanvasProjection, }) {
        return {
            clusters: this.cluster({ markers, map, mapCanvasProjection }),
            changed: false,
        };
    }
    cluster(input) {
        return this.noop(input);
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
class SuperClusterAlgorithm extends AbstractAlgorithm {
    constructor(_a) {
        var { maxZoom, radius = 60 } = _a, options = __rest(_a, ["maxZoom", "radius"]);
        super({ maxZoom });
        this.superCluster = new Supercluster(Object.assign({ maxZoom: this.maxZoom, radius }, options));
        this.state = { zoom: null };
    }
    calculate(input) {
        let changed = false;
        if (!fastDeepEqual(input.markers, this.markers)) {
            changed = true;
            // TODO use proxy to avoid copy?
            this.markers = [...input.markers];
            const points = this.markers.map((marker) => {
                return {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [
                            marker.getPosition().lng(),
                            marker.getPosition().lat(),
                        ],
                    },
                    properties: { marker },
                };
            });
            this.superCluster.load(points);
        }
        const state = { zoom: input.map.getZoom() };
        if (!changed) {
            if (this.state.zoom > this.maxZoom && state.zoom > this.maxZoom) ;
            else {
                changed = changed || !fastDeepEqual(this.state, state);
            }
        }
        this.state = state;
        if (changed) {
            this.clusters = this.cluster(input);
        }
        return { clusters: this.clusters, changed };
    }
    cluster({ map }) {
        return this.superCluster
            .getClusters([-180, -90, 180, 90], Math.round(map.getZoom()))
            .map(this.transformCluster.bind(this));
    }
    transformCluster({ geometry: { coordinates: [lng, lat], }, properties, }) {
        if (properties.cluster) {
            return new Cluster({
                markers: this.superCluster
                    .getLeaves(properties.cluster_id, Infinity)
                    .map((leaf) => leaf.properties.marker),
                position: new google.maps.LatLng({ lat, lng }),
            });
        }
        else {
            const marker = properties.marker;
            return new Cluster({
                markers: [marker],
                position: marker.getPosition(),
            });
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
 * Provides statistics on all clusters in the current render cycle for use in {@link Renderer.render}.
 */
class ClusterStats {
    constructor(markers, clusters) {
        this.markers = { sum: markers.length };
        const clusterMarkerCounts = clusters.map((a) => a.count);
        const clusterMarkerSum = clusterMarkerCounts.reduce((a, b) => a + b, 0);
        this.clusters = {
            count: clusters.length,
            markers: {
                mean: clusterMarkerSum / clusters.length,
                sum: clusterMarkerSum,
                min: Math.min(...clusterMarkerCounts),
                max: Math.max(...clusterMarkerCounts),
            },
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
    render({ count, position }, stats) {
        // change color if this cluster has more markers than the mean cluster
        const color = count > Math.max(10, stats.clusters.markers.mean) ? "#ff0000" : "#0000ff";
        // create svg url with fill color
        const svg = window.btoa(`
  <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
    <circle cx="120" cy="120" opacity=".6" r="70" />
    <circle cx="120" cy="120" opacity=".3" r="90" />
    <circle cx="120" cy="120" opacity=".2" r="110" />
  </svg>`);
        // create marker using svg icon
        return new google.maps.Marker({
            position,
            icon: {
                url: `data:image/svg+xml;base64,${svg}`,
                scaledSize: new google.maps.Size(45, 45),
            },
            label: {
                text: String(count),
                color: "rgba(255,255,255,0.9)",
                fontSize: "12px",
            },
            title: `Cluster of ${count} markers`,
            // adjust zIndex to be above other markers
            zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
        });
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
var MarkerClustererEvents;
(function (MarkerClustererEvents) {
    MarkerClustererEvents["CLUSTERING_BEGIN"] = "clusteringbegin";
    MarkerClustererEvents["CLUSTERING_END"] = "clusteringend";
    MarkerClustererEvents["CLUSTER_CLICK"] = "click";
})(MarkerClustererEvents || (MarkerClustererEvents = {}));
const defaultOnClusterClickHandler = (_, cluster, map) => {
    map.fitBounds(cluster.bounds);
};
/**
 * MarkerClusterer creates and manages per-zoom-level clusters for large amounts
 * of markers. See {@link MarkerClustererOptions} for more details.
 *
 */
class MarkerClusterer extends OverlayViewSafe {
    constructor({ map, markers = [], algorithm = new SuperClusterAlgorithm({}), renderer = new DefaultRenderer(), onClusterClick = defaultOnClusterClickHandler, }) {
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
        markers.forEach((marker) => {
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
        marker.setMap(null);
        this.markers.splice(index, 1); // Remove the marker from the list of managed markers
        if (!noDraw) {
            this.render();
        }
        return true;
    }
    removeMarkers(markers, noDraw) {
        let removed = false;
        markers.forEach((marker) => {
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
        if (map instanceof google.maps.Map && this.getProjection()) {
            google.maps.event.trigger(this, MarkerClustererEvents.CLUSTERING_BEGIN, this);
            const { clusters, changed } = this.algorithm.calculate({
                markers: this.markers,
                map,
                mapCanvasProjection: this.getProjection(),
            });
            // allow algorithms to return flag on whether the clusters/markers have changed
            if (changed || changed == undefined) {
                // reset visibility of markers and clusters
                this.reset();
                // store new clusters
                this.clusters = clusters;
                this.renderClusters();
            }
            google.maps.event.trigger(this, MarkerClustererEvents.CLUSTERING_END, this);
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
        this.markers.forEach((marker) => marker.setMap(null));
        this.clusters.forEach((cluster) => cluster.delete());
        this.clusters = [];
    }
    renderClusters() {
        // generate stats to pass to renderers
        const stats = new ClusterStats(this.markers, this.clusters);
        const map = this.getMap();
        this.clusters.forEach((cluster) => {
            if (cluster.markers.length === 1) {
                cluster.marker = cluster.markers[0];
            }
            else {
                cluster.marker = this.renderer.render(cluster, stats);
                if (this.onClusterClick) {
                    cluster.marker.addListener("click", 
                    /* istanbul ignore next */
                    (event) => {
                        google.maps.event.trigger(this, MarkerClustererEvents.CLUSTER_CLICK, cluster);
                        this.onClusterClick(event, cluster, map);
                    });
                }
            }
            cluster.marker.setMap(map);
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
const LOADER_OPTIONS = {
    apiKey: "AIzaSyDhRjl83cPVWeaEer-SnKIw7GTjBuqWxXI",
    version: "weekly",
    libraries: [],
};
// helper function to keep maps in sync
const sync = (...maps) => {
    let center;
    let zoom;
    function update(changedMap) {
        maps.forEach((m) => {
            if (m === changedMap) {
                return;
            }
            m.setCenter(center);
            m.setZoom(zoom);
        });
    }
    maps.forEach((m) => {
        m.addListener("bounds_changed", () => {
            const changedCenter = m.getCenter();
            const changedZoom = m.getZoom();
            if (changedCenter !== center || changedZoom !== zoom) {
                center = changedCenter;
                zoom = changedZoom;
                update(m);
            }
        });
    });
};

var trees = [
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.84421521958048,
				40.723091773924274
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "red maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.81867945834878,
				40.79411066708779
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93660770459083,
				40.717580740099116
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93445615919741,
				40.713537494833226
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97597938483258,
				40.66677775537875
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98494997200308,
				40.770045625891846
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98533807200513,
				40.77020969000546
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98729652382876,
				40.7627238542921
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.07625483097186,
				40.596579313729144
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96974394191379,
				40.58635724735751
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91117076849402,
				40.78242822973097
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91201956608866,
				40.78173511421239
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.16267038247524,
				40.55710259269471
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96821054029427,
				40.69473313907219
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.92113023015189,
				40.664317398984245
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96760066006317,
				40.69331418041053
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99159679617637,
				40.593787550585226
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96452446822275,
				40.64878769169177
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.8652999186246,
				40.73764622495205
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97258754060326,
				40.69149917038739
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98588943758692,
				40.66123875468547
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96045570742453,
				40.77217147708009
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98096427881879,
				40.78208719997997
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "willow oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.13856340070123,
				40.56882124262724
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "sycamore maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97218377293484,
				40.67483918746511
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "willow oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98917142531711,
				40.594936285011926
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Amur maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82499154919253,
				40.706533516902155
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97042747898412,
				40.61190461071703
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98982976460587,
				40.72180744390711
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91549691023117,
				40.708040124340584
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98670281663865,
				40.668826466756094
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89338225682316,
				40.847947079185445
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98162670448419,
				40.77039612675352
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98121826363523,
				40.77022714718968
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.08667826554655,
				40.58810729823054
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98504778619343,
				40.77008697533186
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98526928593986,
				40.77018061208424
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.13906214676298,
				40.568825166867676
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.11474623823968,
				40.578074056718314
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97484010897847,
				40.78258673880227
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95246689847255,
				40.575205295811905
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "willow oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97705764351917,
				40.73371649944506
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97453013858579,
				40.61366258454641
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82768034198298,
				40.70404651889878
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99936835831562,
				40.726639575307196
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "willow oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91127902288238,
				40.78233983248895
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9663797202686,
				40.695280682555044
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97238976811065,
				40.78218110151048
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99380070218072,
				40.59393169321807
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "willow oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.14804001171058,
				40.5858495229097
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "willow oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97671634831147,
				40.61293798189811
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82720922149184,
				40.714909971907666
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.94863403031965,
				40.6100347683596
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.94861132582527,
				40.60991607577651
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.80826025712618,
				40.74068683597206
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.15618059801685,
				40.53211312776527
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89097860617149,
				40.856774471838726
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90356057731171,
				40.85091786024071
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "red maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97721168704322,
				40.78993606612256
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.1065349443613,
				40.5610324289115
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "red maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.19255286874332,
				40.539369387860575
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "red maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88725059080657,
				40.75902778398188
			]
		},
		status: "Dead",
		health: null,
		spc_common: null
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98253014634868,
				40.745033994065416
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99985934610353,
				40.7359998531807
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.13823191471243,
				40.56785426360856
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "hedge maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89540540519324,
				40.76686765057031
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.00410729319515,
				40.6819432732001
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96207980385901,
				40.80230108588602
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88730078404606,
				40.75088939064141
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.81946649097343,
				40.79313800420383
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88088626637622,
				40.87343705714923
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99157274737178,
				40.716805385067346
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91763219387903,
				40.846375825268666
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "American elm"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96280534088122,
				40.59078485715291
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "sycamore maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82819499212432,
				40.704944499331496
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91209530143406,
				40.78075206758672
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95894425967109,
				40.77222448155208
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90688618113626,
				40.848106229042735
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American elm"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9829175035826,
				40.77013008975271
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American elm"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97558535494926,
				40.781617201031025
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97682017943663,
				40.612880643288754
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.03492842818125,
				40.62140476357093
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.85444599003124,
				40.71316968515154
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9110256109311,
				40.78254676160222
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9614226506213,
				40.69227839545721
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83829721619878,
				40.7170323149707
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Amur maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.85501987714406,
				40.7124796096016
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98073049257751,
				40.66823129823416
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.85213797272486,
				40.71264110335946
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97325312578212,
				40.66903950319261
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97721789744,
				40.61324054313011
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96044297686721,
				40.62480755663272
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89249204770594,
				40.76679522573525
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.14007848548106,
				40.56872513256854
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96632142166791,
				40.58802013648723
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.85445969770379,
				40.7133838901074
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9663647807708,
				40.6952057852503
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97276285920823,
				40.78233866823086
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97308772691781,
				40.78250569576515
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "American elm"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.1391287419038,
				40.56873093262929
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.85210322557508,
				40.71269661040168
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99153287193579,
				40.71688340954114
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.948624417497,
				40.609984520365074
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91201937501401,
				40.78081458825172
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91106905408407,
				40.78159709045163
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.79811408031267,
				40.767629052943775
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96331506361766,
				40.808811547267055
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.92576588806473,
				40.646496516411695
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.13481836488482,
				40.567362175022126
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97469909198902,
				40.78283422070782
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97678694913915,
				40.61298057281686
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99162804769017,
				40.7166971757019
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98935258382868,
				40.76312607478656
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ash"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.85066148383136,
				40.714986665047206
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91084616552375,
				40.78178061437763
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.79787010490064,
				40.767608366494336
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96340334087577,
				40.80874458097537
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82657764962174,
				40.74830311097895
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Amur maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96071917063361,
				40.805725833688264
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "willow oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83342753060359,
				40.75465185367967
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Amur maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96412322243684,
				40.81114537770991
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "American elm"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.13565413722235,
				40.56710370271643
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "hedge maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.92220307515682,
				40.66522203542396
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95649258663089,
				40.627001309145506
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.1921610911247,
				40.539370099142886
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "red maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.00504966097043,
				40.73998078715982
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9911988140183,
				40.72180184476791
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "red maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82961561789335,
				40.70649325306424
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.1563285618603,
				40.53195765715974
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97237310801523,
				40.78220389461905
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.85600425263182,
				40.72877984849716
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91633968601458,
				40.77399973028186
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97646441113959,
				40.66701232112726
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.76764199907284,
				40.60866168114924
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90933909161998,
				40.69775111583416
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98065645047268,
				40.74829709386316
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97423449341356,
				40.792387023589114
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9676460501815,
				40.687678567049865
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.772342855482,
				40.596266880967335
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.77245394318506,
				40.59683647901558
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.8934063139104,
				40.85791814268075
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.86526993448096,
				40.73999100224415
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.75365462363227,
				40.66362636421385
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.86525670768232,
				40.72186915184504
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93644715389304,
				40.604305228351556
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.73473543174987,
				40.70321800070179
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96350468040232,
				40.67591256104146
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.85049292510068,
				40.71525300311096
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.13410013975913,
				40.5674483333905
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "hedge maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89080442865829,
				40.770796739955074
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82895529041788,
				40.75195241033611
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82549632406925,
				40.71219318208699
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97613835640813,
				40.78080394938657
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82794407979267,
				40.71175383782811
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96312071522566,
				40.809077091635245
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.16264761325981,
				40.56025909897613
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99518627114927,
				40.617992061446785
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "red maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.0014707483652,
				40.68162051359106
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95571955043029,
				40.650159419405185
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97323052472242,
				40.67524603537304
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.84936673017978,
				40.903399783034004
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.87162803649807,
				40.76416599592589
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99026971945337,
				40.618915854764595
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97980286957241,
				40.776883569081534
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95532709911106,
				40.77277225281873
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98475371509943,
				40.76996266103026
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.92575934741653,
				40.762068387732796
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98436754908766,
				40.73943979278015
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.86702522453213,
				40.6906255669243
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.81814429380658,
				40.58401171426236
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98089638287,
				40.66831143307048
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97201220349837,
				40.67498646199742
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98261516507901,
				40.73570804262992
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83049495134772,
				40.712661666273114
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90137420267449,
				40.85392217509237
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97579405598702,
				40.64072804862932
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97521359341532,
				40.67179945111836
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.78793924620142,
				40.73275125780878
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83485945619927,
				40.753950211492175
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98369364073422,
				40.77033272090147
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9954703275665,
				40.6858461395734
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99536155283243,
				40.68581010748825
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95993923683677,
				40.76955938613082
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98958223874826,
				40.72173135843938
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98322687764586,
				40.78010688421972
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89434095986375,
				40.76810089883451
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.78633372012597,
				40.76280481942359
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "red maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98079836980062,
				40.66826408835274
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97503084431871,
				40.672018678962196
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.8544642235531,
				40.711718682810904
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96121439017126,
				40.763321885181526
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9856408665588,
				40.78061205329372
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.850185988622,
				40.57619607059636
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88713448997301,
				40.74996589421454
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.94980362691733,
				40.7254984444126
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.86658672060496,
				40.68844786971196
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9762603088283,
				40.68591967165016
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95177311899286,
				40.72856768684118
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.16220431179724,
				40.596660022153145
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.8271460568184,
				40.769804273003245
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.92810435566474,
				40.76316179541797
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98485279037527,
				40.77000454390119
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.94378431797111,
				40.578872483620586
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98213047206272,
				40.77038982952048
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "crab apple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.16242862629674,
				40.59784148735821
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.94879371143635,
				40.72262724694355
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97620525932034,
				40.670998675536595
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90162551182495,
				40.86998754094472
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.92415479730757,
				40.63056030950792
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95955457579119,
				40.76436461074178
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97857965770694,
				40.747801383092565
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96036844845918,
				40.624421400549274
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88745706302697,
				40.85705393379904
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96487681570375,
				40.60961592154829
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9821229383017,
				40.76996827663165
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "crab apple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.1625358567237,
				40.59837238915214
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96835284586766,
				40.69543462276076
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96832202873222,
				40.69528271580404
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97337630074402,
				40.67530269357513
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96064456272003,
				40.7630799218316
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96012716653067,
				40.769639050423706
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97628863705064,
				40.6860602071579
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98337930093409,
				40.780171873919386
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99033070458827,
				40.72311463323263
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96045231030908,
				40.7629982865116
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96077693381598,
				40.76313613142997
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97505728387982,
				40.67490333891054
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96003887726967,
				40.76960162372808
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98285451731736,
				40.7575704444091
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9911001715579,
				40.72206572518783
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98370686371007,
				40.76964206462148
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.10593025322113,
				40.559182784116466
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82864618675484,
				40.582117378332185
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98179160516962,
				40.77046434714469
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82538141635906,
				40.58306474243835
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96062866815528,
				40.69153074391603
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98598250883435,
				40.744866526894505
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9590118876348,
				40.76916627113935
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9594592284515,
				40.764324420146224
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.94759301402212,
				40.72286387838295
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97268165254152,
				40.669723765221214
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97971636953785,
				40.75235027872372
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.94855770955621,
				40.60963577616657
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98054733919605,
				40.738155307914035
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98079174857948,
				40.770050688083366
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97265211582584,
				40.676725388466856
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9646957314448,
				40.64872085303549
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93895705650718,
				40.71308988154833
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9861634988138,
				40.770558620044575
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98577304556501,
				40.66116852618676
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91521777074148,
				40.70233781917689
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99769318960969,
				40.712695582657275
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98364215184338,
				40.769614760294
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95847825842672,
				40.6203764506935
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99457015014323,
				40.66357180023084
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82831042299202,
				40.58221487046158
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9457410798543,
				40.60955151419967
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97278999947494,
				40.67586568888086
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89270306926588,
				40.70099719320924
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96056700656774,
				40.691246946793136
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96897588563444,
				40.79880048648503
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91480707343258,
				40.70871281397412
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.01226648426427,
				40.71007644255111
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97068954436763,
				40.69577266456954
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97235367387583,
				40.67249782707868
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9737185112562,
				40.67688867789059
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9525171573011,
				40.80278452172171
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9485315241513,
				40.609498885165344
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98048351591714,
				40.73824263013364
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97213743123869,
				40.67561104810398
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97187884501805,
				40.67551014283506
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82405773320552,
				40.583448808962444
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82387098920358,
				40.58350299022843
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93663138986484,
				40.71763375446986
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88841975636886,
				40.75182476724454
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.94694311762747,
				40.72566318601352
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89377521412185,
				40.85153000922133
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90218779990661,
				40.85811920580536
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American elm"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.92783662495987,
				40.742227975764685
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99982555437511,
				40.63461036089849
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.7701119046339,
				40.610953039810774
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.16176843708956,
				40.55832020616527
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Amur maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90281035245803,
				40.84983560625613
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "American elm"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.7505809837239,
				40.69414596649315
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91459447204626,
				40.783437262155715
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91206577688445,
				40.78183619303114
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93097316077315,
				40.58453675842773
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.16442171984586,
				40.61544132982603
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97055355284611,
				40.78755732166394
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.8489220158499,
				40.73791650447109
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "American elm"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.84843342902634,
				40.737531101147574
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.79585205192946,
				40.765096654425534
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91049676852056,
				40.77997368915533
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.03391951302535,
				40.62103615128787
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97136275805653,
				40.78603545543292
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "willow oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.75219520944026,
				40.662434638966616
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "silver maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.1173718409482,
				40.60249347336218
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "silver maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.09984423227807,
				40.57845115848064
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "silver maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97711678832722,
				40.64218647848739
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "silver maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98660086329274,
				40.719759138377796
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Turkish hazelnut"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.86006187486797,
				40.71947082475158
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "silver maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.75326962425427,
				40.673351655728666
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "silver maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.77954308373778,
				40.7662955931536
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "silver maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.75653466318799,
				40.75690759213043
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "black cherry"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.85375547780835,
				40.734105299793065
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "silver maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.7862539618821,
				40.72499954735958
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "silver maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.15250829368087,
				40.588712582343504
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "silver maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98974807814508,
				40.764580563550844
			]
		},
		status: "Stump",
		health: null,
		spc_common: null
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.84269904004744,
				40.785331699005575
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "eastern redcedar"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.8082914975296,
				40.768431370782906
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "silver maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95696074016637,
				40.639636998375025
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "eastern redcedar"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90830663505174,
				40.69791921791782
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "black cherry"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96444166434875,
				40.61242515683779
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "silver maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89324990156877,
				40.75237428897951
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "silver maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83028810474481,
				40.71266474924727
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "silver maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.8577866877099,
				40.73433313918474
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.8928498165053,
				40.85600070282801
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.84915063594836,
				40.71760215260353
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90149295162624,
				40.853583188310736
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90142196275109,
				40.85378583735348
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98381721575313,
				40.73921100140552
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.00402821462116,
				40.68210683997713
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9748565957397,
				40.67222770823235
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.81811316508589,
				40.583962822281
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9746999208122,
				40.7501978633249
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97454407007058,
				40.750413661356596
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89371112573107,
				40.84765783915696
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.76412300359742,
				40.60693099162316
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "tulip-poplar"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.92817070942458,
				40.8323063344422
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.84236504608491,
				40.72099944449807
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "tulip-poplar"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90408213711774,
				40.70871171076446
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88153802702232,
				40.875677472746624
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97883273498775,
				40.67491691698478
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.73567337116417,
				40.761294822918806
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95509839024993,
				40.671875458924426
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.839662783766,
				40.7212802330751
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89426076098657,
				40.7579284785756
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99240025027014,
				40.76814466237722
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96594650663212,
				40.71233877828144
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "sawtooth oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83213743809483,
				40.704535556981845
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96500314540887,
				40.63956768935483
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.85369904562373,
				40.85488535201195
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82703697671428,
				40.76982330987716
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98317757284649,
				40.75689624699233
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90157359948711,
				40.85334855839091
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97164399768184,
				40.79952467269521
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96965381884705,
				40.79962299123585
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96117931929288,
				40.76412272782525
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96795356428449,
				40.6934663434313
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96593251427679,
				40.693836994843444
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.92414492776821,
				40.630465637654986
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89088874470391,
				40.85637186275616
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89269409659236,
				40.85737327604057
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98090355676406,
				40.779130765635024
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.8246528931495,
				40.581421716285284
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.79794186235839,
				40.76761445100967
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96541768242338,
				40.691230289274024
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96071086630371,
				40.6919405568074
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93086590481172,
				40.76782573817681
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96285445267887,
				40.64459955521258
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "tulip-poplar"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.77418742201044,
				40.77048653308347
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.74810118977845,
				40.67524171814123
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.75464769507323,
				40.73287782291874
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.94652237313713,
				40.6767397869881
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83329646281585,
				40.71449876855058
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95739876534434,
				40.806903447365045
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89064769960058,
				40.76932328118715
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88695044511424,
				40.85070574739979
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82133896706138,
				40.70556937682455
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.1268032807866,
				40.574617023915735
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97827071291084,
				40.74529871427063
			]
		},
		status: "Dead",
		health: null,
		spc_common: null
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97672525531632,
				40.73357761852385
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97646307823072,
				40.73346807245652
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88533325023631,
				40.858051471555996
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99941652718023,
				40.72666327605533
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "willow oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91136021318917,
				40.78227353426455
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96619451081666,
				40.694525853644905
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.84344476868337,
				40.65353428763706
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American elm"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91819073937215,
				40.84571910981879
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97022536787256,
				40.6946872763473
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9754955375243,
				40.781686700704405
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89058091521603,
				40.67763434929766
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98509239771755,
				40.739746449492955
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90979495906255,
				40.68280728486643
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91146819719465,
				40.68111501724419
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.92809354040915,
				40.634408471249486
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83980527866572,
				40.72403950498265
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Chinese fringetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9602335381335,
				40.65189344201852
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89013512490963,
				40.856635415662495
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.08885093710383,
				40.57237893874682
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9531414319802,
				40.67441562628087
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89566027346673,
				40.84744347968359
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "red maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.94425848829616,
				40.70378287332874
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "southern magnolia"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95201546475371,
				40.70744575297773
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89424406390512,
				40.85912362110134
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95912524502857,
				40.65364722793121
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.0123523488884,
				40.71011368390399
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89261604631696,
				40.84948750294595
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98052056032301,
				40.74791179387195
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.79683634195773,
				40.59061303700894
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "sweetgum"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.796739944405,
				40.590642997214154
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "sweetgum"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9481526243999,
				40.72606120823322
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95725929221062,
				40.676075325406366
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95581738043795,
				40.67640772269089
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99597273594627,
				40.7175101380143
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.86131974582419,
				40.722244661861886
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90344945218123,
				40.70687246026798
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.92842894819353,
				40.74040845148154
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.74664284363496,
				40.59570646587395
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96078214339691,
				40.76395531024252
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96047463434878,
				40.763825687430476
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98224174340228,
				40.720688102388486
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89295364399136,
				40.857481998421285
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.8896228441087,
				40.74912138530947
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.18409535660193,
				40.5501769140859
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97144407409905,
				40.61227656871346
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.18913181498976,
				40.588681667285066
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.18811274872097,
				40.58804692267144
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90396581017892,
				40.778173089545945
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.08802745932843,
				40.58451588370911
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.8266914710005,
				40.74831191006405
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95861205918303,
				40.80754134482308
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89970654157909,
				40.84272939371104
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.00705779378404,
				40.74797174512059
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.986873891706,
				40.67232210879313
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98683518495905,
				40.67236842326965
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95630454924643,
				40.623359085286395
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "scarlet oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96020329718299,
				40.65173425519747
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.86052983655352,
				40.57030075673283
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.86056009366939,
				40.57035357869177
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95382788947512,
				40.637453936863345
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "scarlet oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95234582818328,
				40.73617912438847
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98398917631937,
				40.67179931860605
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95962941730623,
				40.62775075567955
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "scarlet oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93529399124681,
				40.60327056841771
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "scarlet oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90126028443578,
				40.854247368535276
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88753349726441,
				40.85696595379053
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9820886445382,
				40.7699686306065
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "crab apple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99007878098249,
				40.59406602519284
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96071137933431,
				40.763108294314875
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89182849628509,
				40.700955579572515
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89560727579894,
				40.84754856966117
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Atlantic white cedar"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83996683817163,
				40.783268889842375
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.10598288732902,
				40.55912311711576
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98622844052731,
				40.59447845402136
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "black oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.0177996138029,
				40.70807231522759
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Japanese zelkova"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.0039688431674,
				40.73951749146824
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Japanese zelkova"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95874411391469,
				40.620515907362055
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Japanese zelkova"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97234134653237,
				40.69025666715261
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95281040626419,
				40.80402101079295
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95150744918652,
				40.78281017402808
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95962391103913,
				40.65017866499389
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97718110675576,
				40.72266960403733
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89095084917571,
				40.75013518900441
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97750283861568,
				40.640542914932624
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "sweetgum"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9903024246257,
				40.76726395822387
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90160792298914,
				40.85845785473327
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82844596463524,
				40.70830056616466
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.1844018236676,
				40.54960722092716
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "sweetgum"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95395421686904,
				40.67404278548662
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.79713579372896,
				40.59246810452389
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9918492450809,
				40.59354535874552
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89650861207002,
				40.678130825276874
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9815455232793,
				40.770362540315126
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95966713110309,
				40.77123387987493
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90753082037423,
				40.711499785693995
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.94673199583946,
				40.7252894663601
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98596471382398,
				40.77047458895194
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98067313149596,
				40.736163660168216
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96719943972623,
				40.80732246649563
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97909806793731,
				40.725697078429484
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.00236597933626,
				40.64205588645163
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95123356290063,
				40.64673763530125
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89574170919056,
				40.847281998615514
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "red maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95798142112277,
				40.67625398068884
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91769088440894,
				40.77708930253318
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99168684472288,
				40.593701160074815
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.75622313012815,
				40.59969829081785
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9297513791378,
				40.764225560727645
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83427783150539,
				40.75498147158002
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82397193232552,
				40.58347370404511
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9367721075071,
				40.71794871774924
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88843105935635,
				40.751886753748906
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99958539779227,
				40.735884363300954
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91694034557939,
				40.77679762152703
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98642286600719,
				40.77066825925523
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97259679073959,
				40.69154585248793
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91603248146964,
				40.846694933908175
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.94799785465035,
				40.69544411556516
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98637067316523,
				40.766542902356576
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96683228727653,
				40.6436057455026
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95835615115016,
				40.649389695378794
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88672874136103,
				40.856323501545525
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.08651135580149,
				40.58283322986748
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95830423336267,
				40.637879214299566
			]
		},
		status: "Stump",
		health: null,
		spc_common: null
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.18923615384018,
				40.540938876360386
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "sweetgum"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9454488586446,
				40.71724309471646
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "sweetgum"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96095697484164,
				40.77774504052222
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "sweetgum"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90690108974417,
				40.83327795025313
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90442392154077,
				40.76879797480267
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.87001251472422,
				40.83884368842613
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.8700241172357,
				40.83912378406879
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98308164886949,
				40.75685572912601
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9695368863614,
				40.79957439556649
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95568857408162,
				40.64923076934295
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9679836089979,
				40.69361445284435
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9659165712771,
				40.69375721548925
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89090157235233,
				40.856404473575246
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.85048876681068,
				40.57672002971406
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9719601605765,
				40.675061761190584
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82478884082774,
				40.58138308491675
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98266889209197,
				40.73563403799143
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95922787922515,
				40.76925783353046
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99067638481597,
				40.76497171600916
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95207230651006,
				40.72846888186239
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83920810377049,
				40.72217808026102
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91826095550442,
				40.77164613898779
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.87914913311336,
				40.75988227867551
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.84751149150947,
				40.903263508591735
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97532346334772,
				40.78192299706997
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96230576828576,
				40.8023961095017
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.16271887629433,
				40.56047015093172
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.84348029413093,
				40.69613647279765
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97654061296187,
				40.74990774158338
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93971597603074,
				40.71290601264906
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95815085371336,
				40.6421017408604
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.79713027690735,
				40.59241447210203
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.13699480134734,
				40.61825743900319
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "sweetgum"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.80829413850186,
				40.81550170095881
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.11074525897867,
				40.57879235331398
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.7358747702583,
				40.761611421876644
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82422548700261,
				40.58154316635929
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82453415052974,
				40.58145545780084
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95933546629497,
				40.76427224994388
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98541109863412,
				40.744528080649815
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91564549776162,
				40.7078950942702
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97273924533373,
				40.66965471924911
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99073673695291,
				40.722324761386034
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.00698867319541,
				40.613524485667384
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.75621645243889,
				40.599870804784516
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96549830227003,
				40.80929314213609
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95684834446494,
				40.772416725922184
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95804293024116,
				40.77346064841097
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91197789227802,
				40.61133243139744
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "crab apple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9606105467073,
				40.69144733849064
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.94033809475349,
				40.71275528326804
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.08697960138329,
				40.58826636506421
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.94736720824885,
				40.771179778257356
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91004856224149,
				40.77823873269163
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90999442990935,
				40.7782829240155
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83203525815377,
				40.651568710432485
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.74783796867045,
				40.67569030219613
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91164100188226,
				40.758602885756886
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88569125789775,
				40.75700789163766
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9765955485196,
				40.612744880227815
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.19492803860753,
				40.517676892411316
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.02148258671878,
				40.6463105957943
			]
		},
		status: "Dead",
		health: null,
		spc_common: null
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96085161637228,
				40.63735750807199
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88562979137713,
				40.756667996832256
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83378198339634,
				40.89168960980179
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83415019663612,
				40.89025306809609
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90008335246327,
				40.735254587584755
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89364333931192,
				40.84777131980271
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91780195213839,
				40.78120648456185
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93661699118985,
				40.68626385336295
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96480787807656,
				40.67580692870529
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96598813108825,
				40.676052659547395
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.85493494109828,
				40.73285768347087
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82639560840393,
				40.74828903736156
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Amur maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96045172390801,
				40.69072504992415
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83878858966877,
				40.72154116102347
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93170769432754,
				40.584384651323056
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99900595216046,
				40.68509716720126
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.15949734296514,
				40.530022834119656
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95640820651897,
				40.618947273205734
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82141585813082,
				40.70476184102312
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89818770462072,
				40.76908787487744
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.85850254137104,
				40.69535849388542
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.80939869328824,
				40.742106373013335
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.1119414636811,
				40.57943219745527
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95579396951865,
				40.637776178537514
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99468080403022,
				40.68558460651076
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.84446066216256,
				40.72311889775094
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.79034472776264,
				40.731516075119174
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.86800833449752,
				40.7635973998244
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.10615444666,
				40.55892862960083
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98476379621135,
				40.73275809728903
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90441916293928,
				40.870166831221326
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97136050163523,
				40.67135580281279
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9746813210035,
				40.782804783009055
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97497301505558,
				40.78240423425448
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82942852067306,
				40.75165373477278
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "willow oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88734612806253,
				40.75114120403045
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96098442862402,
				40.64390375935704
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "London planetree"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.86679300156054,
				40.74255627745602
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83747603296702,
				40.71923851222828
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.16544643627111,
				40.52989284421756
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.85411981131115,
				40.78557420100614
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97718356345842,
				40.655987310935444
			]
		},
		status: "Stump",
		health: null,
		spc_common: null
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96552793009938,
				40.61094837617426
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9159768138624,
				40.782949533579675
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9598273531243,
				40.66250749513229
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.75595234880191,
				40.733483289676194
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.85172193829422,
				40.849335251112734
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90554670452389,
				40.7691008523092
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.08850458015749,
				40.58823854866351
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "sweetgum"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.00358610925849,
				40.736894987626606
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Ohio buckeye"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.74663781399073,
				40.60046522428823
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.94635859195522,
				40.72636132577155
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "sweetgum"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.16353728189311,
				40.59284161011513
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "sweetgum"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.7582515964935,
				40.59542651398754
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9981789331313,
				40.73570809776438
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96388852990957,
				40.76362306809114
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.92826539502109,
				40.74243038769082
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89254966815538,
				40.85909695885299
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96007159635786,
				40.63904098308401
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "tulip-poplar"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83319329007601,
				40.71650512349887
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.78817630715473,
				40.72572232782555
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82182410696282,
				40.760898485058924
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97303810215779,
				40.78245490847852
			]
		},
		status: "Stump",
		health: null,
		spc_common: null
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89352150271775,
				40.847975285160786
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89083845762482,
				40.769669360106754
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9600752709618,
				40.780416624756256
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.84375429813754,
				40.72322904277261
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98927129854985,
				40.76437966270442
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.03768116666659,
				40.62117761328229
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.16670128020681,
				40.527007256982095
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98415748649936,
				40.78061276661701
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.00199675727279,
				40.73791181446669
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9385374943357,
				40.604730998315006
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88558277841713,
				40.859457521811706
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.85070039388916,
				40.57708624789798
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97795890612241,
				40.74865417864706
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.86655869583821,
				40.68832509619777
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97246070876648,
				40.7859023047711
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99005439276567,
				40.719910192414254
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91485147911182,
				40.70866955113727
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96001124506653,
				40.67524602563093
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Japanese zelkova"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95578895507936,
				40.637490569844694
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "northern red oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.92155189169091,
				40.73804387948683
			]
		},
		status: "Dead",
		health: null,
		spc_common: null
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95381354446748,
				40.637378972809216
			]
		},
		status: "Stump",
		health: null,
		spc_common: null
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98536217066534,
				40.73986145726532
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Japanese zelkova"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98542512709345,
				40.73988829766519
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Japanese zelkova"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83937577603841,
				40.72529976652313
			]
		},
		status: "Stump",
		health: null,
		spc_common: null
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88785030235013,
				40.85787584478919
			]
		},
		status: "Dead",
		health: null,
		spc_common: null
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96085724372357,
				40.76491371354804
			]
		},
		status: "Stump",
		health: null,
		spc_common: null
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.8363067551969,
				40.721513754246
			]
		},
		status: "Dead",
		health: null,
		spc_common: null
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93896269038615,
				40.688026364313544
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "black oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.85807160996906,
				40.57133137665867
			]
		},
		status: "Stump",
		health: null,
		spc_common: null
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88783889079797,
				40.758381987972854
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Japanese zelkova"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95963287280152,
				40.76439761556554
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.94762396456971,
				40.723094318444524
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83582153713401,
				40.71946253172383
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "crab apple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.10612350966859,
				40.55896370037156
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97387773656743,
				40.67665163383538
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.85940095601251,
				40.73726942527195
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98110854297951,
				40.77018175379025
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82415968446146,
				40.58341922878571
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97237645489776,
				40.676617342791374
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96440259529571,
				40.648835254500106
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.94676476073012,
				40.72534746620394
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95741759744091,
				40.64537755080124
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9832981533227,
				40.77029021722772
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90658661568328,
				40.81976491649515
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9660784224089,
				40.608088045154595
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96333908101838,
				40.77339057613968
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9477165456528,
				40.69547660198517
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.07730025357984,
				40.59634053772127
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9154854304105,
				40.846684335425614
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9042424751777,
				40.85123953203528
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.86916936263249,
				40.83705855825059
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "silver linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9478077545686,
				40.724687379632286
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "silver linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83802679362677,
				40.71684084535957
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "silver linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96134249273145,
				40.80528415809051
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96611252073379,
				40.7704013891506
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98492380651963,
				40.78093705639848
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.85652381096364,
				40.728626196486374
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98627024855678,
				40.67304608583913
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98617237399314,
				40.673162960978125
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95358258241535,
				40.63617194575145
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.00564484119514,
				40.737228969128836
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.74261149705507,
				40.60159686022606
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.0349254309092,
				40.620977565702304
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89101539801852,
				40.85495155530641
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.8116112374934,
				40.817399850550274
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95955864147093,
				40.71403749867748
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "sawtooth oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96638945795036,
				40.7537632313701
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88707942079546,
				40.851029339555076
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.8661268057186,
				40.74209537603645
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.86634202263245,
				40.74006321781235
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.80519150146446,
				40.74044911054589
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95683061716171,
				40.63894718378938
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93572857906759,
				40.60366050245092
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "scarlet oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93688875216881,
				40.604701433062395
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "scarlet oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93726273790163,
				40.60503697152363
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96310905389937,
				40.67491391240436
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98453426613013,
				40.671424389798254
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82758363775602,
				40.762805703187546
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "sweetgum"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93855748059504,
				40.6079681151749
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "sweetgum"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.75920636656537,
				40.59577276177435
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.94510025596996,
				40.70809553514362
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.94502062832778,
				40.70838163730728
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.16740145727712,
				40.52602882211185
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "sweetgum"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.15956330365482,
				40.52906867308866
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "sweetgum"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93882397764779,
				40.71431738528611
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99280742985778,
				40.74704875655648
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.08816077683572,
				40.58357807565156
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "sweetgum"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96674313708033,
				40.64313217412675
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98269482333325,
				40.66664325654747
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.85730313457496,
				40.69600763061474
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93064686284218,
				40.744296175226765
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97446102791906,
				40.79402050116742
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96340402705194,
				40.62501519226842
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.81005460602867,
				40.74194207544866
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.94508787194152,
				40.708018155502806
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.1674653447432,
				40.52600127808297
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "sweetgum"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.92839249754685,
				40.83201884714369
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89883707734337,
				40.77010496637987
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9086008878777,
				40.78033312872911
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.94007692047211,
				40.6068076062418
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91894210366294,
				40.78288705721976
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98520399419073,
				40.72058607650066
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.86677694286294,
				40.68919765215941
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89408742363432,
				40.756981336788115
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82786478016297,
				40.70888304804651
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.8901236637565,
				40.75071921172073
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.76874633503216,
				40.68587944384731
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.968994181721,
				40.69464741512754
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.86632135482765,
				40.7381855347441
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93677963386168,
				40.60460353226671
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "scarlet oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93804149910387,
				40.60573565785411
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "scarlet oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.959130158245,
				40.69363817212312
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.74983600506259,
				40.664464899055965
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96197026973842,
				40.79637945346751
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.18562597784602,
				40.52222910069071
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98458176511265,
				40.6713673710428
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "swamp white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90017110291679,
				40.85262543622842
			]
		},
		status: "Dead",
		health: null,
		spc_common: null
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.01770609038257,
				40.708196665027295
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Japanese zelkova"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83143392215382,
				40.71299278918512
			]
		},
		status: "Dead",
		health: null,
		spc_common: null
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93783487450189,
				40.60403707791911
			]
		},
		status: "Stump",
		health: null,
		spc_common: null
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97748379661694,
				40.67088135888117
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Japanese zelkova"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.94503038596142,
				40.70844239406035
			]
		},
		status: "Stump",
		health: null,
		spc_common: null
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95894021153866,
				40.62049439479422
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Japanese zelkova"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9652457207833,
				40.71179417858591
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Japanese zelkova"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96627038362813,
				40.71065226191783
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Japanese zelkova"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.0058289841944,
				40.73520204944266
			]
		},
		status: "Dead",
		health: null,
		spc_common: null
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.72222977486663,
				40.727482076833034
			]
		},
		status: "Stump",
		health: null,
		spc_common: null
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9531746407699,
				40.64429755797787
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Japanese zelkova"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.75914553155998,
				40.59374122472949
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Japanese zelkova"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96919108975698,
				40.64306104507643
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pignut hickory"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90128905368327,
				40.857930317888176
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Japanese zelkova"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9016192150744,
				40.85804344492269
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Japanese zelkova"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96558740883681,
				40.63859132341147
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Japanese zelkova"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.92211665986669,
				40.776934807968296
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89421585229286,
				40.672051596687304
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97729531326686,
				40.74033544347427
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.84992501768801,
				40.57574445136686
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97382000799308,
				40.78374081321219
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90092156913762,
				40.870231460180285
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.00443051429181,
				40.681542282068826
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98304477571506,
				40.75765083363472
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98352687059362,
				40.635361340443815
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99180041375843,
				40.59359220677317
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97909081325655,
				40.634388032654
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95820513702462,
				40.7732349566675
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97362608904096,
				40.67619193297383
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96054758979898,
				40.691157584016196
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.71603411547522,
				40.73158659257078
			]
		},
		status: "Stump",
		health: null,
		spc_common: null
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93982046523136,
				40.71288069722843
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95983152318928,
				40.80805619203157
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90011120473385,
				40.842859598701715
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91550040007868,
				40.84681332034603
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89143099554077,
				40.847571927552266
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96309381327539,
				40.625049750518464
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.08690965202733,
				40.58303830822063
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.92781655224064,
				40.74467888149997
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9052621544153,
				40.70525957822366
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.86561806955417,
				40.73676439622127
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9742758319475,
				40.672445706240964
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95055819010824,
				40.72504082953626
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98700410945843,
				40.76178034073247
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93218262436767,
				40.74070591837963
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95639612194378,
				40.67404230954746
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.12681886534361,
				40.57367535431265
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "sweetgum"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.1626012258995,
				40.598696031438635
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98635746371741,
				40.67294193903361
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98622082745788,
				40.67310510149202
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9739860933107,
				40.64449024085306
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.77951459134016,
				40.76606033888917
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "sweetgum"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95910694249899,
				40.628815535614365
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "white oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.00566546848535,
				40.73712446781051
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88760376127263,
				40.85539038465405
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.00402241166432,
				40.60927793522501
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.00098899026396,
				40.57291653831438
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.16570859454397,
				40.52978381003439
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.86615699979191,
				40.69015150498833
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.86604539879546,
				40.74294501962076
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89743131637341,
				40.772177488323535
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "tulip-poplar"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.79633086226958,
				40.76849830762041
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.18862269714779,
				40.588364556579414
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99384165307265,
				40.61561938984554
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.13854026757288,
				40.5696226639112
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95939434814034,
				40.771609113813156
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96616266264685,
				40.608526100800205
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.1878642205816,
				40.541647620393164
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9934037600683,
				40.59337938947291
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99378974267856,
				40.593578571513596
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.19518294606755,
				40.51732552325576
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.19551986893087,
				40.518104240407055
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9632677184606,
				40.674737001168296
			]
		},
		status: "Stump",
		health: null,
		spc_common: null
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91594408613153,
				40.84658065284755
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.8289897171572,
				40.709847980670006
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "silver linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.1994855585511,
				40.52848799147304
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9922561385385,
				40.76808416235349
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89400200333621,
				40.74841097789615
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.84240573428382,
				40.7853220636402
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.885767183663,
				40.757427728723734
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.76723763525582,
				40.600672628678076
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.73603575352372,
				40.76186625654271
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83142390205948,
				40.84209556317764
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.12154500002386,
				40.5718518251871
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.00230396421513,
				40.68119451529027
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97546825247913,
				40.68618229072995
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95234853448636,
				40.73745046689527
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "tulip-poplar"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99155781636794,
				40.63018600253431
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.8925591250746,
				40.849582423981424
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98594537357108,
				40.6612725056828
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98303059226036,
				40.77017766294483
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.84123675508147,
				40.72185072674419
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95280607941581,
				40.80393433962139
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95279851012432,
				40.80378266551919
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97257729111152,
				40.66984888052818
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96658192593391,
				40.61478835486239
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "crab apple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.7518978916568,
				40.595121862465355
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88578193675903,
				40.75750930396007
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97292043973405,
				40.5901010021019
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.00238256048064,
				40.681216307034084
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89757741034882,
				40.77005639874826
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.99109537359887,
				40.62990670934709
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93976810449638,
				40.713855471809055
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "silver linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88617688912908,
				40.74926289791675
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.85058441935722,
				40.57688555728901
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.94967899410496,
				40.72527988055005
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.03799246103748,
				40.62066187821872
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96713405849083,
				40.61472536231554
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83957848781706,
				40.72130539389915
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.85243354589795,
				40.78531604131911
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9318858159037,
				40.58436482396077
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96107492481575,
				40.63854249824756
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98829793959364,
				40.72999095768746
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.86641802102255,
				40.74040120190242
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9676158790996,
				40.61467595780388
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88445606668488,
				40.857961130809926
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "sawtooth oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97739122339507,
				40.67435212613093
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.75067830547931,
				40.667327649380354
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88984528453571,
				40.681591588618474
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.00100056759398,
				40.61093835373242
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9152428937497,
				40.784798054231324
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "tulip-poplar"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83226394232828,
				40.71736608524252
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82739420739524,
				40.71012681146812
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89806109768138,
				40.768386303549924
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.84452963869177,
				40.78933923760832
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.73547397463551,
				40.76076998916424
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90189217399795,
				40.62765020887042
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9375507375317,
				40.608705702354534
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.16249289787162,
				40.598159703814936
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89286449745522,
				40.858663332953796
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90757283904985,
				40.71098678195813
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98209704160291,
				40.770438486628265
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "crab apple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96032529752176,
				40.76294435215787
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9609130869743,
				40.763193945056614
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96324926860528,
				40.762539948249504
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98365233812586,
				40.78028828754498
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91498455209054,
				40.70256662039827
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83682647937259,
				40.72083875923985
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95184262137505,
				40.728544734044426
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "American linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97061750522157,
				40.69576999238976
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.10605199228333,
				40.559044775077226
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91246247190253,
				40.614325352597795
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.94978382010174,
				40.72392664722994
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.03289655700792,
				40.62004590757024
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83138941184487,
				40.70689483455158
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.12839965419724,
				40.572000955902595
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "red maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.85550419574764,
				40.72892772875654
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98223654378293,
				40.7571599699229
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.1068337739828,
				40.560705479166025
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "red maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89409969709496,
				40.84848470289513
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Kentucky yellowwood"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.870204023343,
				40.76472405710767
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.87037992882853,
				40.76470539407124
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93710726335381,
				40.603314906326574
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.07931969727011,
				40.59660931936376
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "pin oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.12324985134273,
				40.57151101215287
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9112737728507,
				40.703181268565594
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.75711256153286,
				40.66131303766858
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.86584183067336,
				40.68827429765406
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97895476552384,
				40.67496431816244
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88669619185539,
				40.85054989378538
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.00759032667068,
				40.65145939630182
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "tulip-poplar"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83230047678626,
				40.704479526064475
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88572036958493,
				40.757168866123905
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96885544095771,
				40.693777834395114
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.85186613512924,
				40.84951985644618
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.12163399469449,
				40.571647974483604
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.80944784256256,
				40.76916625647108
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.92878904620954,
				40.76650457571858
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97371081484535,
				40.7827688355983
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88470553796623,
				40.749629528409685
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "ginkgo"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96039364310532,
				40.691185176892034
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96035776922965,
				40.69102388442802
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91928498511504,
				40.84579634062015
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95222733851952,
				40.772232237414215
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91566750436594,
				40.783119461995575
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91509437261973,
				40.7026134407457
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90907286240125,
				40.77248279406617
			]
		},
		status: "Stump",
		health: null,
		spc_common: null
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95909466622656,
				40.77201829101074
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.989465124729,
				40.76256232442072
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.00285913081379,
				40.650692122750904
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93833215925501,
				40.8406610663749
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83453668702522,
				40.717346700124864
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91611522226145,
				40.78283785239786
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91630562555154,
				40.78268421571127
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88947697625849,
				40.75767011680549
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.85320671538696,
				40.7855772739446
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89446422683204,
				40.850998882988414
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "sawtooth oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95870599319582,
				40.62603904458474
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83775215309515,
				40.71977224842445
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83505031754665,
				40.71506272624395
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.86734175210346,
				40.68921942169868
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.7372155076138,
				40.76238264776014
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9184434422007,
				40.78345131649924
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91875423274057,
				40.783244657420816
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95840918366615,
				40.772532630923806
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95101632684947,
				40.72584529893142
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.977385861254,
				40.7402110589159
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "mulberry"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88131029257596,
				40.87395035298123
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.88122629137803,
				40.87384782156017
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Callery pear"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98210588204032,
				40.636207922986756
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "silver linden"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90726608140017,
				40.769575805093886
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89055519161958,
				40.85595972237955
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89012718066444,
				40.84993596560512
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83260139261598,
				40.71762170936511
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.85397242232716,
				40.78564187080665
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96600619265858,
				40.638276510454816
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.8315461716127,
				40.71571421180112
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96379945768352,
				40.64922338747617
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.90097471454082,
				40.852399226488636
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "sweetgum"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.78472973243309,
				40.72503588447185
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.97270269315409,
				40.687132742711476
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96465201069871,
				40.64273828232173
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83389144209043,
				40.89126258104119
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.83412948092898,
				40.89033389303611
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.82326354495896,
				40.759994003112766
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89063016490319,
				40.76922814429278
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89470050820537,
				40.84771732898775
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89427290080934,
				40.75799481105387
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96592316283956,
				40.7123907200352
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "sawtooth oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.73690826180648,
				40.76181350776993
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9914014089773,
				40.63009153995651
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95472131660374,
				40.64659769174134
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89736930358582,
				40.75795579178782
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.8348102271265,
				40.6508067363485
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93929337575149,
				40.83746667815298
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "tulip-poplar"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.74476239392067,
				40.60288726963042
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.96983540388875,
				40.61169703439864
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.8926518688801,
				40.753595613035074
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.89246317858597,
				40.70019272144136
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.94389672012264,
				40.716767853730445
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95193080087041,
				40.652602813245046
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "tulip-poplar"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.8843092053551,
				40.85237441088388
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Douglas-fir"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.16572025597364,
				40.61418686075109
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.84186154328103,
				40.72445799534328
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.00326303972524,
				40.6813592303565
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.75157131502951,
				40.595119486443444
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "honeylocust"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98064292185306,
				40.7466893843522
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.80683746175198,
				40.58737262383953
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.80675640021164,
				40.58727548202356
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.13697605897553,
				40.61832735983278
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "sweetgum"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9289543995257,
				40.74046863355758
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.78763771002002,
				40.73239966589493
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.9465512921045,
				40.72670253092843
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "sweetgum"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.16930095136523,
				40.55685880788923
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "sweetgum"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.93211057004004,
				40.740697526422665
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Sophora"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.78695686441766,
				40.72644205149251
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95657607903932,
				40.625954650161795
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "northern red oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95762927800848,
				40.770981668560765
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Japanese zelkova"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.87007197740033,
				40.83711136963804
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "crepe myrtle"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98942211487898,
				40.66926302168864
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Japanese zelkova"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95925314083483,
				40.62369892226536
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Japanese zelkova"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91382885044519,
				40.77841237488571
			]
		},
		status: "Dead",
		health: null,
		spc_common: null
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.98291922293897,
				40.71846391689566
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Japanese zelkova"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.00239005133722,
				40.728139006578886
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "northern red oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95392965289909,
				40.63798574488204
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "northern red oak"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.91503242876452,
				40.69698001646252
			]
		},
		status: "Dead",
		health: null,
		spc_common: null
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.18192345707378,
				40.56261545750322
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Japanese zelkova"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.18209838298641,
				40.562594495194226
			]
		},
		status: "Dead",
		health: null,
		spc_common: null
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.12944305302537,
				40.56929362947098
			]
		},
		status: "Dead",
		health: null,
		spc_common: null
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.00015215718948,
				40.68505281208544
			]
		},
		status: "Alive",
		health: "Poor",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.95751667406411,
				40.62479203216237
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-74.09660153562089,
				40.59258559746177
			]
		},
		status: "Alive",
		health: "Good",
		spc_common: "Norway maple"
	},
	{
		geometry: {
			type: "Point",
			coordinates: [
				-73.79587098829472,
				40.76495851787223
			]
		},
		status: "Alive",
		health: "Fair",
		spc_common: "Norway maple"
	}
];

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
const mapOptions = {
    center: { lat: 40.7128, lng: -73.85 },
    zoom: 10,
};
new Loader(LOADER_OPTIONS).load().then(() => {
    const maps = [];
    const panels = [
        [
            document.getElementById("noop"),
            new NoopAlgorithm({}),
            `new NoopAlgorithm()`,
        ],
        [
            document.getElementById("grid"),
            new GridAlgorithm({ maxDistance: 40000 }),
            `new GridAlgorithm({})`,
        ],
        [
            document.getElementById("supercluster"),
            new SuperClusterAlgorithm({}),
            `new SuperClusterAlgorithm({})`,
        ],
    ];
    panels.forEach(([element, algorithm, text]) => {
        const map = new google.maps.Map(element, mapOptions);
        maps.push(map);
        const textElement = document.createElement("pre");
        textElement.innerText = text;
        textElement.classList.add("description");
        map.controls[google.maps.ControlPosition.LEFT_TOP].push(textElement);
        const markers = trees.map(({ geometry }) => new google.maps.Marker({
            position: {
                lat: geometry.coordinates[1],
                lng: geometry.coordinates[0],
            },
            map,
        }));
        new MarkerClusterer({
            algorithm,
            map,
            markers,
        });
    });
    sync(...maps);
});
