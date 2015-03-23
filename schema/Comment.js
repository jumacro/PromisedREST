module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Comment", {
    	
        comment_id: { 
        	type: DataTypes.INTEGER, 
        	autoIncrement: true, 
        	primaryKey: true 
        },
        feed_id: { 
        	type: DataTypes.STRING(50), 
        	allowNull: true, 
            defaultValue: null
        },
        user_id: { 
            type: DataTypes.STRING(50), 
            allowNull: true, 
            defaultValue: null
        },
        character_detail_id: { 
            type: DataTypes.STRING(50), 
            allowNull: true, 
            defaultValue: null
        },
        comment: { 
            type: DataTypes.TEXT, 
            allowNull: false 
        },
        zergs: { 
        	type: DataTypes.TEXT, 
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

    	tableName: 'zid_comments',
    	createdAt: false,
    	updatedAt: false,
    	deletedAt: false
    });  
}