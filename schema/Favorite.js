module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Favorite", {
    	
        favorite_id: { 
        	type: DataTypes.INTEGER, 
        	autoIncrement: true, 
        	primaryKey: true 
        },
        user_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        guild_favorite: { 
        	type: DataTypes.STRING(50), 
        	allowNull: false 
        },
        character_favorite: { 
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

    	tableName: 'zid_favorites',
    	createdAt: false,
    	updatedAt: false,
    	deletedAt: false
    });  
}