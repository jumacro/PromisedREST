module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Event", {
        
        event_id: { 
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
        character_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        event_name: { 
            type: DataTypes.STRING(50), 
            allowNull: true, 
            defaultValue: null
        },
        event_description: { 
            type: DataTypes.TEXT, 
            allowNull: true, 
            defaultValue: null
        },
        event_date: { 
            type: DataTypes.DATE, 
            allowNull: false
        },
        event_todate: { 
            type: DataTypes.DATE, 
            allowNull: false
        },
        event_from_time: { 
            type: DataTypes.STRING(10), 
            allowNull: false
        },
        event_to_time: { 
            type: DataTypes.STRING(10), 
            allowNull: false
        },
        is_attendance_required: { 
            type: DataTypes.BOOLEAN, 
            allowNull: true, 
            defaultValue: null
        },
        is_sendto_officer: { 
            type: DataTypes.BOOLEAN, 
            allowNull: true, 
            defaultValue: null
        },
        is_sendto_member: { 
            type: DataTypes.BOOLEAN, 
            allowNull: true, 
            defaultValue: null
        },
        is_sendto_user: { 
            type: DataTypes.BOOLEAN, 
            allowNull: true, 
            defaultValue: null
        },
        is_sendto_character: { 
            type: DataTypes.BOOLEAN, 
            allowNull: FALSE, 
            defaultValue: 1
        },
        is_no_rsvp_necessary: { 
            type: DataTypes.BOOLEAN, 
            allowNull: FALSE, 
            defaultValue: 1
        },
        rsvp_state: { 
            type: DataTypes.INTEGER, 
            allowNull: false
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
        event_created_timezone: { 
            type: DataTypes.DATE, 
            allowNull: true, 
            defaultValue: null
        },
        is_active: { 
            type: DataTypes.BOOLEAN, 
            allowNull: FALSE, 
            defaultValue: 1
        }

    }, {

        tableName: 'zid_events',
        createdAt: false,
        updatedAt: false,
        deletedAt: false
    });  
}