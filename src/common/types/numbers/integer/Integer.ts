const _Rational: typeof Rational = importModule(
  "rational/Rational",
) as typeof Rational;

class Integer extends _Rational {
  public static get Rational(): typeof Rational {
    try {
      return _Rational;
    }
    catch (e) {
      throw new ReferenceError(
        `Integer: error loading parent Rational module: \n${e as string}`,
      );
    }
  }

  protected override _qualifies(rawNumber: number): boolean {
    try {
      return (
        super._qualifies(rawNumber) && new Integer.Rational(rawNumber).isInteger
      );
    }
    catch (e) {
      throw new Error(`Integer.qualifies: \n${e as string}`);
    }
  }
}

module.exports = Integer;
