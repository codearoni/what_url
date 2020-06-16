# what url
> A [whatwg url](https://url.spec.whatwg.org/) builder for [deno](https://deno.land/)

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
    
    console.log(url.getHref());
    // => https://deno.land/path/to/endpoint
```

#### Build a WhatUrl given an existing string
``` ts
    const url = new WhatUrl(
      "https://what:1234@deno.land:8080?x=hello_world&y=&z=true#asdf",
    ).build();

    console.log(url.hostname);
    // => deno.land
```