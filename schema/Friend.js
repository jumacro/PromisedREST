module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Friend", {
        
        friend_id: { 
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
        linked_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false
        },
        comment: { 
            type: DataTypes.STRING(1000), 
            allowNull: true, 
            defaultValue: null
        },
        is_accepted: { 
            type: DataTypes.BOOLEAN, 
            allowNull: false
        },
        is_active: { 
            type: DataTypes.BOOLEAN, 
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
        }

    }, {

        tableName: 'zid_friends',
        createdAt: false,
        updatedAt: false,
        deletedAt: false
    });  
}