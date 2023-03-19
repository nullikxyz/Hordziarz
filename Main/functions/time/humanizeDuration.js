module.exports = (duration) => {
	duration = parseInt(duration);

	let total = duration / 1000;
	let years = Math.floor(total / 31536000);
	total %= 31536000;
	let months = Math.floor(total / 2628000);
	total %= 2628000;
	let weeks = Math.floor(total / 604800);
	total %= 604800;
	let days = Math.floor(total / 86400);
	total %= 86400;
	let hours = Math.floor(total / 3600);
	total %= 3600;
	let minutes = Math.floor(total / 60);
	let seconds = Math.floor(total % 60);

	let s = [];
	let str = "";

	if (years > 0) {
		if (years == 1) s.push("rok");
		else {
			let last = years.toString().match(/\d/g);
			last = last[last.length - 1];

			if (![12, 13, 14].includes(years) && [2, 3, 4].includes(Number(last))) s.push(`${years} lata`);
			else s.push(`${years} lat`);
		}
	}

	if (months > 0) {
		if (months == 1) s.push("miesiąc");
		else {
			let last = months.toString().match(/\d/g);
			last = last[last.length - 1];

			if (months != 12 && [2, 3, 4].includes(Number(last))) s.push(`${months} miesiące`);
			else s.push(`${months} miesięcy`);
		}
	}

	if (weeks > 0) {
		if (weeks == 1) s.push("tydzień");
		else s.push(`${weeks} tygodnie`);
	}

	if (days > 0) {
		if (days == 1) s.push("1 dzień");
		else s.push(`${days} dni`);
	}

	if (hours > 0) {
		if (hours == 1) s.push("1 godzinę");
		else {
			let last = hours.toString().match(/\d/g);
			last = last[last.length - 1];

			if (![12, 13, 14].includes(hours) && [2, 3, 4].includes(Number(last))) s.push(`${hours} godziny`);
			else s.push(`${hours} godzin`);
		}
	}

	if (minutes > 0) {
		if (minutes == 1) s.push("1 minutę");
		else {
			let last = minutes.toString().match(/\d/g);
			last = last[last.length - 1];

			if (![12, 13, 14].includes(minutes) && [2, 3, 4].includes(Number(last))) s.push(`${minutes} minuty`);
			else s.push(`${minutes} minut`);
		}
	}

	if (seconds > 0) {
		if (seconds == 1) s.push("1 sekundę");
		else {
			let last = seconds.toString().match(/\d/g);
			last = last[last.length - 1];

			if (![12, 13, 14].includes(seconds) && [2, 3, 4].includes(Number(last))) s.push(`${seconds} sekundy`);
			else s.push(`${seconds} sekund`);
		}
	}

	if (!s.length) s.push("mniej niż sekundę");

	for (let time of s) {
		if (time == s[s.length - 1]) {
			str += time;
			continue;
		}
		time != s[s.length - 2] ? (str += `${time}, `) : (str += `${time} i `);
	}

	return str;
};
