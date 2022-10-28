import { DipArgs, parseArgs } from "./args.ts";
import { imagescript, path } from "./deps.ts";
import {
  Pixel,
  ProcessorError,
  ProcessorInitFunc,
  ProcessorProcessFunc,
  Sampler,
} from "./types.ts";

let args: DipArgs;

try {
  args = parseArgs(Deno.args);
} catch (error) {
  console.error(error.message);
  Deno.exit(1);
}

function ensurePathIsAbsolute(filePath: string) {
  if (!path.isAbsolute(filePath)) {
    return path.resolve(
      path.join(Deno.cwd(), filePath),
    );
  }
  return filePath;
}

args.inputFileName = ensurePathIsAbsolute(args.inputFileName);
args.processorFileName = ensurePathIsAbsolute(args.processorFileName);
args.outputFileName = ensurePathIsAbsolute(args.outputFileName);

const data = Deno.readFileSync(args.inputFileName);
const image = (await imagescript.decode(data)) as imagescript.Image;

const processor = await import(
  path.toFileUrl(args.processorFileName).toString()
);

function buildPixel(value: number): Pixel {
  return {
    r: (value & 0xff000000) >> 24,
    g: (value & 0x00ff0000) >> 16,
    b: (value & 0x0000ff00) >> 8,
    a: value & 0x000000ff,
  };
}

const samples: Record<string, Sampler> = {};
for (const [key, fileName] of Object.entries(args.samples)) {
  const samplerData = Deno.readFileSync(fileName);
  const samplerImage = (await imagescript.decode(data)) as imagescript.Image;
  samples[key] = {
    width: samplerImage.width,
    height: samplerImage.height,
    at: function (x: number, y: number): Pixel {
      const value = samplerImage.getPixelAt(x, y);
      return buildPixel(value);
    },
  };
}

function handleProcessorErrors(func: () => void) {
  try {
    func();
  } catch (error) {
    if (error instanceof ProcessorError) {
      console.error(`Processor Error: ${error.message}`);
    } else {
      console.error("Unexpected Error:");
      console.error(error);
    }
  }
}

if (processor.init) {
  handleProcessorErrors(() => {
    (processor.init as ProcessorInitFunc)({
      samples,
      params: args.params,
    });
  });
}

if (processor.process) {
  handleProcessorErrors(() => {
    image.fill((x: number, y: number) => {
      const pixelValue = image.getPixelAt(x, y);
      let pixel = buildPixel(pixelValue);
      pixel = (processor.process as ProcessorProcessFunc)({
        x,
        y,
        pixel,
        samples,
        params: args.params,
      });
      return (pixel.r << 24) | (pixel.g << 16) | (pixel.b << 8) | pixel.a;
    });
  });
} else {
  console.error(
    `Processor Error: Processor does not export a process function.`,
  );
  Deno.exit(1);
}

Deno.writeFileSync(args.outputFileName, await image.encode(0), {
  create: true,
});
