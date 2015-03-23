module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Server", {
    	
        id: { 
        	type: DataTypes.INTEGER, 
        	autoIncrement: true, 
        	primaryKey: true 
        },
        game_id: { 
        	type: DataTypes.INTEGER,  
        	allowNull: false
        },
        server_name: { 
            type: DataTypes.STRING(50), 
            allowNull: true, 
            defaultValue: null
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

    	tableName: 'zid_servers',
    	createdAt: false,
    	updatedAt: false,
    	deletedAt: false
    });  
}