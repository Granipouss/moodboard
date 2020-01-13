import Container, { ObjectType } from 'typedi';
import { createElement, Fragment } from 'react';

import { useAsync } from './useAsync';

export const useService = <T>(type: ObjectType<T>): T => Container.get(type);

type ServiceProviderProps<T> = {
  factory: () => Promise<T>;
  fallback: React.ReactNode;
  children: React.ReactNode;
};

export const ServiceProvider = <T extends { constructor: Function }>({
  children,
  fallback,
  factory,
}: ServiceProviderProps<T>) => {
  const [, { done }] = useAsync(async () => {
    const service = await factory();
    Container.set(service.constructor, service);
  });

  return createElement(Fragment, null, done ? children : fallback);
};
