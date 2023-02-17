class Callback {

  private readonly _baseUrl: Url;

  constructor(
    schemeOrCallback:
      | Types.stringful
      | Scheme
      | Callback,
    host: ConstructorParameters<typeof Host>[0] = "",
    basePath: ConstructorParameters<typeof Path>[0] = "",
    commonParams: ConstructorParameters<typeof Query>[0] = ""
  ) {
    if (schemeOrCallback instanceof Callback)
      this._baseUrl = new Url(
        schemeOrCallback.baseUrl
      );
    else
      this._baseUrl = new Callback.Url(
        schemeOrCallback,
        host,
        undefined,
        basePath,
        new Callback.Query(
          commonParams
        )
      );
  }

  get baseUrl(): Types.stringful {
    return this._baseUrl.toString();
  }

  get scheme(): Types.stringful {
    return this._baseUrl.scheme;
  }

  set scheme(
    scheme: ConstructorParameters<typeof Scheme>[0]
  ) {
    this._baseUrl.scheme = scheme;
  }

  get host(): string {
    return this._baseUrl.host;
  }

  set host(
    host: ConstructorParameters<typeof Host>[0]
  ) {
    this._baseUrl.host = host;
  }

  get basePath(): string {
    return this._baseUrl.path;
  }

  set basePath(
    path: ConstructorParameters<typeof Path>[0]
  ) {
    this._baseUrl.path = path;
  }

  appendBasePath(
    ...path: Parameters<Url["appendPath"]>
  ): this {
    this._baseUrl.appendPath(...path);
    return this;
  }

  get commonParams(): typeof Callback.prototype.commonParamMap {
    return this.commonParamMap;
  }

  get commonQuery(): typeof Url.prototype.query {
    return this._baseUrl.query;
  }

  get commonParamTuples(): typeof Url.prototype.queryTuples {
    return this._baseUrl.queryTuples;
  }

  get commonParamMap(): typeof Url.prototype.queryMap {
    return this._baseUrl.queryMap;
  }

  set commonParams(
    params: ConstructorParameters<typeof Query>[0]
  ) {
    this._baseUrl.query = params;
  }

  addCommonParam(
    ...params: Parameters<Url["addParam"]>
  ): this {
    this._baseUrl.addParam(
      ...params
    );
    return this;
  }

  deleteCommonParam(
    ...keys: Parameters<Url["deleteParam"]>
  ): this {
    this._baseUrl.deleteParam(
      ...keys
    );
    return this;
  }

  getCommonParam(
    ...key: Parameters<Url["getParam"]>
  ): ReturnType<Url["getParam"]> {
    return this._baseUrl.getParam(
      ...key
    );
  }

  hasCommonParam(
    ...key: Parameters<Url["hasParam"]>
  ): ReturnType<Url["hasParam"]> {
    return this._baseUrl.hasParam(
      ...key
    );
  }

  request(
    path: ConstructorParameters<typeof Path>[0],
    query: ConstructorParameters<typeof Query>[0],
    attachCommonParams: boolean = true,
    overrideCommonParams: boolean = true
  ): ReturnType<Url["xCallback"]> {
    const cUrl: Url = new Callback.Url(this._baseUrl);
    cUrl.appendPath(path);
    if (attachCommonParams) {
      if (overrideCommonParams)
        cUrl.addParam(query);
      else {
        const commonQuery: string = cUrl.query;
        cUrl.query = query;
        cUrl.addParam(commonQuery);
      }
    }
    else {
      cUrl.query = "";
      cUrl.query = query;
    }
    return cUrl.xCallback();
  }

  toString(): string {
    return this.baseUrl;
  }

  get Url(): typeof Url {
    return Callback.Url;
  }

  get Query(): typeof Query {
    return Callback.Query;
  }

  static get Url(): typeof Url {
    return importModule("Url");
  }

  static get Query(): typeof Query {
    return Callback.Url.Query;
  }

}

module.exports = Callback;