const {
  Model,
} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Attack extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Attack.init({
    input: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    damage: {
      type: DataTypes.INTEGER,
    },
    guard: {
      type: DataTypes.STRING,
    },
    startup: {
      type: DataTypes.INTEGER,
    },
    active: {
      type: DataTypes.INTEGER,
    },
    recovery: {
      type: DataTypes.INTEGER,
    },
    on_block: {
      type: DataTypes.INTEGER,
    },
    attack_level: {
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: "Attack",
    tableName: "attack",
    timestamps: true,
    underscored: true,
  });
  return Attack;
};
