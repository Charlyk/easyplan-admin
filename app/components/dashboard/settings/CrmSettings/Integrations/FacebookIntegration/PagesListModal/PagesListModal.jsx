import React, { useCallback, useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import orderBy from 'lodash/orderBy';
import PropTypes from 'prop-types';
import EASModal from 'app/components/common/modals/EASModal';
import IconCheckMark from 'app/components/icons/iconCheckMark';
import { textForKey } from 'app/utils/localization';
import styles from './PagesListModal.module.scss';

const PagesListModal = ({ open, pages, onClose, onSelect }) => {
  const [selectedPages, setSelectedPages] = useState([]);

  const isPageSelected = useCallback(
    (page) => {
      return selectedPages.some((item) => item.id === page.id);
    },
    [selectedPages],
  );

  const handleSubmit = () => {
    onSelect?.(selectedPages);
  };

  const handlePageSelected = (page) => {
    if (selectedPages.some((item) => item.id === page.id)) {
      setSelectedPages(selectedPages.filter((item) => item.id !== page.id));
    } else {
      setSelectedPages([...selectedPages, page]);
    }
  };

  return (
    <EASModal
      open={open}
      onClose={onClose}
      onPrimaryClick={handleSubmit}
      title={textForKey('Select a page')}
      className={styles.pagesListModal}
    >
      <MenuList>
        {orderBy(pages, 'name').map((page) => (
          <MenuItem
            key={page.id}
            selected={isPageSelected(page)}
            classes={{
              root: styles.menuItem,
              selected: styles.selected,
            }}
            onClick={() => handlePageSelected(page)}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                className={styles.pagePicture}
                src={page.picture.data.url}
                alt={page.name}
              />
              {page.name}
            </div>
            {isPageSelected(page) && <IconCheckMark fill='#00ac00' />}
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
      id: PropTypes.string,
      name: PropTypes.string,
      picture: PropTypes.shape({
        data: {
          url: PropTypes.string,
        },
      }),
    }),
  ),
};
