import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { WhatUrl, QueryParameters } from "./what_url.ts";

Deno.test({
  name: "Returns correct origin given a protocol",
  fn(): void {
    const url = new WhatUrl()
      .setProtocol("https:")
      .build();

    assertEquals(url.origin, "https://");
  },
});

Deno.test({
  name: "Returns correct origin given a protocol and host",
  fn(): void {
    const url = new WhatUrl()
      .setProtocol("https:")
      .setHostname("deno.land")
      .setPort(8000)
      .build();

    assertEquals(url.origin, "https://deno.land:8000");
  },
});

Deno.test({
  name: "Returns an auth with no password",
  fn(): void {
    const url = new WhatUrl()
      .setProtocol("https:")
      .setUsername("what")
      .setHostname("deno.land")
      .setPort(8080)
      .setPathname("path/to/file")
      .addParam("x", "hello_world")
      .addParam("y", 2)
      .addParam("z", true)
      .setHash("asdf")
      .build();

    assertEquals(url.auth, url.username);
  },
});

Deno.test({
  name: "Returns an auth with a password",
  fn(): void {
    const url = new WhatUrl()
      .setProtocol("https:")
      .setUsername("what")
      .setPassword("1234")
      .setHostname("deno.land")
      .setPort(8080)
      .setPathname("path/to/file")
      .addParam("x", "hello_world")
      .addParam("y", 2)
      .addParam("z", true)
      .setHash("asdf")
      .build();

    assertEquals(url.auth, url.username + ":" + url.password);
  },
});

Deno.test({
  name: "Returns a host without a port",
  fn(): void {
    const url = new WhatUrl()
      .setProtocol("https:")
      .setUsername("what")
      .setPassword("1234")
      .setHostname("deno.land")
      .setPathname("path/to/file")
      .addParam("x", "hello_world")
      .addParam("y", 2)
      .addParam("z", true)
      .setHash("asdf")
      .build();

    assertEquals(url.host, url.hostname);
  },
});

Deno.test({
  name: "Returns a host with a port",
  fn(): void {
    const url = new WhatUrl()
      .setProtocol("https:")
      .setUsername("what")
      .setPassword("1234")
      .setHostname("deno.land")
      .setPort(8080)
      .setPathname("path/to/file")
      .addParam("x", "hello_world")
      .addParam("y", 2)
      .addParam("z", true)
      .setHash("asdf")
      .build();

    assertEquals(url.host, url.hostname + ":" + url.port);
  },
});

Deno.test({
  name: "Returns a hash",
  fn(): void {
    const url = new WhatUrl()
      .setProtocol("https:")
      .setUsername("what")
      .setPassword("1234")
      .setHostname("deno.land")
      .setPort(8080)
      .setPathname("path/to/file")
      .addParam("x", "hello_world")
      .addParam("y", 2)
      .addParam("z", true)
      .setHash("asdf")
      .build();

    assertEquals(url.hash, "asdf");
  },
});

Deno.test({
  name: "Returns the correct query params",
  fn(): void {
    const url = new WhatUrl()
      .setProtocol("https:")
      .setUsername("what")
      .setPassword("1234")
      .setHostname("deno.land")
      .setPort(8080)
      .setPathname("path/to/file")
      .addParam("x", "hello_world")
      .addParam("y", 2)
      .addParam("z", true)
      .setHash("asdf")
      .build();

    assertEquals(url.getParam("x"), "hello_world");
    assertEquals(url.getParam("y"), "2");
    assertEquals(url.getParam("z"), "true");
  },
});

Deno.test({
  name: "Returns undefined for a missing param",
  fn(): void {
    const url = new WhatUrl()
      .setProtocol("https:")
      .setUsername("what")
      .setPassword("1234")
      .setHostname("deno.land")
      .setPort(8080)
      .setPathname("path/to/file")
      .addParam("x", "hello_world")
      .addParam("y", 2)
      .addParam("z", true)
      .setHash("asdf")
      .build();

    assertEquals(url.getParam("check"), undefined);
  },
});

