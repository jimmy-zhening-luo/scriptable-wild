const pa_UrlPartRepeater: typeof UrlPartRepeater = importModule(
  "urlpartrepeater/UrlPartRepeater",
);

class PathRepeater extends pa_UrlPartRepeater {
  protected parse(repeater: string): null | string {
    try {
      return new PathRepeater.ValidPathRepeater(repeater).value;
    } catch (e) {
      throw new Error(`PathRepeater: parse: error parsing PathRepeater: ${e}`);
    }
  }

  static get ValidPathRepeater(): typeof ValidPathRepeater {
    try {
      return PathRepeater.UrlValidators.Path.Repeaters.Path;
    } catch (e) {
      throw new ReferenceError(
        `PathRepeater: error loading ValidPathRepeater module: ${e}`,
      );
    }
  }

  static get UrlPartRepeater(): typeof UrlPartRepeater {
    try {
      return pa_UrlPartRepeater;
    } catch (e) {
      throw new ReferenceError(
        `PathRepeater: error loading parent UrlPartRepeater module: ${e}`,
      );
    }
  }
}

module.exports = PathRepeater;
