const set_Filetype: typeof Filetype = importModule(
  "filetype/Filetype",
) as typeof Filetype;

class Setting<
  C extends Config = Record<string, never>,
> extends set_Filetype<
    "Setting"
  > {
  constructor(
    appType: string,
    appName: string,
  ) {
    try {
      super(
        "Setting",
        Setting.ReadOnlyIOFile,
        appType,
        appName + ".json",
      );
    }
    catch (e) {
      throw new EvalError(
        `Setting: ctor`,
        { cause: e },
      );
    }
  }

  public get parsed(): C {
    try {
      if (this._cachedSetting !== undefined)
        return this._cachedSetting;
      else {
        if (!this._file.isFile)
          throw new ReferenceError(
            `No setting file found at path: ${this._file.path}`,
          );
        else {
          const parsedJson: unknown = JSON.parse(this.read());

          if (_validate(parsedJson)) {
            this._cachedSetting = parsedJson as C;

            return this._cachedSetting;
          }
          else
            throw new TypeError(
              `Setting file parsed to valid JSON, but has incorrect schema: ${this._file.path}`,
            );

          function _validate(parsedJson: unknown): boolean {
            try {
              // TO-DO: Validate JSON schema.
              return parsedJson !== undefined;
            }
            catch (e) {
              throw new EvalError(
                `_validate`,
                { cause: e },
              );
            }
          }
        }
      }
    }
    catch (e) {
      throw new EvalError(
        `Setting: parsed`,
        { cause: e },
      );
    }
  }

  public get unmerged(): C {
    try {
      return this.parsed;
    }
    catch (e) {
      throw new EvalError(
        `Setting: unmerged`,
        { cause: e },
      );
    }
  }

  public get app(): C["app"] {
    try {
      if (this.unmerged.app === undefined)
        throw new ReferenceError(
          `No app setting found`,
        );
      else
        return this.unmerged.app;
    }
    catch (e) {
      throw new EvalError(
        `Setting: app`,
        { cause: e },
      );
    }
  }

  public get user(): C["user"] {
    try {
      if (this.unmerged.user === undefined)
        throw new ReferenceError(
          `No user setting found`,
        );
      else
        return this.unmerged.user;
    }
    catch (e) {
      throw new EvalError(
        `Setting: user`,
        { cause: e },
      );
    }
  }

  public get merged(): SettingMap {
    try {
      return this.mergeSettings(
        this.user,
        this.app,
      );
    }
    catch (e) {
      throw new EvalError(
        `Setting: merged`,
        { cause: e },
      );
    }
  }

  public get mergedNoOverride(): SettingMap {
    try {
      return this.mergeSettings(
        this.app,
        this.user,
      );
    }
    catch (e) {
      throw new EvalError(
        `Setting: mergedNoOverride`,
        { cause: e },
      );
    }
  }

  private mergeSettings(
    winners: SettingMap | undefined,
    losers: SettingMap | undefined,
  ): SettingMap {
    try {
      if (winners === undefined && losers === undefined)
        return {};
      else if (losers === undefined)
        return winners!;
      else if (winners === undefined)
        return losers;
      else {
        const sharedKeys: string[] = intersectKeys(
          winners,
          losers,
        );
        const uniqueKeysW: string[] = uniqueKeysOf(
          winners,
          sharedKeys,
        );
        const uniqueKeysL: string[] = uniqueKeysOf(
          losers,
          sharedKeys,
        );
        const mergedMap: Map<string, SettingValue> = new Map();
        const losingMap: Map<string, SettingValue> = new Map(Object.entries(losers));
        const winningMap: Map<string, SettingValue> = new Map(Object.entries(winners));

        for (const loser of uniqueKeysL)
          mergedMap.set(
            loser,
            losingMap.get(loser)!,
          );

        for (const winner of uniqueKeysW)
          mergedMap.set(
            winner,
            winningMap.get(winner)!,
          );

        for (const key of sharedKeys) {
          if (
            isPrimitive(winningMap.get(key)!)
            && isPrimitive(losingMap.get(key)!)
          )
            mergedMap.set(
              key,
              winningMap.get(key)!,
            );
          else if (
            Array.isArray(winningMap.get(key))
            && Array.isArray(losingMap.get(key))
          )
            mergedMap.set(
              key,
              mergeArrays(
                winningMap.get(key) as SettingValue[],
                losingMap.get(key) as SettingValue[],
              ),
            );
          else if (Array.isArray(winningMap.get(key)))
            mergedMap.set(
              key,
              mergeArrays(
                winningMap.get(key) as SettingValue[],
                [losingMap.get(key)!],
              ),
            );
          else if (Array.isArray(losingMap.get(key)))
            mergedMap.set(
              key,
              mergeArrays(
                [winningMap.get(key)!],
                losingMap.get(key) as SettingValue[],
              ),
            );
          else
            mergedMap.set(
              key,
              this.mergeSettings(
                winningMap.get(key) as SettingMap,
                losingMap.get(key) as SettingMap,
              ),
            );
        }

        return Object.fromEntries(mergedMap);
      }
    }
    catch (e) {
      throw new EvalError(
        `Setting: mergeSettings`,
        { cause: e },
      );
    }

    function isPrimitive(obj: SettingValue): boolean {
      try {
        return (
          typeof obj === "string"
          || typeof obj === "number"
          || typeof obj === "boolean"
        );
      }
      catch (e) {
        throw new EvalError(
          `isPrimitive`,
          { cause: e },
        );
      }
    }

    function mergeArrays(
      winner: SettingValue[],
      loser: SettingValue[],
    ): SettingValue[] {
      try {
        return winner.concat(loser);
      }
      catch (e) {
        throw new EvalError(
          `mergeArrays`,
          { cause: e },
        );
      }
    }

    function intersectKeys(a: SettingMap, b: SettingMap): string[] {
      try {
        const bKeys: string[] = Object.keys(b);

        return Object.keys(a)
          .filter(aKey =>
            bKeys
              .includes(aKey));
      }
      catch (e) {
        throw new EvalError(
          `intersectKeys`,
          { cause: e },
        );
      }
    }

    function uniqueKeysOf(x: SettingMap, sharedKeys: string[]): string[] {
      try {
        return Object.keys(x)
          .filter(xKey =>
            !sharedKeys
              .includes(xKey));
      }
      catch (e) {
        throw new EvalError(
          `uniqueKeysOf`,
          { cause: e },
        );
      }
    }
  }

  private _cachedSetting?: C;
}

module.exports = Setting;
