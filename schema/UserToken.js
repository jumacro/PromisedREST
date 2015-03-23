module.exports = function(sequelize, DataTypes) {
    return sequelize.define("UserToken", {
    	
        token_id: { 
        	type: DataTypes.INTEGER, 
        	autoIncrement: true, 
        	primaryKey: true 
        },
        user_id: { 
        	type: DataTypes.INTEGER,  
        	allowNull: false
        },
        token: { 
            type: DataTypes.STRING(1000), 
            allowNull: true, 
            defaultValue: null
        },
        expires: { 
            type: DataTypes.STRING(100), 
            allowNull: true, 
            defaultValue: null
        },
        user_agent: { 
            type: DataTypes.STRING(100), 
            allowNull: true, 
            defaultValue: null
        },
        created: { 
            type: DataTypes.DATE, 
            allowNull: false
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

    	tableName: 'zid_user_tokens',
    	createdAt: false,
    	updatedAt: false,
    	deletedAt: false
    });  
}