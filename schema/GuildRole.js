module.exports = function(sequelize, DataTypes) {
    return sequelize.define("GuildRole", {
    	
        id: { 
        	type: DataTypes.INTEGER, 
        	autoIncrement: true, 
        	primaryKey: true 
        },
        role_name: { 
        	type: DataTypes.STRING(50), 
        	allowNull: false 
        },
        created_date: { 
        	type: DataTypes.DATE, 
        	allowNull: false
        },
        last_modified_date: { 
        	type: DataTypes.DATE, 
        	allowNull: false
        }

    }, {

    	tableName: 'zid_guild_roles',
    	createdAt: false,
    	updatedAt: false,
    	deletedAt: false
    });  
}