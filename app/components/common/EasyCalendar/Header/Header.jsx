import React from 'react';
import PropTypes from 'prop-types';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import styles from './Header.module.scss';
import HeaderItem from './HeaderItem';

const Header = ({ items, onItemClick }) => {
  return (
    <div className={styles.headerRoot}>
      {items.map((item) => (
        <HeaderItem key={item.id} item={item} onItemClick={onItemClick} />
      ))}
    </div>
  );
};

export default React.memo(Header, areComponentPropsEqual);

Header.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      doctorId: PropTypes.number,
      date: PropTypes.instanceOf(Date),
      name: PropTypes.string,
      disabled: PropTypes.bool,
      hint: PropTypes.string,
    }),
  ),
  onItemClick: PropTypes.func,
};

Header.defaultProps = {
  items: [],
};
