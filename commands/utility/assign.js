const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

const SKILLED_PLAYER = '363740534600368139';
const GOOD_PLAYER = '391699658021535765';
const SKILLED_CREATOR = '712435601097490483';
const CREATOR = '353212883892436993';
const STARGRINDER = '363738869176205313';

const vEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('Kitüntetéééééééééés')
	.setTimestamp()

module.exports = {
	data: new SlashCommandBuilder()
		.setName('assign')
		.setDescription('Adj megfelelő kitüntetést egy felhasználónak.')
        .addUserOption(option => option.setName('user').setDescription('Felhasználó').setRequired(true))
        .addStringOption(option =>
			option.setName('role')
				.setDescription('A role, amit adni szeretnél')
				.setRequired(true)
                .addChoices(
                    { name: 'Skilled Player', value: SKILLED_PLAYER },
                    { name: 'Good Player', value: GOOD_PLAYER },
                    { name: 'Skilled Creator', value: SKILLED_CREATOR },
                    { name: 'Creator', value: CREATOR },
                    { name: 'Stargrinder', value: STARGRINDER },
        ))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	async execute(interaction) {
        console.log(`${interaction.user.username} - assign`);

        const user = interaction.options.getMember('user');
        const role = interaction.guild.roles.cache.find(r => r.id == interaction.options.getString('role'));

        if (!user) {
            await interaction.reply({content: 'Kérlek szerveren lévő felhasználót említs.', ephemeral: true});
            return;
        }

        // Add roles
        await user.roles.add(role);

        // Change nickname
        await user.setNickname(`${role.name[0]} ${user.nickname.split(' ')[1]}`);

        vEmbed.setDescription(`**${user.user.username}** megkapta a roleját.`);

        interaction.reply({ embeds: [vEmbed], ephemeral: true });
	},
};