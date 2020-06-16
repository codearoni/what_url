import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { WhatUrl } from "./what_url.ts";

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
    assertEquals(url.getParam("y"), 2);
    assertEquals(url.getParam("z"), true);
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
      url.toString(),
      "https://what:1234@deno.land:8080?x=hello_world&y=2&z=true#asdf",
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

    assertEquals(url.getQuery(), "x=hello_world&y=2&z=true");
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

    assertEquals(url.getSearch(), "?x=hello_world&y=2&z=true");
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

    assertEquals(url.getPath(), "path/to/file?x=hello_world&y=2&z=true");
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
    assertEquals(url.port, 8080);
    assertEquals(url.host, "deno.land:8080");
    assertEquals(url.getParam("x"), "hello_world");
    assertEquals(url.getParam("y"), null);
    assertEquals(url.getParam("z"), "true");
    assertEquals(url.hash, "#asdf");
  },
});
