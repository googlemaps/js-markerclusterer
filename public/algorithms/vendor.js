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

/**
 * @module helpers
 */
/**
 * Earth Radius used with the Harvesine formula and approximates using a spherical (non-ellipsoid) Earth.
 *
 * @memberof helpers
 * @type {number}
 */
var earthRadius = 6371008.8;
/**
 * Unit of measurement factors using a spherical (non-ellipsoid) earth radius.
 *
 * @memberof helpers
 * @type {Object}
 */
var factors = {
    centimeters: earthRadius * 100,
    centimetres: earthRadius * 100,
    degrees: earthRadius / 111325,
    feet: earthRadius * 3.28084,
    inches: earthRadius * 39.37,
    kilometers: earthRadius / 1000,
    kilometres: earthRadius / 1000,
    meters: earthRadius,
    metres: earthRadius,
    miles: earthRadius / 1609.344,
    millimeters: earthRadius * 1000,
    millimetres: earthRadius * 1000,
    nauticalmiles: earthRadius / 1852,
    radians: 1,
    yards: earthRadius * 1.0936,
};
/**
 * Wraps a GeoJSON {@link Geometry} in a GeoJSON {@link Feature}.
 *
 * @name feature
 * @param {Geometry} geometry input geometry
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature} a GeoJSON Feature
 * @example
 * var geometry = {
 *   "type": "Point",
 *   "coordinates": [110, 50]
 * };
 *
 * var feature = turf.feature(geometry);
 *
 * //=feature
 */
function feature(geom, properties, options) {
    if (options === void 0) { options = {}; }
    var feat = { type: "Feature" };
    if (options.id === 0 || options.id) {
        feat.id = options.id;
    }
    if (options.bbox) {
        feat.bbox = options.bbox;
    }
    feat.properties = properties || {};
    feat.geometry = geom;
    return feat;
}
/**
 * Creates a {@link Point} {@link Feature} from a Position.
 *
 * @name point
 * @param {Array<number>} coordinates longitude, latitude position (each in decimal degrees)
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<Point>} a Point feature
 * @example
 * var point = turf.point([-75.343, 39.984]);
 *
 * //=point
 */
function point(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    if (!coordinates) {
        throw new Error("coordinates is required");
    }
    if (!Array.isArray(coordinates)) {
        throw new Error("coordinates must be an Array");
    }
    if (coordinates.length < 2) {
        throw new Error("coordinates must be at least 2 numbers long");
    }
    if (!isNumber(coordinates[0]) || !isNumber(coordinates[1])) {
        throw new Error("coordinates must contain numbers");
    }
    var geom = {
        type: "Point",
        coordinates: coordinates,
    };
    return feature(geom, properties, options);
}
/**
 * Takes one or more {@link Feature|Features} and creates a {@link FeatureCollection}.
 *
 * @name featureCollection
 * @param {Feature[]} features input features
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {FeatureCollection} FeatureCollection of Features
 * @example
 * var locationA = turf.point([-75.343, 39.984], {name: 'Location A'});
 * var locationB = turf.point([-75.833, 39.284], {name: 'Location B'});
 * var locationC = turf.point([-75.534, 39.123], {name: 'Location C'});
 *
 * var collection = turf.featureCollection([
 *   locationA,
 *   locationB,
 *   locationC
 * ]);
 *
 * //=collection
 */
function featureCollection(features, options) {
    if (options === void 0) { options = {}; }
    var fc = { type: "FeatureCollection" };
    if (options.id) {
        fc.id = options.id;
    }
    if (options.bbox) {
        fc.bbox = options.bbox;
    }
    fc.features = features;
    return fc;
}
/**
 * Convert a distance measurement (assuming a spherical Earth) from radians to a more friendly unit.
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @name radiansToLength
 * @param {number} radians in radians across the sphere
 * @param {string} [units="kilometers"] can be degrees, radians, miles, inches, yards, metres,
 * meters, kilometres, kilometers.
 * @returns {number} distance
 */
function radiansToLength(radians, units) {
    if (units === void 0) { units = "kilometers"; }
    var factor = factors[units];
    if (!factor) {
        throw new Error(units + " units is invalid");
    }
    return radians * factor;
}
/**
 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into radians
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @name lengthToRadians
 * @param {number} distance in real units
 * @param {string} [units="kilometers"] can be degrees, radians, miles, inches, yards, metres,
 * meters, kilometres, kilometers.
 * @returns {number} radians
 */
function lengthToRadians(distance, units) {
    if (units === void 0) { units = "kilometers"; }
    var factor = factors[units];
    if (!factor) {
        throw new Error(units + " units is invalid");
    }
    return distance / factor;
}
/**
 * Converts an angle in degrees to radians
 *
 * @name degreesToRadians
 * @param {number} degrees angle between 0 and 360 degrees
 * @returns {number} angle in radians
 */
function degreesToRadians(degrees) {
    var radians = degrees % 360;
    return (radians * Math.PI) / 180;
}
/**
 * Converts a length to the requested unit.
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @param {number} length to be converted
 * @param {Units} [originalUnit="kilometers"] of the length
 * @param {Units} [finalUnit="kilometers"] returned unit
 * @returns {number} the converted length
 */
function convertLength(length, originalUnit, finalUnit) {
    if (originalUnit === void 0) { originalUnit = "kilometers"; }
    if (finalUnit === void 0) { finalUnit = "kilometers"; }
    if (!(length >= 0)) {
        throw new Error("length must be a positive number");
    }
    return radiansToLength(lengthToRadians(length, originalUnit), finalUnit);
}
/**
 * isNumber
 *
 * @param {*} num Number to validate
 * @returns {boolean} true/false
 * @example
 * turf.isNumber(123)
 * //=true
 * turf.isNumber('foo')
 * //=false
 */
function isNumber(num) {
    return !isNaN(num) && num !== null && !Array.isArray(num);
}

/**
 * Returns a cloned copy of the passed GeoJSON Object, including possible 'Foreign Members'.
 * ~3-5x faster than the common JSON.parse + JSON.stringify combo method.
 *
 * @name clone
 * @param {GeoJSON} geojson GeoJSON Object
 * @returns {GeoJSON} cloned GeoJSON Object
 * @example
 * var line = turf.lineString([[-74, 40], [-78, 42], [-82, 35]], {color: 'red'});
 *
 * var lineCloned = turf.clone(line);
 */
function clone(geojson) {
    if (!geojson) {
        throw new Error("geojson is required");
    }
    switch (geojson.type) {
        case "Feature":
            return cloneFeature(geojson);
        case "FeatureCollection":
            return cloneFeatureCollection(geojson);
        case "Point":
        case "LineString":
        case "Polygon":
        case "MultiPoint":
        case "MultiLineString":
        case "MultiPolygon":
        case "GeometryCollection":
            return cloneGeometry(geojson);
        default:
            throw new Error("unknown GeoJSON type");
    }
}
/**
 * Clone Feature
 *
 * @private
 * @param {Feature<any>} geojson GeoJSON Feature
 * @returns {Feature<any>} cloned Feature
 */
