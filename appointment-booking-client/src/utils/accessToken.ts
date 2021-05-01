class Auth {
  accessToken: string;

  constructor() {
    this.accessToken = "";
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getAccessToken() {
    return this.accessToken;
  }
}

export const auth = new Auth();