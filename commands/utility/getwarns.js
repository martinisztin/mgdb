const { SlashCommandBuilder } = require('discord.js');
const { initializeWarnings } = require('../../warnings.js');
const { EmbedBuilder } = require('discord.js');

const warnEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('Figyelmeztetések')
	.setTimestamp()

module.exports = {
	data: new SlashCommandBuilder()
		.setName('getwarns')
		.setDescription('Lekéri a warnjaidat, ha vannak.'),
	async execute(interaction) {
        const warnings = initializeWarnings();
        const userWarnings = warnings[interaction.user.id];

        console.log(`${interaction.user.username} - getwarns`);

        if (!userWarnings) {
            warnEmbed.setDescription(`Neked nincs figyelmeztetésed.`);
            await interaction.reply({ embeds: [warnEmbed]});
        } else {
            warnEmbed.setDescription(`Figyelmeztetések száma: ${userWarnings.warns}\nIndok:\n► ${userWarnings.reasons.join('\n► ')}`);
            await interaction.reply({ embeds: [warnEmbed]});
        }
	},
};