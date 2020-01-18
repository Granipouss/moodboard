import Container, { ObjectType } from 'typedi';

export const useService = <T>(type: ObjectType<T>): T => Container.get(type);
