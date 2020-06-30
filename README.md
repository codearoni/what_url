# what url
> A [whatwg](https://url.spec.whatwg.org/) url builder for [deno](https://deno.land/)

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
``` ts
import { WhatUrl, QueryParameters } from "https://github.com/codearoni/what_url/blob/master/mod.ts";
```

## Usage

#### Basic url building:
``` ts
const url = new WhatUrl()
  .setProtocol("https:")
  .setHostname("deno.land")
  .setPathname("/path/to/endpoint")
  .build();

console.log(url.getHref()); // https://deno.land/path/to/endpoint
```

#### Build a WhatUrl given an existing string
``` ts
const url = new WhatUrl(
  "https://what:1234@deno.land:8080/path/to/endpoint?x=hello_world&y=&z=true#asdf",
).build();

console.log(url.protocol);    // https:
console.log(url.user);        // what
console.log(url.password);    // 1234
console.log(url.hostname);    // deno.land
console.log(url.port);        // 8080
console.log(url.pathname);    // /path/to/endpoint
console.log(url.query);       // x=hello_world&y=&z=true
console.log(url.search);      // ?x=hello_world&y=&z=true
console.log(url.path);        // /path/to/endpoint?x=hello_world&y=&z=true
console.log(url.hash);        // #asdf
console.log(url.origin);      // http://deno.land:8080
console.log(url.auth);        // what:1234
console.log(url.host);        // deno.land:8080
console.log(url.getHref());   // https://what:1234@deno.land:8080/path/to/endpoint?x=hello_world&y=&z=true#asdf
```

#### Build a WhatUrl based on an existing WhatUrl
``` ts
const urlB = new WhatUrl()
  .setProtocol("https:")
  .setHostname("subdomain.example.com")
  .setPort(3000)
  .build();

const urlB = new WhatUrl(urlA)
  .addParam("x", 1)
  .addParam("y", 2)
  .addParam("z", 3)
  .build();

console.log(urlB.getHref()); // https://subdomain.example.com:3000?x=1&y=2&z=3
```

#### Parse a given url and retrieve a parameter
```ts
const url = new WhatUrl(
  "https://what:1234@deno.land:8080/path/to/endpoint?x=hello_world&y=check123&z=true#asdf",
).build();

const param = url.getParam("y");
console.log(param); // check123
```