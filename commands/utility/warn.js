const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { initializeWarnings } = require('../../warnings.js');
const fs = require('fs');
const { EmbedBuilder } = require('discord.js');
const moment = require('moment');

const FIGY_ROLE = '1187573212335325224'


const warnEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('Figyelmeztetés')
	.setTimestamp()

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Figyelmeztess egy felhasználót.')
        .addUserOption(option => option.setName('user').setDescription('Figyelmeztetendő felhasználó').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Indok')
        .setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	async execute(interaction) {
        let warnings = initializeWarnings();

        console.log(`${interaction.user.username} - warn`);

        const user = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason');

        if (!user) {
            await interaction.reply({content: 'Kérlek szerveren lévő felhasználót említs.', ephemeral: true});
            return;
        }

        const time = moment().format('YYYY-MM-DD HH:mm')

        // Create or update warnings for the user
        if (!warnings[user.user.id]) {
                warnings[user.user.id] = {
                username: user.user.username,
                warns: 1,
                reasons: [reason],
                date: [time]
            };
        } else {
            warnings[user.user.id].warns++;
            warnings[user.user.id].reasons.push(reason);
            warnings[user.user.id].date.push(time);
            console.log(user.user);

            if(warnings[user.user.id].warns == 4) {
                const role = interaction.guild.roles.cache.find(r => r.id == FIGY_ROLE);
                await user.roles.add(role);
            }

            if(warnings[user.user.id].warns == 5) {
                await user.kick();
            }

            if(warnings[user.user.id].warns == 6) {
                await interaction.guild.members.ban(user);
            }
        }

        fs.writeFile('warnings.json', JSON.stringify(warnings), 'utf8', (err) => {
        if (err) {
            console.error('Hiba a mentes kozben:', err);
            interaction.reply({content: 'Hiba a mentés közben. Szólj a gazdámnak, Martinnak erről.', ephemeral: true});
        } else {
            const extraStr = warnings[user.user.id].warns == 4 ? "\n*Megkapta a figyelmeztetett rolet.*" : 
                (warnings[user.user.id].warns == 5 ? "\n*Ki lett kickelve a szerverről.*" : 
                (warnings[user.user.id].warns == 6) ? "\n*Ki lett bannolva a szerverről.*" : ""); 

            warnEmbed.setDescription(`**${user.user.username}** figyelmeztetve lett a következő indokkal: **${reason}**.
            \nFigyelmeztetések száma: ${warnings[user.user.id].warns}` + extraStr);

            interaction.reply({ embeds: [warnEmbed]});
        }
        });
	},
};