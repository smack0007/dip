export interface DipArgs {
  inputFileName: string;
  processorFileName: string;
  outputFileName: string;
  samples: Record<string, string>;
  params: Record<string, string>;
}

const enum CollectArgState {
  none,
  param,
  sample,
}

export function parseArgs(args: string[]): DipArgs {
  const inputFileName = args[0];

  if (inputFileName === undefined) {
    throw new Error("Please specify an input file name.");
  }

  const processorFileName = args[1];

  if (processorFileName === undefined) {
    throw new Error("Please specify a processor file name.");
  }

  const outputFileName = args[2];

  if (outputFileName === undefined) {
    throw new Error("Please specify an output file name.");
  }

  const samples: Record<string, string> = {};
  const params: Record<string, string> = {};

  let collectArgState: CollectArgState = CollectArgState.none;

  for (let i = 3; i < args.length; i++) {
    const arg = args[i];

    if (collectArgState === CollectArgState.none) {
      if (arg === "-p" || arg === "-param") {
        collectArgState = CollectArgState.param;
      } else if (arg === "-s" || arg === "-sample") {
        collectArgState = CollectArgState.sample;
      } else {
        throw new Error(`Unexpected argument: ${arg}`);
      }
    } else {
      let key: string, value: string;

      if (arg.includes("=")) {
        [key, value] = arg.split("=", 2);
      } else {
        key = arg;
        value = "";
      }

      if (collectArgState === CollectArgState.param) {
        params[key] = value;
      } else if (collectArgState === CollectArgState.sample) {
        samples[key] = value;
      }

      collectArgState = CollectArgState.none;
    }
  }

  return {
    inputFileName,
    processorFileName,
    outputFileName,
    samples,
    params,
  };
}
