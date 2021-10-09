import React from "react";
import clsx from "clsx";
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import IconUmbrella from "../../../icons/iconUmbrella";
import styles from './Header.module.scss';
import areComponentPropsEqual from "../../../../utils/areComponentPropsEqual";

const HeaderItem = ({ item, onItemClick }) => {
  const handleItemClick = () => {
    if (item.disabled) {
      return;
    }
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
      {item.disabled && <IconUmbrella/>}
      <Typography className={styles.itemName}>
        {item.name}
      </Typography>
    </div>
  )
}

export default React.memo(HeaderItem, areComponentPropsEqual);

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
