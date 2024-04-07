type NavigatorUAData = {
	platform: string;
};

export function getPlatform() {
	if ("userAgentData" in navigator) {
		const { platform } = navigator.userAgentData as NavigatorUAData;
		return platform;
	}
	return navigator.platform;
}

function testPlatform(pattern: RegExp) {
	return pattern.test(getPlatform());
}

function testUserAgent(pattern: RegExp) {
	return pattern.test(navigator.userAgent);
}

function testVendor(pattern: RegExp) {
	return pattern.test(navigator.vendor);
}

export function isTouchDevice() {
	return navigator.maxTouchPoints !== 0;
}

export function isMac() {
	return testPlatform(/^mac/i) && !isTouchDevice();
}

export function isIPhone() {
	return testPlatform(/^iphone/i);
}

export function isSafari() {
	return isApple() && testVendor(/apple/i);
}

export function isFirefox() {
	return testUserAgent(/firefox\//i);
}

export function isApple() {
	return testPlatform(/mac|iphone|ipad|ipod/i);
}

export function isIos() {
	return isApple() && !isMac();
}
