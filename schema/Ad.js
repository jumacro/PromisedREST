module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Ad", {
        
        uuid: { 
            type: DataTypes.UUID,
            primaryKey: true 
        },
        company_id: { 
            type: DataTypes.STRING(64), 
            allowNull: true, 
            defaultValue: null
        },
        description: { 
            type: DataTypes.STRING(255), 
            allowNull: true, 
            defaultValue: null
        },
        ad_unit_category: { 
            type: DataTypes.STRING(64), 
            allowNull: true, 
            defaultValue: null
        },
        ad_unit_name: { 
            type: DataTypes.STRING(64), 
            allowNull: true, 
            defaultValue: null
        },
        approved: { 
            type: DataTypes.BOOLEAN, 
            allowNull: true, 
            defaultValue: null
        },
        inline_enabled: { 
            type: DataTypes.BOOLEAN, 
            allowNull: true, 
            defaultValue: null
        },
        leftrail_enabled: { 
            type: DataTypes.BOOLEAN, 
            allowNull: true, 
            defaultValue: null
        },
        dimensions: { 
            type: DataTypes.STRING(32), 
            allowNull: true, 
            defaultValue: null
        },
        leftrail_code: { 
            type: DataTypes.TEXT, 
            allowNull: true, 
            defaultValue: null
        },
        inline_code: { 
            type: DataTypes.TEXT, 
            allowNull: true, 
            defaultValue: null
        },
        cpc: { 
            type: DataTypes.FLOAT, 
            allowNull: true, 
            defaultValue: null
        },
        cpm: { 
            type: DataTypes.FLOAT, 
            allowNull: true, 
            defaultValue: null
        },
        display_count: { 
            type: DataTypes.INTEGER, 
            allowNull: true, 
            defaultValue: null
        },
        click_count: { 
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
            allowNull: true, 
            defaultValue: null
        }

    }, {

        tableName: 'zid_ads',
        createdAt: false,
        updatedAt: false,
        deletedAt: false
    });  
}