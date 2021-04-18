const { sanitizeEntity } = require("strapi-utils");

const replaceImageWithUrl = (donghua) => {
  if (donghua.image && donghua.image.url) {
    donghua.image = donghua.image.url;
  }
  return donghua;
};

module.exports = {
  /**
   * Retrieve records.
   *
   * @return {Array}
   */

  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.donghua.search(ctx.query);
    } else {
      entities = await strapi.services.donghua.find(ctx.query);
    }

    return entities.map((entity) =>
      replaceImageWithUrl(
        sanitizeEntity(entity, { model: strapi.models.donghua })
      )
    );
  },

  /**
   * Retrieve a record.
   *
   * @return {Object}
   */

  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.donghua.findOne({ id });
    return replaceImageWithUrl(
      sanitizeEntity(entity, { model: strapi.models.donghua })
    );
  },
};
