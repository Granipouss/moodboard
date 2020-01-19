import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

const parseIndex = (index?: number) => Math.max(0, index || 0);

export const useNavigation = () => {
  const history = useHistory();
  const navigate = useMemo(
    () => ({
      toGallery: (index?: number) =>
        history.replace(`/gallery/${parseIndex(index)}`),
      toView: (index: number) => history.replace(`/view/${parseIndex(index)}`),
      toConnectors: () => history.replace(`/connectors`),
    }),
    [history],
  );
  return navigate;
};
