import { Model } from "sequelize";

class Attack extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
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
        name: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
        modelName: "Attack",
        tableName: "attack",
        timestamps: true,
        underscored: true,
      },
    );
  }
}
export default Attack;
