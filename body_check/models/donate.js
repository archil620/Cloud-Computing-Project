'use strict';

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Donate', {
        id              : { type: DataTypes.BIGINT(12), allowNull: false, autoIncrement: true, Unsigned: true, primaryKey: true, field: 'id' },
        appId           : { type: DataTypes.BIGINT, allowNull: false, field: 'app_id' },
        status          : { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0, field: 'status' },
        glucose          : { type: DataTypes.STRING, allowNull: false, field: 'glucose' },
        bun          : { type: DataTypes.STRING, allowNull: false, field: 'bun' },
        creatinine           : { type: DataTypes.STRING, allowNull: false, field: 'creatinine' },
        glom    : { type: DataTypes.STRING, allowNull: false, field: 'glom' },
        african           : { type: DataTypes.STRING, allowNull: false, field: 'african' },
        bun_creatinine           : { type: DataTypes.STRING, allowNull: false, field: 'bun_creatinine' },
        sodium           : { type: DataTypes.STRING, allowNull: false, field: 'sodium' },
        potassium           : { type: DataTypes.STRING, allowNull: false, field: 'potassium' },
        chloride           : { type: DataTypes.STRING, allowNull: false, field: 'chloride' },
        carbon           : { type: DataTypes.STRING, allowNull: false, field: 'carbon' },
        calcium           : { type: DataTypes.STRING, allowNull: false, field: 'calcium' },
        protein           : { type: DataTypes.STRING, allowNull: false, field: 'protein' },
        albumin           : { type: DataTypes.STRING, allowNull: false, field: 'albumin' },
        globulin           : { type: DataTypes.STRING, allowNull: false, field: 'globulin' },
        ag           : { type: DataTypes.STRING, allowNull: false, field: 'ag' },
        bilirubin           : { type: DataTypes.STRING, allowNull: false, field: 'bilirubin' },
        alkaline           : { type: DataTypes.STRING, allowNull: false, field: 'alkaline' },
        ast           : { type: DataTypes.STRING, allowNull: false, field: 'ast' },
        alt_sgpt           : { type: DataTypes.STRING, allowNull: false, field: 'alt_sgpt' },
        tsh           : { type: DataTypes.STRING, allowNull: false, field: 'tsh' },
        white           : { type: DataTypes.STRING, allowNull: false, field: 'white' },
        red           : { type: DataTypes.STRING, allowNull: false, field: 'red' },
        hemoglobin           : { type: DataTypes.STRING, allowNull: false, field: 'hemoglobin' },
        hematocrit           : { type: DataTypes.STRING, allowNull: false, field: 'hematocrit' },
        mcv           : { type: DataTypes.STRING, allowNull: false, field: 'mcv' },
        mch           : { type: DataTypes.STRING, allowNull: false, field: 'mch' },
        mchc           : { type: DataTypes.STRING, allowNull: false, field: 'mchc' },
        rdw           : { type: DataTypes.STRING, allowNull: false, field: 'rdw' },
        platelets           : { type: DataTypes.STRING, allowNull: false, field: 'platelets' },
        neutrophils           : { type: DataTypes.STRING, allowNull: false, field: 'neutrophils' },
        lymphs           : { type: DataTypes.STRING, allowNull: false, field: 'lymphs' },
        monocytes           : { type: DataTypes.STRING, allowNull: false, field: 'monocytes' },
        eos           : { type: DataTypes.STRING, allowNull: false, field: 'eos' },
        basos           : { type: DataTypes.STRING, allowNull: false, field: 'basos' },
        neutrophils_abs           : { type: DataTypes.STRING, allowNull: false, field: 'neutrophils_abs' },
        customField1    : { type: DataTypes.STRING(1024), allowNull: true, field: 'custom_field1' },
        customField2    : { type: DataTypes.STRING(1024), allowNull: true, field: 'custom_field2' },
        customField3    : { type: DataTypes.STRING(1024), allowNull: true, field: 'custom_field3' },
        customField4    : { type: DataTypes.STRING(1024), allowNull: true, field: 'custom_field4' },
        customField5    : { type: DataTypes.STRING(1024), allowNull: true, field: 'custom_field5' }
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