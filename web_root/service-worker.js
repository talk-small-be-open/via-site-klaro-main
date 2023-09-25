// Dead simple minimalistic service worker, just for the sake to have one and to be a PWA

// OPTIMIZE?: Cache the bare bare stuff, to startup offline, like splash logo, ...

self.addEventListener('fetch',  fetchEvent => {

	return;
	
  // const request = fetchEvent.request;

	// return fetch(request);
	
  // if (request.method !== 'GET') {
  //   return;
  // }

	
});

self.addEventListener("install", event => {
  console.log("Service Worker installing.");
});

self.addEventListener("activate", event => {
  console.log("Service Worker activating.");
});

// If we really rely on it, then do a reload, to have it fully working on the very first request
//navigator.serviceWorker.ready.then(reload);
