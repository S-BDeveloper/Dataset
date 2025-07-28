// Global type declarations for missing libraries

declare module "d3-cloud" {
  export interface CloudLayout {
    size: (size: [number, number]) => CloudLayout;
    words: (words: any[]) => CloudLayout;
    padding: (padding: number) => CloudLayout;
    rotate: (rotate: () => number) => CloudLayout;
    font: (font: string) => CloudLayout;
    fontSize: (fontSize: () => number) => CloudLayout;
    on: (event: string, callback: () => void) => CloudLayout;
    start: () => void;
  }

  export function cloud(): CloudLayout;
}

declare module "sinonjs_fake-timers" {
  export interface FakeTimers {
    install: (config?: any) => void;
    uninstall: () => void;
    tick: (ms: number) => void;
    next: () => void;
    runAll: () => void;
    runToLast: () => void;
    reset: () => void;
    setSystemTime: (now?: number | Date) => void;
    getRealSystemTime: () => number;
  }

  export function createClock(
    now?: number | Date,
    loopLimit?: number
  ): FakeTimers;
  export function install(config?: any): FakeTimers;
}

declare module "sizzle" {
  export function select(
    selector: string,
    context?: Element | Document
  ): Element[];
  export function selectAll(
    selector: string,
    context?: Element | Document
  ): Element[];
}

declare module "yauzl" {
  export interface ZipFile {
    readEntry(): void;
    on(event: string, callback: (entry: any) => void): void;
    close(): void;
  }

  export interface Entry {
    fileName: string;
    uncompressedSize: number;
    compressedSize: number;
    isDirectory: boolean;
    isFile: boolean;
  }

  export function fromBuffer(
    buffer: Buffer,
    callback: (err: Error | null, zipfile: ZipFile) => void
  ): void;
  export function fromFd(
    fd: number,
    callback: (err: Error | null, zipfile: ZipFile) => void
  ): void;
  export function fromRandomAccessReader(
    reader: any,
    totalSize: number,
    callback: (err: Error | null, zipfile: ZipFile) => void
  ): void;
}

// Declare missing D3 modules
declare module "d3-color" {
  export function rgb(r: number, g: number, b: number): any;
  export function hsl(h: number, s: number, l: number): any;
  export function lab(l: number, a: number, b: number): any;
  export function hcl(h: number, c: number, l: number): any;
  export function cubehelix(h: number, s: number, l: number): any;
}

declare module "d3-delaunay" {
  export function delaunay(points: [number, number][]): any;
  export function voronoi(points: [number, number][]): any;
}

declare module "d3-interpolate" {
  export function interpolate(a: any, b: any): (t: number) => any;
  export function interpolateNumber(
    a: number,
    b: number
  ): (t: number) => number;
  export function interpolateString(
    a: string,
    b: string
  ): (t: number) => string;
  export function interpolateRgb(a: string, b: string): (t: number) => string;
  export function interpolateHsl(a: string, b: string): (t: number) => string;
}

declare module "d3-path" {
  export function path(): any;
}

declare module "d3-scale-chromatic" {
  export function interpolateViridis(t: number): string;
  export function interpolateInferno(t: number): string;
  export function interpolateMagma(t: number): string;
  export function interpolatePlasma(t: number): string;
  export function interpolateWarm(t: number): string;
  export function interpolateCool(t: number): string;
  export function interpolateRainbow(t: number): string;
  export function interpolateSinebow(t: number): string;
}

declare module "d3-time" {
  export function timeInterval(
    floor: any,
    offset: any,
    count: any,
    field: any
  ): any;
  export function timeMillisecond(): any;
  export function timeSecond(): any;
  export function timeMinute(): any;
  export function timeHour(): any;
  export function timeDay(): any;
  export function timeWeek(): any;
  export function timeMonth(): any;
  export function timeYear(): any;
}

declare module "d3-time-format" {
  export function timeFormat(specifier: string): (date: Date) => string;
  export function timeParse(specifier: string): (date: string) => Date | null;
  export function utcFormat(specifier: string): (date: Date) => string;
  export function utcParse(specifier: string): (date: string) => Date | null;
}
