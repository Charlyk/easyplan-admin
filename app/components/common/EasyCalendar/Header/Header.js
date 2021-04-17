import React from "react";
import PropTypes from 'prop-types';
import styles from './Header.module.scss';
import HeaderItem from "./HeaderItem";

const Header = ({ items, onItemClick }) => {
  return (
    <div className={styles.headerRoot}>
      {items.map((item) => (
        <HeaderItem
          key={item.id}
          item={item}
          onItemClick={onItemClick}
        />
      ))}
    </div>
  )
}

export default Header;

Header.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    doctorId: PropTypes.number,
    date: PropTypes.instanceOf(Date),
    name: PropTypes.string,
    disabled: PropTypes.bool,
  })),
  onItemClick: PropTypes.func,
}

Header.defaultProps = {
  items: [],
}
