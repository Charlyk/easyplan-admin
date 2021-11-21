import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import PropTypes from 'prop-types';
import EASModal from 'app/components/common/modals/EASModal';
import { textForKey } from 'app/utils/localization';

const PagesListModal = ({ open, pages, onClose, onSelect }) => {
  return (
    <EASModal open={open} onClose={onClose} title={textForKey('Select a page')}>
      <MenuList>
        {pages.map((page) => (
          <MenuItem key={page.id} onClick={() => onSelect(page)}>
            {page.name}
          </MenuItem>
        ))}
      </MenuList>
    </EASModal>
  );
};

export default PagesListModal;

PagesListModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      access_token: PropTypes.string,
      category: PropTypes.string,
      id: PropTypes.string,
      name: PropTypes.string,
      tasks: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
};
