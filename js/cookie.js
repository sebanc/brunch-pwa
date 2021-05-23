async function setCookie(name, value) {
	await cookieStore.set({
		name: name,
		value: value,
		expires: Date.now() + (10*365*24*60*60*1000),
		secure: (new URL(self.location.href)).protocol === 'https:',
		httpOnly: false,
	});
}

async function getCookie(name) {
	cookie = await cookieStore.get(name);
	if (cookie) {
		console.log(`Found ${cookie.name} cookie: ${cookie.value}`);
		return cookie;
	} else {
		console.log('Cookie not found');
	}
}

async function eraseCookie(name) {   
	await cookieStore.delete(name);
}

async function checkCookie() {
	var brunch_stable = await getCookie("brunch_stable");
	var brunch_unstable = await getCookie("brunch_unstable");
	var chromeos = await getCookie("chromeos");
	var notifications = await getCookie("notifications");
	if (!brunch_stable) {
		setCookie("brunch_stable", "yes");
	}
	if (!brunch_unstable) {
		setCookie("brunch_unstable", "no");
	}
	if (!chromeos) {
		setCookie("chromeos", "no");
	}
	if (!notifications) {
		if (Notification.permission !== "granted") {
			setCookie("notifications", "no");
		} else {
			setCookie("notifications", "yes");
		}
	}
}
