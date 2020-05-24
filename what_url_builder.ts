
const PROTO_SUFFIX = '//';

class WhatUrl {
    protocol: string;
    username: string;
    password: string;
    hostname: string;
    port: number | null;
    pathname: string;
    query: Map<string, string | number | boolean | null>;
    hash: string;
    constructor(whatUrlBuilder: WhatUrlBuilder) {
        this.protocol = whatUrlBuilder.protocol;
        this.username = whatUrlBuilder.username;
        this.password = whatUrlBuilder.password;
        this.hostname = whatUrlBuilder.hostname;
        this.port = whatUrlBuilder.port;
        this.pathname = whatUrlBuilder.pathname;
        this.query = whatUrlBuilder.query;
        this.hash = whatUrlBuilder.hash;
    }
    getOrigin() {
        return this.protocol + PROTO_SUFFIX;
    }
    getParam(key: string) {
        return this.query.get(key);
    }
    toString(): string {
        let urlStr = '';
    
        if (this.protocol) {
            urlStr = this.protocol + PROTO_SUFFIX;
        }

        if (this.username) {
            urlStr = urlStr + this.username;

            if (this.password) {
                urlStr = urlStr + ':' + this.password;
            }

            urlStr = urlStr + '@';
        }

        if (this.hostname) {
            urlStr = urlStr + this.hostname;
        }

        if (this.port) {
            urlStr = urlStr + ':' + this.port;
        }

        if (this.query.size > 0) {
            const paramArr: Array<string> = [];
            urlStr = urlStr + '?';
            this.query.forEach((value: string | number | boolean | null, key: string) => {
                if (value === null) {
                    paramArr.push(key + '=');
                } else {
                    paramArr.push(key + '=' + value);
                }
            });
            urlStr = urlStr + paramArr.join('&');
        }

        if (this.hash) {
            urlStr = urlStr + '#' + this.hash;
        }

        return urlStr;
    }
}

const parseQueryString = function (qs: string): Map<string, string | number | boolean | null> {
    return new Map<string, string>();
};

class WhatUrlBuilder {

    private _protocol: string = '';
    private _username: string = '';
    private _password: string = '';
    private _hostname: string = '';
    private _port: number | null = null;
    private _pathname: string = '';
    private _query: Map<string, string | number | boolean | null> = new Map();
    private _hash: string = '';

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
        } else if (typeof whatUrl === 'string') {
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

    addParam(key: string, value: string | number | boolean) {
        this._query.set(key, value);
        return this;
    }

    removeParam(key: string) {
        if(this._query.get(key)) {
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

    setQuery(query: Map<string, string>) {
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

export { WhatUrlBuilder, WhatUrl }