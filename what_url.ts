import { WhatUrlBuilder } from "./what_url_builder";

class WhatUrl {
    protocol: string;
    username: string;
    password: string;
    hostname: string;
    port: number;
    pathname: string;
    query: string;
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
}

export { WhatUrl }