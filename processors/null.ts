import { Pixel, ProcessorInitArgs, ProcessorProcessArgs } from "dip";

export function init({
  samples,
  params,
}: ProcessorInitArgs): void {
  console.info("Samples:");
  for (const [key, value] of Object.entries(samples)) {
    console.info(`${key}=${value.width}x${value.height}`);
  }

  console.info("Params:");
  for (const [key, value] of Object.entries(params)) {
    console.info(`${key}=${value}`);
  }
}

export function process({
  pixel,
}: ProcessorProcessArgs): Pixel {
  return pixel;
}
