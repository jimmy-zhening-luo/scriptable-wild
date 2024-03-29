const hrn_UrlPartRepeater: typeof UrlPartRepeater = importModule(
  "urlpartrepeater/UrlPartRepeater",
) as typeof UrlPartRepeater;

class HostRegNameRepeater extends hrn_UrlPartRepeater {
  public static get ValidHostRegNameRepeater():
  typeof ValidHostRegNameRepeater {
    try {
      return HostRegNameRepeater.UrlValidators.Host.Repeaters.RegName;
    }
    catch (e) {
      throw new ReferenceError(
        `HostRegNameRepeater: error loading ValidHostRegNameRepeater module: \n${e as string}`,
      );
    }
  }

  public static get UrlPartRepeater(): typeof UrlPartRepeater {
    try {
      return hrn_UrlPartRepeater;
    }
    catch (e) {
      throw new ReferenceError(
        `HostRegNameRepeater: error loading parent UrlPartRepeater module: \n${e as string}`,
      );
    }
  }

  protected parse(repeater: string): null | string {
    try {
      return new HostRegNameRepeater.ValidHostRegNameRepeater(repeater).value;
    }
    catch (e) {
      throw new Error(
        `HostRegNameRepeater: parse: error parsing HostRegNameRepeater: \n${e as string}`,
      );
    }
  }
}

module.exports = HostRegNameRepeater;
