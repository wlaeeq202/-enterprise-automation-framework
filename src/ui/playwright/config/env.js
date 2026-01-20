const env = process.env.TEST_ENV || "dev";

const config = {
  dev: {
    baseURL: "https://www.saucedemo.com",
  },

  stage: {
    baseURL: "https://www.saucedemo.com",
  },

  prod: {
    baseURL: "https://www.saucedemo.com",
  }
};

module.exports = {
  ...config[env],

  users: {
    valid: {
      username: "standard_user",
      password: "secret_sauce",
    },
    invalid: {
      username: "invalid_user",
      password: "wrong_password",
    }
  },

  currentEnv: env,
};
