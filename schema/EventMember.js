module.exports = function(sequelize, DataTypes) {
    return sequelize.define("EventMember", {
    	
        event_member_id: { 
        	type: DataTypes.INTEGER, 
        	autoIncrement: true, 
        	primaryKey: true 
        },
        user_id: { 
        	type: DataTypes.INTEGER, 
        	allowNull: false 
        },
        character_detail_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        event_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        is_rsvp: { 
        	type: DataTypes.BOOLEAN, 
        	allowNull: true, 
        	defaultValue: null
        },
        is_alternate: { 
            type: DataTypes.BOOLEAN, 
            allowNull: true, 
            defaultValue: null
        },
        is_rsvp_accepted: { 
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
        },
        comeas_role: { 
            type: DataTypes.STRING(2000), 
            allowNull: true, 
            defaultValue: null
        },
        is_role_accepted: { 
            type: DataTypes.STRING(72), 
            allowNull: true, 
            defaultValue: null
        }

    }, {

    	tableName: 'zid_event_members',
    	createdAt: false,
    	updatedAt: false,
    	deletedAt: false
    });  
}