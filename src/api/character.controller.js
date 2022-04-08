import db from "../../models/index";

const apiGetCharacters = async (req, res) => {
  const list = await db.Character.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });

  const response = {
    characters: list,
  };
  return res.json(response);
};

const apiCreateCharacter = async (req, res) => {
  const character = req.body;
  let response;
  try {
    const newCharacter = await db.Character.create(character);
    response = newCharacter;
  } catch (err) {
    response = {
      error: err,
    };
  }

  return res.json(response);
};

const apiDeleteCharacter = async (req, res) => {
  let response;
  const { params } = req;
  try {
    const des = await db.Character.destroy({ where: { name: params.character } });
    response = {
      total_deleted: des,
    };
  } catch (err) {
    response = {
      error: err,
    };
  }
  return res.json(response);
};

const apiUpdateCharacter = async (req, res) => {
  const update = req.body;

  let response;
  try {
    const updatedCharacter = await db.Character.update(
      update,
      {
        where: {
          name: update.current,
        },
      },
    );

    response = {
      updated: updatedCharacter[0] === 1,
      character: update.name,
    };
  } catch (err) {
    response = {
      error: err,
    };
  }
  return res.json(response);
};

export default {
  apiGetCharacters, apiCreateCharacter, apiDeleteCharacter, apiUpdateCharacter,
};
