/**
 * MapGL Module
 */
declare module "mapgl" {

  /**
   * lat lon
   */
  export interface LatLon {
    lat: number;
    lon: number;
  }

  /**
   * the map settings
   */
  export interface MapLocation {

    /**
     * map center
     */
    mapCenter: LatLon;

    /**
     * map zoom
     */
    zoom: number;

    /**
     * animating
     */
    isAnimating: boolean,

    /**
     * target center
     */
    targetCenter?: LatLon

    /**
     * target zoom
     */
    targetZoom?: number

    /**
     * animated duration
     */
    duration?: number

    /**
     * time
     */
    time?: number

    /**
     * map tilt
     */
    tilt: number;

    /**
     * the z rotation
     */
    zRotation: number;
  }

  /**
   * the map size
   */
  export interface MapSize {
    width: number;
    height: number;
  }

  /**
   * the map State
   */
  export interface MapState {
    location: MapLocation;
    size: MapSize;
  }

  /**
   * Settings for the map
   */
  export interface MapSetting {

    /**
     * the tile server url
     */
    tileServerUrl?: string;

    /**
     * building server url - url to building server
     */
    buildingServerUrl?: string;

    /**
     * list of
     */
    plugins?: React.ComponentClass<{}>[];

  }

  /**
   * an object that can render
   */
  export interface Render {
    render3D(frameTime: number);
  }

  /**
   * export the method initialize map
   * @param element element to render the map to
   * @param setting setting of the map
   *
   * @example
   *  MapGL.initMap(document.getElementById("map"), {
   *    plugins: [MapGL.
   *  })
   */
  export function initMap(element, setting?: MapSetting);

  export function addMarker(markerInfo: MarkerItemProps, callback: (data, event)=>void);

  /**
   * Highlight building on map
   * @param buildingId
   */
  export function highlightBuildingId(buildingId);
  /**
   * the map component
   */
  export class MapComponent extends React.Component<{setting?: MapSetting}, {}> {

    /**
     * get the map state
     */
    mapState: MapState;


    /**
     * add a renderer to render the map
     * @param renderer: the renderer to add
     */
    addRenderer(renderer: Render);

    /**
     * Highlight building
     * @param buildingId
     */
    highlightBuildingById(buildingId: string);

  }

  /**
   * base class for map plugin
   */
  export class MapPlugin<T> extends __React.Component<{map: MapComponent}, T> {
  }

  /**
   * the building importer plugin
   */
  export class BuildingImporter extends MapPlugin<{}> {
  }
  export class PromotionComponent extends MapPlugin<{}> {
  }
  export class BuildingManagement extends MapPlugin<{}> {
  }
  export class BuildingInfo extends MapPlugin<{}> {
  }
  export class MapMarkerInfo extends MapPlugin<{}> {
  }

  export class MapSearchComponent extends MapPlugin<{}> {
  }

  export class MapControl extends MapPlugin<{}> {
  }

  export class MapTooltip extends MapPlugin<{}> {
  }

}
