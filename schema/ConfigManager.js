module.exports = function(sequelize, DataTypes) {
    return sequelize.define("ConfigManager", {
    	
        config_manager_id: { 
        	type: DataTypes.INTEGER, 
        	autoIncrement: true, 
        	primaryKey: true 
        },
        no_of_zerg_stories: { 
        	type: DataTypes.INTEGER, 
        	allowNull: true, 
            defaultValue: null
        },
        custom_message: { 
        	type: DataTypes.STRING(3000), 
        	allowNull: true, 
        	defaultValue: null
        },
        is_total_user_count_display: { 
            type: DataTypes.boolean, 
            allowNull: true, 
            defaultValue: null
        },
        is_no_of_zergs_today: { 
            type: DataTypes.boolean, 
            allowNull: true, 
            defaultValue: null
        },
        is_no_of_comment_display: { 
            type: DataTypes.boolean, 
            allowNull: true, 
            defaultValue: null
        },
        is_message_show: { 
            type: DataTypes.boolean, 
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

    	tableName: 'zid_config_manager',
    	createdAt: false,
    	updatedAt: false,
    	deletedAt: false
    });  
}