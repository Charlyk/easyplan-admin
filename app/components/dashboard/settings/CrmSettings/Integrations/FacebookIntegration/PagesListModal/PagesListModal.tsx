import React, { useCallback, useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import orderBy from 'lodash/orderBy';
import Image from 'next/image';
import EASModal from 'app/components/common/modals/EASModal';
import IconCheckMark from 'app/components/icons/iconCheckMark';
import { textForKey } from 'app/utils/localization';
import instagramLogo from 'public/instagram.png';
import { FacebookPageType } from 'types';
import styles from './PagesListModal.module.scss';

interface PageListModalProps {
  open: boolean;
  pages: FacebookPageType[];
  onClose?: () => void;
  onSelect?: (pages: FacebookPageType[]) => void;
}

const PagesListModal: React.FC<PageListModalProps> = ({
  open,
  pages,
  onClose,
  onSelect,
}) => {
  const [selectedPages, setSelectedPages] = useState<FacebookPageType[]>([]);

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
            disableRipple
            key={page.id}
            selected={isPageSelected(page)}
            classes={{
              root: styles.menuItem,
              selected: styles.selected,
            }}
            onClick={() => handlePageSelected(page)}
          >
            <div className={styles.itemRoot}>
              <div className={styles.pageContainer}>
                <img
                  className={styles.pagePicture}
                  src={page.picture.data.url}
                  alt={page.name}
                />
                {page.name}
              </div>
              {page.connected_instagram_account != null && (
                <div className={styles.instagramContainer}>
                  <Image
                    className={styles.logo}
                    src={instagramLogo}
                    width={20}
                    height={20}
                  />
                  @{page.connected_instagram_account.username}
                </div>
              )}
            </div>
            {isPageSelected(page) && <IconCheckMark fill='#00ac00' />}
          </MenuItem>
        ))}
      </MenuList>
    </EASModal>
  );
};

export default PagesListModal;
