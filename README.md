[![npm](https://img.shields.io/npm/v/@googlemaps/markerclusterer)][npm-pkg]
![Release](https://github.com/googlemaps/js-markerclusterer/workflows/Release/badge.svg)
![Stable](https://img.shields.io/badge/stability-stable-green)
[![Tests/Build](https://github.com/googlemaps/js-markerclusterer/actions/workflows/test.yml/badge.svg)](https://github.com/googlemaps/js-markerclusterer/actions/workflows/test.yml)

[![codecov](https://codecov.io/gh/googlemaps/js-markerclusterer/branch/main/graph/badge.svg)](https://codecov.io/gh/googlemaps/js-markerclusterer)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![solidarity](https://github.com/jpoehnelt/in-solidarity-bot/raw/main/static//badge-flat.png)](https://github.com/apps/in-solidarity)

![Contributors](https://img.shields.io/github/contributors/googlemaps/js-markerclusterer?color=green)
[![License](https://img.shields.io/github/license/googlemaps/js-markerclusterer?color=blue)][license]
[![StackOverflow](https://img.shields.io/stackexchange/stackoverflow/t/google-maps?color=orange&label=google-maps&logo=stackoverflow)](https://stackoverflow.com/questions/tagged/google-maps)
[![Discord](https://img.shields.io/discord/676948200904589322?color=6A7EC2&logo=discord&logoColor=ffffff)][Discord server]

# Google Maps JavaScript MarkerClusterer

## Description

The library creates and manages per-zoom-level clusters for large amounts of markers.

[**Try the demo**](https://googlemaps.github.io/js-markerclusterer/public/defaults/)

![screenshot](https://user-images.githubusercontent.com/3392975/135143029-20abd824-0f3e-4e28-bad3-327acf7aec04.png)

See the [history section](#history) and [migration section](#migration) for how this library relates to [@google/markerclusterer][@google/markerclusterer] and [@googlemaps/markerclustererplus][@googlemaps/markerclustererplus].

## Requirements

- [Sign up with Google Maps Platform]
- A Google Maps Platform [project] with the [**Maps Javascript API**][maps-sdk] enabled
- An [API key] associated with the project above
- [@googlemaps/markerclusterer NPM package][npm-pkg]

## Installation

Install the [@googlemaps/markerclusterer NPM package][npm-pkg] with:

```
npm i @googlemaps/markerclusterer
```

Alternativly you may add the umd package directly to the html document using the unpkg link.

```html
<script src="https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js"></script>
```

When adding via unpkg, the `MarkerClusterer` can be accessed at `markerClusterer.MarkerClusterer`.

#### TypeScript

This library uses the official TypeScript typings for Google Maps Platform, [@types/google.maps](https://npmjs.com/package/@types/google.maps).

```sh
npm i -D @types/google.maps
```

## Documentation

The [documentation] is generated from the TypeScript definitions.

## Usage

### Examples

```js
import { MarkerClusterer } from "@googlemaps/markerclusterer";

// use default algorithm and renderer
const markerCluster = new MarkerClusterer({ map, markers });
```

To run the examples:
- Install dependencies: ```npm install```
- Start the development server in the root folder: ```npm run dev```
- Navigate to [http://localhost:8080/](http://localhost:8080/) in your web browser.
- Provide a valid Google Maps Platform API key.

Examples details:

- [Algorithm Comparisons](https://googlemaps.github.io/js-markerclusterer/public/algorithms) - This example demonstrates the different algorithms. Please note that spacing and many other options can be changed for each algorithm.

- [Renderer Usage](https://googlemaps.github.io/js-markerclusterer/public/renderers) - This example demonstrates different renderers similar to the image below.

![Screen Shot 2021-09-28 at 1 41 06 PM](https://user-images.githubusercontent.com/3392975/135154898-a5abb5a4-3022-44e0-92d2-5dcefa247e87.png)

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

The API of [@googlemaps/markerclusterer][@googlemaps/markerclusterer] has changed in a number of ways from [@googlemaps/markerclustererplus][@googlemaps/markerclustererplus].

- The `MarkerClusterer` class now accepts an `algorithm` and `renderer` parameter to allow for more flexibility. The interface looks like the following:

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
- The traditional `GridAlgorithm` is still supported, **but is not the default**. The default is [supercluster](https://npmjs.com/package/supercluster) which uses [k-d trees](https://en.wikipedia.org/wiki/K-d_tree) for improved performance.
- Styling of clusters has been simplifed and moved to the renderer interface.
- The `MarkerClusterer` class is still an instance of `google.maps.OverlayView`, but uses `google.maps.Marker`s instead of `google.maps.Overlay` to render the clusters. This solves issues related to the usage of map panes and click handlers.
- @googlemaps/markerclusterer supports Marker and Map [a11y improvements](https://cloud.google.com/blog/products/maps-platform/improved-accessibility-maps-javascript-api).

## Contributing

Contributions are welcome and encouraged! If you'd like to contribute, send us a [pull request] and refer to our [code of conduct] and [contributing guide].

## Terms of Service

This library uses Google Maps Platform services. Use of Google Maps Platform services through this library is subject to the Google Maps Platform [Terms of Service].

This library is not a Google Maps Platform Core Service. Therefore, the Google Maps Platform Terms of Service (e.g. Technical Support Services, Service Level Agreements, and Deprecation Policy) do not apply to the code in this library.

### European Economic Area (EEA) developers

If your billing address is in the European Economic Area, effective on 8 July 2025, the [Google Maps Platform EEA Terms of Service](https://cloud.google.com/terms/maps-platform/eea) will apply to your use of the Services. Functionality varies by region. [Learn more](https://developers.google.com/maps/comms/eea/faq).

## Support

This library is offered via an open source [license]. It is not governed by the Google Maps Platform Support [Technical Support Services Guidelines, the SLA, or the [Deprecation Policy]. However, any Google Maps Platform services used by the library remain subject to the Google Maps Platform Terms of Service.

This library adheres to [semantic versioning] to indicate when backwards-incompatible changes are introduced. Accordingly, while the library is in version 0.x, backwards-incompatible changes may be introduced at any time.

If you find a bug, or have a feature request, please [file an issue] on GitHub. If you would like to get answers to technical questions from other Google Maps Platform developers, ask through one of our [developer community channels]. If you'd like to contribute, please check the [contributing guide].

You can also discuss this library on our [Discord server].

[@googlemaps/markerclustererplus]: https://npmjs.com/package/@googlemaps/markerclustererplus
[@google/markerclusterer]: https://npmjs.com/package/@google/markerclusterer

[API key]: https://developers.google.com/maps/documentation/javascript/get-api-key
[maps-sdk]: https://developers.google.com/maps/documentation/javascript
[documentation]: https://googlemaps.github.io/js-markerclusterer
[npm-pkg]: https://npmjs.com/package/@googlemaps/markerclusterer

[code of conduct]: ?tab=coc-ov-file#readme
[contributing guide]: CONTRIBUTING.md
[Deprecation Policy]: https://cloud.google.com/maps-platform/terms
[developer community channels]: https://developers.google.com/maps/developer-community
[Discord server]: https://discord.gg/hYsWbmk
[file an issue]: https://github.com/googlemaps/js-markerclusterer/issues/new/choose
[license]: LICENSE
[project]: https://developers.google.com/maps/documentation/javascript/cloud-setup#enabling-apis
[pull request]: https://github.com/googlemaps/js-markerclusterer/compare
[semantic versioning]: https://semver.org
[Sign up with Google Maps Platform]: https://console.cloud.google.com/google/maps-apis/start
[similar inquiry]: https://github.com/googlemaps/js-markerclusterer/issues
[SLA]: https://cloud.google.com/maps-platform/terms/sla
[Technical Support Services Guidelines]: https://cloud.google.com/maps-platform/terms/tssg
[Terms of Service]: https://cloud.google.com/maps-platform/terms
