module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Role", {
    	
        role_id: { 
        	type: DataTypes.INTEGER, 
        	autoIncrement: true, 
        	primaryKey: true 
        },
        role_name: { 
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

    	tableName: 'zid_roles',
    	createdAt: false,
    	updatedAt: false,
    	deletedAt: false
    });  
}