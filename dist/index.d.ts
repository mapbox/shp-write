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
    folder?: string;
    filename?: string;
    types: {
      point?: string;
      polygon?: string;
      line?: string;
      multipolygon?: string;
      multiline?: string;
    };
  }

  type Compression = 'STORE' | 'DEFLATE';
  interface OutputByType {
    base64: string;
    string: string;
    text: string;
    binarystring: string;
    array: number[];
    uint8array: Uint8Array;
    arraybuffer: ArrayBuffer;
    blob: Blob;
    nodebuffer: Buffer;
    stream: ReadableStream;
  }
  type OutputType = keyof OutputByType;

  export interface ZipOptions {
    compression: Compression,
    outputType: OutputType
  }

  DEFAULT_ZIP_OPTIONS = {
    compression: 'STORE',
    type: 'base64'
  }

  export function download(
    geojson: GeoJSON.FeatureCollection,
    options?: DownloadOptions & ZipOptions= DEFAULT_ZIP_OPTIONS
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

  export function zip<T extends OutputType>(
    geojson: GeoJSON.FeatureCollection,
    options: DownloadOptions & ZipOptions = DEFAULT_ZIP_OPTIONS,
    stream = false): Promise<OutputByType[T]>;
}
