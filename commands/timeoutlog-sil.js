const Discord = require("discord.js");
const config = require("../config.json");
const db = require("croxydb");

module.exports = {
    data: new Discord.SlashCommandBuilder()
    .setName("timeoutlog-sil")
    .setDescription("Timeout log kanalını siler.")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageChannels),
    async execute (client, interaction) {
        if (!db.has(`timeoutch-${interaction.guild.id}`)) return interaction.reply({ content: `**Timeout log** kanalı __zaten__ ayarlanmamış.`, ephemeral: false });

        if (db.has(`timeoutch-${interaction.guild.id}`)) {
            db.delete(`timeoutch-${interaction.guild.id}`)
            interaction.reply({ content: `Başarı ile \`timeout\` **log** kanalı __silindi.__`, ephemeral: false })
        }
    }
}