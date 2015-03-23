module.exports = function(sequelize, dataTypes){
	return sequelize.define("Device", {
		id: {
			type: dataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		user_id: {
			type: dataTypes.STRING(64), 
			allowNull: true 
		},
		device_id: {
			type: dataTypes.STRING(255), 
			allowNull: true 
		},
        created_at: { 
        	type: dataTypes.DATE, 
        	allowNull: true
        },
        last_modified_at: { 
        	type: dataTypes.DATE, 
        	allowNull: true
        },
		platform: {
			type: dataTypes.STRING(25), 
			allowNull: true 
		}

	}, {

    	tableName: 'zid_devices',
    	createdAt: false,
    	updatedAt: false,
    	deletedAt: false
    });
}