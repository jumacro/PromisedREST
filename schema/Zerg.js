module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Zerg", {
    	
        zerg_id: { 
        	type: DataTypes.INTEGER, 
        	autoIncrement: true, 
        	primaryKey: true 
        },
        user_id: { 
        	type: DataTypes.INTEGER,  
        	allowNull: false
        },
        feed_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false
        },
        character_detail_id: { 
            type: DataTypes.STRING(100), 
            allowNull: true, 
            defaultValue: null
        },
        is_zergit: { 
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
        userid: { 
            type: DataTypes.STRING(3000), 
            allowNull: true, 
            defaultValue: null
        }

    }, {

    	tableName: 'zid_zergs',
    	createdAt: false,
    	updatedAt: false,
    	deletedAt: false
    });  
}