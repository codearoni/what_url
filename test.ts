import { assertEquals, assertThrows } from "https://deno.land/std/testing/asserts.ts";
import { WhatUrlBuilder } from "./what_url_builder.ts";

Deno.test({
    name: 'Returns correct origin given a protocol',
    fn(): void {
        const url = new WhatUrlBuilder()
            .setProtocol('https:')
            .build();
        
        assertEquals(url.getOrigin(), 'https://');
    }
});

Deno.test({
    name: 'Creates a fully populated url',
    fn(): void {
        const url = new WhatUrlBuilder()
            .setProtocol('https:')
            .setUsername('what')
            .setPassword('1234')
            .setHostname('deno.land')
            .setPort(8080)
            .setPathname('path/to/file')
            .addParam('x', 'hello_world')
            .addParam('y', 2)
            .addParam('z', true)
            .setHash('asdf')
            .build();

        assertEquals(url.toString(), 'https://what:1234@deno.land:8080?x=hello_world&y=2&z=true#asdf');
    }
});

Deno.test({
    name: 'Parses a fully populated url',
    fn(): void {
        console.log(new URL('https://what:1234@deno.land:8080?x=hello_world&y=&z=true#asdf'));
        const url = new WhatUrlBuilder('https://what:1234@deno.land:8080?x=hello_world&y=&z=true#asdf')

        console.log(url);
    }
});

Deno.test({
    name: 'Parses a url',
    fn(): void {
        console.log(new URL('https://what:1234@deno.land:8080#asdf'));
        const url = new WhatUrlBuilder('https://what:1234@deno.land:8080#asdf')

        console.log(url);
    }
});