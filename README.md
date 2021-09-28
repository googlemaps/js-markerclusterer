# Google Maps JavaScript MarkerClusterer

[![npm](https://img.shields.io/npm/v/@googlemaps/markerclusterer)](https://www.npmjs.com/package/@googlemaps/markerclusterer)
![Build](https://github.com/googlemaps/js-markerclusterer/workflows/Build/badge.svg)
![Release](https://github.com/googlemaps/js-markerclusterer/workflows/Release/badge.svg)
[![codecov](https://codecov.io/gh/googlemaps/js-markerclusterer/branch/main/graph/badge.svg)](https://codecov.io/gh/googlemaps/js-markerclusterer)
![GitHub contributors](https://img.shields.io/github/contributors/googlemaps/js-markerclusterer?color=green)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![](https://github.com/jpoehnelt/in-solidarity-bot/raw/main/static//badge-flat.png)](https://github.com/apps/in-solidarity)

## Description

The library creates and manages per-zoom-level clusters for large amounts of markers.

![screenshot](https://user-images.githubusercontent.com/3392975/135143029-20abd824-0f3e-4e28-bad3-327acf7aec04.png)

See the [history section](#history) for how this library relates to [@google/markerclusterer][@google/markerclusterer] and [@googlemaps/markerclustererplus][@googlemaps/markerclustererplus].

## Install

Available via npm as the package [@googlemaps/markerclusterer](https://www.npmjs.com/package/@googlemaps/markerclusterer).

```
npm i @googlemaps/markerclusterer
```

or

```sh
yarn add @googlemaps/markerclusterer
```

Alternativly you may add the umd package directly to the html document using the unpkg link.

```html
<script src="https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js"></script>
```

When adding via unpkg, the `MarkerClusterer` can be accessed at `markerclusterer.MarkerClusterer`.

A version can be specified by using

```
https://unpkg.com/@googlemaps/markerclusterer@VERSION/dist/...
```

#### TypeScript

This library uses the official TypeScript typings for Google Maps Platform, [@types/google.maps](https://www.npmjs.com/package/@types/google.maps).

```sh
npm i -D @types/google.maps
```

## Documentation

The [reference documentation](https://googlemaps.github.io/js-markerclusterer/) is generated from the TypeScript definitions.

## Example

```js
import { MarkerClusterer } from "@googlemaps/markerclusterer";

// use default algorithm and renderer
const markerCluster = new MarkerClusterer({ map, markers });
```

View the package in action:

- [Algorithms](https://googlemaps.github.io/js-markerclusterer/public/algorithms)
- [Renderer Usage](https://googlemaps.github.io/js-markerclusterer/public/renderers)

## History

This library has a heritage in [@google/markerclusterer][@google/markerclusterer] and [@googlemaps/markerclustererplus][@googlemaps/markerclustererplus], originally made available on [code.google.com](https://code.google.com/archive/) and then transferred to GitHub at https://github.com/googlemaps/v3-utility-library. The following is an approximate timeline.

- 201X - [@google/markerclusterer][@google/markerclusterer] was created.
- 201X - [@googlemaps/markerclustererplus][@googlemaps/markerclustererplus] was created.
- 2019 - Libraries were published to NPM.
- 2019 - [@google/markerclusterer][@google/markerclusterer] was deprecated for [@googlemaps/markerclustererplus][@googlemaps/markerclustererplus].
- 2020 - [@googlemaps/markerclustererplus][@googlemaps/markerclustererplus] was refactored to TypeScript.
- 2020 - [@googlemaps/markerclustererplus][@googlemaps/markerclustererplus] was moved to a separate repository.
- 2021 - [@googlemaps/markerclustererplus][@googlemaps/markerclustererplus] was rewritten as [@googlemaps/markerclusterer (**new**)][@googlemaps/markerclusterer].
- TBD - [@googlemaps/markerclustererplus][@googlemaps/markerclustererplus] is deprecated for [@googlemaps/markerclusterer (**new**)][@googlemaps/markerclusterer].

## Migration

The API of @googlemaps/markerclustererplus has changed in a number of ways from [@googlemaps/markerclustererplus][@googlemaps/markerclustererplus].

- The `MarkerClusterer` class now accepts an algorithm and renderer parameter to allow for more flexibility. The interface looks like the following:

```js
{
    algorithm?: Algorithm;
    map?: google.maps.Map;
    markers?: google.maps.Marker[];
    renderer?: Renderer;
    onClusterClick?: onClusterClickHandler;
  }
```

- The `MarkerClusterer` accepts a single options argument instead of positional parameters.
- The traditional `GridAlgorithm` is still supported, **but is not the default**.
- Styling of clusters has been simplifed and moved to the renderer interface.
- The `MarkerClusterer` class is still an instance of `google.maps.OverlayView`, but uses `google.maps.Marker`s instead of `google.maps.Overlay` to render the clusters. This solves issues related to the usage of map panes and click handlers.
- @googlemaps/markerclusterer supports Marker and Map [a11y improvements](https://cloud.google.com/blog/products/maps-platform/improved-accessibility-maps-javascript-api).

[@googlemaps/markerclustererplus]: https://www.npmjs.com/package/@googlemaps/markerclustererplus
[@google/markerclusterer]: https://www.npmjs.com/package/@google/markerclusterer
[@googlemaps/markerclusterer]: https://www.npmjs.com/package/@googlemaps/markerclusterer
