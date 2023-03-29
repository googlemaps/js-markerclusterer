export type Marker = google.maps.Marker | google.maps.marker.AdvancedMarkerView;

export class MarkerUtils {

  public static isAdvancedMarker (marker: Marker): boolean {
    if (marker instanceof google.maps.marker.AdvancedMarkerView) {
      return true;
    }
    return false;
  }

  public static setMap (marker: Marker, map: google.maps.Map | null) {
    if (this.isAdvancedMarker(marker)) {
      (marker as google.maps.marker.AdvancedMarkerView).map = map;
      return;
    }
    (marker as google.maps.Marker).setMap(map);
  }

}