function cloneFeature(geojson) {
    var cloned = { type: "Feature" };
    // Preserve Foreign Members
    Object.keys(geojson).forEach(function (key) {
        switch (key) {
            case "type":
            case "properties":
            case "geometry":
                return;
            default:
                cloned[key] = geojson[key];
        }
    });
    // Add properties & geometry last
    cloned.properties = cloneProperties(geojson.properties);
    cloned.geometry = cloneGeometry(geojson.geometry);
    return cloned;
}
/**
 * Clone Properties
 *
 * @private
 * @param {Object} properties GeoJSON Properties
 * @returns {Object} cloned Properties
 */
function cloneProperties(properties) {
    var cloned = {};
    if (!properties) {
        return cloned;
    }
    Object.keys(properties).forEach(function (key) {
        var value = properties[key];
        if (typeof value === "object") {
            if (value === null) {
                // handle null
                cloned[key] = null;
            }
            else if (Array.isArray(value)) {
                // handle Array
                cloned[key] = value.map(function (item) {
                    return item;
                });
            }
            else {
                // handle generic Object
                cloned[key] = cloneProperties(value);
            }
        }
        else {
            cloned[key] = value;
        }
    });
    return cloned;
}
/**
 * Clone Feature Collection
 *
 * @private
 * @param {FeatureCollection<any>} geojson GeoJSON Feature Collection
 * @returns {FeatureCollection<any>} cloned Feature Collection
 */
function cloneFeatureCollection(geojson) {
    var cloned = { type: "FeatureCollection" };
    // Preserve Foreign Members
    Object.keys(geojson).forEach(function (key) {
        switch (key) {
            case "type":
            case "features":
                return;
            default:
                cloned[key] = geojson[key];
        }
    });
    // Add features
    cloned.features = geojson.features.map(function (feature) {
        return cloneFeature(feature);
    });
    return cloned;
}
/**
 * Clone Geometry
 *
 * @private
 * @param {Geometry<any>} geometry GeoJSON Geometry
 * @returns {Geometry<any>} cloned Geometry
 */
function cloneGeometry(geometry) {
    var geom = { type: geometry.type };
    if (geometry.bbox) {
        geom.bbox = geometry.bbox;
    }
    if (geometry.type === "GeometryCollection") {
        geom.geometries = geometry.geometries.map(function (g) {
            return cloneGeometry(g);
        });
        return geom;
    }
    geom.coordinates = deepSlice(geometry.coordinates);
    return geom;
}
/**
 * Deep Slice coordinates
 *
 * @private
 * @param {Coordinates} coords Coordinates
 * @returns {Coordinates} all coordinates sliced
 */
function deepSlice(coords) {
    var cloned = coords;
    if (typeof cloned[0] !== "object") {
        return cloned.slice();
    }
    return cloned.map(function (coord) {
        return deepSlice(coord);
    });
}

/**
 * Callback for coordEach
 *
 * @callback coordEachCallback
 * @param {Array<number>} currentCoord The current coordinate being processed.
 * @param {number} coordIndex The current index of the coordinate being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
 * @param {number} geometryIndex The current index of the Geometry being processed.
 */

/**
 * Iterate over coordinates in any GeoJSON object, similar to Array.forEach()
 *
 * @name coordEach
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentCoord, coordIndex, featureIndex, multiFeatureIndex)
 * @param {boolean} [excludeWrapCoord=false] whether or not to include the final coordinate of LinearRings that wraps the ring in its iteration.
 * @returns {void}
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {"foo": "bar"}),
 *   turf.point([36, 53], {"hello": "world"})
 * ]);
 *
 * turf.coordEach(features, function (currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
 *   //=currentCoord
 *   //=coordIndex
 *   //=featureIndex
 *   //=multiFeatureIndex
 *   //=geometryIndex
 * });
 */
function coordEach(geojson, callback, excludeWrapCoord) {
  // Handles null Geometry -- Skips this GeoJSON
  if (geojson === null) return;
  var j,
    k,
    l,
    geometry,
    stopG,
    coords,
    geometryMaybeCollection,
    wrapShrink = 0,
    coordIndex = 0,
    isGeometryCollection,
    type = geojson.type,
    isFeatureCollection = type === "FeatureCollection",
    isFeature = type === "Feature",
    stop = isFeatureCollection ? geojson.features.length : 1;

  // This logic may look a little weird. The reason why it is that way
  // is because it's trying to be fast. GeoJSON supports multiple kinds
  // of objects at its root: FeatureCollection, Features, Geometries.
  // This function has the responsibility of handling all of them, and that
  // means that some of the `for` loops you see below actually just don't apply
  // to certain inputs. For instance, if you give this just a
  // Point geometry, then both loops are short-circuited and all we do
  // is gradually rename the input until it's called 'geometry'.
  //
  // This also aims to allocate as few resources as possible: just a
  // few numbers and booleans, rather than any temporary arrays as would
  // be required with the normalization approach.
  for (var featureIndex = 0; featureIndex < stop; featureIndex++) {
    geometryMaybeCollection = isFeatureCollection
      ? geojson.features[featureIndex].geometry
      : isFeature
      ? geojson.geometry
      : geojson;
    isGeometryCollection = geometryMaybeCollection
      ? geometryMaybeCollection.type === "GeometryCollection"
      : false;
    stopG = isGeometryCollection
      ? geometryMaybeCollection.geometries.length
      : 1;

    for (var geomIndex = 0; geomIndex < stopG; geomIndex++) {
      var multiFeatureIndex = 0;
      var geometryIndex = 0;
      geometry = isGeometryCollection
        ? geometryMaybeCollection.geometries[geomIndex]
        : geometryMaybeCollection;

      // Handles null Geometry -- Skips this geometry
      if (geometry === null) continue;
      coords = geometry.coordinates;
      var geomType = geometry.type;

      wrapShrink =
        excludeWrapCoord &&
        (geomType === "Polygon" || geomType === "MultiPolygon")
          ? 1
          : 0;

      switch (geomType) {
        case null:
          break;
        case "Point":
          if (
            callback(
              coords,
              coordIndex,
              featureIndex,
              multiFeatureIndex,
              geometryIndex
            ) === false
          )
            return false;
          coordIndex++;
          multiFeatureIndex++;
          break;
        case "LineString":
        case "MultiPoint":
          for (j = 0; j < coords.length; j++) {
            if (
              callback(
                coords[j],
                coordIndex,
                featureIndex,
                multiFeatureIndex,
                geometryIndex
              ) === false
            )
              return false;
            coordIndex++;
            if (geomType === "MultiPoint") multiFeatureIndex++;
          }
          if (geomType === "LineString") multiFeatureIndex++;
          break;
        case "Polygon":
        case "MultiLineString":
          for (j = 0; j < coords.length; j++) {
            for (k = 0; k < coords[j].length - wrapShrink; k++) {
              if (
                callback(
                  coords[j][k],
                  coordIndex,
                  featureIndex,
                  multiFeatureIndex,
                  geometryIndex
                ) === false
              )
                return false;
              coordIndex++;
            }
            if (geomType === "MultiLineString") multiFeatureIndex++;
            if (geomType === "Polygon") geometryIndex++;
          }
          if (geomType === "Polygon") multiFeatureIndex++;
          break;
        case "MultiPolygon":
          for (j = 0; j < coords.length; j++) {
            geometryIndex = 0;
            for (k = 0; k < coords[j].length; k++) {
              for (l = 0; l < coords[j][k].length - wrapShrink; l++) {
                if (
                  callback(
                    coords[j][k][l],
                    coordIndex,
                    featureIndex,
                    multiFeatureIndex,
                    geometryIndex
                  ) === false
                )
                  return false;
                coordIndex++;
              }
              geometryIndex++;
            }
            multiFeatureIndex++;
          }
          break;
        case "GeometryCollection":
          for (j = 0; j < geometry.geometries.length; j++)
            if (
              coordEach(geometry.geometries[j], callback, excludeWrapCoord) ===
              false
            )
              return false;
          break;
        default:
          throw new Error("Unknown Geometry Type");
      }
    }
  }
}

