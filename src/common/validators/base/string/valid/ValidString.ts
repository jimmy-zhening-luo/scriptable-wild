class ValidString<Brand extends string> {
  public readonly string: CharStringful<Brand>["string"];

  constructor(
    input: string,
    {
      min = 1,
      max = Infinity,
      negate = false,
      chars = [],
    }: {
      min?: number;
      max?: number;
      negate?: boolean;
      chars?: Array<
        ConstructorParameters<typeof CharSet>[1]
      >;
    } = {},
    cleanOptions: Parameters<typeof ValidString.clean>[1] = {},
  ) {
    try {
      this.string = new ValidString
        .CharStringful<Brand>(
        min,
        max,
        ValidString
          .clean(
            input,
            cleanOptions,
          ),
        negate,
        ...chars,
      ).string;
    }
    catch (e) {
      throw new EvalError(
        `ValidString: ctor`,
        { cause: e },
      );
    }
  }

  public static get CharSet(): typeof CharSet {
    try {
      return ValidString.CharStringful.CharSet;
    }
    catch (e) {
      throw new ReferenceError(
        `ValidString: import CharStringful.CharSet`,
        { cause: e },
      );
    }
  }

  private static get CharStringful(): typeof CharStringful {
    try {
      return importModule(
        "charstrings/CharStringful",
      ) as typeof CharStringful;
    }
    catch (e) {
      throw new ReferenceError(
        `ValidString: import CharStringful`,
        { cause: e },
      );
    }
  }

  private static clean(
    raw: string,
    {
      toLower = false,
      trim = false,
      trimLeadingExcept = false,
      trimTrailingExcept = false,
      trimLeading = [],
      trimTrailing = [],
    }: {
      toLower?: boolean;
      trim?: boolean;
      trimLeadingExcept?: boolean;
      trimTrailingExcept?: boolean;
      trimLeading?: string[];
      trimTrailing?: string[];
    },
  ): string {
    try {
      return ValidString._trimEdge(
        ValidString._trimEdge(
          raw[
            toLower
              ? "toLowerCase"
              : "toString"
          ]()[
            trim
              ? "trim"
              : "toString"
          ](),
          "leading",
          trimLeading,
          trimLeadingExcept,
        ),
        "trailing",
        trimTrailing,
        trimTrailingExcept,
      );
    }
    catch (e) {
      throw new EvalError(
        `ValidString: clean`,
        { cause: e },
      );
    }
  }

  private static _trimEdge(
    string: string,
    edge: "leading" | "trailing",
    wordsToTrim: string[],
    trimExcept: boolean,
  ): string {
    try {
      let trimmed: string = string;
      const lookFn:
        | "startsWith"
        | "endsWith" = edge === "leading"
          ? "startsWith"
          : "endsWith";

      wordsToTrim
        .filter(
          (word: string): word is stringful =>
            word !== "",
        )
        .forEach(
          (word: stringful): void => {
            while (
              trimmed[lookFn](word) !== trimExcept
            )
              trimmed = lookFn === "startsWith"
                ? trimmed.slice(
                  trimExcept
                    ? 1
                    : word.length,
                )
                : trimmed.slice(
                  0,
                  0 - (
                    trimExcept
                      ? 1
                      : word.length
                  ),
                );
          },
        );

      return trimmed;
    }
    catch (e) {
      throw new EvalError(
        `ValidString: _trimEdge`,
        { cause: e },
      );
    }
  }

  public toString(): ValidString<Brand>["string"] {
    try {
      return this.string;
    }
    catch (e) {
      throw new EvalError(
        `ValidString: toString`,
        { cause: e },
      );
    }
  }
}

module.exports = ValidString;