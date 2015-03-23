module.exports = function(sequelize, DataTypes) {
    return sequelize.define("CharacterDetail", {
        
        character_detail_id: { 
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
        character_id: { 
            type: DataTypes.STRING(1000), 
            allowNull: false 
        },
        server_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true, 
            defaultValue: null
        },
        faction_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true, 
            defaultValue: null
        },
        class_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true, 
            defaultValue: null
        },
        profession1_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true, 
            defaultValue: null
        },
        profession2_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true, 
            defaultValue: null
        },
        profession3_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true, 
            defaultValue: null
        },
        media_info_id: { 
            type: DataTypes.STRING(100), 
            allowNull: true, 
            defaultValue: null
        },
        character_icon: { 
            type: DataTypes.STRING(100), 
            allowNull: true, 
            defaultValue: null
        },
        character_name: { 
            type: DataTypes.STRING(50), 
            allowNull: false
        },
        guild_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true, 
            defaultValue: null
        },
        is_pve_enabled: { 
            type: DataTypes.BOOLEAN, 
            allowNull: true, 
            defaultValue: null
        },
        is_pvp_enabled: { 
            type: DataTypes.BOOLEAN, 
            allowNull: true, 
            defaultValue: null
        },
        is_rp_enabled: { 
            type: DataTypes.BOOLEAN, 
            allowNull: true, 
            defaultValue: null
        },
        level: { 
            type: DataTypes.STRING(3), 
            allowNull: true, 
            defaultValue: null
        },
        is_public: { 
            type: DataTypes.BOOLEAN, 
            allowNull: FALSE, 
            defaultValue: 1
        },
        mini_bio: { 
            type: DataTypes.STRING(1000), 
            allowNull: false
        },
        is_minibio_enabled: { 
            type: DataTypes.BOOLEAN, 
            allowNull: FALSE, 
            defaultValue: 1
        },
        created_date: { 
            type: DataTypes.DATE, 
            allowNull: false
        },
        last_modified_date: { 
            type: DataTypes.DATE, 
            allowNull: true, 
            defaultValue: null
        }

    }, {

        tableName: 'zid_character_details',
        createdAt: false,
        updatedAt: false,
        deletedAt: false
    });  
}