module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Class", {
    	
        class_id: { 
        	type: DataTypes.INTEGER, 
        	autoIncrement: true, 
        	primaryKey: true 
        },
        game_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        faction_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true, 
            defaultValue: null
        },
        class_name: { 
        	type: DataTypes.STRING(50), 
        	allowNull: false 
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

    	tableName: 'zid_classes',
    	createdAt: false,
    	updatedAt: false,
    	deletedAt: false
    });  
}