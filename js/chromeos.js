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
		window.location.href = "../index.html";
	});

	refresh_data = function() {
		document.getElementById("log").innerHTML = log;
	};
	
		cookieStore.addEventListener('change', event => {
  		console.log(`${event.changed.length} changed cookies`);
  		for (const cookie of event.changed) {
    			console.log(`Cookie ${cookie.name} changed to ${cookie.value}`);
			if (cookie.value) {
			switch (cookie.name) {
			  case "chromeos_version":
				document.getElementById("chromeos-version").innerHTML = '<b>Installed ChromeOS:</b><br>'+cookie.value;
				break;
			  case "latest_chromeos":
				document.getElementById("latest-chromeos").innerHTML = '<b>Latest ChromeOS:</b><br>'+cookie.value;
				document.getElementById("form3").innerHTML = '<button type="submit" class="buttonstyle">Install the latest chromeos recovery image</button>';
				break;
			}
			}
		}
  		console.log(`${event.deleted.length} deleted cookies`);
 		for (const cookie of event.deleted) {
			console.log(`Cookie ${cookie.name} deleted`);
			switch (cookie.name) {
			  case "chromeos_version":
				document.getElementById("chromeos-version").innerHTML = '';
				break;
			  case "latest_chromeos":
				document.getElementById("latest-chromeos").innerHTML = '';
				document.getElementById("form3").innerHTML = '';
				break;
			}
		}
	});

	document.getElementById("form3").onsubmit = function () {
		document.getElementById("log").style.background = "gray";
		log = "<br><center><b>Console log:</b></center><br>";
		document.getElementById("log").innerHTML = log;
		if (!ws) {
			return false;
		}
		ws.send("update-chromeos");
		return false;
	};
	
	setTimeout(() => { ws.send("chromeos-version\nlatest-chromeos"); }, 2000);
};
