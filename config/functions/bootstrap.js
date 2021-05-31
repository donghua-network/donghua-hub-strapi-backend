"use strict";
const fs = require("fs");

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#bootstrap
 */

async function createDummyData() {
  // genre
  const actionGenre = await strapi.services.genre.create({
    name: "Action",
  });

  const dramaGenre = await strapi.services.genre.create({
    name: "Drama",
  });

  // media-type
  const mediaType = await strapi.services["media-type"].create({
    name: "ONA",
  });

  // person
  const person = await strapi.services.person.create({
    name: "Jie Zhang",
  });

  // studio
  const studio = await strapi.services.studio.create({
    name: "B.C MAY PICTURES",
  });

  // tag
  const tag1 = await strapi.services.tag.create({
    name: "Video Games",
  });

  const tag2 = await strapi.services.tag.create({
    name: "E-Sports",
  });

  // donghua
  const donghua = await strapi.services.donghua.create({
    numEpisodes: 12,
    duration: 24,
    genres: [actionGenre.id, dramaGenre.id],
    media_type: mediaType.id,
    studios: [studio.id],
    tags: [tag1.id, tag2.id],
    titles: {
      romanized: "Quanzhi Gaoshou",
      en: "The King's Avatar",
      "zh-Hans": "全职高手",
    },
    alternativeTitles: ["全職高手", "Full-Time Expert", "Master of Skills"],
    description: `Widely regarded as a trailblazer and top-tier professional player in the online multiplayer game Glory, Ye Xiu is dubbed the "Battle God" for his skills and contributions to the game over the years. However, when forced to retire from the team and to leave his gaming career behind, he finds work at a nearby internet café. There, when Glory launches its tenth server, he throws himself into the game once more using a new character named "Lord Grim."

    Ye Xiu's early achievements on the new server immediately catch the attention of many players, as well as the big guilds, leaving them to wonder about the identity of this exceptional player. However, while he possesses ten years of experience and in-depth knowledge, starting afresh with neither sponsors nor a team in a game that has changed over the years presents numerous challenges. Along with talented new comrades, Ye Xiu once again dedicates himself to traversing the path to Glory's summit!
    
    [Written by MAL Rewrite]`,
    isAiring: false,
    startDate: new Date(),
    endDate: new Date(),
    streams: {
      youtube:
        "https://www.youtube.com/watch?v=O7XQd5wRPm8&list=PLMX26aiIvX5pFbfTf10Tke0CiMwxO76fT",
    },
    trailers: [
      {
        youtube: "ef7GCI4Cdxg",
      },
    ],
    popularity: { myanimelist: 292490 },
    score: { myanimelist: 7.96 },
    totalPopularity: 292490,
    aggregateScore: 7.96,
    isFeatured: true,
    relatedWorks: {
      sequel: 2,
    },
    externalSiteIds: {
      anilist: 98861,
      myanimelist: 33926,
    },
  });

  // image
  await strapi.entityService.uploadFiles(
    donghua,
    {
      image: [
        {
          name: "placeholder.jpg",
          type: "image/jpeg",
          path: "./public/images/placeholder.jpg",
        },
      ],
    },
    {
      model: "donghua",
    }
  );

  // donghua
  const donghua2 = await strapi.services.donghua.create({
    numEpisodes: 12,
    duration: 24,
    genres: [actionGenre.id, dramaGenre.id],
    media_type: mediaType.id,
    studios: [studio.id],
    tags: [tag1.id, tag2.id],
    titles: {
      romanized: "Quanzhi Gaoshou Specials",
      "zh-Hans": "全职高手 特别篇",
    },
    alternativeTitles: ["全職高手", "Full-Time Expert", "Master of Skills"],
    description: `Widely regarded as a trailblazer and top-tier professional player in the online multiplayer game Glory, Ye Xiu is dubbed the "Battle God" for his skills and contributions to the game over the years. However, when forced to retire from the team and to leave his gaming career behind, he finds work at a nearby internet café. There, when Glory launches its tenth server, he throws himself into the game once more using a new character named "Lord Grim."

    Ye Xiu's early achievements on the new server immediately catch the attention of many players, as well as the big guilds, leaving them to wonder about the identity of this exceptional player. However, while he possesses ten years of experience and in-depth knowledge, starting afresh with neither sponsors nor a team in a game that has changed over the years presents numerous challenges. Along with talented new comrades, Ye Xiu once again dedicates himself to traversing the path to Glory's summit!
    
    [Written by MAL Rewrite]`,
    isAiring: false,
    startDate: new Date(),
    endDate: new Date(),
    streams: {
      youtube:
        "https://www.youtube.com/watch?v=O7XQd5wRPm8&list=PLMX26aiIvX5pFbfTf10Tke0CiMwxO76fT",
    },
    trailers: [
      {
        youtube: "ef7GCI4Cdxg",
      },
    ],
    popularity: { myanimelist: 292490 },
    score: { myanimelist: 7.96 },
    totalPopularity: 292490,
    aggregateScore: 7.96,
    isFeatured: true,
    relatedWorks: {
      prequel: 1,
    },
    externalSiteIds: {
      anilist: 101410,
      myanimelist: 37078,
    },
  });

  // image2
  await strapi.entityService.uploadFiles(
    donghua2,
    {
      image: [
        {
          name: "placeholder2.jpg",
          type: "image/jpeg",
          path: "./public/images/placeholder.jpg",
        },
      ],
    },
    {
      model: "donghua",
    }
  );

  // staff-role
  await strapi.services["staff-role"].create({
    donghua: donghua.id,
    person: person.id,
    name: "Voice Actor - Ye Xiu",
  });
}

async function setPublicRolePermissions() {
  const publicRole = await strapi
    .query("role", "users-permissions")
    .findOne({ type: "public" });
  const permissionsToUpdate = publicRole.permissions.filter(
    (permission) =>
      (permission.type === "application" || permission.type === "upload") &&
      (permission.action === "count" ||
        permission.action === "find" ||
        permission.action === "findone" ||
        permission.action === "search")
  );

  for (const permission of permissionsToUpdate) {
    await strapi.query("permission", "users-permissions").update(
      { id: permission.id },
      {
        enabled: true,
      }
    );
  }

  strapi.log.info("Granted Public permissions to read from API");
}

async function createDefaultAdminUser() {
  try {
    const params = {
      username: process.env.DEV_USER || "admin",
      password: process.env.DEV_PASS || "admin",
      firstname: process.env.DEV_USER || "Admin",
      lastname: process.env.DEV_USER || "Admin",
      email: process.env.DEV_EMAIL || "admin@test.test",
      blocked: false,
      isActive: true,
    };
    const tempPass = params.password;
    const SUPER_ADMIN_ROLE_ID = 1;

    params.roles = [SUPER_ADMIN_ROLE_ID];
    params.password = await strapi.admin.services.auth.hashPassword(
      params.password
    );
    await strapi.query("user", "admin").create({
      ...params,
    });

    strapi.log.info("Admin account was successfully created.");
    strapi.log.info(`Email: ${params.email}`);
    strapi.log.info(`Password: ${tempPass}`);
  } catch (error) {
    strapi.log.error(`Couldn't create Admin account during bootstrap: `, error);
  }
}

module.exports = async () => {
  if (process.env.NODE_ENV === "development") {
    //Check if any account exists.
    const admins = await strapi.query("user", "admin").find();

    if (admins.length === 0) {
      await createDefaultAdminUser();
      await setPublicRolePermissions();
      await createDummyData();
    }
  }
};