/**
 * Callback for featureEach
 *
 * @callback featureEachCallback
 * @param {Feature<any>} currentFeature The current Feature being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 */

/**
 * Iterate over features in any GeoJSON object, similar to
 * Array.forEach.
 *
 * @name featureEach
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentFeature, featureIndex)
 * @returns {void}
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {foo: 'bar'}),
 *   turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.featureEach(features, function (currentFeature, featureIndex) {
 *   //=currentFeature
 *   //=featureIndex
 * });
 */
function featureEach(geojson, callback) {
  if (geojson.type === "Feature") {
    callback(geojson, 0);
  } else if (geojson.type === "FeatureCollection") {
    for (var i = 0; i < geojson.features.length; i++) {
      if (callback(geojson.features[i], i) === false) break;
    }
  }
}

/**
 * Get all coordinates from any GeoJSON object.
 *
 * @name coordAll
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @returns {Array<Array<number>>} coordinate position array
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {foo: 'bar'}),
 *   turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * var coords = turf.coordAll(features);
 * //= [[26, 37], [36, 53]]
 */
function coordAll(geojson) {
  var coords = [];
  coordEach(geojson, function (coord) {
    coords.push(coord);
  });
  return coords;
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var distance$1 = {
	/**
  * Euclidean distance
  */
	eudist: function eudist(v1, v2, sqrt) {
		var len = v1.length;
		var sum = 0;

		for (var i = 0; i < len; i++) {
			var d = (v1[i] || 0) - (v2[i] || 0);
			sum += d * d;
		}
		// Square root not really needed
		return sqrt ? Math.sqrt(sum) : sum;
	},
	mandist: function mandist(v1, v2, sqrt) {
		var len = v1.length;
		var sum = 0;

		for (var i = 0; i < len; i++) {
			sum += Math.abs((v1[i] || 0) - (v2[i] || 0));
		}

		// Square root not really needed
		return sqrt ? Math.sqrt(sum) : sum;
	},


	/**
  * Unidimensional distance
  */
	dist: function dist(v1, v2, sqrt) {
		var d = Math.abs(v1 - v2);
		return sqrt ? d : d * d;
	}
};

var Distance$1 = distance$1,
    eudist$1 = Distance$1.eudist,
    dist = Distance$1.dist;

var kinit = {
	kmrand: function kmrand(data, k) {
		var map = {},
		    ks = [],
		    t = k << 2;
		var len = data.length;
		var multi = data[0].length > 0;

		while (ks.length < k && t-- > 0) {
			var d = data[Math.floor(Math.random() * len)];
			var key = multi ? d.join("_") : "" + d;
			if (!map[key]) {
				map[key] = true;
				ks.push(d);
			}
		}

		if (ks.length < k) throw new Error("Error initializating clusters");else return ks;
	},


	/**
  * K-means++ initial centroid selection
  */
	kmpp: function kmpp(data, k) {
		var distance = data[0].length ? eudist$1 : dist;
		var ks = [],
		    len = data.length;
		var multi = data[0].length > 0;
		var map = {};

		// First random centroid
		var c = data[Math.floor(Math.random() * len)];
		var key = multi ? c.join("_") : "" + c;
		ks.push(c);
		map[key] = true;

		// Retrieve next centroids
		while (ks.length < k) {
			// Min Distances between current centroids and data points
			var dists = [],
			    lk = ks.length;
			var dsum = 0,
			    prs = [];

			for (var i = 0; i < len; i++) {
				var min = Infinity;
				for (var j = 0; j < lk; j++) {
					var _dist = distance(data[i], ks[j]);
					if (_dist <= min) min = _dist;
				}
				dists[i] = min;
			}

			// Sum all min distances
			for (var _i = 0; _i < len; _i++) {
				dsum += dists[_i];
			}

			// Probabilities and cummulative prob (cumsum)
			for (var _i2 = 0; _i2 < len; _i2++) {
				prs[_i2] = { i: _i2, v: data[_i2], pr: dists[_i2] / dsum, cs: 0 };
			}

			// Sort Probabilities
			prs.sort(function (a, b) {
				return a.pr - b.pr;
			});

			// Cummulative Probabilities
			prs[0].cs = prs[0].pr;
			for (var _i3 = 1; _i3 < len; _i3++) {
				prs[_i3].cs = prs[_i3 - 1].cs + prs[_i3].pr;
			}

			// Randomize
			var rnd = Math.random();

			// Gets only the items whose cumsum >= rnd
			var idx = 0;
			while (idx < len - 1 && prs[idx++].cs < rnd) {}
			ks.push(prs[idx - 1].v);
			/*
   let done = false;
   while(!done) {
   	// this is our new centroid
   	c = prs[idx-1].v
   	key = multi? c.join("_") : `${c}`;
   	if(!map[key]) {
   		map[key] = true;
   		ks.push(c);
   		done = true;
   	}
   	else {
   		idx++;
   	}
   }
   */
		}

		return ks;
	}
};

/*jshint esversion: 6 */

var Distance = distance$1,
    ClusterInit = kinit,
    eudist = Distance.eudist,
    kmrand = ClusterInit.kmrand,
    kmpp = ClusterInit.kmpp;

var MAX = 10000;

/**
 * Inits an array with values
 */
function init(len, val, v) {
	v = v || [];
	for (var i = 0; i < len; i++) {
		v[i] = val;
	}return v;
}

function skmeans(data, k, initial, maxit) {
	var ks = [],
	    old = [],
	    idxs = [],
	    dist = [];
	var conv = false,
	    it = maxit || MAX;
	var len = data.length,
	    vlen = data[0].length,
	    multi = vlen > 0;
	var count = [];

	if (!initial) {
		var _idxs = {};
		while (ks.length < k) {
			var idx = Math.floor(Math.random() * len);
			if (!_idxs[idx]) {
				_idxs[idx] = true;
				ks.push(data[idx]);
			}
		}
	} else if (initial == "kmrand") {
		ks = kmrand(data, k);
	} else if (initial == "kmpp") {
		ks = kmpp(data, k);
	} else {
		ks = initial;
	}

	do {
		// Reset k count
		init(k, 0, count);

		// For each value in data, find the nearest centroid
		for (var i = 0; i < len; i++) {
			var min = Infinity,
			    _idx = 0;
			for (var j = 0; j < k; j++) {
				// Multidimensional or unidimensional
				var dist = multi ? eudist(data[i], ks[j]) : Math.abs(data[i] - ks[j]);
				if (dist <= min) {
					min = dist;
					_idx = j;
				}
			}
			idxs[i] = _idx; // Index of the selected centroid for that value
			count[_idx]++; // Number of values for this centroid
		}

		// Recalculate centroids
		var sum = [],
		    old = [];
		for (var _j = 0; _j < k; _j++) {
			// Multidimensional or unidimensional
			sum[_j] = multi ? init(vlen, 0, sum[_j]) : 0;
			old[_j] = ks[_j];
		}

		// If multidimensional
		if (multi) {
			for (var _j2 = 0; _j2 < k; _j2++) {
				ks[_j2] = [];
			} // Sum values and count for each centroid
			for (var _i = 0; _i < len; _i++) {
				var _idx2 = idxs[_i],
				    // Centroid for that item
				vsum = sum[_idx2],
				    // Sum values for this centroid
				vect = data[_i]; // Current vector

				// Accumulate value on the centroid for current vector
				for (var h = 0; h < vlen; h++) {
					vsum[h] += vect[h];
				}
			}
			// Calculate the average for each centroid
			conv = true;
			for (var _j3 = 0; _j3 < k; _j3++) {
				var ksj = ks[_j3],
				    // Current centroid
				sumj = sum[_j3],
				    // Accumulated centroid values
				oldj = old[_j3],
				    // Old centroid value
				cj = count[_j3]; // Number of elements for this centroid

				// New average
				for (var _h = 0; _h < vlen; _h++) {
					ksj[_h] = sumj[_h] / cj || 0; // New centroid
				}

				// Find if centroids have moved
				if (conv) {
					for (var _h2 = 0; _h2 < vlen; _h2++) {
						if (oldj[_h2] != ksj[_h2]) {
							conv = false;
							break;
						}
					}
				}
			}
		}
		// If unidimensional
		else {
				// Sum values and count for each centroid
				for (var _i2 = 0; _i2 < len; _i2++) {
					var _idx3 = idxs[_i2];
					sum[_idx3] += data[_i2];
				}
				// Calculate the average for each centroid
				for (var _j4 = 0; _j4 < k; _j4++) {
					ks[_j4] = sum[_j4] / count[_j4] || 0; // New centroid
				}
				// Find if centroids have moved
				conv = true;
				for (var _j5 = 0; _j5 < k; _j5++) {
					if (old[_j5] != ks[_j5]) {
						conv = false;
						break;
					}
				}
			}

		conv = conv || --it <= 0;
	} while (!conv);

	return {
		it: MAX - it,
		k: k,
		idxs: idxs,
		centroids: ks
	};
}

var main = skmeans;

/**
 * Takes a set of {@link Point|points} and partition them into clusters using the k-mean .
 * It uses the [k-means algorithm](https://en.wikipedia.org/wiki/K-means_clustering)
 *
 * @name clustersKmeans
 * @param {FeatureCollection<Point>} points to be clustered
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.numberOfClusters=Math.sqrt(numberOfPoints/2)] numberOfClusters that will be generated
 * @param {boolean} [options.mutate=false] allows GeoJSON input to be mutated (significant performance increase if true)
 * @returns {FeatureCollection<Point>} Clustered Points with an additional two properties associated to each Feature:
 * - {number} cluster - the associated clusterId
 * - {[number, number]} centroid - Centroid of the cluster [Longitude, Latitude]
 * @example
 * // create random points with random z-values in their properties
 * var points = turf.randomPoint(100, {bbox: [0, 30, 20, 50]});
 * var options = {numberOfClusters: 7};
 * var clustered = turf.clustersKmeans(points, options);
 *
 * //addToMap
 * var addToMap = [clustered];
 */
function clustersKmeans(points, options) {
    if (options === void 0) { options = {}; }
    // Default Params
    var count = points.features.length;
    options.numberOfClusters =
        options.numberOfClusters || Math.round(Math.sqrt(count / 2));
    // numberOfClusters can't be greater than the number of points
    // fallbacks to count
    if (options.numberOfClusters > count)
        options.numberOfClusters = count;
    // Clone points to prevent any mutations (enabled by default)
    if (options.mutate !== true)
        points = clone(points);
    // collect points coordinates
    var data = coordAll(points);
    // create seed to avoid skmeans to drift
    var initialCentroids = data.slice(0, options.numberOfClusters);
    // create skmeans clusters
    var skmeansResult = main(data, options.numberOfClusters, initialCentroids);
    // store centroids {clusterId: [number, number]}
    var centroids = {};
    skmeansResult.centroids.forEach(function (coord, idx) {
        centroids[idx] = coord;
    });
    // add associated cluster number
    featureEach(points, function (point, index) {
        var clusterId = skmeansResult.idxs[index];
        point.properties.cluster = clusterId;
        point.properties.centroid = centroids[clusterId];
    });
    return points;
}

/**
 * Unwrap a coordinate from a Point Feature, Geometry or a single coordinate.
 *
 * @name getCoord
 * @param {Array<number>|Geometry<Point>|Feature<Point>} coord GeoJSON Point or an Array of numbers
 * @returns {Array<number>} coordinates
 * @example
 * var pt = turf.point([10, 10]);
 *
 * var coord = turf.getCoord(pt);
 * //= [10, 10]
 */
function getCoord(coord) {
    if (!coord) {
        throw new Error("coord is required");
    }
    if (!Array.isArray(coord)) {
        if (coord.type === "Feature" &&
            coord.geometry !== null &&
            coord.geometry.type === "Point") {
            return coord.geometry.coordinates;
        }
        if (coord.type === "Point") {
            return coord.coordinates;
        }
    }
    if (Array.isArray(coord) &&
        coord.length >= 2 &&
        !Array.isArray(coord[0]) &&
        !Array.isArray(coord[1])) {
        return coord;
    }
    throw new Error("coord must be GeoJSON Point or an Array of numbers");
}

//http://en.wikipedia.org/wiki/Haversine_formula
//http://www.movable-type.co.uk/scripts/latlong.html
/**
 * Calculates the distance between two {@link Point|points} in degrees, radians, miles, or kilometers.
 * This uses the [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula) to account for global curvature.
 *
 * @name distance
 * @param {Coord | Point} from origin point or coordinate
 * @param {Coord | Point} to destination point or coordinate
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] can be degrees, radians, miles, or kilometers
 * @returns {number} distance between the two points
 * @example
 * var from = turf.point([-75.343, 39.984]);
 * var to = turf.point([-75.534, 39.123]);
 * var options = {units: 'miles'};
 *
 * var distance = turf.distance(from, to, options);
 *
 * //addToMap
 * var addToMap = [from, to];
 * from.properties.distance = distance;
 * to.properties.distance = distance;
 */
function distance(from, to, options) {
    if (options === void 0) { options = {}; }
    var coordinates1 = getCoord(from);
    var coordinates2 = getCoord(to);
    var dLat = degreesToRadians(coordinates2[1] - coordinates1[1]);
    var dLon = degreesToRadians(coordinates2[0] - coordinates1[0]);
    var lat1 = degreesToRadians(coordinates1[1]);
    var lat2 = degreesToRadians(coordinates2[1]);
    var a = Math.pow(Math.sin(dLat / 2), 2) +
        Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
    return radiansToLength(2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)), options.units);
}

