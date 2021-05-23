var ws;
var log = "";

function refresh_data() {
	console.log("Data refresh requested without display");
}

async function showNotification(notification_text, tabname) {
	const title = 'Brunch PWA';
	const options = {
		body: notification_text,
		icon: '/brunch-pwa/images/icons/512.png',
		data: {
			tab: tabname,
		}
	};
	if (typeof Window !== 'undefined') {
		const sw = await navigator.serviceWorker.ready;
		sw.showNotification(title, options);
	} else {
		self.registration.showNotification(title, options);
	}
}

function ws_connect() {
	ws = new WebSocket("ws://localhost:8080");
	ws.onclose = function (evt) {
		console.log("Connection closed");
	};
	ws.onmessage = async function (evt) {
		var notifications = await getCookie("notifications");
		var brunch_stable = await getCookie("brunch_stable");
		var latest_stable = await getCookie("latest_stable");
		var brunch_unstable = await getCookie("brunch_unstable");
		var latest_unstable = await getCookie("latest_unstable");
		var chromeos = await getCookie("chromeos");
		var latest_chromeos = await getCookie("latest_chromeos");
		var messages = evt.data.split(':next:');
		for (var i = 0; i < messages.length; i++) {
			console.log("Message received: " + messages[i]);
			if (messages[0] === "brunch-version") {
				setCookie("brunch_version", messages[1]);
				break;
			}
			if (messages[0] === "latest-stable") {
				if (notifications.value === "yes" && brunch_stable.value === "yes") {
					if (latest_stable && latest_stable.value !== "" && messages[1] !== "" && latest_stable.value !== messages[1]) {
						showNotification("New brunch stable release available: " + messages[1], "brunch");
					}
				}
				setCookie("latest_stable", messages[1]);
				break;
			}
			if (messages[0] === "latest-unstable") {
				if (notifications.value === "yes" && brunch_unstable.value === "yes") {
					if (latest_unstable && latest_unstable.value !== "" && messages[1] !== "" && latest_unstable.value !== messages[1]) {
						showNotification("New brunch unstable release available: " + messages[1], "brunch");
					}
				}
				setCookie("latest_unstable", messages[1]);
				break;
			}
			if (messages[0] === "chromeos-version") {
				setCookie("chromeos_version", messages[1]);
				break;
			}
			if (messages[0] === "latest-chromeos") {
				if (notifications.value === "yes" && chromeos.value === "yes") {
					if (latest_chromeos && latest_chromeos.value !== "" && messages[1] !== "" && latest_chromeos.value !== messages[1]) {
						showNotification("New recovery image available: " + messages[1], "chromeos");
					}
				}
				setCookie("latest_chromeos", messages[1]);
				break;
			}
			log += messages[i] + '<br>';
		}
		refresh_data();
	};
}

