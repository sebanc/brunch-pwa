self.importScripts('js/cookie.js');
self.importScripts('js/ws.js');

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open('v1').then(function(cache) {
			return cache.addAll([
				'/brunch-pwa/',
				'/brunch-pwa/index.html',
				'/brunch-pwa/css/style.css',
				'/brunch-pwa/html/addons.html',
				'/brunch-pwa/html/chromeos.html',
				'/brunch-pwa/html/settings.html',
				'/brunch-pwa/images/background/background.png',
				'/brunch-pwa/images/icons/48.png',
				'/brunch-pwa/images/icons/96.png',
				'/brunch-pwa/images/icons/144.png',
				'/brunch-pwa/images/icons/192.png',
				'/brunch-pwa/images/icons/256.png',
				'/brunch-pwa/images/icons/384.png',
				'/brunch-pwa/images/icons/512.png',
				'/brunch-pwa/js/addons.js',
				'/brunch-pwa/js/brunch.js',
				'/brunch-pwa/js/chromeos.js',
				'/brunch-pwa/js/cookie.js',
				'/brunch-pwa/js/settings.js',
				'/brunch-pwa/js/ws.js'
			]);
		})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		fetch(event.request).catch(function() {
			return caches.match(event.request);
		})
	);
});

const GetVersion = async () => {
	console.log('In periodicsync handler');
	ws_connect();
	setTimeout(() => { ws.send("latest-stable\nlatest-unstable\nlatest-chromeos"); }, 2000);
};

self.addEventListener('periodicsync', event => {
	console.log('syncing started.');
	if (event.tag == 'get-latest-version') {
		event.waitUntil(GetVersion());
	}
});

self.addEventListener('notificationclick', function (event) {
	console.log(event.notification.data.tab);
	const rootUrl = new URL('/brunch-pwa/', location).href;
	var targetUrl;
	if (event.notification.data.tab === "brunch") {
		targetUrl = new URL('/brunch-pwa/', location).href;
	} else {
		targetUrl = new URL('/brunch-pwa/html/' + event.notification.data.tab + '.html', location).href;
	}
	event.notification.close();
	event.waitUntil(
		clients.matchAll().then(matchedClients => {
			for (let client of matchedClients) {
				if (client.url.indexOf(rootUrl) >= 0) {
					client.navigate(targetUrl);
					return client.focus();
				}
			}
			return clients.openWindow(targetUrl);
		})
	);
});
