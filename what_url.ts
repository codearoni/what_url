type IQueryParam = string | number | boolean | WhatUrl | null;
type IQuery = Map<string, string>;

const parseQueryString = function (qs: string): IQuery {
  const qsMap = new Map<string, string>();
  if (qs.length <= 1) {
    return qsMap;
  }

  const queryString = qs.startsWith("?") ? qs.substring(1) : qs;
  const kvPairs = queryString.split("&");

  kvPairs.forEach((pair) => {
    const entry = pair.split("=");
    qsMap.set(entry[0], decodeURIComponent(entry[1]) || "");
  });

  return qsMap;
};

const createQueryString = (qsMap: IQuery): string => {
  const paramArr: Array<string> = [];
  let urlStr = "";
  qsMap.forEach((value: IQueryParam, key: string) => {
    if (value === null) {
      paramArr.push(key + "=");
    } else if (value instanceof WhatUrl) {
      paramArr.push(key + "=" + encodeURIComponent(value.href));
    } else {
      paramArr.push(key + "=" + encodeURIComponent(value));
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
  readonly port: string;
  readonly pathname: string;
  private _query: IQuery;
  readonly hash: string;
  // calculated parameters
  readonly origin: string;
  readonly auth: string;
  readonly host: string;
  readonly query: string;
  readonly search: string;
  readonly path: string;
  readonly href: string;
  constructor(whatUrlBuilder: WhatUrlBuilder) {
    // component parameters
    this.protocol = whatUrlBuilder.protocol;
    this.username = whatUrlBuilder.username;
    this.password = whatUrlBuilder.password;
    this.hostname = whatUrlBuilder.hostname;
    this.port = whatUrlBuilder.port;
    this.pathname = whatUrlBuilder.pathname;
    this._query = whatUrlBuilder.query;
    this.hash = whatUrlBuilder.hash;
    // calculated parameters
    this.auth = this.username + (this.password ? ":" + this.password : "");
    this.host = this.hostname + (this.port ? ":" + this.port : "");
    this.origin = this.protocol + this._protoSuffix + this.host;
    this.query = createQueryString(this._query);
    this.search = "?" + this.query;
    this.path = this.pathname + this.search;
    this.href = this.createHref();
  }
  getParam(key: string) {
    return this._query.get(key);
  }
  private createHref(): string {
    let hrefStr = "";

    if (this.protocol) {
      hrefStr = this.protocol + this._protoSuffix;
    }

    if (this.username) {
      hrefStr = hrefStr + this.username;

      if (this.password) {
        hrefStr = hrefStr + ":" + this.password;
      }

      hrefStr = hrefStr + "@";
    }

    if (this.hostname) {
      hrefStr = hrefStr + this.hostname;
    }

    if (this.port) {
      hrefStr = hrefStr + ":" + this.port;
    }

    if (this.pathname) {
      hrefStr = hrefStr +
        (this.pathname.startsWith("/") ? this.pathname : "/" + this.pathname);
    }

    if (this._query.size > 0) {
      hrefStr = hrefStr + this.search;
    }

    if (this.hash) {
      hrefStr = hrefStr + "#" + this.hash;
    }

    return hrefStr;
  }
}

class WhatUrlBuilder {
  private _protocol: string = "";
  private _username: string = "";
  private _password: string = "";
  private _hostname: string = "";
  private _port: string = "";
  private _pathname: string = "";
  private _query: IQuery = new Map<string, string>();
  private _search: string = "";
  private _hash: string = "";

  constructor(whatUrl?: WhatUrl | string | null) {
    if (whatUrl instanceof WhatUrl) {
      this._protocol = whatUrl.protocol;
      this._username = whatUrl.username;
      this._password = whatUrl.password;
      this._hostname = whatUrl.hostname;
      this._port = whatUrl.port;
      this._pathname = whatUrl.pathname;
      this._search = whatUrl.search;
      this._hash = whatUrl.hash;
    } else if (typeof whatUrl === "string") {
      const parsedUrl = new URL(whatUrl);
      this._protocol = parsedUrl.protocol;
      this._username = parsedUrl.username;
      this._password = parsedUrl.password;
      this._hostname = parsedUrl.hostname;
      this._port = parsedUrl.port;
      this._pathname = parsedUrl.pathname;
      this._search = parsedUrl.search;
      this._query = parseQueryString(parsedUrl.search);
      this._hash = parsedUrl.hash;
    }
  }

  addParam(key: string, value: IQueryParam) {
    const param = (value === null)
      ? ""
      : (value instanceof WhatUrl ? value.href : value + "");
    this._query.set(key, param);
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

  setPort(port: string | number) {
    this._port = (typeof port === "number") ? port.toString() : port;
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

export type { IQuery as QueryParams, IQueryParam as QueryParam };
