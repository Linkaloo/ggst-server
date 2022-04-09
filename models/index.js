import Sequelize from "sequelize";
import configFile from "../config/config.js";
import Attack from "./Attack.js";
import Character from "./Character.js";
import Player from "./Player.js";

const env = process.env.NODE_ENV || "development";
const config = configFile[env];
const db = {};

let sequelize;

console.log(config);

if (process.env.DB_URI) {
  console.log("connecting through URI");
  sequelize = new Sequelize(process.env.DB_URI);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}
try {
  await sequelize.authenticate();
  console.log("Connection to database established");
} catch (err) {
  console.log("Unable to connect to the database");
}

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
