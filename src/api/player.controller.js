import db from "../../models/index.js";

const apiGetPlayers = async (req, res) => {
  const playerQuery = {};
  const charQuery = {};
  const { character, stream, guildId } = req.query;

  if (guildId) {
    playerQuery.guild_id = guildId;
  }
  if (stream) {
    playerQuery.stream = `${process.env.BASE_TWITCH_URL}/${stream}`;
  }
  if (character) {
    charQuery.name = character;
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
    where: playerQuery,
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
  const playerQuery = {};
  const charQuery = {};
  const { player, character, guildId } = req.query;
  let response;

  if ((character === undefined && player === undefined) || guildId === undefined) {
    response = {
      error: {
        message: "guild id was not provided or one of character or player was not provided",
      },
    };
    return res.json(response);
  }

  if (guildId) {
    playerQuery.guild_id = guildId;
  }
  if (player) {
    playerQuery.name = player;
  }
  if (character) {
    charQuery.name = character;
  }
  await db.Player.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    include: {
      model: db.Character,
      attributes: ["name", "image"],
      where: charQuery,
    },
    where: playerQuery,
  });
  if (character) {
    const players = await db.Player.findAll({
      include: {
        model: db.Character,
        where: charQuery,
      },
      where: {
        guild_id: playerQuery.guild_id,
      },
    });
    const des = players.length;
    response = {
      total_deleted: des,
    };
    players.forEach(async (p) => {
      await p.destroy();
    });
  } else {
    try {
      const des = await db.Player.destroy(
        {
          where: {
            name: playerQuery.name,
            guild_id: playerQuery.guild_id,
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