Deno.test({
  name: "Removes the param",
  fn(): void {
    const url = new WhatUrl()
      .setProtocol("https:")
      .setUsername("what")
      .setPassword("1234")
      .setHostname("deno.land")
      .setPort(8080)
      .setPathname("path/to/file")
      .addParam("x", "hello_world")
      .addParam("y", 2)
      .addParam("z", true)
      .removeParam("x")
      .setHash("asdf")
      .build();

    assertEquals(url.getParam("x"), undefined);
  },
});

Deno.test({
  name: "Creates a fully populated url",
  fn(): void {
    const url = new WhatUrl()
      .setProtocol("https:")
      .setUsername("what")
      .setPassword("1234")
      .setHostname("deno.land")
      .setPort(8080)
      .setPathname("path/to/file")
      .addParam("x", "hello_world")
      .addParam("y", 2)
      .addParam("z", true)
      .setHash("asdf")
      .build();

    assertEquals(
      url.href,
      "https://what:1234@deno.land:8080/path/to/file?x=hello_world&y=2&z=true#asdf",
    );
  },
});

Deno.test({
  name: "Returns the query",
  fn(): void {
    const url = new WhatUrl()
      .setProtocol("https:")
      .setUsername("what")
      .setPassword("1234")
      .setHostname("deno.land")
      .setPort(8080)
      .setPathname("path/to/file")
      .addParam("x", "hello_world")
      .addParam("y", 2)
      .addParam("z", true)
      .setHash("asdf")
      .build();

    assertEquals(url.query, "x=hello_world&y=2&z=true");
  },
});

Deno.test({
  name: "Returns the search",
  fn(): void {
    const url = new WhatUrl()
      .setProtocol("https:")
      .setUsername("what")
      .setPassword("1234")
      .setHostname("deno.land")
      .setPort(8080)
      .setPathname("path/to/file")
      .addParam("x", "hello_world")
      .addParam("y", 2)
      .addParam("z", true)
      .setHash("asdf")
      .build();

    assertEquals(url.search, "?x=hello_world&y=2&z=true");
  },
});

Deno.test({
  name: "Returns the path",
  fn(): void {
    const url = new WhatUrl()
      .setProtocol("https:")
      .setUsername("what")
      .setPassword("1234")
      .setHostname("deno.land")
      .setPort(8080)
      .setPathname("path/to/file")
      .addParam("x", "hello_world")
      .addParam("y", 2)
      .addParam("z", true)
      .setHash("asdf")
      .build();

    assertEquals(url.path, "path/to/file?x=hello_world&y=2&z=true");
  },
});

Deno.test({
  name: "Parses a fully populated url",
  fn(): void {
    const url = new WhatUrl(
      "https://what:1234@deno.land:8080?x=hello_world&y=&z=true#asdf",
    ).build();

    assertEquals(url.protocol, "https:");
    assertEquals(url.username, "what");
    assertEquals(url.password, "1234");
    assertEquals(url.hostname, "deno.land");
    assertEquals(url.port, "8080");
    assertEquals(url.host, "deno.land:8080");
    assertEquals(url.getParam("x"), "hello_world");
    assertEquals(url.getParam("y"), "");
    assertEquals(url.getParam("z"), "true");
    assertEquals(url.hash, "#asdf");
  },
});

Deno.test({
  name: "Accepts the QueryParameters var as a valid type",
  fn(): void {
    const baseUrl = new WhatUrl(
      "https://what:1234@deno.land:8080",
    ).build();

    const qs: QueryParameters = new Map();
    qs.set("x", "1");
    qs.set("y", "2");
    qs.set("z", "3");
    qs.set("a", "");

    const url = new WhatUrl(baseUrl).setQuery(qs).build();

    assertEquals(url.protocol, "https:");
    assertEquals(url.username, "what");
    assertEquals(url.password, "1234");
    assertEquals(url.hostname, "deno.land");
    assertEquals(url.port, "8080");
    assertEquals(url.host, "deno.land:8080");
    assertEquals(url.getParam("x"), "1");
    assertEquals(url.getParam("y"), "2");
    assertEquals(url.getParam("z"), "3");
    assertEquals(url.getParam("a"), "");
  },
});

