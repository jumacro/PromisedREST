module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Game", {
    	
        id: { 
        	type: DataTypes.INTEGER, 
        	autoIncrement: true, 
        	primaryKey: true 
        },
        user_id: { 
        	type: DataTypes.INTEGER,  
        	allowNull: false
        },
        server_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false
        },
        game_name: { 
            type: DataTypes.STRING(100), 
            allowNull: true, 
            defaultValue: null
        },
        game_logo: { 
            type: DataTypes.STRING(50), 
            allowNull: true, 
            defaultValue: null
        },
        description: { 
            type: DataTypes.TEXT, 
            allowNull: false 
        },
        is_active: { 
        	type: DataTypes.BOOLEAN, 
        	allowNull: true, 
        	defaultValue: null
        },
        accepted_on: { 
            type: DataTypes.DATE, 
            allowNull: true, 
            defaultValue: null
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

    	tableName: 'zid_games',
    	createdAt: false,
    	updatedAt: false,
    	deletedAt: false
    });  
}