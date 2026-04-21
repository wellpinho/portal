self.addEventListener("install", (event) => {
  console.log("[SW] Installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
  console.log("[SW] Activated");
});

self.addEventListener("fetch", (event) => {
  console.log("[SW] Fetch:", event.request.url);
});
