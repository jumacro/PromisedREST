module.exports = function(sequelize, DataTypes) {
    return sequelize.define("ZergStory", {
    	
        zerg_story_id: { 
        	type: DataTypes.INTEGER, 
        	autoIncrement: true, 
        	primaryKey: true 
        },
        id: { 
        	type: DataTypes.INTEGER,  
        	allowNull: false
        },
        media_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false
        },
        zerg_story: { 
            type: DataTypes.TEXT, 
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
        	allowNull: false
        }

    }, {

    	tableName: 'zid_zerg_stories',
    	createdAt: false,
    	updatedAt: false,
    	deletedAt: false
    });  
}