import Container from 'typedi';

import { TumblrConnector } from '../services/connectors/tumblr';
import { IConnector } from '../services/connectors/connector.interface';

export const resumeCollection = () => {
  const connectors: IConnector[] = [Container.get(TumblrConnector)];

  return Promise.all(
    connectors.map(async connector => {
      try {
        const isActive = await connector.isActive();
        if (!isActive) return;
        await connector.resumeCollection();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(connector.constructor.name, error);
      }
    }),
  );
};
