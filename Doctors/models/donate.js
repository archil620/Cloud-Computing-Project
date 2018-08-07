'use strict';

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Donate', {
        id              : { type: DataTypes.BIGINT(12), allowNull: false, autoIncrement: true, Unsigned: true, primaryKey: true, field: 'id' },
        appId           : { type: DataTypes.BIGINT, allowNull: false, field: 'app_id' },
        userId          : { type: DataTypes.BIGINT, allowNull: true, field: 'user_id' },
        status          : { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0, field: 'status' },
        asking          : { type: DataTypes.STRING, allowNull: false, field: 'asking' },
        needle          : { type: DataTypes.STRING, allowNull: false, field: 'needle' },
        donor           : { type: DataTypes.STRING, allowNull: false, field: 'donor' },
        donationDate    : { type: DataTypes.STRING, allowNull: false, field: 'donation_date' },
        share           : { type: DataTypes.STRING, allowNull: false, field: 'share' },
        customField1    : { type: DataTypes.STRING(1024), allowNull: true, field: 'custom_field1' },
        customField2    : { type: DataTypes.STRING(1024), allowNull: true, field: 'custom_field2' },
        customField3    : { type: DataTypes.STRING, allowNull: true, field: 'custom_field3' },
        customField4    : { type: DataTypes.STRING, allowNull: true, field: 'custom_field4' },
        customField5    : { type: DataTypes.STRING, allowNull: true, field: 'custom_field5' }
    }, {
        timestamps: true,
        createdAt: 'created_dt',
        updatedAt: 'changed_dt',
        freezeTableName: true,  
        tableName: 'bb_donates'
    });
    
    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};