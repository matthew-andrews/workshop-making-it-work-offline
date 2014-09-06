# Success!

We have achieved the goal of creating an online-first news app that works on all major browsers and has a unique URL for every page that can render both on the server and the client.  But that success is bittersweet.  We've had to add hacks into every layer of our application - and we won't stop facing reprocussions for adding those hacks.  We need to be careful any time we make changes to any part of the application - even our CDN will need to be aware of what the `up` cookie means.

This is not a good place to be.  Although we've unlocked the ultimate offline user experience, maintaining this complex solution is almost guaranteed to cause us problems.

Luckily a better way is coming.

---

[← Back to *More hacking AppCache*](../04-more-hacking-appcache) | [Continue to *Offline news with Service Worker* →](../../06-offline-news-with-service-worker)
