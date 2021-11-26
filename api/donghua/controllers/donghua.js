const { sanitizeEntity } = require("strapi-utils");
// TODO get rid of this hardcoded variable
const PROD_FILE_PREFIX = "https://files.donghuahub.com/";
module.exports = {
  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.donghua.search(ctx.query);
    } else {
      entities = await strapi.services.donghua.find(ctx.query);
    }

    for (const entity of entities) {
      if (entity.image) {
        if (strapi.config.currentEnvironment == "production") {
          const urlParts = entity.image.url.split("/");
          entity.imageUrl = PROD_FILE_PREFIX + urlParts[urlParts.length - 1];
        } else {
          entity.imageUrl = entity.image.url;
        }
      } else {
        entity.imageUrl = null;
      }
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.donghua })
    );
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.donghua.findOne({ id });
    if (entity.image) {
      if (strapi.config.currentEnvironment == "production") {
        const urlParts = entity.image.url.split("/");
        entity.imageUrl = PROD_FILE_PREFIX + urlParts[urlParts.length - 1];
      } else {
        entity.imageUrl = entity.image.url;
      }
    } else {
      entity.imageUrl = null;
    }
    return sanitizeEntity(entity, { model: strapi.models.donghua });
  },
};
