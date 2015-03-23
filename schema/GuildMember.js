module.exports = function(sequelize, DataTypes) {
    return sequelize.define("GuildMember", {
        
        guild_member_id: { 
            type: DataTypes.INTEGER, 
            autoIncrement: true, 
            primaryKey: true 
        },
        guild_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        user_id: { 
            type: DataTypes.INTEGER,
            allowNull: true, 
            defaultValue: null
        },
        character_detail_id: { 
            type: DataTypes.INTEGER,
            allowNull: true, 
            defaultValue: null
        },
        guild_role_id: { 
            type: DataTypes.INTEGER,
            allowNull: true, 
            defaultValue: null
        },
        guild_play_style: { 
            type: DataTypes.INTEGER,
            allowNull: true, 
            defaultValue: null
        },
        about_character: { 
            type: DataTypes.STRING(100),
            allowNull: true, 
            defaultValue: null
        },
        is_speaker_available: { 
            type: DataTypes.BOOLEAN,
            allowNull: true, 
            defaultValue: null
        },
        is_headset_available: { 
            type: DataTypes.BOOLEAN,
            allowNull: true, 
            defaultValue: null
        },
        is_voice_chat_available: { 
            type: DataTypes.BOOLEAN,
            allowNull: true, 
            defaultValue: null
        },
        is_accepted: { 
            type: DataTypes.BOOLEAN,
            allowNull: true, 
            defaultValue: null
        },
        created_date: { 
            type: DataTypes.DATE, 
            allowNull: false
        },
        last_modified_date: { 
            type: DataTypes.DATE, 
            allowNull: true, 
            defaultValue: null
        }

    }, {

        tableName: 'zid_guild_member',
        createdAt: false,
        updatedAt: false,
        deletedAt: false
    });  
}