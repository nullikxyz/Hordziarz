const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ship")
		.setDescription("Shipuje dwie osoby")
		.addUserOption((user) => user.setName("osoba1").setDescription("Pierwsza osoba do shipowania.").setRequired(true))
		.addUserOption((user) => user.setName("osoba2").setDescription("Druga osoba do shipowania")),
	cooldown: "15s",
	async execute(client, interaction) {
		try {
			let osoba1 = interaction.options.getMember("osoba1");
			let osoba2 = interaction.options.getMember("osoba2") || interaction.member;

			if (osoba1.id == osoba2.id) return client.error(interaction, { description: "Nie możesz shipować dwóch tych samych osób." });

			let random = Math.floor(Math.random() * 101);

			let odp = [
				{ od: 0, do: 15, teksty: ["Mimo że się znacie to się nie kochacie", "Zdradziłaś k*rw* mnie", "Daje ci znaki ale ty jedyny jaki widzisz to znak stop", "Tym razem chybiła strzała Amora...", "Maszyna twierdzi, że nic z tego nie będzie.", "Ja wiem, ty wiesz, że to się nie uda. Sorry, ale ja nie wierzę w cuda."] },
				{ od: 16, do: 30, teksty: ["Daleko to nie zajdzie!", "Znajomi ale nic więcej!", "Iskierka nie zapłonie między wami!", "No tak średnio bym powiedział, tak średnio", "Niestety trochę poczekasz na tą miłość, jak na ZGP", "Gdy mówisz kocham, to nie mów z litości, bo gorzka jest miłość bez wzajemności."] },
				{ od: 31, do: 50, teksty: ["Coś tam iskra!", "Postarajcie się!", "Coś tam świta!", "No no możesz zagadywać", "Warto spróbować!", "Wiem, że to trochę mało, ale dasz się zaprosić na kawę?", "Tego kwiatu jest pół światu", "Z wtorku na srode pieknie mi sie snilo ze moje serduszko obok Ciebie bylo, gdy sie obudzilem- Boze moj kochany zamiast kolo Ciebie leze obok sciany."] },
				{ od: 51, do: 75, teksty: ["Los do was się uśmiecha może to czas na pierwszy krok?", "Ewidentnie to coś poważniejszego!", "Jest lepiej, niż myślisz!", "Dobrze to rozegraj, a będziesz ją/go miał/a!", "Zagadajcie do siebie może coś z tego będzie", "Bądźmy poważni pasujemy do siebie jak Harnaś i ICE tea", "Kocham cie jak kaczka wodę krowa trawę świnia gnój bo ty jesteś debil mój"] },
				{ od: 76, do: 90, teksty: ["Pora zarywać!", "Świetlana przyszłość", "To prawie twoja druga połówka!", "To jest ten czas, ta chwila, ten moment", "Tak nie wiele wam brakuje, idźcie razem na kolację, może miłość bardziej zasmakuje", "Są osoby, które się pamięta, i osoby, o których się śni.", "Maybe I just wanna be yours, I wanna be yours~"] },
				{ od: 91, do: 100, teksty: ["Ogłaszam was mężem i żoną!", "Oho! Nie wybronisz się z tego!", "Duo idealne ❤️", 'Dla ciebie to napisze lepszą piosenkę niż "Kiss Cam" czy inny dobry love song', "Dla was to brakuje tylko kropla!", "To jest pierwszy argument dlaczego do siebie pasujecie.", "Wolę jedno życie z Tobą niż samotność przez wszystkie ery tego świata."] },
			];

			odp = odp.filter((x) => x.od <= random && x.do >= random)[0].teksty.sort((a, b) => 0.5 - Math.random())[0];

			let skala = "❤️".repeat(Math.floor(random / 10)) + "🤍".repeat(10 - Math.floor(random / 10));
			if (Math.floor(random / 10) == 10) {
				skala = "💖".repeat(10);
				odp = [
					"Miłość rośnie\nWokół nas\nW spokojną jasną noc\nNareszcie świat\nZaczyna w zgodzie żyć\nMagiczną czując moc ❤️",
					"Przez twe oczy, te oczy zielone oszalałem\nGwiazdy chyba twym oczom oddały cały blask\nA ja serce miłości spragnione ci oddałem\nTak zakochać, zakochać się można tylko raz",
					'Achievement unlocked "miłość" 💖💘💖',
					"Kochaj mnie kochaj\nBądź ze mną bądź\nI nie opuszczaj\nMnie na krok",
					"Kochaj mnie, uparcie\nJakby świat się kończyć miał\nKochaj mnie, to łatwe\nBez oporu siebie dam",
					"You're my heart, you're my soul\nYeah, a feelin' that our love will grow~❤️",
					"Z moich oczu plyna lzy, bo w mym sercu jestes Ty. Ciebie teraz przy mnie nie ma, a ja tesknie bez watpienia. Bo Cie Kocham i Cie lubie, ze sie w myslach swoich gubie!",
					"Weź mnie do tańca o północy w centrum miasta\nNa pasach mnie całuj i obracaj\nJakby nie było świata, stwórzmy prywatny bal.",
				].sort((a, b) => 0.5 - Math.random())[0];
			}

			client.success(interaction, { title: "Miłosne Dopasowanie 💕", color: "FF66CC", description: `${osoba1} ✘ ${osoba2}\n\`${random}%\` \`${skala}\`\n\n**${odp}**` });
		} catch (err) {
			client.error(interaction, { description: "Wystąpił błąd! Spróbuj ponownie później" });
			client.logger.error(err);
		}
	},
};
