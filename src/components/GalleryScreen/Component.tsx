import React, { useRef, useEffect, useMemo } from 'react';
import SyncIcon from '@material-ui/icons/Sync';

import { useKey } from '../../hooks/useKey';
import { useSize } from '../../hooks/useSize';
import { useImages } from '../../hooks/useImages';
import { useNavigation } from '../../hooks/useNavigation';

import ActionMenu from '../ActionMenu';

import { useCursorNavigation } from './useCursorNavigation';
import { useScrollControl } from './useScrollControl';
import LoadTrigger from './LoadTrigger';
import GridContainer from './GridContainer';
import GridTile from './GridTile';

export const GalleryScreen: React.FC = () => {
  const images = useImages();

  // Ensure that tiles are squared
  const galleryRef = useRef<HTMLUListElement>(null);
  const { width } = useSize(galleryRef);

  const navigate = useNavigation();

  const imageCountRef = useRef(0);
  useEffect(() => void (imageCountRef.current = images.length), [images]);

  const cursor = useCursorNavigation(imageCountRef);

  const tileRefs = useRef<(HTMLElement | null)[]>([]);
  useScrollControl(cursor, width, tileRefs);

  const actions = useMemo(
    () => [
      {
        icon: <SyncIcon />,
        label: 'Synchronize',
        run: () => navigate.toConnectors(),
      },
    ],
    [navigate],
  );

  useKey('Enter', () => navigate.toView(cursor), [cursor]);

  return (
    <main>
      <GridContainer ref={galleryRef}>
        {images.map((image, index) => (
          <GridTile
            key={index}
            image={image}
            selected={cursor === index}
            onClick={() => navigate.toView(index)}
            ref={el => (tileRefs.current[index] = el as HTMLElement)}
          />
        ))}
      </GridContainer>
      <LoadTrigger />
      <ActionMenu actions={actions} />
    </main>
  );
};
