module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Profession", {
    	
        profession_id: { 
        	type: DataTypes.INTEGER, 
        	autoIncrement: true, 
        	primaryKey: true 
        },
        game_id: { 
        	type: DataTypes.INTEGER,
        	allowNull: false 
        },
        profession_name: { 
            type: DataTypes.STRING(50),  
            autoIncrement: true, 
            primaryKey: true 
        },
        is_active: { 
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
        	allowNull: false
        }

    }, {

    	tableName: 'zid_professions',
    	createdAt: false,
    	updatedAt: false,
    	deletedAt: false
    });  
}