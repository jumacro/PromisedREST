module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Guild", {
    	
        guild_id: { 
        	type: DataTypes.INTEGER, 
        	autoIncrement: true, 
        	primaryKey: true 
        },
        user_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        game_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        server_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        faction_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        guild_name: { 
        	type: DataTypes.STRING(50), 
        	allowNull: false 
        },
        guild_logo: { 
            type: DataTypes.STRING(50), 
            allowNull: true, 
            defaultValue: null
        },
        guild_description: { 
            type: DataTypes.TEXT, 
            allowNull: true, 
            defaultValue: null
        },
        is_accept_applicant: { 
        	type: DataTypes.BOOLEAN, 
        	allowNull: true, 
        	defaultValue: null
        },
        is_pvp_enabled: { 
            type: DataTypes.BOOLEAN, 
            allowNull: true, 
            defaultValue: null
        },
        is_pve_enabled: { 
            type: DataTypes.BOOLEAN, 
            allowNull: true, 
            defaultValue: null
        },
        is_rp_enabled: { 
            type: DataTypes.BOOLEAN, 
            allowNull: true, 
            defaultValue: null
        },
        main_comm_url: { 
            type: DataTypes.STRING(50), 
            allowNull: true, 
            defaultValue: null
        },
        main_comm_password: { 
            type: DataTypes.STRING(20), 
            allowNull: true, 
            defaultValue: null
        },
        main_comm_service: { 
            type: DataTypes.STRING(50), 
            allowNull: true, 
            defaultValue: null
        },
        main_comm_port: { 
            type: DataTypes.STRING(10), 
            allowNull: true, 
            defaultValue: null
        },
        second_comm_url: { 
            type: DataTypes.STRING(50), 
            allowNull: true, 
            defaultValue: null
        },
        second_comm_password: { 
            type: DataTypes.STRING(20), 
            allowNull: true, 
            defaultValue: null
        },
        second_comm_service: { 
            type: DataTypes.STRING(50), 
            allowNull: true, 
            defaultValue: null
        },
        second_comm_port: { 
            type: DataTypes.STRING(10), 
            allowNull: true, 
            defaultValue: null
        },
        is_active: { 
            type: DataTypes.BOOLEAN, 
            allowNull: true, 
            defaultValue: 1
        },
        is_favorite: { 
            type: DataTypes.BOOLEAN, 
            allowNull: true, 
            defaultValue: null
        },
        banner_id: { 
            type: DataTypes.INTEGER, 
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

    	tableName: 'zid_guilds',
    	createdAt: false,
    	updatedAt: false,
    	deletedAt: false
    });  
}