import { DipArgs, parseArgs } from "./args.ts";
import { asserts, bdd } from "./deps.ts";
const { assertEquals } = asserts;
const { describe, it } = bdd;

const successfulTestCases: Array<[string[], DipArgs]> = [
  [["input.png", "processor.ts", "output.png"], {
    inputFileName: "input.png",
    processorFileName: "processor.ts",
    outputFileName: "output.png",
    samples: {},
    params: {},
  }],

  [["input.png", "processor.ts", "output.png", "-s", "foo=bar.png"], {
    inputFileName: "input.png",
    processorFileName: "processor.ts",
    outputFileName: "output.png",
    samples: {
      "foo": "bar.png",
    },
    params: {},
  }],

  [["input.png", "processor.ts", "output.png", "-sample", "foo=bar.png"], {
    inputFileName: "input.png",
    processorFileName: "processor.ts",
    outputFileName: "output.png",
    samples: {
      "foo": "bar.png",
    },
    params: {},
  }],

  [["input.png", "processor.ts", "output.png", "-p", "foo=bar"], {
    inputFileName: "input.png",
    processorFileName: "processor.ts",
    outputFileName: "output.png",
    samples: {},
    params: {
      "foo": "bar",
    },
  }],

  [["input.png", "processor.ts", "output.png", "-param", "foo=bar"], {
    inputFileName: "input.png",
    processorFileName: "processor.ts",
    outputFileName: "output.png",
    samples: {},
    params: {
      "foo": "bar",
    },
  }],

  [[
    "input.png",
    "processor.ts",
    "output.png",
    "-s",
    "foo=bar.png",
    "-param",
    "foo=bar",
  ], {
    inputFileName: "input.png",
    processorFileName: "processor.ts",
    outputFileName: "output.png",
    samples: {
      "foo": "bar.png",
    },
    params: {
      "foo": "bar",
    },
  }],
];

describe("parseArgs", () => {
  for (const testCase of successfulTestCases) {
    const testName = `should parse "${testCase[0].join(" ")}"`;
    it(testName, () => {
      assertEquals(parseArgs(testCase[0]), testCase[1]);
    });
  }
});
