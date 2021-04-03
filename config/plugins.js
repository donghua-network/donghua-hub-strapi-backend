module.exports = ({ env }) => ({
  upload: {
    provider: "b2",
    providerOptions: {
      applicationKeyId: env("B2_ID"),
      applicationKey: env("B2_KEY"),
      bucket: env("B2_BUCKET"),
    },
  },
});
