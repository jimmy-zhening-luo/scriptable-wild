class ValidString {
  readonly raw: string;
  readonly cleaned: string;
  readonly value: null | string;
  constructor(
    text: string,
    {
      toLower = false,
      trim = true,
      trimLeading = [],
      trimTrailing = [],
    }: {
      toLower?: boolean,
      trim?: boolean,
      trimLeading?: string[],
      trimTrailing?: string[]
      },
    {
      maxLength = Infinity
    }: {
      maxLength?: number
    },
    ...allowedChars: Char.CharInput[]
  ) {
    this.raw = text;
    this.cleaned = clean(
      this.raw,
      toLower,
      trim,
      trimLeading,
      trimTrailing
    );

    maxLength = new ValidString._PositiveInteger(maxLength).value ?? Infinity;

    this.value = text.length > maxLength ?
      null
      : parseStringToOneGrams(
      this.cleaned
    ).map(ngram => new ValidString._OneCharString(
      ngram.word, ...allowedChars
    )).every(charstring => charstring.isValid) ?
      this.cleaned
      : null;

    function clean(
      text: string,
      toLower: boolean,
      trim: boolean,
      trimLeading: string[],
      trimTrailing: string[]
    ): string {
      return postTrim(
        preTrim(trim ?
          toLower ?
            text.toLowerCase().trim()
            : text.trim()
          : toLower ?
            text.toLowerCase()
            : text,
          trimLeading
        ),
        trimTrailing
      );
      function preTrim(
        text: string,
        wordsToTrim: string[]
      ): string {
        wordsToTrim
          .filter(word => word !== "")
          .forEach(word => {
            while (text.startsWith(word))
              text = text.slice(word.length);
          });
        return text;
      }
      function postTrim(
        text: string,
        wordsToTrim: string[]
      ): string {
        wordsToTrim
          .filter(word => word !== "")
          .forEach(word => {
            while (text.endsWith(word))
              text = text.slice(0, 0 - word.length);
          });
        return text;
      }
    }

    function parseStringToOneGrams(text: string): NGram[] {
      return [...text]
        .map(char => new ValidString._OneGram(char));
    }
  }

  get isValid(): boolean {
    return this.value !== null;
  }

  get string(): string {
    return this.value ?? "";
  }

  toString(): string {
    return this.string;
  }
}

namespace ValidString {
  export const _OneGram: typeof OneGram = importModule("words/OneGram");
  export const _OneCharString: typeof OneCharString = importModule("charstrings/OneCharString.ts");
  export const _PositiveInteger: typeof PositiveInteger = importModule("./shortcut/application/common/primitives/numbers/PositiveInteger");
}

module.exports = ValidString;
