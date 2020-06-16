type IQueryParam = string | number | boolean | null;
type IQuery = Map<string, IQueryParam>;

const createQueryString = (qsMap: IQuery): string => {
  const paramArr: Array<string> = [];
  let urlStr = "";
  qsMap.forEach((value: IQueryParam, key: string) => {
    if (value === null) {
      paramArr.push(key + "=");
    } else {
      paramArr.push(key + "=" + value);
    }
  });
  return urlStr + paramArr.join("&");
};

class WhatUrl {
  // component parameters
  private _protoSuffix = "//";
  readonly protocol: string;
  readonly username: string;
  readonly password: string;
  readonly hostname: string;
  readonly port: number | null;
  readonly pathname: string;
  readonly query: IQuery;
  readonly hash: string;
  // calculated parameters
  readonly origin: string;
  readonly auth: string;
  readonly host: string;
  constructor(whatUrlBuilder: WhatUrlBuilder) {
    // component parameters
    this.protocol = whatUrlBuilder.protocol;
    this.username = whatUrlBuilder.username;
    this.password = whatUrlBuilder.password;
    this.hostname = whatUrlBuilder.hostname;
    this.port = whatUrlBuilder.port;
    this.pathname = whatUrlBuilder.pathname;
    this.query = whatUrlBuilder.query;
    this.hash = whatUrlBuilder.hash;
    // calculated parameters
    this.auth = this.username + (this.password ? ":" + this.password : "");
    this.host = this.hostname + (this.port ? ":" + this.port : "");
    this.origin = this.protocol + this._protoSuffix + this.host;
  }
  getParam(key: string) {
    return this.query.get(key);
  }
  getQuery() {
    return createQueryString(this.query);
  }
  getSearch() {
    return "?" + this.getQuery();
  }
  getPath() {
    return this.pathname + this.getSearch();
  }
  getHref(): string {
    let urlStr = "";

    if (this.protocol) {
      urlStr = this.protocol + this._protoSuffix;
    }

    if (this.username) {
      urlStr = urlStr + this.username;

      if (this.password) {
        urlStr = urlStr + ":" + this.password;
      }

      urlStr = urlStr + "@";
    }

    if (this.hostname) {
      urlStr = urlStr + this.hostname;
    }

    if (this.port) {
      urlStr = urlStr + ":" + this.port;
    }

    if (this.query.size > 0) {
      urlStr = urlStr + "?" + createQueryString(this.query);
    }

    if (this.hash) {
      urlStr = urlStr + "#" + this.hash;
    }

    return urlStr;
  }
}

const parseQueryString = function (qs: string): IQuery {
  const qsMap = new Map<string, IQueryParam>();
  if (qs.length <= 1) {
    return qsMap;
  }

  const queryString = qs.startsWith("?") ? qs.substring(1) : qs;
  const kvPairs = queryString.split("&");

  kvPairs.forEach((pair) => {
    const entry = pair.split("=");
    qsMap.set(entry[0], entry[1] || null);
  });

  return qsMap;
};

class WhatUrlBuilder {
  private _protocol: string = "";
  private _username: string = "";
  private _password: string = "";
  private _hostname: string = "";
  private _port: number | null = null;
  private _pathname: string = "";
  private _query: IQuery = new Map();
  private _hash: string = "";

  constructor(whatUrl?: WhatUrl | string) {
    if (whatUrl instanceof WhatUrl) {
      this._protocol = whatUrl.protocol;
      this._username = whatUrl.username;
      this._password = whatUrl.password;
      this._hostname = whatUrl.hostname;
      this._port = whatUrl.port;
      this._pathname = whatUrl.pathname;
      this._query = whatUrl.query;
      this._hash = whatUrl.hash;
    } else if (typeof whatUrl === "string") {
      const parsedUrl = new URL(whatUrl);
      this._protocol = parsedUrl.protocol;
      this._username = parsedUrl.username;
      this._password = parsedUrl.password;
      this._hostname = parsedUrl.hostname;
      this._port = parseInt(parsedUrl.port, 10);
      this._pathname = parsedUrl.pathname;
      this._query = parseQueryString(parsedUrl.search);
      this._hash = parsedUrl.hash;
    }
  }

  addParam(key: string, value: IQueryParam) {
    this._query.set(key, value);
    return this;
  }

  removeParam(key: string) {
    if (this._query.get(key)) {
      this._query.delete(key);
    }
    return this;
  }

  setProtocol(protocol: string) {
    this._protocol = protocol;
    return this;
  }

  setUsername(username: string) {
    this._username = username;
    return this;
  }

  setPassword(password: string) {
    this._password = password;
    return this;
  }

  setHostname(hostname: string) {
    this._hostname = hostname;
    return this;
  }

  setPort(port: number) {
    this._port = port;
    return this;
  }

  setPathname(pathname: string) {
    this._pathname = pathname;
    return this;
  }

  setQuery(query: IQuery) {
    this._query = query;
    return this;
  }

  setHash(hash: string) {
    this._hash = hash;
    return this;
  }

  build() {
    return new WhatUrl(this);
  }

  get protocol() {
    return this._protocol;
  }

  get username() {
    return this._username;
  }

  get password() {
    return this._password;
  }

  get hostname() {
    return this._hostname;
  }

  get port() {
    return this._port;
  }

  get pathname() {
    return this._pathname;
  }

  get query() {
    return this._query;
  }

  get hash() {
    return this._hash;
  }
}

export { WhatUrlBuilder as WhatUrl };
