module.exports = function(sequelize, DataTypes) {
    return sequelize.define("MediaInfo", {
    	
        media_info_id: { 
        	type: DataTypes.INTEGER, 
        	autoIncrement: true, 
        	primaryKey: true 
        },
        user_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        media_type: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        file_path: { 
        	type: DataTypes.STRING(50), 
        	allowNull: true, 
            defaultValue: null
        },
        youtube_url: { 
            type: DataTypes.STRING(50), 
            allowNull: true, 
            defaultValue: null
        },
        is_active: { 
        	type: DataTypes.BOOLEAN, 
        	allowNull: true, 
        	defaultValue: 1
        },
        is_default: { 
            type: DataTypes.BOOLEAN, 
            allowNull: true, 
            defaultValue: null
        },
        is_banner: { 
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

    	tableName: 'zid_media_info',
    	createdAt: false,
    	updatedAt: false,
    	deletedAt: false
    });  
}