var lib = {exports: {}};

var DBSCAN = {exports: {}};

/**
 * DBSCAN - Density based clustering
 *
 * @author Lukasz Krawczyk <contact@lukaszkrawczyk.eu>
 * @copyright MIT
 */

(function (module) {
/**
 * DBSCAN class construcotr
 * @constructor
 *
 * @param {Array} dataset
 * @param {number} epsilon
 * @param {number} minPts
 * @param {function} distanceFunction
 * @returns {DBSCAN}
 */
function DBSCAN(dataset, epsilon, minPts, distanceFunction) {
  /** @type {Array} */
  this.dataset = [];
  /** @type {number} */
  this.epsilon = 1;
  /** @type {number} */
  this.minPts = 2;
  /** @type {function} */
  this.distance = this._euclideanDistance;
  /** @type {Array} */
  this.clusters = [];
  /** @type {Array} */
  this.noise = [];

  // temporary variables used during computation

  /** @type {Array} */
  this._visited = [];
  /** @type {Array} */
  this._assigned = [];
  /** @type {number} */
  this._datasetLength = 0;

  this._init(dataset, epsilon, minPts, distanceFunction);
}
/******************************************************************************/
// public functions

/**
 * Start clustering
 *
 * @param {Array} dataset
 * @param {number} epsilon
 * @param {number} minPts
 * @param {function} distanceFunction
 * @returns {undefined}
 * @access public
 */
DBSCAN.prototype.run = function(dataset, epsilon, minPts, distanceFunction) {
  this._init(dataset, epsilon, minPts, distanceFunction);

  for (var pointId = 0; pointId < this._datasetLength; pointId++) {
    // if point is not visited, check if it forms a cluster
    if (this._visited[pointId] !== 1) {
      this._visited[pointId] = 1;

      // if closest neighborhood is too small to form a cluster, mark as noise
      var neighbors = this._regionQuery(pointId);

      if (neighbors.length < this.minPts) {
        this.noise.push(pointId);
      } else {
        // create new cluster and add point
        var clusterId = this.clusters.length;
        this.clusters.push([]);
        this._addToCluster(pointId, clusterId);

        this._expandCluster(clusterId, neighbors);
      }
    }
  }

  return this.clusters;
};

/******************************************************************************/
// protected functions

/**
 * Set object properties
 *
 * @param {Array} dataset
 * @param {number} epsilon
 * @param {number} minPts
 * @param {function} distance
 * @returns {undefined}
 * @access protected
 */
DBSCAN.prototype._init = function(dataset, epsilon, minPts, distance) {

  if (dataset) {

    if (!(dataset instanceof Array)) {
      throw Error('Dataset must be of type array, ' +
        typeof dataset + ' given');
    }

    this.dataset = dataset;
    this.clusters = [];
    this.noise = [];

    this._datasetLength = dataset.length;
    this._visited = new Array(this._datasetLength);
    this._assigned = new Array(this._datasetLength);
  }

  if (epsilon) {
    this.epsilon = epsilon;
  }

  if (minPts) {
    this.minPts = minPts;
  }

  if (distance) {
    this.distance = distance;
  }
};

/**
 * Expand cluster to closest points of given neighborhood
 *
 * @param {number} clusterId
 * @param {Array} neighbors
 * @returns {undefined}
 * @access protected
 */
DBSCAN.prototype._expandCluster = function(clusterId, neighbors) {

  /**
   * It's very important to calculate length of neighbors array each time,
   * as the number of elements changes over time
   */
  for (var i = 0; i < neighbors.length; i++) {
    var pointId2 = neighbors[i];

    if (this._visited[pointId2] !== 1) {
      this._visited[pointId2] = 1;
      var neighbors2 = this._regionQuery(pointId2);

      if (neighbors2.length >= this.minPts) {
        neighbors = this._mergeArrays(neighbors, neighbors2);
      }
    }

    // add to cluster
    if (this._assigned[pointId2] !== 1) {
      this._addToCluster(pointId2, clusterId);
    }
  }
};

/**
 * Add new point to cluster
 *
 * @param {number} pointId
 * @param {number} clusterId
 */
DBSCAN.prototype._addToCluster = function(pointId, clusterId) {
  this.clusters[clusterId].push(pointId);
  this._assigned[pointId] = 1;
};

/**
 * Find all neighbors around given point
 *
 * @param {number} pointId,
 * @param {number} epsilon
 * @returns {Array}
 * @access protected
 */
DBSCAN.prototype._regionQuery = function(pointId) {
  var neighbors = [];

  for (var id = 0; id < this._datasetLength; id++) {
    var dist = this.distance(this.dataset[pointId], this.dataset[id]);
    if (dist < this.epsilon) {
      neighbors.push(id);
    }
  }

  return neighbors;
};

/******************************************************************************/
// helpers

/**
 * @param {Array} a
 * @param {Array} b
 * @returns {Array}
 * @access protected
 */
DBSCAN.prototype._mergeArrays = function(a, b) {
  var len = b.length;

  for (var i = 0; i < len; i++) {
    var P = b[i];
    if (a.indexOf(P) < 0) {
      a.push(P);
    }
  }

  return a;
};

/**
 * Calculate euclidean distance in multidimensional space
 *
 * @param {Array} p
 * @param {Array} q
 * @returns {number}
 * @access protected
 */
DBSCAN.prototype._euclideanDistance = function(p, q) {
  var sum = 0;
  var i = Math.min(p.length, q.length);

  while (i--) {
    sum += (p[i] - q[i]) * (p[i] - q[i]);
  }

  return Math.sqrt(sum);
};

if (module.exports) {
  module.exports = DBSCAN;
}
}(DBSCAN));

