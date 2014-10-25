# Sevice Worker Caches

## One tiny problem

Service Workers will be really helpful for creating offline apps.  Unfortunately they're not yet implemented any browser, even the very latest Firefox Nightlies or Chrome Canaries.  A [polyfill (using IndexedDB) has been created](https://github.com/jeffposnick/service-worker-cache), which we will use instead.