Deno.test({
  name: "Correctly encodes an embedded url within the query string",
  fn(): void {
    const baseUrl = new WhatUrl(
      "https://what:1234@deno.land:8080",
    ).build();

    const urlToEncode = new WhatUrl(
      "https://some.url.example.com/path/to/endpoint?a=1&b=2&c=3",
    ).build();

    const url = new WhatUrl(baseUrl)
      .addParam("embedded", urlToEncode.href)
      .build();

    assertEquals(
      url.href,
      "https://what:1234@deno.land:8080/?embedded=https%3A%2F%2Fsome.url.example.com%2Fpath%2Fto%2Fendpoint%3Fa%3D1%26b%3D2%26c%3D3",
    );
  },
});

Deno.test({
  name: "Correctly decodes a url when parsing a query string",
  fn(): void {
    const baseUrl = new WhatUrl(
      "https://what:1234@deno.land:8080?embedded=https%3A%2F%2Fsome.url.example.com%3Fa%3D1%26b%3D2%26c%3D3",
    ).build();

    const embedUrl = baseUrl.getParam("embedded");
    const decodedUrl = new WhatUrl(embedUrl)
      .build();

    assertEquals(
      decodedUrl.href,
      "https://some.url.example.com/?a=1&b=2&c=3",
    );
  },
});

Deno.test({
  name: "Marshals a given query param of type WhatUrl into an encoded string",
  fn(): void {
    const embeddedUrl = new WhatUrl()
      .setProtocol("https:")
      .setUsername("what")
      .setPassword("1234")
      .setHostname("deno.land")
      .setPort(8080)
      .setPathname("path/to/file")
      .addParam("x", "hello_world")
      .addParam("y", 2)
      .addParam("z", true)
      .setHash("asdf")
      .build();

    const baseUrl = new WhatUrl()
      .setProtocol("https:")
      .setHostname("some.site.net")
      .setPathname("/endpoint")
      .addParam("embedUrl", embeddedUrl)
      .build();

    assertEquals(
      baseUrl.href,
      "https://some.site.net/endpoint?embedUrl=https%3A%2F%2Fwhat%3A1234%40deno.land%3A8080%2Fpath%2Fto%2Ffile%3Fx%3Dhello_world%26y%3D2%26z%3Dtrue%23asdf",
    );
  },
});

Deno.test({
  name: "Decodes a url in the query string correctly",
  fn(): void {
    const baseUrl = new WhatUrl(
      "https://some.site.net/endpoint?embedUrl=https%3A%2F%2Fwhat%3A1234%40deno.land%3A8080%2Fpath%2Fto%2Ffile%3Fx%3Dhello_world%26y%3D2%26z%3Dtrue%23asdf",
    ).build();

    const embeddedUrl = baseUrl.getParam("embedUrl");

    assertEquals(
      embeddedUrl,
      "https://what:1234@deno.land:8080/path/to/file?x=hello_world&y=2&z=true#asdf",
    );
  },
});

Deno.test({
  name: "URL SEARCH PARAMS",
  fn(): void {
    const baseUrl = new WhatUrl(
      "https://some.site.net/endpoint?a=&b=2&c=asdf&embedUrl=https%3A%2F%2Fwhat%3A1234%40deno.land%3A8080%2Fpath%2Fto%2Ffile%3Fx%3Dhello_world%26y%3D2%26z%3Dtrue%23asdf",
    ).build();

    const url = new URL(baseUrl.href);

    console.log(typeof url.searchParams.get("a"));
  },
});