var KMEANS = {exports: {}};

(function (module) {
/**
 * KMEANS clustering
 *
 * @author Lukasz Krawczyk <contact@lukaszkrawczyk.eu>
 * @copyright MIT
 */

/**
 * KMEANS class constructor
 * @constructor
 *
 * @param {Array} dataset
 * @param {number} k - number of clusters
 * @param {function} distance - distance function
 * @returns {KMEANS}
 */
 function KMEANS(dataset, k, distance) {
  this.k = 3; // number of clusters
  this.dataset = []; // set of feature vectors
  this.assignments = []; // set of associated clusters for each feature vector
  this.centroids = []; // vectors for our clusters

  this.init(dataset, k, distance);
}

/**
 * @returns {undefined}
 */
KMEANS.prototype.init = function(dataset, k, distance) {
  this.assignments = [];
  this.centroids = [];

  if (typeof dataset !== 'undefined') {
    this.dataset = dataset;
  }

  if (typeof k !== 'undefined') {
    this.k = k;
  }

  if (typeof distance !== 'undefined') {
    this.distance = distance;
  }
};

/**
 * @returns {undefined}
 */
KMEANS.prototype.run = function(dataset, k) {
  this.init(dataset, k);

  var len = this.dataset.length;

  // initialize centroids
  for (var i = 0; i < this.k; i++) {
    this.centroids[i] = this.randomCentroid();
	}

  var change = true;
  while(change) {

    // assign feature vectors to clusters
    change = this.assign();

    // adjust location of centroids
    for (var centroidId = 0; centroidId < this.k; centroidId++) {
      var mean = new Array(maxDim);
      var count = 0;

      // init mean vector
      for (var dim = 0; dim < maxDim; dim++) {
        mean[dim] = 0;
      }

      for (var j = 0; j < len; j++) {
        var maxDim = this.dataset[j].length;

        // if current cluster id is assigned to point
        if (centroidId === this.assignments[j]) {
          for (var dim = 0; dim < maxDim; dim++) {
            mean[dim] += this.dataset[j][dim];
          }
          count++;
        }
      }

      if (count > 0) {
        // if cluster contain points, adjust centroid position
        for (var dim = 0; dim < maxDim; dim++) {
          mean[dim] /= count;
        }
        this.centroids[centroidId] = mean;
      } else {
        // if cluster is empty, generate new random centroid
        this.centroids[centroidId] = this.randomCentroid();
        change = true;
      }
    }
  }

  return this.getClusters();
};

/**
 * Generate random centroid
 *
 * @returns {Array}
 */
KMEANS.prototype.randomCentroid = function() {
  var maxId = this.dataset.length -1;
  var centroid;
  var id;

  do {
    id = Math.round(Math.random() * maxId);
    centroid = this.dataset[id];
  } while (this.centroids.indexOf(centroid) >= 0);

  return centroid;
};

/**
 * Assign points to clusters
 *
 * @returns {boolean}
 */
KMEANS.prototype.assign = function() {
  var change = false;
  var len = this.dataset.length;
  var closestCentroid;

  for (var i = 0; i < len; i++) {
    closestCentroid = this.argmin(this.dataset[i], this.centroids, this.distance);

    if (closestCentroid != this.assignments[i]) {
      this.assignments[i] = closestCentroid;
      change = true;
    }
  }

  return change;
};

/**
 * Extract information about clusters
 *
 * @returns {undefined}
 */
KMEANS.prototype.getClusters = function() {
  var clusters = new Array(this.k);
  var centroidId;

  for (var pointId = 0; pointId < this.assignments.length; pointId++) {
    centroidId = this.assignments[pointId];

    // init empty cluster
    if (typeof clusters[centroidId] === 'undefined') {
      clusters[centroidId] = [];
    }

    clusters[centroidId].push(pointId);
  }

  return clusters;
};

// utils

/**
 * @params {Array} point
 * @params {Array.<Array>} set
 * @params {Function} f
 * @returns {number}
 */
KMEANS.prototype.argmin = function(point, set, f) {
  var min = Number.MAX_VALUE;
  var arg = 0;
  var len = set.length;
  var d;

  for (var i = 0; i < len; i++) {
    d = f(point, set[i]);
    if (d < min) {
      min = d;
      arg = i;
    }
  }

  return arg;
};

/**
 * Euclidean distance
 *
 * @params {number} p
 * @params {number} q
 * @returns {number}
 */
KMEANS.prototype.distance = function(p, q) {
  var sum = 0;
  var i = Math.min(p.length, q.length);

  while (i--) {
    var diff = p[i] - q[i];
    sum += diff * diff;
  }

  return Math.sqrt(sum);
};

if (module.exports) {
  module.exports = KMEANS;
}
}(KMEANS));

