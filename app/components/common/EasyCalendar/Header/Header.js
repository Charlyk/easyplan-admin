import React from "react";
import PropTypes from 'prop-types';
import HeaderItem from "./HeaderItem";
import styles from './Header.module.scss';
import areComponentPropsEqual from "../../../../utils/areComponentPropsEqual";

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

export default React.memo(Header, areComponentPropsEqual);

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
