const Discord = require("discord.js");
const config = require("../config.json");
const db = require("croxydb");

module.exports = {
    data: new Discord.SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout atmanızı sağlar.")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ModerateMembers)
    .addUserOption(option => option.setName("target").setDescription("Lütfen bir kullanıcı seçiniz!").setRequired(true))
    .addIntegerOption(option => option.setName("duration").setDescription("Lütfen süreyi seçiniz. (dakika)").setRequired(true)),
    async execute(client, interaction) {
        const users = interaction.options.getUser('target');
        const logch = db.get(`timeoutch-${interaction.guild.id}`);
        const üye = interaction.guild.members.cache.get(users.id);
        const duration = interaction.options.getInteger('duration');

        


        const kullananKişiYetkileri = interaction.member.permissions;


        

        const EmbedError = new Discord.EmbedBuilder()
        .setTitle("Hata!")
        .setColor("White")
        .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp()
        .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .setDescription(`**Bir hata oluştu,** Lütfen seçtiğiniz süreyi \`1 dakika - 7 gün\` __arasında seçiniz__ (**Dakika cinsinden.**)`)

        if (duration < 1 || duration > 10080) {
            return interaction.reply({ embeds: [EmbedError], ephemeral: true });
        }

    
        if (!db.has(`timeoutch-${interaction.guild.id}`)) return interaction.reply({ content: "Timeout **log kanalı** belirlenmemiş.", ephemeral: true });

        if (!üye) return interaction.reply({ content: `Bu kullanıcı **sunucuda** değil!`, ephemeral: true });

        const seçilenKişiYetkileri = üye.permissions;
        if (seçilenKişiYetkileri.has(kullananKişiYetkileri)) return interaction.reply({ content: `Seçilen **kişinin** yetkileri senle __eşit__ veya __yüksek__ olduğu için bu **kullanıcıya** timeout atamam.!`, ephemeral: true });

        if (users.id == interaction.user.id) return interaction.reply({ content: `Kendine timeout **atamassın.**`, ephemeral: true });

        if (users.id == "BOTUN İD'SİNİ GİRİNİZ") return interaction.reply({ content: `Hey, kendime **timeout** __attırmaya__ mı **çalışıyorsun?**` });

        if (seçilenKişiYetkileri.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({ content: `Seçilen **kişi** bir __admin__ olduğu için ona timeout atamam.`, ephemeral: true });

        if (üye.time) return interaction.reply({ content: `Bu kullanıcıya **timeout** atamam.`, ephemeral: true });


        

        const channelss = interaction.guild.channels.cache.get(db.get(`timeoutch-${interaction.guild.id}`))

        const süre = duration * 60000

        const timestamp = Date.now();
        const timestampInSeconds = Math.floor(timestamp / 1000);


        const logEmbed = new Discord.EmbedBuilder()
        .setTitle("Timeout Log")
        .setColor("White")
        .setFooter({ text: `${users.tag} adlı kullanıcıya timeout atıldı.`, iconURL: üye.displayAvatarURL() })
        .setTimestamp()
        .setAuthor({ name: `${users.tag}`, iconURL: üye.displayAvatarURL() })
        .setDescription(`\`${users.tag}\` adlı kullanıcıya **başarılı** bir __şekilde__ **[ <t:${timestampInSeconds}:R> ]** tarihinde \`${duration}\` dakika __timeout__ atıldı!`)





        üye.timeout(süre).then(`${üye.tag} adlı kullanıcıya başarı ile **timeout** atıldı!`).catch(console.error)
        channelss.send({ embeds: [logEmbed] })

        await interaction.reply({ content: "**Başarı ile timeout atıldı!**", ephemeral: true })
    }
}
