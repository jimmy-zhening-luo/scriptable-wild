const hips_UrlPartRepeater: typeof UrlPartRepeater = importModule(
  "urlpartrepeater/UrlPartRepeater",
) as typeof UrlPartRepeater;

class HostIPv6Repeater extends hips_UrlPartRepeater {
  public static get ValidHostIPv6Repeater(): typeof ValidHostIPv6Repeater {
    try {
      return HostIPv6Repeater.UrlValidators.Host.Repeaters.IPv6;
    }
    catch (e) {
      throw new ReferenceError(
        `HostIPv6Repeater: error loading ValidHostIPv6Repeater module: \n${e as string}`,
      );
    }
  }

  public static get UrlPartRepeater(): typeof UrlPartRepeater {
    try {
      return hips_UrlPartRepeater;
    }
    catch (e) {
      throw new ReferenceError(
        `HostIPv6Repeater: error loading parent UrlPartRepeater module: \n${e as string}`,
      );
    }
  }

  protected parse(repeater: string): null | string {
    try {
      return new HostIPv6Repeater.ValidHostIPv6Repeater(repeater).value;
    }
    catch (e) {
      throw new Error(
        `HostIPv6Repeater: parse: error parsing HostIPv6Repeater: \n${e as string}`,
      );
    }
  }
}

module.exports = HostIPv6Repeater;
