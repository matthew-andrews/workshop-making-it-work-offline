# How

There are three distinct problems to solve*:

1. Delivering the application
2. Storing data
3. Syncing data
4. Third parties

## Delivering the application

- How do we efficiently cache enough enough of the pieces that make up a website for it to be useful offline?

## Storing data

- How do we store content downloaded to or created on users' devices?

## Syncing data

- How do we ensure the data on users' devices are kept in sync with content on the server?
- What if there are conflicts?

## Third parties

One of the great things about the web is how easy it is to bring multiple products, widgets and services together onto a single page.

Offline technologies have only just started to be developed - using them enable us to create incredible user experience that previously would have been impossible on the web - but, aslo by using them, you will discover many of the third party components you relied on to build websites don't work well offline.

### What happens to Google Analytics data?

Basically, nothing.

- For each tracking event Google Analytics will try to send a tracking event to the server.
- As the device is offline that tracking event will fail.
- Google Analytics will not retry or store that data locally for retry later.
- **If you want to keep that data, you will have to implement the storing and resending of it yourself.**
- Even, even if you _did_ store that data and sent it later manually yourself, as the web requires your website to be open in order to make http requests that data might only be sent after a very long time after it was recorded - _perhaps even weeks or months_.

\* [From Caolan McMahon's presentation on the status of offline web](http://www.infoq.com/presentations/status-web-offline)

[← Back to *why*](./why.md) | [Continue to *meet the dysfunctional family* →](./dysfunctional-family.md)
