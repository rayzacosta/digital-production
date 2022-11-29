import React from 'react';

type UseModalResult = [boolean, () => void, () => void, () => void];

export const useModal = (defaultValue?: boolean): UseModalResult => {
  const [isOpen, setIsOpen] = React.useState(Boolean(defaultValue));

  const handleClose = () => setIsOpen(false);

  const handleOpen = () => setIsOpen(true);

  const handleSwitch = () => setIsOpen((prev) => !prev);

  return [isOpen, handleClose, handleOpen, handleSwitch];
};
