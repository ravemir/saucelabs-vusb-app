import React from 'react';
import Styles from './CloseIcon.module.css';

const CloseIcon = ({ onClick }: { onClick: () => void }) => {
  return (
    <i
      role="button"
      aria-label="Close"
      tabIndex={0}
      className={`${Styles.icon} ${Styles.hover} far fa-window-close`}
      onClick={() => onClick()}
      onKeyDown={() => onClick()}
    />
  );
};

export default CloseIcon;
