import { Model } from "sequelize";

class Player extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
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
      },
      {
        sequelize,
        modelName: "Player",
        tableName: "player",
        timestamps: true,
        underscored: true,
      },
    );
  }
}

export default Player;
