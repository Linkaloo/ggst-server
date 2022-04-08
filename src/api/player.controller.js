import db from "../../models/index";

const apiGetPlayers = async (req, res) => {
  const query = { guild_id: req.params.guild };
  const charQuery = {};

  if (req.params.character) {
    charQuery.name = req.params.character;
  }

  const list = await db.Player.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    include: {
      model: db.Character,
      attributes: ["name", "image"],
      where: charQuery,
    },
    where: query,
  });

  const response = {
    players: list,
  };
  return res.json(response);
};

const apiCreatePlayer = async (req, res) => {
  const player = req.body;
  let response;
  let character;
  let newPlayer;

  try {
    character = await db.Character.findOne({ where: { name: player.character } });
    player.character_id = character.id;
    delete player.character;

    newPlayer = await db.Player.findOrCreate({ where: player });
    response = newPlayer;
  } catch (err) {
    const message = (character === null ? "character does not exist" : "player could not be created");
    response = {
      error: { ...err, message },
    };
  }
  return res.json(response);
};

const apiDeletePlayer = async (req, res) => {
  let response;
  const { params } = req;
  if (Object.keys(params).length === 2) {
    try {
      const des = await db.Player.destroy(
        {
          where: {
            name: params.player,
            guild_id: params.guild,
          },
        },
      );
      response = {
        total_deleted: des,
      };
    } catch (err) {
      response = {
        error: err,
      };
    }
  } else {
    try {
      const des = await db.Player.destroy(
        {
          where: {
            guild_id: params.guild,
          },
        },
      );
      response = {
        total_deleted: des,
      };
    } catch (err) {
      response = {
        error: err,
      };
    }
  }

  return res.json(response);
};

const apiUpdatePlayer = async (req, res) => {
  const update = req.body;
  let response;

  if (update.character) {
    try {
      const newCharacter = await db.Character.findOne({ where: { name: update.character } });
      update.character_id = newCharacter.id;
    } catch (err) {
      response = {
        error: { ...err, message: "Character not found", character: update.character },
      };
      return res.json(response);
    }
  }
  try {
    const updatedPlayer = await db.Player.update(
      update,
      {
        where: {
          name: update.current,
          guild_id: update.guild,
        },
      },
    );

    response = {
      updated: updatedPlayer[0] === 1,
      player: update.name,
      character: update.character_id ? update.character : undefined,
    };
  } catch (err) {
    response = {
      error: { ...err, message: "could not update player" },
    };
  }
  return res.json(response);
};

export default {
  apiGetPlayers, apiCreatePlayer, apiDeletePlayer, apiUpdatePlayer,
};
