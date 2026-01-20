const BasePage = require('./BasePage');
const env = require('../config/env');  // pulls baseURL + test data

class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    this.usernameInput = '#user-name';
    this.passwordInput = '#password';
    this.loginButton   = '#login-button';
    this.errorMessage  = '[data-test="error"]';
    this.appLogo       = '.login_logo';
  }

  async open() {
    await this.navigate(env.baseURL);
  }

  async login(username, password) {
    await this.type(this.usernameInput, username);
    await this.type(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async getErrorMessage() {
    if (await this.isVisible(this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return null;
  }

  async isLoginPageLoaded() {
    return await this.isVisible(this.appLogo);
  }
}

module.exports = LoginPage;