var OPTICS = {exports: {}};

var PriorityQueue = {exports: {}};

/**
 * PriorityQueue
 * Elements in this queue are sorted according to their value
 *
 * @author Lukasz Krawczyk <contact@lukaszkrawczyk.eu>
 * @copyright MIT
 */

(function (module) {
/**
 * PriorityQueue class construcotr
 * @constructor
 *
 * @example
 * queue: [1,2,3,4]
 * priorities: [4,1,2,3]
 * > result = [1,4,2,3]
 *
 * @param {Array} elements
 * @param {Array} priorities
 * @param {string} sorting - asc / desc
 * @returns {PriorityQueue}
 */
function PriorityQueue(elements, priorities, sorting) {
  /** @type {Array} */
  this._queue = [];
  /** @type {Array} */
  this._priorities = [];
  /** @type {string} */
  this._sorting = 'desc';

  this._init(elements, priorities, sorting);
}
/**
 * Insert element
 *
 * @param {Object} ele
 * @param {Object} priority
 * @returns {undefined}
 * @access public
 */
PriorityQueue.prototype.insert = function(ele, priority) {
  var indexToInsert = this._queue.length;
  var index = indexToInsert;

  while (index--) {
    var priority2 = this._priorities[index];
    if (this._sorting === 'desc') {
      if (priority > priority2) {
        indexToInsert = index;
      }
    } else {
      if (priority < priority2) {
        indexToInsert = index;
      }
    }
  }

  this._insertAt(ele, priority, indexToInsert);
};

/**
 * Remove element
 *
 * @param {Object} ele
 * @returns {undefined}
 * @access public
 */
PriorityQueue.prototype.remove = function(ele) {
  var index = this._queue.length;

  while (index--) {
    var ele2 = this._queue[index];
    if (ele === ele2) {
      this._queue.splice(index, 1);
      this._priorities.splice(index, 1);
      break;
    }
  }
};

/**
 * For each loop wrapper
 *
 * @param {function} func
 * @returs {undefined}
 * @access public
 */
PriorityQueue.prototype.forEach = function(func) {
  this._queue.forEach(func);
};

/**
 * @returns {Array}
 * @access public
 */
PriorityQueue.prototype.getElements = function() {
  return this._queue;
};

/**
 * @param {number} index
 * @returns {Object}
 * @access public
 */
PriorityQueue.prototype.getElementPriority = function(index) {
  return this._priorities[index];
};

/**
 * @returns {Array}
 * @access public
 */
PriorityQueue.prototype.getPriorities = function() {
  return this._priorities;
};

/**
 * @returns {Array}
 * @access public
 */
PriorityQueue.prototype.getElementsWithPriorities = function() {
  var result = [];

  for (var i = 0, l = this._queue.length; i < l; i++) {
    result.push([this._queue[i], this._priorities[i]]);
  }

  return result;
};

/**
 * Set object properties
 *
 * @param {Array} elements
 * @param {Array} priorities
 * @returns {undefined}
 * @access protected
 */
PriorityQueue.prototype._init = function(elements, priorities, sorting) {

  if (elements && priorities) {
    this._queue = [];
    this._priorities = [];

    if (elements.length !== priorities.length) {
      throw new Error('Arrays must have the same length');
    }

    for (var i = 0; i < elements.length; i++) {
      this.insert(elements[i], priorities[i]);
    }
  }

  if (sorting) {
    this._sorting = sorting;
  }
};

/**
 * Insert element at given position
 *
 * @param {Object} ele
 * @param {number} index
 * @returns {undefined}
 * @access protected
 */
PriorityQueue.prototype._insertAt = function(ele, priority, index) {
  if (this._queue.length === index) {
    this._queue.push(ele);
    this._priorities.push(priority);
  } else {
    this._queue.splice(index, 0, ele);
    this._priorities.splice(index, 0, priority);
  }
};

if (module.exports) {
  module.exports = PriorityQueue;
}
}(PriorityQueue));

