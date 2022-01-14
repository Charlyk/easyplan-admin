import React from 'react';
import { Tooltip } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import ArrowRight from '@material-ui/icons/KeyboardArrowRight';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import IconUmbrella from 'app/components/icons/iconUmbrella';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import styles from './Header.module.scss';

const HeaderItem = ({
  item,
  canMove,
  onItemClick,
  onMoveLeft,
  onMoveRight,
}) => {
  const handleItemClick = () => {
    if (item.disabled) {
      return;
    }
    onItemClick(item);
  };

  const handleMoveLeft = (event) => {
    event.stopPropagation();
    onMoveLeft?.(item);
  };

  const handleMoveRight = (event) => {
    event.stopPropagation();
    onMoveRight?.(item);
  };

  return (
    <Box
      className={clsx(styles.headerItem, {
        [styles.disabled]: item.disabled,
      })}
      onClick={handleItemClick}
    >
      {canMove && (
        <IconButton className={styles.arrowButton} onClick={handleMoveLeft}>
          <ArrowLeft />
        </IconButton>
      )}
      <div className={styles.titleContainer}>
        {item.disabled && <IconUmbrella />}
        {item.hint ? (
          <Tooltip title={item.hint}>
            <Typography className={styles.itemName}>{item.name}</Typography>
          </Tooltip>
        ) : (
          <Typography className={styles.itemName}>{item.name}</Typography>
        )}
      </div>
      {canMove && (
        <IconButton className={styles.arrowButton} onClick={handleMoveRight}>
          <ArrowRight />
        </IconButton>
      )}
    </Box>
  );
};

export default React.memo(HeaderItem, areComponentPropsEqual);

HeaderItem.propTypes = {
  canMove: PropTypes.bool,
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    doctorId: PropTypes.number,
    date: PropTypes.instanceOf(Date),
    name: PropTypes.string,
    disabled: PropTypes.bool,
    hint: PropTypes.string,
    isCabinet: PropTypes.bool,
  }).isRequired,
  onItemClick: PropTypes.func,
  onMoveLeft: PropTypes.func,
  onMoveRight: PropTypes.func,
};
