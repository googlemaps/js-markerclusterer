import { MarkerUtils } from "./marker-utils";
import { initialize } from "@googlemaps/jest-mocks";

initialize();
const markerClasses = [
  google.maps.Marker,
  google.maps.marker.AdvancedMarkerView,
];

describe.each(markerClasses)(
  "MarkerUtils works with legacy and Advanced Markers",
  (markerClass) => {
    let map: google.maps.Map;

    beforeEach(() => {
      map = new google.maps.Map(document.createElement("div"));
    });

    test("identifies AdvancedMarker instances", () => {
      const isAdvancedMarker = MarkerUtils.isAdvancedMarker(new markerClass());
      if (markerClass === google.maps.marker.AdvancedMarkerView) {
        expect(isAdvancedMarker).toBeTruthy;
        return;
      }
      expect(isAdvancedMarker).toBeFalsy;
    });

    test("sets the map", () => {
      const marker = new markerClass();
      MarkerUtils.setMap(marker, map);
      if (markerClass === google.maps.marker.AdvancedMarkerView) {
        expect((marker as google.maps.marker.AdvancedMarkerView).map).toEqual(
          map
        );
        return;
      }
      expect((marker as google.maps.Marker).setMap).toHaveBeenCalled;
    });

    test("gets the marker position and returns a LatLng", () => {
      // test markers created with LatLng and LatLngLiteral
      [new google.maps.LatLng(1, 1), { lat: 1, lng: 1 }].forEach((position) => {
        const marker = new markerClass({ position: position });
        if (markerClass === google.maps.marker.AdvancedMarkerView) {
          (marker as google.maps.marker.AdvancedMarkerView).position = position;
        }
        expect(MarkerUtils.getPosition(marker)).toBeInstanceOf(
          google.maps.LatLng
        );
      });
    });

    test("", () => {
      const marker = new markerClass();
      expect(MarkerUtils.getVisible(marker)).toBeTruthy;
    });
  }
);
