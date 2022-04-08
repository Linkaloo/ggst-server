import sequelize from "sequelize";

class Attack extends sequelize.Model {
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
