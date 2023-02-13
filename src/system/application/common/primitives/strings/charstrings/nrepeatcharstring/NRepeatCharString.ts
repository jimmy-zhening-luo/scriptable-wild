const _BoundedRepeatCharString: typeof BoundedRepeatCharString = importModule("boundedrepeatcharstring/BoundedRepeatCharString");

class NRepeatCharString extends _BoundedRepeatCharString {

  constructor(
    n: number,
    charstring: string,
    ...ofCharInputs:
      | Char[]
      | string[]
      | string[][]
      | Char.CharInput[]
  ) {
    super(n, n, charstring, ...ofCharInputs);
  }

  get n() {
    return this.max;
  }

  get BoundedRepeatCharString(): typeof BoundedRepeatCharString {
    return NRepeatCharString.BoundedRepeatCharString;
  }

  static get BoundedRepeatCharString(): typeof BoundedRepeatCharString {
    return _BoundedRepeatCharString;
  }

}

interface Parent extends RepeatCharString { };

module.exports = NRepeatCharString;
