module.exports = function(sequelize, DataTypes) {
    return sequelize.define("oAuthClient", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        clientId: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        clientSecret: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        tableName: 'zid_oauth_client',
        createdAt: false,
        updatedAt: false,
        deletedAt: false
    });
}