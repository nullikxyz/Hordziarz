const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
	name: "embedy",
	async execute(client, interaction) {
		try {
			await interaction.deferReply();
			if (interaction.customId.split("-")[1] != interaction.member.id) return client.error(interaction, { description: "Ktos inny już wysyła embed." });
			const channel = interaction.guild.channels.resolve(interaction.customId.split("-")[2]) || interaction.channel;
			const akcja = interaction.values[0];

			switch (akcja) {
				case "regulamin":
					channel?.send({
						embeds: [
							new EmbedBuilder()
								.setColor(client.config.embedHex)
								.setTitle("📛REGULAMIN SERWERA📛")
								.setDescription(
									`\`\`\`Wstępne informacje\`\`\`\n:heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign:\n\n:small_blue_diamond:Przebywanie na naszym serwerze Discord jest równoznaczne z zaakceptowaniem oraz przeczytaniem całego regulaminu. Jego nieznajomość nie zwalnia cię z przestrzegania go.\n\n:small_orange_diamond:Jako użytkownik naszego Discorda masz prawo do odwołania się od wszelakich kar, jakie zostały na ciebie nałożone.\n\n:small_blue_diamond:Najważniejszymi osobami na serwerze są osoby z rangą <@&378333741661290498> bądź <@&684881899558141961>, w przypadku jakichkolwiek sporów ich głos jest decydujący i nie należy podważać ich decyzji.\n\n:small_orange_diamond:Administracja ma prawo ukarać za rzecz nie zawartą w regulaminie.`
								),
							new EmbedBuilder()
								.setColor(client.config.embedHex)
								.setDescription(
									`\`\`\`Informacje ogólne\`\`\`\n:heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign::heavy_minus_sign:\n\n:small_blue_diamond:Kultura osobista to domena każdej osoby, staraj się zachowywać odpowiednio na wszystkich kanałach ogólnych, nikogo nie obrażaj oraz nie przeklinaj.\n\n:small_orange_diamond:Na naszym serwerze zakazane jest spamowanie, floodowanie oraz pisanie capslockiem.\n\n:small_blue_diamond:Zakaz prowadzenia konwersacji w językach obcych oraz dialektach na kanałach do tego nie przeznaczonych.\n\n:small_orange_diamond:Jako użytkownik Discorda jesteś zobowiązany do trzymania się tematu kanału, na którym przebywasz. Każdy kanał na tym serwerze ma swoje przeznaczenie.\n\n:small_blue_diamond:Zabronione jest wykłócanie się z osobą należącą do Ekipy naszego Discorda, w przeciwnym razie każda osoba należąca do niej może ukarać cię w trybie natychmiastowym.\n\n:small_orange_diamond:Zakazane jest reklamowanie serwerów Discord oraz wszelakich social mediów. Tyczy się to także wiadomości prywatnych.\n\n:small_blue_diamond:Obowiązuje zakaz wysyłania podejrzanych linków.\n\n:small_orange_diamond:Zakazane na naszym Discordzie jest wykonywanie czynności, które mają na celu łamać Polskie Prawo!\n\n:small_blue_diamond:Zabronione jest udostępnianie treści mających na celu propagowanie nazizmu/komunizmu, treści erotycznych i rasistowskich. Ta zasada obejmuje również avatary czy nickname\`y.\n\n:small_orange_diamond:Na naszym serwerze panuje zasada: "Jeden użytkownik - jedno konto". Posiadanie multikont jest u nas karane.\n\n:small_blue_diamond:Nie udostępniaj danych osobowych swoich ani innych osób. W przeciwnym razie możesz zostać ukarany.`
								),
							new EmbedBuilder()
								.setColor(client.config.embedHex)
								.setDescription(
									`:small_orange_diamond:Zakazane jest używanie modulatorów oraz bindów w celu przeszkadzania, trollowania.\n\n:small_blue_diamond:Zabronione jest podszywanie się pod jakiegokolwiek użytkownika Discorda, niezależnie czy to youtuber, osoba z ekipy, czy ktoś inny.\n\n:small_orange_diamond:Plagiat jest surowo karany. Wrzucaj prace zrobione przez siebie, a nie przez inne osoby. Jeśli nie będziesz się do tego stosować, możesz otrzymać karę w postaci rangi <@&668041019908030474>, a nawet bana!\n\n:small_blue_diamond:Zakazane jest tzw. "shitpostowanie" czyli np. wstawianie grafik robionych za pomocą zwykłych programów do szybkiej przeróbki typu Paint, bądź Foto Editor. Możesz zostać za to ukarany rangą <@&668041019908030474>.\n\n:small_orange_diamond:Zabronione jest sprzedawanie czegokolwiek za prawdziwe pieniądze. Żadna forma płatności nie będzie dozwolona, ponieważ łamie to politykę Discorda! Pamiętaj jednak, że Ekipa nie ingeruje w sprzedaż w wiadomościach prywatnych.\n\n:small_blue_diamond:Zabronione jest proszenie każdego użytkownika z osobna o realne pieniądze, walutę serwerową, czy też jakieś rzeczy z gier. Każdy użytkownik, jaki dopuszcza się nadmiernego żebrania może zostać ukarany rangą <@&610039857619664897>.\n\n:small_orange_diamond:Zabroniona jest każda forma sztucznego nabijanie expa na kanałach głosowych i tekstowych.\n\n:small_blue_diamond:Kanał <#603308182349021221> również ma swoją zasadę - za notoryczne wstawianie mało interesujących zdjęć, czy też obrazków, memów z przesterami, Papieżem, grozi nadanie rangi <@&607682927907831829>. Ranga ta blokuje całkowity dostęp do udostępniania treści na kanale.\n\n:small_orange_diamond:Na naszym serwerze obowiązuje zakaz szkalowania jakiejkolwiek osoby. Każda osoba, jaka się tego dopuści zostanie ukarana początkowo warnem, a później banem.\n\n:small_blue_diamond:W przypadku znalezienia jakiegokolwiek błędu na naszym Discordzie, czy też w regulaminie należy zgłosić się do administracji serwera. Naumyślne wykorzystywanie błędów jest surowo karane!\n\n:small_orange_diamond:Na naszym serwerze mamy ustalony limit warnów, który wynosi 5. Po przekroczeniu tej ilości możecie zostać ukarani banami czasowymi, a w późniejszym czasie banem permanentnym.\n\n:small_blue_diamond:Zabrania się pingowania właściciela serwera, a także nadmiernego oznaczania użytkowników na czatach tekstowych!`
								),
							new EmbedBuilder().setColor(client.config.embedHex).setDescription("```Administracja serwera ma prawo w każdej chwili zedytować, bądź całkowicie zmienić regulamin, nie podając przy tym żadnej przyczyny.```"),
						],
					});
					break;
				case "eventy-burdel":
					channel.send({ embeds: [new EmbedBuilder().setColor(client.config.embedHex).setTitle("Stwórz kanał eventowy").setDescription("Jeśli masz pomysł na jakiś event kliknij przycisk poniżej i przedstaw go na stworzonym kanale.")], components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("burdel-event_kanal").setLabel("Stwórz kanał").setEmoji("<:yes:942751104662396948>").setStyle("Success")])] });
					break;
				case "weryfikacja":
					channel.send({
						embeds: [
							new EmbedBuilder()
								.setColor(client.config.embedHex)
								.setTitle("Weryfikacja")
								.setDescription(
									"**WITAMY NA HORDZIE**\nAby móc swobodnie korzystać ze wszystkich funkcji na naszym serwerze musisz się zweryfikować!\n\nW tym celu kliknij przycisk poniżej. Otrzymasz w prywatnej wiadomości od <@794978590781472819> kod, który należy wysłać na tym kanale, aby ukończyć weryfikację!\n\nJeśli wiadomość nie została wysłana, upewnij się, że masz włączone prywatne wiadomości z naszego serwera.\n**UWAGA: Kod wygasa po 10 minutach\n\nABY UTWORZYĆ NOWY KOD KLIKNIJ JESZCZE RAZ W PRZYCISK PONIŻEJ**\n\nInfinite link: **[discord.gg/hordakonopa](https://discord.gg/hordakonopa)**"
								),
						],
						components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("weryfikacja-wstep").setLabel("Weryfikacja").setEmoji("<:yes:942751104662396948> ").setStyle("Success")])],
					});
					break;
				case "reporterzy":
					channel.send({
						embeds: [
							new EmbedBuilder()
								.setColor(client.config.embedHex)
								.setTitle("Zgłoś temat")
								.setDescription(
									"Cześć! Masz fajny temat i chcesz pomóc przy tworzeniu odcinków? Podeślij go tutaj a my przekażemy go Konopowi w celu akceptacji! Aby ułatwić nam prace opisz swój temat w następujący sposób: \n\n**Temat:**\n*Horda Konopa to najlepszy serwer na świecie!*\n\n**Opis:**\n*Konopskyy w swoim filmie mówi o tym że Horda Konopa to najlepszy serwer na świecie.*\n\n**Źródła: **\n*https://www.youtube.com/channel/UCR7uLtPuXsDpN8N6ocFQyeg*\n\n*Jeśli masz jakieś dowody w postaci zdjęć to wyslij je do @mnowacki#5538 w wiadomości prywatnej.*"
								),
						],
						components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("temat-zgloszenial").setLabel("Zgłoś temat").setEmoji("<:koperta:942821976924381265>").setStyle("Primary")])],
					});
					break;
				case "rekrutacja":
					channel.send({
						embeds: [
							new EmbedBuilder()
								.setColor(client.config.embedHex)
								.setTitle("Rekrutacja")
								.setDescription(
									"**Witajcie**\nWystartowała właśnie kolejna rekrutacja na rangę <@&507597859634544652> na naszym serwerze!\nJeżeli chcesz wziąć w niej udział, kliknij w przycisk poniżej i wypełnij podanie według wzoru. Pamiętaj, że osoba aplikująca na to stanowisko powinna mieć ukończone **14 lat**.\n\nŻyczymy powodzenia!\n*Wzór podania na moderatora:*\n```\n• Imię: \n• Wiek: \n• Od kiedy udzielasz się na serwerze? \n• Ile czasu dziennie możesz poświęcić na moderowanie i w których godzinach? \n• Jakie jest twoje doświadczenie w moderowaniu? \n• Dlaczego chciałbyś zostać moderatorem? \n• Coś o sobie: \n• Znajomość ortografii i interpunkcji (1-10): \n• Czy posiadasz sprawny mikrofon:\n```"
								),
						],
						components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("rekru-zgloszenie").setLabel("Podanie").setEmoji("<:koperta:942821976924381265>").setStyle("Success")])],
					});
					break;
				case "popros-o-role":
					channel.send({ embeds: [new EmbedBuilder().setTitle("__Poproś o rolę__").setDescription(`Rangi, które znajdują się poniżej podlegają **weryfikacji przez administratora**. W celu ich otrzymania należy spełnić poszczególne **kryteria**.`).setColor(0xee2a7b)] });
					channel.send({
						embeds: [
							new EmbedBuilder()
								.setTitle("Rangi Wiekowe:")
								.setDescription("Aby otrzymać rangę wiekową należy wysłać w wiadomości prywatnej administratorowi adekwatny dokument potwierdzający **datę urodzenia** wraz z karteczką z **nickiem z Discorda**.\n\n<@&603339798543073290> - Ranga dla osób, które ukończyły **16** lat.\n\n<@&603339860488618028> - Ranga dla osób, które ukończyły **18** lat.\n\n<@&603339933935206413> - Ranga dla osób które ukończyły **20** lat.")
								.setFooter({ text: "Uwag: Interesuje nas wyłącznie data urodzenia, resztę danych można zamazać. Rangi nadajemy wyłącznie po ukończeniu danego wieku." })
								.setColor(0xee2a7b),
						],
						components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("popros-603339798543073290").setLabel("+16").setStyle("Primary"), new ButtonBuilder().setCustomId("popros-603339860488618028").setLabel("+18").setStyle("Primary"), new ButtonBuilder().setCustomId("popros-603339933935206413").setLabel("+20").setStyle("Primary")])],
					});
					channel.send({
						embeds: [
							new EmbedBuilder()
								.setTitle("Rangi za Aktywność:")
								.setDescription(
									"<@&532956199231160320> - Ranga dla osób, które spędziły już sporo czasu na naszym serwerze. Aby ją zdobyć należy posiadać **30 level** na kanałach tekstowych bądź **20 level** na głosowych.\n\n<@&523139370908123137> - Ranga dla osób, które lubią często przesiadywać nocami na naszym Discordzie w godzinach od **01:00 do 05:00**.\n\n<@&562623984278175744> - Ranga dla osób, które przesiadują na naszym Discordzie już od samego rana w godzinach od **05:00 do 07:00**."
								)
								.setFooter({ text: "Uwaga: Aktywność w podanych powyżej godzinach musi być regularna. Jednorazowa aktywność nie zalicza się do otrzymania rangi." })
								.setColor(0xee2a7b),
						],
						components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("popros-532956199231160320").setLabel("No-Life").setStyle("Primary"), new ButtonBuilder().setCustomId("popros-562623984278175744").setLabel("Poranny Ptaszek").setStyle("Primary"), new ButtonBuilder().setCustomId("popros-523139370908123137").setLabel("Nocny Marek").setStyle("Primary")])],
					});
					channel.send({
						embeds: [
							new EmbedBuilder()
								.setTitle("Rangi Dodatkowe:")
								.setDescription(
									"<@&378333798540115968> - Ranga dla osób, które mają minimum **10.000** subskrybcji na swoim kanale oraz zamieszczają **regularnie** na nim treści.\n\n<@&603516856044748800> - Ranga dla osób, które wysłały ponad **50** memów, które osiągnęły przynajmniej **20** pozytywnych **reakcji**.\n\n<@&603516858557136906> - Ranga dla osób, które w naszej ekonomii wydały ponad **30 000** <:konopcoin:866344767192825906> na rzeczy związane z hazardem (ruletka, bj, sm, losy oraz inne).\n\n<@&603516854404775936> - Ranga dla osób, które złożyły przynajmniej **3** pomysły, które weszły w życie serwera."
								)
								.setFooter({ text: "Uwaga: Notoryczne wysyłanie nieśmiesznych memów może skutkować odrzuceniem prośby o rangę Memiarz." })
								.setColor(0xee2a7b),
						],
						components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("popros-378333798540115968").setLabel("YouTuber").setStyle("Primary"), new ButtonBuilder().setCustomId("popros-603516856044748800").setLabel("Memiarz").setStyle("Primary"), new ButtonBuilder().setCustomId("popros-603516858557136906").setLabel("Hazardzista").setStyle("Primary"), new ButtonBuilder().setCustomId("popros-603516854404775936").setLabel("Pomysłodawca").setStyle("Primary")])],
					});
					channel.send({
						embeds: [new EmbedBuilder().setTitle("Zapisane Rangi:").setDescription("Po powrocie na serwer np. po banie, możesz odzyskać swoje rangi (jeżeli były wcześniej zapisane).").setColor(0xee2a7b)],
						components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("odzyskZapis-oddaj").setLabel("Odbierz zapisane rangi").setStyle("Primary"), new ButtonBuilder().setCustomId("odzyskZapis-zapisz").setLabel("Zapisz posiadane rangi").setStyle("Primary")])],
					});
					break;
				case "pomysly":
					channel.send({
						embeds: [
							new EmbedBuilder()
								.setColor(client.config.embedHex)
								.setTitle("Witaj w sekcji propozycji")
								.setDescription(`Na tym kanale możecie złożyć waszą propozycję na usprawnienie pracy serwera!\n\nAby to zrobić kliknij przycisk <:plus:942821977012437062>.\nJeżeli chcesz edytować wcześniej napisana propozycję kliknij przycisk <:edit:947152424118931476>.\n\n**UWAGA** *Zaśmiecanie kanału lub dawanie bezsensownych propozycji będzie skutkowało warnem oraz <@&${client.config.roles.inne.pomBlok}>*`),
						],
						components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("pomysly-dodaj").setEmoji("<:plus:942821977012437062>").setStyle("Success"), new ButtonBuilder().setCustomId("pomysly-edytuj").setEmoji("<:edit:947152424118931476>").setStyle("Primary")])],
					});
					break;
				case "kanaly-prywatne":
					channel.send({
						embeds: [
							new EmbedBuilder()
								.setColor("#FDFD96")
								.setTitle("Regulamin kanałów prywatnych")
								.setDescription(
									"🔹 Każdy użytkownik może posiadać maksymalnie jeden kanał prywatny.\n\n🔸 Nazwa oraz opis kanału prywatnego nie mogą łamać regulaminu serwerowego.\n\n🔹 Na kanałach prywatnych obowiązują zasady objęte przez regulamin serwera.\n\n🔸Kanał prywatny, który nie osiągnie progu 50 wiadomości w ciągu tygodnia zostanie automatycznie usunięty.\n\n🔹 Zabronione jest zakładanie kanałów będącymi biznesami pożyczkowymi lub zawierającym loterie/zakłady. Dozwolone jest jedynie tworzenie kanałów handlującymi dobrami serwerowy.\n\n🔸Właściciel kanału ma pełne prawo do zarządzania kanałem. Ma prawo zablokować kanał danej osobie bez podania przyczyny. Zakazane jest blokowanie kanału członkom administracji.\n\n🔹 W celu zarządzania wiadomościami wymagana jest weryfikacja dwuetapowa.\n\n🔸 Wszelkie błędy w funkcjonowaniu kanałów prywatnych należy natychmiast zgłaszać administracji.\n\n🔹 Nieznajomość regulaminu nie zwalnia Cię z jego przestrzegania."
								),
							new EmbedBuilder().setColor("#FDFD96").setDescription("```\nAdministracja serwera ma prawo w każdej chwili edytować bądź całkowicie zmienić regulamin, nie podając przy tym żadnej przyczyny.\n```"),
						],
					});
					channel.send({
						embeds: [
							new EmbedBuilder()
								.setColor("#FDFD96")
								.setTitle("Panel zarządzania prywatnym kanałem tekstowym")
								.addFields([
									{ name: "📌 Stwórz kanał", value: "Tworzy twój własny kanał." },
									{ name: "📝 Zmień nazwe", value: "Zmienia nazwę twojego kanału." },
									{ name: "⏱️ Ustaw cooldown", value: "Ustawia tryb powolny dla twojego kanału." },
									{ name: "✏️ Zmień opis", value: "Zmienia opis twojego kanału." },
									{ name: "🔑 Zablokuj lub odblokuj kanał", value: "Blokuje lub odblokowuje widoczność twojego kanału." },
									{ name: "🔴 Zablokuj osobe", value: "Blokuje możliwość pisania oznaczonej przez ciebie osobie na twoim kanale." },
									{ name: "🟢 Odblokuj osobe", value: "Odblokowuje możliwość pisania oznaczonej przez ciebie osobie na twoim kanale." },
									{ name: "👷 Dodaj pomocnika", value: "Dodaje oznaczoną przez ciebie osobę jako pomocnika kanału, który może zarządzać twoim kanałem." },
									{ name: "🙋 Usuń pomocnika", value: "Usuwa oznaczoną przez ciebie osobę z listy pomocników kanału." },
									{ name: "📃 Wyświetl informacje", value: "Wyświetla informacje na temat danego kanału." },
								]),
						],
						components: [
							new ActionRowBuilder().addComponents([
								new ButtonBuilder().setCustomId("textPanel-stworzKanal").setStyle("Secondary").setEmoji("📌"),
								new ButtonBuilder().setCustomId("textPanel-zmienNazwe").setStyle("Secondary").setEmoji("📝"),
								new ButtonBuilder().setCustomId("textPanel-ustawCooldown").setStyle("Secondary").setEmoji("⏱️"),
								new ButtonBuilder().setCustomId("textPanel-zmienTemat").setStyle("Secondary").setEmoji("✏️"),
								new ButtonBuilder().setCustomId("textPanel-zmienStatus").setStyle("Secondary").setEmoji("🔑"),
							]),
							new ActionRowBuilder().addComponents([
								new ButtonBuilder().setCustomId("textPanel-zablokujOsobe").setStyle("Secondary").setEmoji("🔴"),
								new ButtonBuilder().setCustomId("textPanel-odblokujOsobe").setStyle("Secondary").setEmoji("🟢"),
								new ButtonBuilder().setCustomId("textPanel-dodajPomocnika").setStyle("Secondary").setEmoji("👷"),
								new ButtonBuilder().setCustomId("textPanel-usunPomocnika").setStyle("Secondary").setEmoji("🙋"),
								new ButtonBuilder().setCustomId("textPanel-wyswietlInformacje").setStyle("Secondary").setEmoji("📃"),
							]),
						],
					});
					break;
			}

			client.success(interaction, { description: `Poprawnie wysłano embed \`${akcja}\` na kanał ${channel}` }, [], true);
			interaction.channel.messages
				.resolve(interaction.message.id)
				.delete()
				.catch((e) => {});
		} catch (e) {
			console.log(e);
		}
	},
};
