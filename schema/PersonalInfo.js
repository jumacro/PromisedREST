module.exports = function(sequelize, DataTypes) {
    return sequelize.define("PersonalInfo", {
    	
        personal_info_id: { 
        	type: DataTypes.INTEGER, 
        	autoIncrement: true, 
        	primaryKey: true 
        },
        user_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        first_name: { 
            type: DataTypes.STRING(20),
            allowNull: true, 
            defaultValue: null
        },
        last_name: { 
            type: DataTypes.STRING(25),
            allowNull: true, 
            defaultValue: null
        },
        birth_year: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        gender: { 
            type: DataTypes.STRING(20),
            allowNull: true, 
            defaultValue: null
        },
        mini_bio: { 
            type: DataTypes.STRING(2000),
            allowNull: true, 
            defaultValue: null
        },
        country: { 
            type: DataTypes.STRING(20),
            allowNull: true, 
            defaultValue: null
        },
        is_twitter_share: { 
        	type: DataTypes.BOOLEAN, 
        	allowNull: true, 
        	defaultValue: 1
        },
        is_facebook_share: { 
            type: DataTypes.BOOLEAN, 
            allowNull: true, 
            defaultValue: null
        },
        twitter_link: { 
            type: DataTypes.STRING(100),
            allowNull: true, 
            defaultValue: null
        },
        facebook_link: { 
            type: DataTypes.STRING(100), 
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

    	tableName: 'zid_personal_info',
    	createdAt: false,
    	updatedAt: false,
    	deletedAt: false
    });  
}