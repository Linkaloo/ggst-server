import Sequelize from "sequelize";
import configFile from "../config/config.js";
import Attack from "./Attack.js";
import Character from "./Character.js";
import Player from "./Player.js";

const env = process.env.NODE_ENV || "development";
const config = configFile[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Player = Player.init(sequelize, Sequelize.DataTypes);
db.Attack = Attack.init(sequelize, Sequelize.DataTypes);
db.Character = Character.init(sequelize, Sequelize.DataTypes);

db.Character.hasMany(db.Attack, { foreignKey: "character_id", onDelete: "cascade" });
db.Attack.belongsTo(db.Character, { foreignKey: "character_id" });

db.Character.hasMany(db.Player, { foreignKey: "character_id", onDelete: "cascade" });
db.Player.belongsTo(db.Character, { foreignKey: "character_id" });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
