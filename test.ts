// import { assertEquals, assertThrows } from "https://deno.land/std/testing/asserts.ts";
import { WhatUrlBuilder } from "./what_url_builder.ts";

Deno.test({
    name: 'Basic builder',
    fn(): void {
        const url = new WhatUrlBuilder()
            .setProtocol('https:')
            .setHostname('google.com')
            .setPathname('path/to/api/')
            .addParam('a', '1')
            .addParam('b', '2')
            .addParam('b', '3')
            .setHash('asdf')
            .build();
        
        const urlTwo = new WhatUrlBuilder(url).build();
        console.log(url.toString());
        console.log(urlTwo.toString());
    }
})