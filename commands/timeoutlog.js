const Discord = require("discord.js");
const config = require("../config.json");
const db = require("croxydb");

module.exports = {
    data: new Discord.SlashCommandBuilder()
    .setName("timeout-log")
    .setDescription("Timeout log kanalını ayarlar.")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageChannels)
    .addChannelOption(option => option.setName("channel").setDescription("Lütfen log kanalını seçiniz.").setRequired(true).addChannelTypes(Discord.ChannelType.GuildText)),

    async execute (client, interaction) {
        const channelsd = interaction.options.getChannel('channel');
        const tmlog = interaction.guild.channels.cache.get(channelsd.id)
        if (!db.has(`timeoutch-${interaction.guild.id}`)) {
            db.set(`timeoutch-${interaction.guild.id}`, `${tmlog.id}`)
            interaction.reply({ content: "Başarı ile log kanalı ayarlandı.", ephemeral: false })
        } else {
            return interaction.reply({ content: `Zaten log kanalı ayarlanmış!`, ephemeral: false })
        }
    }
}