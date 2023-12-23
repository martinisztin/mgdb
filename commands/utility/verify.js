const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

const TAG_ROLE = '458728115565494272';
const MEGEROSITETT_ROLE = '344193945925844993';
const VENDEG_ROLE = '639961928688467978';

const vEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('Megerősítés')
	.setTimestamp()

module.exports = {
	data: new SlashCommandBuilder()
		.setName('verify')
		.setDescription('Adj megerősített "jogokat" egy felhasználónak.')
        .addUserOption(option => option.setName('user').setDescription('Felhasználó').setRequired(true))
        .addStringOption(option => option.setName('nick').setDescription('Becenév').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	async execute(interaction) {
        console.log(`${interaction.user.username} - verify`);

        const user = interaction.options.getMember('user');
        const nick = interaction.options.getString('nick');

        console.log(user);

        if (!user) {
            await interaction.reply({content: 'Kérlek szerveren lévő felhasználót említs.', ephemeral: true});
            return;
        }

        // Add roles
        const tagRole = interaction.guild.roles.cache.find(r => r.id = TAG_ROLE);
        await user.roles.add(tagRole);

        const mRole = interaction.guild.roles.cache.find(r => r.id = MEGEROSITETT_ROLE);
        await user.roles.add(mRole);

        // Change nickname
        await user.setNickname(`♦ ${nick}`);

        // Remove guest if they have it
        if (user.roles.cache.some(role => role.id === VENDEG_ROLE)) {
            user.roles.remove(interaction.guild.roles.cache.find(r => r.id = VENDEG_ROLE));
        }

        vEmbed.setDescription(`**${user.user.username}** megerősítése sikeresen megtörtént.`);

        interaction.reply({ embeds: [vEmbed], ephemeral: true });
	},
};