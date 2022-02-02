import React from 'react';
import { useDrag } from 'react-dnd';
import { CrmDealListItemType, DealStateType } from 'types';
import { ItemTypes } from '../constants';
import SortedDealItem from '../SortedDealItem';
import UnsortedDealItem from '../UnsortedDealItem';
import styles from './DealItem.module.scss';

interface DealItemProps {
  dealItem: CrmDealListItemType;
  onLinkPatient?: (deal: CrmDealListItemType) => void;
  onDeleteDeal?: (deal: CrmDealListItemType) => void;
  onConfirmFirstContact?: (deal: CrmDealListItemType) => void;
  onDealClick?: (deal: CrmDealListItemType) => void;
}

const DealItem: React.FC<DealItemProps> = ({
  dealItem,
  onLinkPatient,
  onDeleteDeal,
  onConfirmFirstContact,
  onDealClick,
}) => {
  const isUnsorted = dealItem.stateType === DealStateType.Unsorted;
  const [{ isDragging: _isDragging }, drag] = useDrag(() => ({
    type: isUnsorted
      ? ItemTypes.NONE
      : dealItem?.scheduleId == null
      ? ItemTypes.UNSCHEDULED
      : ItemTypes.SCHEDULED,
    item: dealItem,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} key={dealItem.id} className={styles.dealItem}>
      {dealItem.stateType === DealStateType.Unsorted ? (
        <UnsortedDealItem
          deal={dealItem}
          onDealClick={onDealClick}
          onLinkPatient={onLinkPatient}
          onDeleteDeal={onDeleteDeal}
          onConfirmFirstContact={onConfirmFirstContact}
        />
      ) : (
        <SortedDealItem deal={dealItem} onDealClick={onDealClick} />
      )}
    </div>
  );
};

export default DealItem;
