const p_Cardinality: typeof Cardinality = importModule(
  "cardinality/Cardinality",
) as typeof Cardinality;

class Positive extends p_Cardinality {
  public static get Cardinality(): typeof Cardinality {
    try {
      return p_Cardinality;
    }
    catch (e) {
      throw new ReferenceError("Positive: error importing Cardinality module");
    }
  }

  public override isCardinal(value: number): boolean {
    try {
      return (
        super.isCardinal(value) && (value === 0 || value === -0 || value > 0)
      );
    }
    catch (e) {
      throw new EvalError("Positive: error calling isCardinal");
    }
  }
}

module.exports = Positive;
