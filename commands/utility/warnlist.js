const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { initializeWarnings } = require('../../warnings.js');
const { EmbedBuilder } = require('discord.js');

const warnEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('Figyelmeztetések')
	.setTimestamp()

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warnlist')
		.setDescription('Admin parancs az összes warn lekérésére (privát üzenet)')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	async execute(interaction) {
        const warnings = initializeWarnings();

        console.log(`${interaction.user.username} - warnlist`);

        if (Object.keys(warnings).length === 0) {
            warnEmbed.setDescription(`A szerveren még nem történt figyelmeztetés.`);
            await interaction.reply({ embeds: [warnEmbed]});
        } else {
            let str = "";
            for (const element in warnings) {
                let reasonAndDateArr = warnings[element].reasons;
                for (let index = 0; index < reasonAndDateArr.length; index++) {
                    reasonAndDateArr[index] += ` (*${warnings[element].date[index]}*)`;
                }
                str += `**${warnings[element].username}**: ${warnings[element].warns} db.\n► ${reasonAndDateArr.join('\n► ')}\n`;
            }
            warnEmbed.setDescription(str);
            await interaction.reply({ embeds: [warnEmbed], ephemeral: true});
        }
	},
};