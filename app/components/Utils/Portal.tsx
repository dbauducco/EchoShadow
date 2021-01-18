import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const Portal: React.FC<any> = ({ children }) => {
  const mount = document.getElementById('portal-root');
  const el = document.createElement('div');

  useEffect(() => {
    if (mount) {
      mount.appendChild(el);
      return () => {
        mount.removeChild(el);
      };
    }
    return undefined;
  }, [el, mount]);

  return createPortal(children, el);
};

export default Portal;
