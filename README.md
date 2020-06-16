# what url
> A [whatwg url](https://url.spec.whatwg.org/) builder for deno

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