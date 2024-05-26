const b_IEngine: typeof IEngine = importModule(
  "engine/IEngine",
) as typeof IEngine;

class UrlEngine extends b_IEngine {
  protected readonly urls: stringful[];
  protected readonly TAG: stringful;
  protected readonly browser: string;
  protected readonly separator: string;
  protected readonly encodeComponent: boolean;
  private readonly plus = "+";
  private readonly plusEncoded = "%2B";

  constructor(
    urls:
      | string
      | string[],
    TAG: stringful,
    browser = "",
    separator = "+",
    encodeComponent = false,
  ) {
    try {
      super(
        "safari",
      );
      this
        .TAG = TAG;
      this
        .browser = browser;
      this
        .separator = separator;
      this
        .encodeComponent = encodeComponent;

      const stringfulUrls = [urls]
        .flat()
        .filter(
          (url): url is stringful =>
            url
              .length > 0,
        );

      if (
        stringfulUrls
          .length > 0
      )
        this
          .urls = stringfulUrls;
      else
        throw new SyntaxError(
          `URL engine has no URLs`,
        );
    }
    catch (e) {
      throw new EvalError(
        `BrowserEngine: ctor`,
        { cause: e },
      );
    }
  }

  protected override transform(
    query: Query,
  ) {
    try {
      const {
        TAG,
        separator,
        encodeComponent,
        plus,
        plusEncoded,
      } = this;
      const encoder = encodeComponent
        ? function (operand: string): string {
          encodeURI(
            operand,
          );
        }

        : function (operand: string): string {
          encodeURIComponent(
            operand,
          );
        };
      const encodedQuery = query
        .terms
        .map(
          term =>
            term
              .split(
                plus,
              )
              .map(
                encoder,
              )
              .join(
                plusEncoded,
              ),
        )
        .join(
          separator,
        );

      return this
        .urls
        .map(
          url =>
            url
              .replace(
                TAG,
                encodedQuery,
              ),
        );
    }
    catch (e) {
      throw new EvalError(
        `BrowserEngine: transform`,
        { cause: e },
      );
    }
  }

  protected options(
    query: Query,
  ) {
    try {
      const { browser } = this;
      const { natural } = query;

      return {
        browser,
        natural,
      };
    }
    catch (e) {
      throw new EvalError(
        `BrowserEngine: options`,
        { cause: e },
      );
    }
  }
}

module.exports = UrlEngine;
