exports.getDate = function() {
	const today = new Date();
	const options = {
		day : 'numeric',
		month : 'long',
		weekday : 'long'
	};
	return day = today.toLocaleString("en-US",options);
}
exports.getDay = function() {
	const today = new Date();
	const options = {
		weekday : 'long'
	};
	return day = today.toLocaleString("en-US",options);
}
