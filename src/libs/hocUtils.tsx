import React, { createFactory } from 'react';

export const nest = (...Components: React.ComponentType[]): React.FC => {
  const factories = Components.map(createFactory);
  const Nest: React.FC = ({ children }) =>
    factories.reduceRight(
      (child, factory) => factory({}, child),
      <>{children}</>,
    );

  if (process.env.NODE_ENV !== 'production') {
    const displayNames = Components.map(C => C.displayName);
    Nest.displayName = `nest(${displayNames.join(', ')})`;
  }

  return Nest;
};

export const withProps = <T extends {}>(
  Wrapper: React.ComponentType<T & { children: React.ReactNode }>,
  props: T,
): React.FC => ({ children }) => <Wrapper {...props}>{children}</Wrapper>;
