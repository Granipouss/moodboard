import { OAuth as BaseOAuth } from 'oauth';

export type Token = { token: string; secret: string };

export class OAuth {
  private base: BaseOAuth;

  constructor(
    requestUrl: string,
    accessUrl: string,
    consumerKey: string,
    consumerSecret: string,
  ) {
    this.base = new BaseOAuth(
      requestUrl,
      accessUrl,
      consumerKey,
      consumerSecret,
      '1.0',
      null,
      'HMAC-SHA1',
    );
  }

  getAccessToken(
    oauthToken: string,
    oauthVerifier: string,
    oauthSecret: string,
  ): Promise<Token> {
    return new Promise((resolve, reject) => {
      this.base.getOAuthAccessToken(
        oauthToken,
        oauthSecret,
        oauthVerifier,
        (err, token, secret) =>
          err ? reject(err) : resolve({ token, secret }),
      );
    });
  }

  getRequestToken(callbackUrl: string): Promise<Token> {
    return new Promise((resolve, reject) => {
      this.base.getOAuthRequestToken(
        { oauth_callback: callbackUrl },
        (err, token, secret) =>
          err ? reject(err) : resolve({ token, secret }),
      );
    });
  }
}
