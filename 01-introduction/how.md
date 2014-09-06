# How

There are four distinct problems to solve*:

1. Delivering the application
2. Detecting connectivity
3. Storing data
4. Syncing data

## Delivering the application

// todo

## Detecting connectivity

// todo

## Storing data

// todo

## Syncing data

// todo

## What happens to Google Analytics data?

Basically, nothing.

- For each tracking event Google Analytics will try to send a tracking event to the server.
- As the device is offline that tracking event will fail.
- Google Analytics will not retry or store that data locally for retry later.
- **If you want to keep that data, you will have to implement the storing and resending of it yourself.**
- Even, even if you _did_ store that data and sent it later manually yourself, as the web requires your website to be open in order to make http requests that data might only be sent after a very long time after it was recorded - _perhaps even weeks or months_.

\* [From Caolan McMahon's presentation on the status of offline web](http://www.infoq.com/presentations/status-web-offline)

[← Back to *why*](./why.md) | [Continue to *meet the dysfunctional family* →](./dysfunctional-family.md)
