module.exports = function(sequelize, DataTypes) {
    return sequelize.define("GuildFeeds", {
        
        feed_id: { 
            type: DataTypes.INTEGER, 
            autoIncrement: true, 
            primaryKey: true 
        },
        user_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        guild_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        character_detail_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        guild_role_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        feed_media_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        parent_feed_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        feed_text: { 
            type: DataTypes.STRING(2000), 
            allowNull: true, 
            defaultValue: null
        },
        is_visible: { 
            type: DataTypes.BOOLEAN, 
            allowNull: true, 
            defaultValue: null
        },
        zergs: { 
            type: DataTypes.STRING(5000), 
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

        tableName: 'zid_guild_feeds',
        createdAt: false,
        updatedAt: false,
        deletedAt: false
    });  
}