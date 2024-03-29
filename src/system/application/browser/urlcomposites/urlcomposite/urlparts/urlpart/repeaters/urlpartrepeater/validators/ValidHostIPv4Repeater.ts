const hipf_ValidUrlRepeater: typeof ValidUrlRepeater = importModule(
  "validurlpart/ValidUrlRepeater",
) as typeof ValidUrlRepeater;

class ValidHostIPv4Repeater extends hipf_ValidUrlRepeater {
  constructor(hostIPv4Repeater: string) {
    try {
      super(
        hostIPv4Repeater,
        1,
        3,
        hipf_ValidUrlRepeater.UrlCharSet.numbers,
      );
    }
    catch (e) {
      throw new Error(
        `ValidHostIPv4Repeater: constructor: error creating ValidHostIPv4Repeater: \n${e as string}`,
      );
    }
  }

  public static get ValidUrlRepeater(): typeof ValidUrlRepeater {
    try {
      return hipf_ValidUrlRepeater;
    }
    catch (e) {
      throw new ReferenceError(
        `ValidHostIPv4Repeater: error loading parent ValidUrlRepeater module: \n${e as string}`,
      );
    }
  }
}

module.exports = ValidHostIPv4Repeater;
