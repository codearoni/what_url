# what url

> A [whatwg](https://url.spec.whatwg.org/) url builder for
> [deno](https://deno.land/)

![whaturl-ci](https://github.com/codearoni/what_url/workflows/whaturl-ci/badge.svg?branch=master)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              href                                              │
├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │          host          │           path            │ hash  │
│          │  │                     ├─────────────────┬──────┼──────────┬────────────────┤       │
│          │  │                     │    hostname     │ port │ pathname │     search     │       │
│          │  │                     │                 │      │          ├─┬──────────────┤       │
│          │  │                     │                 │      │          │ │    query     │       │
"  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          │  │          │          │    hostname     │ port │          │                │       │
│          │  │          │          ├─────────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │          host          │          │                │       │
├──────────┴──┼──────────┴──────────┼────────────────────────┤          │                │       │
│   origin    │                     │         origin         │ pathname │     search     │ hash  │
├─────────────┴─────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
│                                              href                                              │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## Import

```ts
import {
  QueryParam,
  QueryParams,
  WhatUrl,
} from "https://github.com/codearoni/what_url/blob/master/mod.ts";
```

## Usage

#### Basic url building:

```ts
const url = new WhatUrl()
  .setProtocol("https:")
  .setHostname("deno.land")
  .setPathname("/path/to/endpoint")
  .build();

console.log(url.href); // https://deno.land/path/to/endpoint
```

#### Build a WhatUrl given an existing string

```ts
const url = new WhatUrl(
  "https://what:1234@deno.land:8080/path/to/endpoint?x=hello_world&y=&z=true#asdf",
).build();

console.log(url.protocol); // https:
console.log(url.user); // what
console.log(url.password); // 1234
console.log(url.hostname); // deno.land
console.log(url.port); // 8080
console.log(url.pathname); // /path/to/endpoint
console.log(url.query); // x=hello_world&y=&z=true
console.log(url.search); // ?x=hello_world&y=&z=true
console.log(url.path); // /path/to/endpoint?x=hello_world&y=&z=true
console.log(url.hash); // #asdf
console.log(url.origin); // http://deno.land:8080
console.log(url.auth); // what:1234
console.log(url.host); // deno.land:8080
console.log(url.href); // https://what:1234@deno.land:8080/path/to/endpoint?x=hello_world&y=&z=true#asdf
```

#### Build a WhatUrl based on an existing WhatUrl

```ts
const urlA = new WhatUrl()
  .setProtocol("https:")
  .setHostname("subdomain.example.com")
  .setPort(3000)
  .build();

const urlB = new WhatUrl(urlA)
  .addParam("x", 1)
  .addParam("y", 2)
  .addParam("z", 3)
  .build();

console.log(urlB.href); // https://subdomain.example.com:3000?x=1&y=2&z=3
```

#### Parse a given url and retrieve a parameter

```ts
const url = new WhatUrl(
  "https://what:1234@deno.land:8080/path/to/endpoint?x=hello_world&y=check123&z=true#asdf",
).build();

const param = url.getParam("y");
console.log(param); // check123
```

#### Create a WhatUrl using supported datatypes for QueryParam

```ts
// WhatUrl's .addParam() function converts values into strings for you
const numParam: QueryParam = 1;
const stringParam: QueryParam = "hello_world";
const boolParam: QueryParam = true;
const nullParam: QueryParam = null;

const urlA = new WhatUrl()
  .setProtocol("https:")
  .setHostname("subdomain.example.com")
  .setPort(3000)
  .addParam("a", numParam)
  .addParam("b", stringParam)
  .addParam("c", boolParam)
  .addParam("d", nullParam)
  .build();

console.log(urlA.href); // https://subdomain.example.com:3000?a=1&b=hello_world&c=true&d=
```

#### Create different urls with the same query string

```ts
const queryMap: QueryParams = new Map();
queryMap.set("a", "1");
queryMap.set("b", "asdf");
queryMap.set("c", "");

const urlA = new WhatUrl()
  .setProtocol("https:")
  .setHostname("subdomain.example.com")
  .setPort(3000)
  .setQuery(queryMap)
  .build();

const urlB = new WhatUrl()
  .setProtocol("https:")
  .setHostname("deno.land")
  .setPort(4000)
  .setQuery(queryMap)
  .build();

const urlC = new WhatUrl()
  .setProtocol("https:")
  .setHostname("some.site.net")
  .setPort(5000)
  .setQuery(queryMap)
  .build();

console.log(urlA.href); // https://subdomain.example.com:3000?a=1&b=asdf&c=
console.log(urlB.href); // https://deno.land:4000?a=1&b=asdf&c=
console.log(urlC.href); // https://some.site.net:5000?a=1&b=asdf&c=
```

#### Add a given url to the query string of another url

```ts
const baseUrl = new WhatUrl(
  "https://what:1234@deno.land:8080",
).build();

const urlInParams = "https://some.url.example.com/path/to/endpoint?a=1&b=2&c=3";

const url = new WhatUrl(baseUrl)
  .addParam("embedded", urlInParams)
  .build();

console.log(url.href); // https://what:1234@deno.land:8080/?embedded=https%3A%2F%2Fsome.url.example.com%2Fpath%2Fto%2Fendpoint%3Fa%3D1%26b%3D2%26c%3D3
```

#### Add a WhatUrl to the query string of another url

```ts
const urlInParams = new WhatUrl()
  .setProtocol("https:")
  .setHostname("subdomain.example.com")
  .setPort(3000)
  .addParam("x", null)
  .addParam("y", 500)
  .addParam("z", "hello_world")
  .build();

const baseUrl = new WhatUrl(
  "https://what:1234@deno.land:8080",
)
  .addParam("embedded", urlInParams)
  .build();

console.log(baseUrl.href); // https://what:1234@deno.land:8080/?embedded=https%3A%2F%2Fsubdomain.example.com%3A3000%3Fx%3D%26y%3D500%26z%3Dhello_world
```
