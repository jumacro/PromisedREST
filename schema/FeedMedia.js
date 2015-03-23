module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Feed", {
        
        feed_media_id: { 
            type: DataTypes.INTEGER, 
            autoIncrement: true, 
            primaryKey: true 
        },
        feed_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true, 
            defaultValue: null
        },
        file_path: { 
            type: DataTypes.STRING(100),  
            allowNull: true, 
            defaultValue: null
        },
        large_file_path: { 
            type: DataTypes.STRING(120), 
            allowNull: true, 
            defaultValue: null
        },
        youtube_url: { 
            type: DataTypes.STRING(1000), 
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

        tableName: 'zid_feed_media',
        createdAt: false,
        updatedAt: false,
        deletedAt: false
    });  
}