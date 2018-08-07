'use strict';
const bcrypt 			= require('bcrypt');
const bcrypt_p 			= require('bcrypt-promise');
const jwt           	= require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('User', {
        id              : { type: DataTypes.BIGINT, allowNull: false, autoIncrement: true, unsigned: true, zeroFill: true, primaryKey: true, field: 'id' },
        email           : { type: DataTypes.STRING(132), allowNull: true, unique: true, validate: { isEmail: true}, field: 'user_email' },
        socialUid       : { type: DataTypes.STRING(64), allowNull: true, field: 'social_uid' },
        gtoken          : { type: DataTypes.STRING, allowNull: true, field: 'gtoken' },
        customField1    : { type: DataTypes.STRING, allowNull: true, field: 'custom_field1' },
        customField2    : { type: DataTypes.STRING, allowNull: true, field: 'custom_field2' },
        customField3    : { type: DataTypes.STRING, allowNull: true, field: 'custom_field3' },
        customField4    : { type: DataTypes.STRING, allowNull: true, field: 'custom_field4' },        
    }, {
        timestamps: true,
        createdAt: 'created_dt',
        updatedAt: 'changed_dt',
        freezeTableName: true,  
        tableName: 'bb_users'
    });

    Model.associate = function(models){
        this.hasMany(models.Donate, { as: 'donation', foreignKey: 'userId', sourceKey: 'id'});
    };

    Model.beforeSave(async (user, options) => {
        let err;
        if (user.changed('password')){
            let salt, hash
            [err, salt] = await to(bcrypt.genSalt(10));
            if(err) TE(err.message, true);

            [err, hash] = await to(bcrypt.hash(user.password, salt));
            if(err) TE(err.message, true);

            user.password = hash;
        }
    });

    Model.prototype.comparePassword = async function (pw) {
        let err, pass
        if(!this.password) TE('password not set');

        [err, pass] = await to(bcrypt_p.compare(pw, this.password));
        if(err) TE(err);

        if(!pass) TE('invalid password');

        return this;
    }

    Model.prototype.getJWT = function () {
        let expiration_time = parseInt(CONFIG.jwt_expiration);
        return "Bearer "+jwt.sign({user_id:this.id}, CONFIG.jwt_encryption, {expiresIn: expiration_time});
    };

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};