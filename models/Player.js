const {
  Model,
} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Player.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    region: {
      type: DataTypes.STRING,
    },
    stream: {
      type: DataTypes.STRING,
    },
    guild_id: {
      type: DataTypes.BIGINT,
    },
  }, {
    sequelize,
    modelName: "Player",
    tableName: "player",
    timestamps: true,
    underscored: true,
  });
  return Player;
};
