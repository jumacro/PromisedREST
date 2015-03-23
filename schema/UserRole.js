module.exports = function(sequelize, DataTypes) {
    return sequelize.define("UserRole", {
    	
        id: { 
        	type: DataTypes.INTEGER, 
        	autoIncrement: true, 
        	primaryKey: true 
        },
        name: { 
        	type: DataTypes.STRING(30), 
        	allowNull: false 
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

    	tableName: 'zid_user_roles'
    });  
}