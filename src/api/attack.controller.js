import db from "../../models/index";

const apiGetAttacks = async (req, res) => {
  const characterQuery = {};
  const attackQuery = {};

  if (req.params.character) {
    characterQuery.name = req.params.character;
  }

  if (req.params.input) {
    attackQuery.input = req.params.input;
  }

  const list = await db.Attack.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt", "character_id"],
    },
    include: {
      model: db.Character,
      attributes: ["name", "image"],
      where: characterQuery,
    },
    where: attackQuery,
  });

  const response = {
    attacks: list,
  };
  return res.json(response);
};

const apiCreateAttack = async (req, res) => {
  const attack = req.body;
  let response;

  try {
    const attackExists = await db.Attack.findOne({
      where: {
        input: attack.input,
      },
      include: {
        model: db.Character,
        where: {
          name: attack.character,
        },
      },
    });
    if (!attackExists) {
      const character = await db.Character.findOne({ where: { name: attack.character } });

      const newAttack = await character.createAttack(attack);
      response = newAttack;
    } else {
      response = {
        error: `This move, ${attack.input}, already exists`,
      };
    }
  } catch (err) {
    response = {
      error: err,
    };
  }

  return res.json(response);
};

const apiDeleteAttack = async (req, res) => {
  let response;
  const { params } = req;
  const query = { input: params.input };

  const character = await db.Character.findOne({ where: { name: params.character } });

  if (!character) {
    response = {
      error: "Character not found",
      character: params.character,
    };
    return res.json(response);
  }
  query.character_id = character.id;

  try {
    const des = await db.Attack.destroy({ where: query });

    response = {
      deleted: des > 0,
      total_deleted: des,
      character: params.character,
      input: params.input,
    };
  } catch (err) {
    response = {
      error: err,
    };
  }

  return res.json(response);
};

const apiUpdateAttack = async (req, res) => {
  const update = req.body;
  let response;
  let characterId;

  try {
    const character = await db.Character.findOne({ where: { name: update.character } });
    characterId = character.id;
  } catch (err) {
    response = {
      error: "Character not found",
      character: update.character,
    };
    return res.json(response);
  }

  try {
    const updatedAttack = await db.Attack.update(
      update,
      {
        where: {
          input: update.input,
          character_id: characterId,
        },
      },
    );

    response = {
      updated: updatedAttack[0] === 1,
      input: update.input,
    };
  } catch (err) {
    response = {
      error: err,
    };
  }
  return res.json(response);
};

export default {
  apiGetAttacks, apiCreateAttack, apiDeleteAttack, apiUpdateAttack,
};
