window.onload = function () {
	var conn;
	var latest_stable;
	var log = document.getElementById("log");

	document.getElementById("form3").onsubmit = function () {
		document.getElementById("log").style.background = "gray";
		log.innerHTML = "<br>Console log:<br>";
		if (!conn) {
			return false;
		}
		conn.send("update-chromeos");
		return false;
	};

	if (window["WebSocket"]) {
		conn = new WebSocket("ws://localhost:8080");
		conn.onclose = function (evt) {
			document.body.innerHTML = '<div style="direction: ltr; position: fixed; top: 0; z-index: 999999; display: block; width: 100%; height: 100%; background: #33266e"><p style="position: relative; top: 40%; display: block; font-size: 32px; font-weight: bold; color: #fff; margin: 0 auto; text-align: center">To use this feature you need to enable the brunch "pwa" option.</p></div>';
		};
		conn.onmessage = function (evt) {
			var messages = evt.data.split(':');
			for (var i = 0; i < messages.length; i++) {
				if (messages[0] === "chromeos-version") { document.getElementById("chromeos-version").innerHTML = "<b>Installed ChromeOS:</b><br>"+messages[1]; break; }
				if (messages[0] === "latest-chromeos") { document.getElementById("latest-chromeos").innerHTML = "<b>Latest ChromeOS:</b><br>"+messages[1]; break; }
				log.innerHTML += "<b>" + messages[i] + "<b><br>";
			}
		};
	} else {
		document.body.innerHTML = '<div style="direction: ltr; position: fixed; top: 0; z-index: 999999; display: block; width: 100%; height: 100%; background: #33266e"><p style="position: relative; top: 40%; display: block; font-size: 32px; font-weight: bold; color: #fff; margin: 0 auto; text-align: center">To use this feature you need to enable the brunch "pwa" option.</p></div>';
	}

	setTimeout(() => { conn.send("chromeos-version\nlatest-chromeos"); }, 2000);
};
