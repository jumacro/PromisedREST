module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Message", {
    	
        message_id: { 
        	type: DataTypes.INTEGER, 
        	autoIncrement: true, 
        	primaryKey: true 
        },
        user_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        guild_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        character_detail_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        receiver_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        guild_receiver_id: { 
            type: DataTypes.STRING(2000),
            allowNull: true, 
            defaultValue: null
        },
        event_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        parent_message_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        parent_reply_message_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        is_replied: { 
            type: DataTypes.BOOLEAN, 
            allowNull: false 
        },
        subject: { 
            type: DataTypes.STRING(100),
            allowNull: true, 
            defaultValue: null
        },
        message: { 
            type: DataTypes.STRING(3000),
            allowNull: true, 
            defaultValue: null
        },
        is_message_viewed: { 
            type: DataTypes.BOOLEAN, 
            allowNull: false 
        },
        is_event_message_viewed: { 
        	type: DataTypes.STRING(2000),
        	allowNull: true, 
        	defaultValue: 1
        },
        is_message_parent: { 
            type: DataTypes.BOOLEAN, 
            allowNull: true, 
            defaultValue: null
        },
        is_garbage_message: { 
            type: DataTypes.STRING(100),
            allowNull: true, 
            defaultValue: null
        },
        is_message_deleted: { 
            type: DataTypes.STRING(100), 
            allowNull: true, 
            defaultValue: null
        },
        is_message_active: { 
            type: DataTypes.BOOLEAN, 
            allowNull: true, 
            defaultValue: null
        },
        is_sent_delete: { 
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

    	tableName: 'zid_messages',
    	createdAt: false,
    	updatedAt: false,
    	deletedAt: false
    });  
}