// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: bug;
"use strict";

namespace TestRunner {
  const nativeScript: typeof NativeScript = importModule(
    "system/NativeScript",
  ) as typeof NativeScript;

  namespace Tests {
    export const Tests: Protos.TestSuiteProto[] = [
      {
        name: "Storage",
        cases: [
          [
            "foo",
            1,
            1,
          ],
        ],
      },
      {
        name: "Setting",
        cases: [
          [
            "bar",
            2,
            2,
          ],
        ],
      },
      {
        name: "ReadOnlyFile",
        cases: [
          [
            "baz",
            1,
            1,
          ],
        ],
      },
      {
        name: "File",
        cases: [
          [
            "bin",
            1,
            1,
          ],
        ],
      },
      {
        name: "Url",
        cases: [
          [
            "fizz",
            1,
            1,
          ],
        ],
      },
    ];
  }

  namespace Protos {
    export interface TestSuiteProto {
      name: string;
      cases: TestCaseTriple[];
    }

    export type TestCaseTriple = [string, primitive, primitive];
  }

  export class TestRunner extends nativeScript {
    public async runtime(): Promise<void> {
      try {
        const suites: Classes.TestSuite[] = Tests.Tests.map(testSuiteProto => {
          const caseTuples: Protos.TestCaseTriple[] = testSuiteProto.cases;

          return new Classes.TestSuite(
            testSuiteProto.name,
            ...caseTuples.map(caseTuple => ({
              description: caseTuple[0],
              left: caseTuple[1],
              right: caseTuple[2],
            })),
          );
        });
        const output: string = suites.map(suite => suite.execute())
          .join("");

        console.log(output);
        const outputDialog: Alert = new Alert();

        outputDialog.title = this.constructor.name;
        outputDialog.message = output;
        outputDialog.addAction("OK");
        await outputDialog.presentAlert();
      }
      catch (e) {
        throw new EvalError(
          `TestRunner: runtime: Error running script: \n${e as string}`,
        );
      }
    }
  }

  namespace Classes {
    export class TestSuite {
      private readonly _name: string;
      private readonly _cases: TestCase[];

      constructor(
        name: string,
        ...caseTuples: Array<{
          description: string;
          left: primitive;
          right: primitive;
        }>
      ) {
        try {
          this._name = name;
          this._cases = caseTuples.map(
            caseTuple =>
              new TestCase(
                caseTuple.description,
                caseTuple.left,
                caseTuple.right,
              ),
          );
        }
        catch (e) {
          throw new SyntaxError(`TestSuite.constructor() failed: ${e as string}\n`);
        }
      }

      public execute(): string {
        try {
          return `${this._name}: ${this._cases
            .map(testCase => testCase.execute())
            .join("")}\n`;
        }
        catch (e) {
          throw new EvalError(`TestSuite.execute() failed: ${e as string}\n`);
        }
      }
    }

    export class TestCase {
      private readonly _description: string;
      private readonly _left: primitive;
      private readonly _right: primitive;

      constructor(description: string, left: primitive, right: primitive) {
        try {
          this._description = description;
          this._left = left;
          this._right = right;
        }
        catch (e) {
          throw new SyntaxError(`TestCase.constructor() failed: ${e as string}\n`);
        }
      }

      public execute(): string {
        try {
          return `${this._description}: ${
            this._left === this._right
              ? "success"
              : "FAIL"
          }\n`;
        }
        catch (e) {
          throw new EvalError(`TestCase.execute() failed: ${e as string}\n`);
        }
      }
    }
  }
}

new TestRunner.TestRunner()
  .run();
