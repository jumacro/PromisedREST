module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Migration", {
    	
        id: { 
        	type: DataTypes.INTEGER, 
        	autoIncrement: true, 
        	primaryKey: true 
        },
        hash: { 
        	type: DataTypes.STRING(30), 
        	allowNull: false 
        },
        name: { 
        	type: DataTypes.STRING(100), 
        	allowNull: true, 
        	defaultValue: null
        },
        updated_date: { 
        	type: DataTypes.DATE, 
        	allowNull: false
        },
        created_date: { 
        	type: DataTypes.DATE, 
        	allowNull: false
        }

    }, {

    	tableName: 'zid_migrations',
    	createdAt: false,
    	updatedAt: false,
    	deletedAt: false
    });  
}