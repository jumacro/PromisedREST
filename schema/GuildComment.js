module.exports = function(sequelize, DataTypes) {
    return sequelize.define("GuildComments", {
        
        comment_id: { 
            type: DataTypes.INTEGER, 
            autoIncrement: true, 
            primaryKey: true 
        },
        feed_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
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
        comment: { 
            type: DataTypes.STRING(2000), 
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

        tableName: 'zid_guild_comments',
        createdAt: false,
        updatedAt: false,
        deletedAt: false
    });  
}