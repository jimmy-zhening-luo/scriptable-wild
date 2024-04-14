abstract class App<
  I = null,
  O = null,
  C extends Config = Record<string, never>,
> {
  public static get Filetypes(): typeof Filetypes {
    try {
      return importModule("filetypes/Filetypes") as typeof Filetypes;
    }
    catch (e) {
      throw new ReferenceError(
        `App: Filetypes: Error importing Filetypes module: \n${e as string}`,
      );
    }
  }

  public static get Calendar(): typeof IOCalendar {
    try {
      return importModule("system/calendar/IOCalendar") as typeof IOCalendar;
    }
    catch (e) {
      throw new ReferenceError(
        `App: Calendar: Error importing IOCalendar module: \n${e as string}`,
      );
    }
  }

  public get setting(): Setting<C> {
    try {
      if (this._cachedSetting === undefined)
        this._cachedSetting = new App.Filetypes.Setting(
          this.settingSubpathRoot,
          this.constructor.name,
        );

      return this._cachedSetting;
    }
    catch (e) {
      throw new ReferenceError(
        `App: setting: Error getting app Setting object: \n${e as string}`,
      );
    }
  }

  protected get settingSubpathRoot(): string {
    try {
      return "";
    }
    catch (e) {
      throw new ReferenceError(
        `App: settingSubpathRoot: Error getting app setting subpath: \n${e as string}`,
      );
    }
  }

  protected get storageSubpathRoot(): string {
    try {
      return this.settingSubpathRoot;
    }
    catch (e) {
      throw new ReferenceError(
        `App: storageSubpath: Error getting app storage subpath: \n${e as string}`,
      );
    }
  }

  public abstract get input(): null | string | I;

  public run(): O {
    try {
      const output: O = this.runtime();

      if (this.setOut !== undefined)
        this.setOut(output);

      return output;
    }
    catch (e) {
      const e_final = `App: run: Caught unhandled exception during app runtime: \n${e as string}`;

      console.error(e_final);
      const e_notif = new Notification();

      e_notif.title = "Scriptable Error";
      e_notif.body = e_final;
      e_notif.sound = "failure";
      e_notif.schedule()
        .catch(err => { throw err; });

      throw new EvalError(e_final);
    }
  }

  public readStorage(
    subpath?: string,
  ): ReturnType<Storage["read"]> {
    try {
      return this
        .storage(subpath)
        .read();
    }
    catch (e) {
      throw new ReferenceError(
        `App: readStorage: Error reading app storage file at '${
          this.storage(subpath).path
        }': \n${e as string}`,
      );
    }
  }

  public writeStorage(
    data: string,
    subpath?: string,
  ): this {
    try {
      this
        .storage(subpath)
        .write(data);

      return this;
    }
    catch (e) {
      throw new ReferenceError(
        `App: writeStorage: Error writing to app storage file at '${
          this.storage(subpath).path
        }': \n${e as string}`,
      );
    }
  }

  protected storage(subpath?: string): Storage {
    try {
      return new App.Filetypes.Storage(
        this.storageSubpathRoot,
        this.constructor.name,
        subpath,
      );
    }
    catch (e) {
      throw new ReferenceError(
        `App: storage: Error getting app Storage object: \n${e as string}`,
      );
    }
  }

  public abstract runtime(): O;

  private _cachedSetting?: Setting<C>;

  protected setOut?(runtimeOut: O): void;
}

module.exports = App;