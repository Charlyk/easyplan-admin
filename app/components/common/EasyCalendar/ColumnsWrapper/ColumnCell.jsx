import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
<<<<<<< HEAD
import { useDrop } from 'react-dnd';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import useIsMobileDevice from 'app/utils/hooks/useIsMobileDevice';
import { dragItemTypes } from 'types';
=======
import useIsMobileDevice from 'app/hooks/useIsMobileDevice';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
>>>>>>> develop
import styles from './ColumnsWrapper.module.scss';
import CreateScheduleView from './CreateScheduleView';

const ColumnCell = ({
  startHour,
  endHour,
  disabled,
  hideCreateIndicator,
  onAddSchedule,
  handleOnDropCell,
}) => {
  const [showCreateView, setShowCreateView] = useState(false);
  const isMobile = useIsMobileDevice();

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
      );
    } else {
      return null;
    }
  }, [startHour, endHour, showCreateView, hideCreateIndicator]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: dragItemTypes.Schedule,
    drop: (item) => handleOnDrop(item),
    collect(monitor) {
      return {
        isOver: monitor.isOver(),
      };
    },
  }));

  const handleOnDrop = (schedule) => {
    handleOnDropCell(startHour, schedule);
  };

  const handleAddSchedule = () => {
    onAddSchedule?.(startHour, endHour);
  };

  const handlePointerEnter = () => {
    setShowCreateView(true);
  };

  const handlePointerLeave = () => {
    setShowCreateView(false);
  };

  const getBorderTop = () => {
    if (startHour == null) {
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
      ref={drop}
      id={`container-${startHour}`}
      className={clsx(styles.columnCell, {
        [styles.columnCellHovered]: isOver,
      })}
      style={{ borderTop: getBorderTop() }}
      onPointerEnter={disabled ? () => null : handlePointerEnter}
      onPointerLeave={disabled ? () => null : handlePointerLeave}
      onPointerUp={isMobile ? handleAddSchedule : () => null}
    >
      {content}
    </div>
  );
};

export default React.memo(ColumnCell, areComponentPropsEqual);

ColumnCell.propTypes = {
  disabled: PropTypes.bool,
  startHour: PropTypes.string,
  endHour: PropTypes.string,
  hideCreateIndicator: PropTypes.bool,
  onAddSchedule: PropTypes.func,
};
