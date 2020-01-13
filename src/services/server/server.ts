import URL from 'url';
import { createServer } from 'http';
import { ParsedUrlQuery } from 'querystring';

import { Subject } from 'rxjs';

export class Server {
  private subject = new Subject<ParsedUrlQuery>();

  private server = createServer((req, res) => {
    const { query } = URL.parse(req.url || '', true);
    this.subject.next(query);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<h1>Thanks!</h1>`);
  }).listen();

  public get url(): string {
    const address = this.server.address() || '';
    return typeof address === 'string'
      ? address
      : `http://localhost:${address.port}/`;
  }

  public get() {
    return this.subject;
  }

  public close() {
    this.server.close();
    this.subject.complete();
  }

  public waitForRequest() {
    return new Promise<ParsedUrlQuery>(resolve => {
      this.subject.subscribe(query => resolve(query));
    });
  }
}
