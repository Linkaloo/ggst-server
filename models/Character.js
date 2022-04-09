import { Model } from "sequelize";

class Character extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        image: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
        modelName: "Character",
        tableName: "character",
        timestamps: true,
        underscored: true,
      },
    );
  }
}
export default Character;
