const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { initializeWarnings } = require('../../warnings.js');
const { EmbedBuilder } = require('discord.js');

const warnEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('Figyelmeztetések')
	.setTimestamp()

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userwarns')
		.setDescription('Admin parancs egy specifikus felhasználó warnjainak lekérésére (privát üzenet)')
        .addUserOption(option => option.setName('user').setDescription('Lekérdezett felhasználó').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	async execute(interaction) {
        const user = interaction.options.getMember('user');

        const warnings = initializeWarnings();
        const userWarnings = warnings[user.user.id];

        console.log(`${interaction.user.username} - userwarns`);

        if (!userWarnings) {
            warnEmbed.setDescription(`A felhasználónak még nincs figyelmeztetése.`);
            await interaction.reply({ embeds: [warnEmbed]});
        } else {
            let reasonAndDateArr = userWarnings.reasons;
            for (let index = 0; index < reasonAndDateArr.length; index++) {
                reasonAndDateArr[index] += ` (*${userWarnings.date[index]}*)`;
            }
            warnEmbed.setDescription(`**${userWarnings.username}**: ${userWarnings.warns} db.\n► ${reasonAndDateArr.join('\n► ')}`);
            await interaction.reply({ embeds: [warnEmbed], ephemeral: true});
        }
	},
};