import React, { useMemo, useState } from "react";
import PropTypes from 'prop-types';
import CreateScheduleView from "./CreateScheduleView";
import styles from './ColumnsWrapper.module.scss';
import clsx from "clsx";
import areComponentPropsEqual from "../../../../utils/areComponentPropsEqual";

const ColumnCell = (
  {
    startHour,
    endHour,
    disabled,
    hideCreateIndicator,
    onAddSchedule
  }
) => {
  const [showCreateView, setShowCreateView] = useState(false);

  const content = useMemo(() => {
    if (
      !hideCreateIndicator &&
      showCreateView &&
      startHour != null &&
      endHour != null
    ) {
      return (
        <CreateScheduleView
          startHour={startHour}
          endHour={endHour}
          onAddSchedule={onAddSchedule}
        />
      )
    } else {
      return null
    }
  }, [startHour, endHour, showCreateView, hideCreateIndicator]);

  const handlePointerEnter = () => {
    setShowCreateView(true);
  };

  const handlePointerLeave = () => {
    setShowCreateView(false);
  };

  const getBorderTop = () => {
    if (startHour == null || disabled) {
      return 'none';
    }

    const minute = startHour.split(':')[1];
    if ((minute === '15' || minute === '45') && endHour != null) {
      return 'none';
    } else {
      return '#DBEEFB 1px solid';
    }
  };

  return (
    <div
      id={`container-${startHour}`}
      className={clsx(styles.columnCell, {
        [styles.disabled]: disabled,
      })}
      style={{ borderTop: getBorderTop() }}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {content}
    </div>
  )
};

export default React.memo(ColumnCell, areComponentPropsEqual);

ColumnCell.propTypes = {
  disabled: PropTypes.bool,
  startHour: PropTypes.string,
  endHour: PropTypes.string,
  hideCreateIndicator: PropTypes.bool,
  onAddSchedule: PropTypes.func,
}
