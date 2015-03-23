module.exports = function(sequelize, DataTypes) {
    return sequelize.define("GuildFeedMedia", {
        
        feed_media_id: { 
            type: DataTypes.INTEGER, 
            autoIncrement: true, 
            primaryKey: true 
        },
        feed_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        file_path: { 
            type: DataTypes.STRING(2000),
            allowNull: true, 
            defaultValue: null
        },
        large_file_path: { 
            type: DataTypes.STRING(150),
            allowNull: true, 
            defaultValue: null
        },
        youtube_url: { 
            type: DataTypes.STRING(1000),
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

        tableName: 'zid_guild_feed_media',
        createdAt: false,
        updatedAt: false,
        deletedAt: false
    });  
}