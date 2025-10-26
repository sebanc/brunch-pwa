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
	
	if (navigator.onLine) {
		document.getElementById("form4").innerHTML = '<button type="submit" class="buttonstyle">Install the Gentoo prefix</button>';
		document.getElementById("form4").onsubmit = function () {
			document.getElementById("log").style.background = "#A9A9A9";
			log = "<center><b>Console log:</b></center><br>";
			document.getElementById("log").innerHTML = log;
			if (!ws) {
				return false;
			}
			ws.send("install-gentoo-prefix");
			return false;
		};
	}
};
