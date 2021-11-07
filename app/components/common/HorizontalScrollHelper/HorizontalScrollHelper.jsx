import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from 'prop-types';
import { useGesture } from "react-use-gesture";
import { animated, useSpring } from "react-spring";
import styles from './HorizontalScrollHelper.module.scss';
import clsx from "clsx";

const HELPER_WIDTH = 130;

const HorizontalScrollHelper = ({ position, columnWidth, parentEl, columnSpacing, columnsCount, onScrollUpdate }) => {
  const [helperRef, setHelperRef] = useState(null);
  const activityTimeout = useRef(-1);
  const helperRect = helperRef?.getBoundingClientRect();
  const parentRect = parentEl?.getBoundingClientRect();
  const [isActive, setIsActive] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [{ x }, api] = useSpring(() => ({ x: 0 }));

  useEffect(() => {
    parentEl?.addEventListener('scroll', handleParentScroll);
    return () => {
      parentEl?.removeEventListener('scroll', handleParentScroll);
    }
  }, [parentEl]);

  const maxOffset = useMemo(() => {
    if (helperRect == null) {
      return 0;
    }
    return HELPER_WIDTH - helperRect.width;
  }, [helperRect]);

  const columnWidthPercentage = useMemo(() => {
    if (parentRect == null) {
      return 0
    }
    return (columnWidth + columnSpacing) / parentRect.width * 100
  }, [columnWidth, parentRect, columnSpacing]);

  const spacingPercentage = useMemo(() => {
    if (parentRect == null) {
      return 0
    }
    return columnSpacing / parentRect.width * 100
  }, [parentRect, columnSpacing])

  const helperWidthPercentage = useMemo(() => {
    if (parentRect == null || parentEl == null) {
      return 0;
    }
    return parentRect.width / parentEl.scrollWidth * 100;
  }, [parentRect, parentEl]);

  const columns = useMemo(() => {
    const items = [];
    for (let i = 0; i < columnsCount; i++) {
      items.push(
        <div
          key={`column_item-${i}`}
          className={styles.columnIndicator}
          style={{
            width: `${columnWidthPercentage}%`,
            marginLeft: `${spacingPercentage}%`,
            marginRight: `${spacingPercentage}%`,
          }}
        />
      )
    }
    return items;
  }, [columnsCount, columnWidthPercentage, spacingPercentage]);

  const handleParentScroll = () => {
    if (parentEl == null) {
      return;
    }
    const scrollPercentage = parentEl.scrollLeft / parentEl.scrollWidth;
    const scrollOffset = scrollPercentage * HELPER_WIDTH;
    api.start({ x: scrollOffset, immediate: true });
  };

  const handleDragStart = () => {
    setIsMoving(true);
  }

  const handleDrag = ({ delta: [dx], movement: [mx], memo = x.get() }) => {
    let newOffset = mx + memo;
    if (newOffset > maxOffset) {
      newOffset = maxOffset;
    }

    if (newOffset < 0) {
      newOffset = 0;
    }

    handleMouseEnter();
    const direction = dx > 0 ? 'right' : dx < 0 ? 'left' : 'none';
    if (direction !== "none") {
      const percentage = newOffset / HELPER_WIDTH;
      const scrollOffset = (percentage) * parentEl.scrollWidth + (direction === 'right' ? (columnSpacing / 2) * columnsCount : 0);
      onScrollUpdate?.(scrollOffset, direction);
    }

    api.start({ x: newOffset, immediate: true });
    return memo;
  };

  const handleDragEnd = () => {
    setIsMoving(false);
  }

  const handleMouseEnter = () => {
    clearTimeout(activityTimeout.current);
    if (!isActive) setIsActive(true);
  };

  const handleMouseLeave = () => {
    activityTimeout.current = setTimeout(() => {
      if (isActive) setIsActive(false);
    }, 1500);
  }

  const bindGesture = useGesture({
    onDragStart: handleDragStart,
    onDrag: handleDrag,
    onDragEnd: handleDragEnd,
  });

  return (
    <div
      className={clsx(styles.horizontalScrollHelper, {
        [styles.fadeIn]: isActive,
        [styles.fadeOut]: !isActive,
      })}
      style={{ ...position, width: HELPER_WIDTH }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.dataContainer}>
        <animated.div
          {...bindGesture()}
          ref={setHelperRef}
          className={styles.scrollHelper}
          style={{
            left: x,
            width: `${helperWidthPercentage}%`,
            cursor: isMoving ? 'grabbing' : 'grab',
          }}
        />
        {columns}
      </div>
    </div>
  );
};

export default HorizontalScrollHelper;

HorizontalScrollHelper.propTypes = {
  parentEl: PropTypes.any,
  columnsCount: PropTypes.number,
  columnSpacing: PropTypes.number,
  position: PropTypes.shape({
    top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bottom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    left: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    right: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  onScrollUpdate: PropTypes.func,
};

HorizontalScrollHelper.defaultProps = {
  columnsCount: 0
}
