window.onload = function () {

	if (window["WebSocket"]) {
		ws_connect();
		ws.onclose = function (evt) {
			document.body.innerHTML = '<div style="direction: ltr; position: fixed; top: 0; z-index: 999999; display: block; width: 100%; height: 100%; background: #33266e"><p style="position: relative; top: 40%; display: block; font-size: 32px; font-weight: bold; color: #fff; margin: 0 auto; text-align: center">To use this feature you need to enable the brunch "pwa" option.</p></div>';
		};
	} else {
		document.body.innerHTML = '<div style="direction: ltr; position: fixed; top: 0; z-index: 999999; display: block; width: 100%; height: 100%; background: #33266e"><p style="position: relative; top: 40%; display: block; font-size: 32px; font-weight: bold; color: #fff; margin: 0 auto; text-align: center">To use this feature you need to enable the brunch "pwa" option.</p></div>';
	}

	checkCookie();

	window.addEventListener('appinstalled', () => {
		window.location.reload();
	});

	async function periodicsync() {
		const registration = await navigator.serviceWorker.ready;
		try {
			await registration.periodicSync.register('get-latest-version', {
				minInterval: 12 * 60 * 60 * 1000,
			});
		} catch {
			console.log('Periodic Sync could not be registered!');
			return;
		}
		if (Notification.permission !== "granted") {
			if (await Notification.requestPermission() === "granted") {
				setCookie("notifications", "yes");
				showNotification("Only brunch stable release update notifications are enabled by default. You can add more in the settings tab.", "brunch");
				return;
			}
			console.log("Notifications disabled by user");
			setCookie("notifications", "no");
			await registration.periodicSync.unregister('get-latest-version');
		}
	}

	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('/brunch-pwa/sw.js', {scope: '/brunch-pwa/'}).then(function(reg) {
			console.log('Registration succeeded. Scope is ' + reg.scope);
			periodicsync();
		}).catch(function(error) {
			console.log('Registration failed with ' + error);
		});
	};

	refresh_data = function() {
		document.getElementById("log").innerHTML = log;
	};
	
	cookieStore.addEventListener('change', event => {
  		console.log(`${event.changed.length} changed cookies`);
  		for (const cookie of event.changed) {
    			console.log(`Cookie ${cookie.name} changed to ${cookie.value}`);
			if (cookie.value) {
				switch (cookie.name) {
				  case "brunch_version":
					document.getElementById("brunch-version").innerHTML = '<b>Installed Brunch:</b><br>'+cookie.value;
					break;
				  case "latest_stable":
					document.getElementById("latest-stable").innerHTML = '<b>Stable Brunch:</b><br>'+cookie.value+'<br>=> <a href="https://github.com/sebanc/brunch/releases/latest" target="_blank">Changelog</a>';
					document.getElementById("form").innerHTML = '<button type="submit" class="buttonstyle">Install the latest stable brunch</button>';
					break;
				  case "latest_unstable":
					document.getElementById("latest-unstable").innerHTML = '<b>Unstable Brunch:</b><br>'+cookie.value+'<br>=> <a href="https://github.com/sebanc/brunch-unstable/releases/latest" target="_blank">Changelog</a>';
					document.getElementById("form2").innerHTML = '<button type="submit" class="buttonstyle">Install the latest unstable brunch</button>';
					break;
				}
			}
		}

  		console.log(`${event.deleted.length} deleted cookies`);
 		for (const cookie of event.deleted) {
			console.log(`Cookie ${cookie.name} deleted`);
			switch (cookie.name) {
			  case "brunch_version":
				document.getElementById("brunch-version").innerHTML = '';
				break;
			  case "latest_stable":
				document.getElementById("latest-stable").innerHTML = '';
				document.getElementById("form").innerHTML = '';
				break;
			  case "latest_unstable":
				document.getElementById("latest-unstable").innerHTML = '';
				document.getElementById("form2").innerHTML = '';
				break;
			}
		}
	});
	
	document.getElementById("warning").innerHTML = '<b>Warning: Updating to Brunch r103 will prevent you to access your data. Make sure to backup your data before updating and to powerwash after the update.</b>';

	document.getElementById("form").onsubmit = function () {
		document.getElementById("log").style.background = "#A9A9A9";
		log = "<center><b>Console log:</b></center><br>";
		document.getElementById("log").innerHTML = log;
		if (!ws) {
			return false;
		}
		ws.send("update-stable");
		return false;
	};

	document.getElementById("form2").onsubmit = function () {
		document.getElementById("log").style.background = "#A9A9A9";
		log = "<center><b>Console log:</b></center><br>";
		document.getElementById("log").innerHTML = log;
		if (!ws) {
			return false;
		}
		ws.send("update-unstable");
		return false;
	};

	setTimeout(() => { ws.send("brunch-version\nlatest-stable\nlatest-unstable\nlatest-chromeos"); }, 2000);
};
