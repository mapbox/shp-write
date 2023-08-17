declare module "shp-write" {
  export enum OGCGeometry {
    NULL,
    POINT,
    POLYLINE,
    POLYGON,
    MULTIPOINT,
    POINTZ,
    POLYLINEZ,
    POLYGONZ,
    MULTIPOINTZ,
    POINTM,
    POLYLINEM,
    POLYGONM,
    MULTIPOINTM,
    MULTIPATCH,
  }

  export interface DownloadOptions {
    folder: string;
    filename?: string;
    types: {
      point: string;
      polygon: string;
      line: string;
    };
  }

  export function download(
    geojson: GeoJSON.FeatureCollection,
    options?: DownloadOptions
  ): void;

  export function write(
    data: Array<object>,
    geometrytype: OGCGeometry,
    geometries: Array<object>,
    callback: (
      err: any,
      data: {
        shp: any;
        shx: any;
        dbf: any;
      }
    ) => void
  ): void;

  export function zip(geojson: GeoJSON.FeatureCollection): void;
}
