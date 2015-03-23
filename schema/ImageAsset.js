module.exports = function(sequelize, DataTypes) {
    return sequelize.define("ImageAsset", {
    	
        id: { 
        	type: DataTypes.INTEGER, 
        	autoIncrement: true, 
        	primaryKey: true 
        },
        uuid: { 
            type: DataTypes.INTEGER, 
            allowNull: true, 
            defaultValue: null
        },
        profile_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true, 
            defaultValue: null
        },
        name: { 
        	type: DataTypes.STRING(64), 
        	allowNull: true, 
            defaultValue: null
        },
        path: { 
            type: DataTypes.STRING(255), 
            allowNull: true, 
            defaultValue: null
        },
        type: { 
            type: DataTypes.STRING(32), 
            allowNull: true, 
            defaultValue: null
        },
        size: { 
            type: DataTypes.INTEGER, 
            allowNull: true, 
            defaultValue: null
        },
        options: { 
            type: DataTypes.STRING(255), 
            allowNull: true, 
            defaultValue: null
        },
        created_at: { 
        	type: DataTypes.DATE, 
        	allowNull: false
        },
        updated_at: { 
        	type: DataTypes.DATE, 
        	allowNull: false
        }

    }, {

    	tableName: 'zid_image_assets',
    	createdAt: false,
    	updatedAt: false,
    	deletedAt: false
    });  
}