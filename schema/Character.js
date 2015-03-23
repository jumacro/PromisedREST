module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Character", {
    	
        character_id: { 
        	type: DataTypes.INTEGER, 
        	autoIncrement: true, 
        	primaryKey: true 
        },
        character_role_name: { 
        	type: DataTypes.STRING(50), 
        	allowNull: false 
        },
        is_active: { 
        	type: DataTypes.BOOLEAN, 
        	allowNull: true, 
        	defaultValue: 1
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

    	tableName: 'zid_characters',
    	createdAt: false,
    	updatedAt: false,
    	deletedAt: false
    });  
}