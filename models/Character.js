import sequelize from "sequelize";

class Character extends sequelize.Model {
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
