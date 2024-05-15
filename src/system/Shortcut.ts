const sh_App: typeof App = importModule(
  "app/App",
) as typeof App;

abstract class Shortcut<
  I = never,
  O = never,
  C extends ISetting = never,
> extends sh_App<
    "Shortcut",
    null | NonNullable<I>,
    Null<O>,
    C
  > {
  constructor(debug?: boolean) {
    super(
      "Shortcut",
      debug,
    );
  }

  protected get getInput(): Shortcut<I>["input"] {
    try {
      if (typeof this._getInput === "undefined") {
        const shortcutInput = args.shortcutParameter as null | undefined | I;
        const definedShortcutInput: null | NonNullable<I> = shortcutInput ?? null;

        this._getInput = definedShortcutInput;
      }

      return this._getInput;
    }
    catch (e) {
      throw new EvalError(
        `Shortcut: setInput`,
        { cause: e },
      );
    }
  }

  protected setOutput(runtimeOutput: ReturnType<Shortcut<I, O>["run"]>): ReturnType<Shortcut<I, O>["run"]> {
    try {
      Script.setShortcutOutput(runtimeOutput);

      return runtimeOutput;
    }
    catch (e) {
      throw new EvalError(
        `Shortcut: setOutput`,
        { cause: e },
      );
    }
  }

  private _getInput?: Shortcut<I>["getInput"];
}

module.exports = Shortcut;