(function (module) {
/**
 * @requires ./PriorityQueue.js
 */

if (module.exports) {
      var PriorityQueue$1 = PriorityQueue.exports;
}

/**
 * OPTICS - Ordering points to identify the clustering structure
 *
 * @author Lukasz Krawczyk <contact@lukaszkrawczyk.eu>
 * @copyright MIT
 */

/**
 * OPTICS class constructor
 * @constructor
 *
 * @param {Array} dataset
 * @param {number} epsilon
 * @param {number} minPts
 * @param {function} distanceFunction
 * @returns {OPTICS}
 */
function OPTICS(dataset, epsilon, minPts, distanceFunction) {
  /** @type {number} */
  this.epsilon = 1;
  /** @type {number} */
  this.minPts = 1;
  /** @type {function} */
  this.distance = this._euclideanDistance;

  // temporary variables used during computation

  /** @type {Array} */
  this._reachability = [];
  /** @type {Array} */
  this._processed = [];
  /** @type {number} */
  this._coreDistance = 0;
  /** @type {Array} */
  this._orderedList = [];

  this._init(dataset, epsilon, minPts, distanceFunction);
}

/******************************************************************************/
// pulic functions

/**
 * Start clustering
 *
 * @param {Array} dataset
 * @returns {undefined}
 * @access public
 */
OPTICS.prototype.run = function(dataset, epsilon, minPts, distanceFunction) {
  this._init(dataset, epsilon, minPts, distanceFunction);

  for (var pointId = 0, l = this.dataset.length; pointId < l; pointId++) {
    if (this._processed[pointId] !== 1) {
      this._processed[pointId] = 1;
      this.clusters.push([pointId]);
      var clusterId = this.clusters.length - 1;

      this._orderedList.push(pointId);
      var priorityQueue = new PriorityQueue$1(null, null, 'asc');
      var neighbors = this._regionQuery(pointId);

      // using priority queue assign elements to new cluster
      if (this._distanceToCore(pointId) !== undefined) {
        this._updateQueue(pointId, neighbors, priorityQueue);
        this._expandCluster(clusterId, priorityQueue);
      }
    }
  }

  return this.clusters;
};

/**
 * Generate reachability plot for all points
 *
 * @returns {array}
 * @access public
 */
OPTICS.prototype.getReachabilityPlot = function() {
  var reachabilityPlot = [];

  for (var i = 0, l = this._orderedList.length; i < l; i++) {
    var pointId = this._orderedList[i];
    var distance = this._reachability[pointId];

    reachabilityPlot.push([pointId, distance]);
  }

  return reachabilityPlot;
};

/******************************************************************************/
// protected functions

/**
 * Set object properties
 *
 * @param {Array} dataset
 * @param {number} epsilon
 * @param {number} minPts
 * @param {function} distance
 * @returns {undefined}
 * @access protected
 */
OPTICS.prototype._init = function(dataset, epsilon, minPts, distance) {

  if (dataset) {

    if (!(dataset instanceof Array)) {
      throw Error('Dataset must be of type array, ' +
        typeof dataset + ' given');
    }

    this.dataset = dataset;
    this.clusters = [];
    this._reachability = new Array(this.dataset.length);
    this._processed = new Array(this.dataset.length);
    this._coreDistance = 0;
    this._orderedList = [];
  }

  if (epsilon) {
    this.epsilon = epsilon;
  }

  if (minPts) {
    this.minPts = minPts;
  }

  if (distance) {
    this.distance = distance;
  }
};

/**
 * Update information in queue
 *
 * @param {number} pointId
 * @param {Array} neighbors
 * @param {PriorityQueue} queue
 * @returns {undefined}
 * @access protected
 */
OPTICS.prototype._updateQueue = function(pointId, neighbors, queue) {
  var self = this;

  this._coreDistance = this._distanceToCore(pointId);
  neighbors.forEach(function(pointId2) {
    if (self._processed[pointId2] === undefined) {
      var dist = self.distance(self.dataset[pointId], self.dataset[pointId2]);
      var newReachableDistance = Math.max(self._coreDistance, dist);

      if (self._reachability[pointId2] === undefined) {
        self._reachability[pointId2] = newReachableDistance;
        queue.insert(pointId2, newReachableDistance);
      } else {
        if (newReachableDistance < self._reachability[pointId2]) {
          self._reachability[pointId2] = newReachableDistance;
          queue.remove(pointId2);
          queue.insert(pointId2, newReachableDistance);
        }
      }
    }
  });
};

/**
 * Expand cluster
 *
 * @param {number} clusterId
 * @param {PriorityQueue} queue
 * @returns {undefined}
 * @access protected
 */
OPTICS.prototype._expandCluster = function(clusterId, queue) {
  var queueElements = queue.getElements();

  for (var p = 0, l = queueElements.length; p < l; p++) {
    var pointId = queueElements[p];
    if (this._processed[pointId] === undefined) {
      var neighbors = this._regionQuery(pointId);
      this._processed[pointId] = 1;

      this.clusters[clusterId].push(pointId);
      this._orderedList.push(pointId);

      if (this._distanceToCore(pointId) !== undefined) {
        this._updateQueue(pointId, neighbors, queue);
        this._expandCluster(clusterId, queue);
      }
    }
  }
};

/**
 * Calculating distance to cluster core
 *
 * @param {number} pointId
 * @returns {number}
 * @access protected
 */
OPTICS.prototype._distanceToCore = function(pointId) {
  var l = this.epsilon;
  for (var coreDistCand = 0; coreDistCand < l; coreDistCand++) {
    var neighbors = this._regionQuery(pointId, coreDistCand);
    if (neighbors.length >= this.minPts) {
      return coreDistCand;
    }
  }

  return;
};

/**
 * Find all neighbors around given point
 *
 * @param {number} pointId
 * @param {number} epsilon
 * @returns {Array}
 * @access protected
 */
OPTICS.prototype._regionQuery = function(pointId, epsilon) {
  epsilon = epsilon || this.epsilon;
  var neighbors = [];

  for (var id = 0, l = this.dataset.length; id < l; id++) {
    if (this.distance(this.dataset[pointId], this.dataset[id]) < epsilon) {
      neighbors.push(id);
    }
  }

  return neighbors;
};

/******************************************************************************/
// helpers

/**
 * Calculate euclidean distance in multidimensional space
 *
 * @param {Array} p
 * @param {Array} q
 * @returns {number}
 * @access protected
 */
OPTICS.prototype._euclideanDistance = function(p, q) {
  var sum = 0;
  var i = Math.min(p.length, q.length);

  while (i--) {
    sum += (p[i] - q[i]) * (p[i] - q[i]);
  }

  return Math.sqrt(sum);
};

if (module.exports) {
  module.exports = OPTICS;
}
}(OPTICS));

