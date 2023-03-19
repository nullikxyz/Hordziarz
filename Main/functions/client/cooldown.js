const fs = require("fs");

async function setCooldown(client, user, key, value) {
	if (!client.cooldowns[user]) client.cooldowns[user] = new Object();
	
	client.cooldowns[user][key] = value;
	fs.writeFileSync("./Main/json/cooldowns.json", JSON.stringify(client.cooldowns, null, 4));
}

async function getCooldown(client, user, key) {
	if (!client.cooldowns[user]) client.cooldowns[user] = new Object();
	
	return client.cooldowns[user][key] ? client.cooldowns[user][key] : false;
}

async function deleteCooldown(client, user, key) {
	if (!client.cooldowns[user]) client.cooldowns[user] = new Object();
	
	delete client.cooldowns[user][key];
	fs.writeFileSync("./Main/json/cooldowns.json", JSON.stringify(client.cooldowns, null, 4));
}

async function deleteAllCooldowns(client, user) {
	if (!client.cooldowns[user]) client.cooldowns[user] = new Object();
	
	delete client.cooldowns[user];
	fs.writeFileSync("./Main/json/cooldowns.json", JSON.stringify(client.cooldowns, null, 4));
}

async function checkCooldown(client, user, key) {
	if (!client.cooldowns[user]) client.cooldowns[user] = new Object();
	
	if (client.cooldowns[user][key] && client.cooldowns[user][key] > Date.now()) return true;
	return false;
}

module.exports = {
	setCooldown,
	getCooldown,
	deleteCooldown,
	deleteAllCooldowns,
	checkCooldown
}