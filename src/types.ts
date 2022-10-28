export interface Pixel {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface Sampler {
  readonly width: number;
  readonly height: number;
  at(x: number, y: number): Pixel;
}

export interface ProcessorProcessArgs {
  /**
   * The current X position of the source image.
   */
  x: number;

  /**
   * The current Y position of the source image.
   */
  y: number;

  /**
   * The current pixel of the source image.
   */
  pixel: Pixel;

  /**
   * The available samples.
   */
  samples: Record<string, Sampler>;

  /**
   * Command line flags passed to the processor.
   */
  params: Record<string, string>;
}

export type ProcessorInitArgs = Omit<ProcessorProcessArgs, "x" | "y" | "pixel">;

export type ProcessorInitFunc = (args: ProcessorInitArgs) => void;

export type ProcessorProcessFunc = (args: ProcessorProcessArgs) => Pixel;

export class ProcessorError extends Error {}
