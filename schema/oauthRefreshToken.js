module.exports = function(sequelize, DataTypes) {
    return sequelize.define("oAuthRefreshToken", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        clientId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'zid_oauth_refresh_token',
        createdAt: false,
        updatedAt: false,
        deletedAt: false
    });
}