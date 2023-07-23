const Discord = require("discord.js");
const config = require("./config.json");
const db = require("croxydb");
const scanner = require("ocr-space-api")


const client = new Discord.Client({ intents: [Object.values(Discord.GatewayIntentBits)] });

const { REST } = require("@discordjs/rest");
const fs = require("fs");
const path = require("path");

client.commands = new Discord.Collection();
const slashCommands = [];

client.on("guildCreate", async (guild) => {
    console.log(`${client.user.tag} sunucuya eklendi: ${guild.name} (${guild.id})`);

    const rest = new REST({ version: '9' }).setToken(config.token);

    try {
        await rest.put(Discord.Routes.applicationGuildCommands("1128328184467824743", guild.id), { body: slashCommands });
        console.log(`Başarıyla komutlar yüklendi - Sunucu: ${guild.name} (${guild.id})`);
    } catch (error) {
        console.error('Komut yüklenirken bir hata oluştu:', error);
    }
});


client.on("ready", async () => {
    console.log(`${client.user.tag} olarak giriş yapıldı.`);
	client.user.setStatus("dnd");
    client.user.setActivity(`${client.guilds.cache.size} sunucuyu`, { type: Discord.ActivityType.Watching });

    const rest = new REST({ version: '9' }).setToken(config.token);

    try {
        const guilds = await client.guilds.fetch();
        const guildIDs = guilds.map(guild => guild.id);	

        for (const guildID of guildIDs) {
            await rest.put(Discord.Routes.applicationGuildCommands("1128328184467824743", guildID), { body: slashCommands });
            console.log(`Başarıyla komutlar yüklendi - Sunucu ID: ${guildID}`);
        }

        console.log(`Toplam ${guildIDs.length} sunucuda komutlar yüklendi.`);
    } catch (error) {
        console.error('Komut yüklenirken bir hata oluştu:', error);
	}
});



const commandsPath = path.join(__dirname, 'commands'); // Buraya komutlar klasörünün adını giriniz, bu kodda varsayılan olarak commands olarak belirttim.
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	client.commands.set(command.data.name, command);
    slashCommands.push(command.data.toJSON());

    console.log(`${command.data.name} dosyası yüklendi.`)
}


client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;


  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
      console.error(`Komut ${interaction.commandName} bulunamadı.`);
      return;
  }

  try {
    await command.execute(client, interaction);
} catch (error) {
    return console.error("Bir hata oluştu: " + error.message);
}
    
});








client.on('messageCreate', async (message) => {

});





client.login(config.token);