module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Sessions", {
    	
        session_id: { 
        	type: DataTypes.STRING(24), 
        	autoIncrement: true, 
        	primaryKey: true 
        },
        last_active: { 
        	type: DataTypes.INTEGER,  
        	allowNull: false
        },
        contents: { 
        	type: DataTypes.TEXT, 
        	allowNull: false
        }

    }, {

    	tableName: 'zid_sessions',
    	createdAt: false,
    	updatedAt: false,
    	deletedAt: false
    });  
}