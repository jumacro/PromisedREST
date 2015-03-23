module.exports = function(sequelize, DataTypes) {
    return sequelize.define("ManageContent", {
    	
        id: { 
        	type: DataTypes.INTEGER, 
        	autoIncrement: true, 
        	primaryKey: true 
        },
        is_checked: { 
        	type: DataTypes.BOOLEAN, 
        	allowNull: true, 
            defaultValue: 1
        }

    }, {

    	tableName: 'zid_manage_content',
    	createdAt: false,
    	updatedAt: false,
    	deletedAt: false
    });  
}