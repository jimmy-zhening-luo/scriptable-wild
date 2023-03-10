const _NRepeatCharString: typeof NRepeatCharString = importModule(
  "nrepeatcharstring/NRepeatCharString",
);

class OneCharString extends _NRepeatCharString {
  constructor(
    charstring: string,
    ...ofCharInputs: Char[] | string[] | string[][] | Char.CharInput[]
  ) {
    try {
      super(1, charstring, ...ofCharInputs);
    } catch (e) {
      throw new Error(
        `OneCharString: constructor: Error creating OneCharString object: ${e}`,
      );
    }
  }

  static get NRepeatCharString(): typeof NRepeatCharString {
    try {
      return _NRepeatCharString;
    } catch (e) {
      throw new ReferenceError(
        `OneCharString: NRepeatCharString: Error importing NRepeatCharString module: ${e}`,
      );
    }
  }
}

module.exports = OneCharString;
