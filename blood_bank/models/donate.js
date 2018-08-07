'use strict';

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Donate', {
        id              : { type: DataTypes.BIGINT(12), allowNull: false, autoIncrement: true, Unsigned: true, primaryKey: true, field: 'id' },
        userId          : { type: DataTypes.BIGINT, allowNull: false, field: 'user_id' },
        donateType      : { type: DataTypes.ENUM, allowNull: false, values: ['BL', 'OG', 'TI'], field: 'donate_type' },
        status          : { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0, field: 'status' },
        name            : { type: DataTypes.STRING, allowNull: false, field: 'name' },
        age             : { type: DataTypes.STRING, allowNull: false, field: 'age' },
        sex             : { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0, field: 'sex' },
        lst_donation    : { type: DataTypes.STRING, allowNull: false, field: 'lst_donation' },
        health_condition: { type: DataTypes.STRING, allowNull: false, field: 'health_condition' },
        had_alcohol     : { type: DataTypes.STRING, allowNull: false, field: 'had_alcohol' },
        dental          : { type: DataTypes.STRING, allowNull: false, field: 'dental' },
        pregnant        : { type: DataTypes.STRING, allowNull: false, field: 'pregnant' },
        medication      : { type: DataTypes.STRING, allowNull: false, field: 'medication' },
        tattoo          : { type: DataTypes.STRING, allowNull: false, field: 'tattoo' },
        weight          : { type: DataTypes.STRING, allowNull: false, field: 'weight' },
        illness         : { type: DataTypes.STRING, allowNull: false, field: 'illness' },
        investigation   : { type: DataTypes.STRING, allowNull: false, field: 'investigation' },
        heart           : { type: DataTypes.STRING, allowNull: false, field: 'heart' },
        iron            : { type: DataTypes.STRING, allowNull: false, field: 'iron' },
        drug            : { type: DataTypes.STRING, allowNull: false, field: 'drug' },
        oversea         : { type: DataTypes.STRING, allowNull: false, field: 'oversea' },
        customField1    : { type: DataTypes.STRING(1024), allowNull: true, field: 'custom_field1' },
        customField2    : { type: DataTypes.STRING(1024), allowNull: true, field: 'custom_field2' },
        customField3    : { type: DataTypes.STRING(1024), allowNull: true, field: 'custom_field3' },
        customField4    : { type: DataTypes.STRING, allowNull: true, field: 'custom_field4' },
        customField5    : { type: DataTypes.STRING, allowNull: true, field: 'custom_field5' }
    }, {
        timestamps: true,
        createdAt: 'created_dt',
        updatedAt: 'changed_dt',
        freezeTableName: true,  
        tableName: 'bb_donates'
    });

    Model.associate = function(models){
        this.belongsTo(models.User, { as: 'user', foreignKey: 'userId', targetKey: 'id'})
    };
    
    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};