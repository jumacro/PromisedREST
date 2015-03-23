module.exports = function(sequelize, DataTypes) {
    return sequelize.define("User", {
    	
        id: { 
        	type: DataTypes.INTEGER, 
        	autoIncrement: true, 
        	primaryKey: true 
        },
        username: { 
        	type: DataTypes.STRING(50), 
        	allowNull: false 
        },
        profile_image1: { 
        	type: DataTypes.STRING(50), 
        	allowNull: true, 
        	defaultValue: null
        },
        profile_image2: { 
        	type: DataTypes.STRING(50), 
        	allowNull: true, 
        	defaultValue: null
        },
        profile_image3: { 
        	type: DataTypes.STRING(50), 
        	allowNull: true, 
        	defaultValue: null
        },
        profile_image_active: { 
        	type: DataTypes.BOOLEAN, 
        	allowNull: true, 
        	defaultValue: null
        },
        email: { 
        	type: DataTypes.STRING(50), 
        	allowNull: false 
        },
        password: { 
        	type: DataTypes.STRING(200), 
        	allowNull: false 
        },
        user_type: { 
        	type: DataTypes.INTEGER, 
        	allowNull: false, 
        	defaultValue: 1 
        },
        last_login: { 
        	type: DataTypes.INTEGER, 
        	allowNull: true, 
        	defaultValue: null
        },
        logins: { 
        	type: DataTypes.INTEGER, 
        	allowNull: true, 
        	defaultValue: null
        },
        banner_id: { 
        	type: DataTypes.INTEGER, 
        	allowNull: true, 
        	defaultValue: null
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
        	allowNull: true, 
        	defaultValue: null
        },
        twitter_active: { 
        	type: DataTypes.BOOLEAN, 
        	allowNull: false
        },
        facebook_active: { 
        	type: DataTypes.BOOLEAN, 
        	allowNull: false
        },
        is_twitter_linked: { 
        	type: DataTypes.BOOLEAN, 
        	allowNull: false
        },
        is_facebook_linked: { 
        	type: DataTypes.BOOLEAN, 
        	allowNull: false
        },
        user_timezone: { 
        	type: DataTypes.STRING(200), 
        	allowNull: true, 
        	defaultValue: null
        },
        is_deleted: { 
        	type: DataTypes.BOOLEAN, 
        	allowNull: false, 
        	defaultValue: 1
        },
        feed_type: { 
        	type: DataTypes.BOOLEAN, 
        	allowNull: true, 
        	defaultValue: 1
        }

    }, {

    	tableName: 'zid_users',
    	createdAt: false,
    	updatedAt: false,
    	deletedAt: false
    });  
}