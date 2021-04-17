import React from "react";
import PropTypes from 'prop-types';
import styles from './Header.module.scss';
import { Typography } from "@material-ui/core";
import clsx from "clsx";

const HeaderItem = ({ item, onItemClick }) => {
  const handleItemClick = () => {
    onItemClick(item);
  }
  return (
    <div
      role='button'
      tabIndex={0}
      className={
        clsx(styles.headerItem, {
          [styles.disabled]: item.disabled,
        })
      }
      onClick={handleItemClick}
    >
      <Typography className={styles.itemName}>{item.name}</Typography>
    </div>
  )
}

export default HeaderItem;

HeaderItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    doctorId: PropTypes.number,
    date: PropTypes.instanceOf(Date),
    name: PropTypes.string,
    disabled: PropTypes.bool,
  }).isRequired,
  onItemClick: PropTypes.func,
}
