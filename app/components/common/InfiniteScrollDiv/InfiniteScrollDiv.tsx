import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import debounce from 'lodash/debounce';
import HorizontalScrollHelper from '../HorizontalScrollHelper';

type InfiniteScrollDivProps = {
  className?: any;
  itemsCount?: number;
  totalItems?: number;
  isLoading?: boolean;
  columnWidth?: number;
  columnsCount?: number;
  showScrollHelper?: boolean;
  onScrollToEnd?: () => void;
};

const bottomOffset = 50;

const InfiniteScrollDiv: React.FC<InfiniteScrollDivProps> = ({
  children,
  itemsCount = 0,
  totalItems = 0,
  isLoading,
  columnWidth,
  columnsCount,
  showScrollHelper,
  onScrollToEnd,
  ...rest
}) => {
  const [localRef, setLocalRef] = useState<HTMLDivElement | null>(null);
  const previousDiff = useRef(0);

  const handleScrollEndHit = useCallback(
    debounce(() => {
      onScrollToEnd?.();
    }, 100),
    [],
  );

  const handleDivScrolled = useCallback(() => {
    const indicator = document.getElementById('scroll-end-indicator');
    const indicatorOffset = indicator.offsetTop;
    const rootOffset = localRef.scrollTop + localRef.clientHeight;
    const scrollDiff = indicatorOffset - rootOffset;
    if (
      previousDiff.current > scrollDiff &&
      scrollDiff < bottomOffset &&
      totalItems > itemsCount &&
      !isLoading
    ) {
      handleScrollEndHit();
    }
    previousDiff.current = scrollDiff;
  }, [localRef, handleScrollEndHit, totalItems, itemsCount, isLoading]);

  useEffect(() => {
    if (localRef == null) {
      return;
    }
    localRef.addEventListener('scroll', handleDivScrolled);
    return () => {
      localRef.removeEventListener('scroll', handleDivScrolled);
    };
  }, [localRef, handleDivScrolled]);

  const handleScrollUpdate = (scrollOffset) => {
    if (localRef == null) {
      return;
    }
    localRef.scrollLeft = scrollOffset;
  };

  return (
    <div ref={setLocalRef} {...rest}>
      {children}
      {showScrollHelper && (
        <HorizontalScrollHelper
          columnsCount={columnsCount}
          columnWidth={columnWidth}
          parentEl={localRef}
          columnSpacing={8} // margin between columns
          onScrollUpdate={handleScrollUpdate}
          position={{
            bottom: '1rem',
            right: '5rem',
          }}
        />
      )}
      <div
        id='scroll-end-indicator'
        style={{
          padding: isLoading ? '10px' : 0,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isLoading && <CircularProgress className='circular-progress-bar' />}
      </div>
    </div>
  );
};

export default InfiniteScrollDiv;