(function (module) {
if (module.exports) {
    module.exports = {
      DBSCAN: DBSCAN.exports,
      KMEANS: KMEANS.exports,
      OPTICS: OPTICS.exports,
      PriorityQueue: PriorityQueue.exports
    };
}
}(lib));

var clustering = lib.exports;

/**
 * Takes a set of {@link Point|points} and partition them into clusters according to {@link DBSCAN's|https://en.wikipedia.org/wiki/DBSCAN} data clustering algorithm.
 *
 * @name clustersDbscan
 * @param {FeatureCollection<Point>} points to be clustered
 * @param {number} maxDistance Maximum Distance between any point of the cluster to generate the clusters (kilometers only)
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units="kilometers"] in which `maxDistance` is expressed, can be degrees, radians, miles, or kilometers
 * @param {boolean} [options.mutate=false] Allows GeoJSON input to be mutated
 * @param {number} [options.minPoints=3] Minimum number of points to generate a single cluster,
 * points which do not meet this requirement will be classified as an 'edge' or 'noise'.
 * @returns {FeatureCollection<Point>} Clustered Points with an additional two properties associated to each Feature:
 * - {number} cluster - the associated clusterId
 * - {string} dbscan - type of point it has been classified as ('core'|'edge'|'noise')
 * @example
 * // create random points with random z-values in their properties
 * var points = turf.randomPoint(100, {bbox: [0, 30, 20, 50]});
 * var maxDistance = 100;
 * var clustered = turf.clustersDbscan(points, maxDistance);
 *
 * //addToMap
 * var addToMap = [clustered];
 */
function clustersDbscan(points, maxDistance, options) {
    // Input validation being handled by Typescript
    // collectionOf(points, 'Point', 'points must consist of a FeatureCollection of only Points');
    // if (maxDistance === null || maxDistance === undefined) throw new Error('maxDistance is required');
    // if (!(Math.sign(maxDistance) > 0)) throw new Error('maxDistance is invalid');
    // if (!(minPoints === undefined || minPoints === null || Math.sign(minPoints) > 0)) throw new Error('options.minPoints is invalid');
    if (options === void 0) { options = {}; }
    // Clone points to prevent any mutations
    if (options.mutate !== true)
        points = clone(points);
    // Defaults
    options.minPoints = options.minPoints || 3;
    // create clustered ids
    var dbscan = new clustering.DBSCAN();
    var clusteredIds = dbscan.run(coordAll(points), convertLength(maxDistance, options.units), options.minPoints, distance);
    // Tag points to Clusters ID
    var clusterId = -1;
    clusteredIds.forEach(function (clusterIds) {
        clusterId++;
        // assign cluster ids to input points
        clusterIds.forEach(function (idx) {
            var clusterPoint = points.features[idx];
            if (!clusterPoint.properties)
                clusterPoint.properties = {};
            clusterPoint.properties.cluster = clusterId;
            clusterPoint.properties.dbscan = "core";
        });
    });
    // handle noise points, if any
    // edges points are tagged by DBSCAN as both 'noise' and 'cluster' as they can "reach" less than 'minPoints' number of points
    dbscan.noise.forEach(function (noiseId) {
        var noisePoint = points.features[noiseId];
        if (!noisePoint.properties)
            noisePoint.properties = {};
        if (noisePoint.properties.cluster)
            noisePoint.properties.dbscan = "edge";
        else
            noisePoint.properties.dbscan = "noise";
    });
    return points;
}

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
}(kdbush));

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
        return Math.max(this.options.minZoom, Math.min(+z, this.options.maxZoom + 1));
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

var es6 = function equal(a, b) {
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


    if ((a instanceof Map) && (b instanceof Map)) {
      if (a.size !== b.size) return false;
      for (i of a.entries())
        if (!b.has(i[0])) return false;
      for (i of a.entries())
        if (!equal(i[1], b.get(i[0]))) return false;
      return true;
    }

    if ((a instanceof Set) && (b instanceof Set)) {
      if (a.size !== b.size) return false;
      for (i of a.entries())
        if (!b.has(i[0])) return false;
      return true;
    }

    if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (a[i] !== b[i]) return false;
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
    constructor({ apiKey, channel, client, id = DEFAULT_ID, libraries = [], language, region, version, mapIds, nonce, retries = 3, url = "https://maps.googleapis.com/maps/api/js", }) {
        this.CALLBACK = "__googleMapsCallback";
        this.callbacks = [];
        this.done = false;
        this.loading = false;
        this.errors = [];
        this.version = version;
        this.apiKey = apiKey;
        this.channel = channel;
        this.client = client;
        this.id = id || DEFAULT_ID; // Do not allow empty string
        this.libraries = libraries;
        this.language = language;
        this.region = region;
        this.mapIds = mapIds;
        this.nonce = nonce;
        this.retries = retries;
        this.url = url;
        if (Loader.instance) {
            if (!fastDeepEqual(this.options, Loader.instance.options)) {
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

export { Loader as L, Supercluster as S, __rest as _, clustersDbscan as a, clustersKmeans as c, es6 as e, featureCollection as f, point as p };
