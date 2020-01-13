import { shell } from 'electron';
import { Service } from 'typedi';
import Tumblr, { TumblrClient } from 'tumblr.js';

import { OAuth, Token } from './oauth';
import { LikeResponse, LikeRequestOptions } from './types';
import { Server } from '../../server';

const URL = {
  REQUEST_TOKEN: 'https://www.tumblr.com/oauth/request_token',
  ACCESS_TOKEN: 'https://www.tumblr.com/oauth/access_token',
  AUTHORIZE: 'https://www.tumblr.com/oauth/authorize',
};

@Service()
export class TumblrService {
  get consumerKey() {
    return process.env.REACT_APP_TUMBLR_CONSUMER_KEY || '';
  }

  get consumerSecret() {
    return process.env.REACT_APP_TUMBLR_CONSUMER_SECRET || '';
  }

  auth: Token | null = null;
  client: TumblrClient | null = null;

  private oauth = new OAuth(
    URL.REQUEST_TOKEN,
    URL.ACCESS_TOKEN,
    this.consumerKey,
    this.consumerSecret,
  );

  public async login(): Promise<Token> {
    const server = new Server();

    const oauthRequest = await this.oauth.getRequestToken(server.url);
    shell.openExternal(`${URL.AUTHORIZE}?oauth_token=${oauthRequest.token}`);
    const response = await server.waitForRequest();
    const oauthAccess = await this.oauth.getAccessToken(
      String(response.oauth_token),
      String(response.oauth_verifier),
      oauthRequest.secret,
    );

    this.autoLogin(oauthAccess);

    return oauthAccess;
  }

  public autoLogin({ token, secret }: Token) {
    this.auth = { token, secret };
    this.client = Tumblr.createClient({
      token: token,
      token_secret: secret,
      consumer_key: this.consumerKey,
      consumer_secret: this.consumerSecret,
    });
  }

  public isLogged(): boolean {
    return this.auth != null;
  }

  public getLikes(options: LikeRequestOptions = {}): Promise<LikeResponse> {
    return new Promise((resolve, reject) => {
      if (!this.client) return reject(new Error(`Not logged`));
      this.client.userLikes(options, (err, data) =>
        err ? reject(err) : resolve(data),
      );
    });
  }
}
