module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert("character", [
      {
        name: "Millia Rage",
        image: "https://dustloop.com/wiki/images/a/ab/GGST_Millia_Rage_Portrait.png",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Jack-O Valentine",
        image: "https://dustloop.com/wiki/images/6/6f/GGST_Jack-O%27_Portrait.png",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Ramlethal Valentine",
        image: "https://dustloop.com/wiki/images/f/fa/GGST_Ramlethal_Valentine_Portrait.png",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});

    await queryInterface.bulkInsert("attack", [
      {
        input: "5p",
        damage: 20,
        guard: "All",
        startup: 7,
        active: 5,
        recovery: 7,
        on_block: -2,
        attack_level: 0,
        character_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        input: "5k",
        damage: 24,
        guard: "All",
        startup: 7,
        active: 3,
        recovery: 12,
        on_block: -3,
        attack_level: 1,
        character_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        input: "5p",
        damage: 22,
        guard: "All",
        startup: 5,
        active: 4,
        recovery: 8,
        on_block: -2,
        attack_level: 0,
        character_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});

    await queryInterface.bulkInsert("player", [
      {
        name: "Lord Knight",
        region: "USA",
        stream: "https://www.twitch.tv/lordknight",
        character_id: 1,
        guild_id: 738568921690669056, // Change this to your discord guild id for testing
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Eddventure",
        region: "USA",
        stream: "https://www.twitch.tv/eddventur3",
        character_id: 2,
        guild_id: 738568921690669056, // Change this to your discord guild id for testing
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "SQuirrel147",
        region: "USA",
        stream: "https://www.twitch.tv/squirrel147",
        character_id: 3,
        guild_id: 738568921690669056, // Change this to your discord guild id for testing
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Solstice",
        region: "USA",
        stream: null,
        character_id: 3,
        guild_id: 738568921690669056, // Change this to your discord guild id for testing
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("player", null, {});
    await queryInterface.bulkDelete("attack", null, {});
    await queryInterface.bulkDelete("character", null, {});
  },
};
