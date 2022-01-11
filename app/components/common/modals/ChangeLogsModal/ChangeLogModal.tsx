import React, { useState, useEffect } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { textForKey } from 'app/utils/localization';
import EASImage from '../../EASImage';
import LeftSideModal from '../../LeftSideModal';
import styles from './ChangeLogModal.module.scss';
import { dispatchFetchChangeLogData } from './ChangeLogModal.reducer';
import { changeLogModalSelector } from './ChangeLogModal.selector';

interface Props {
  open: boolean;
  onClose: () => void;
}

const dummyData = [
  {
    imgSrc: 'settings/payment_return_1.gif',
    title: 'Titlul articolului',
    description:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Expedita, nemo omnis Eligendi nulla error provident illo accusamus minus',
  },
  {
    imgSrc: 'settings/payment_return_1.gif',
    title: 'Titlul articolului',
    description:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Expedita, nemo omnis Eligendi nulla error provident illo accusamus minus',
  },
  {
    imgSrc: 'settings/payment_return_1.gif',
    title: 'Titlul articolului',
    description:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Expedita, nemo omnis Eligendi nulla error provident illo accusamus minus',
  },
];

const ChangeLogModal: React.FC<Props> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const changeLogData = useSelector(changeLogModalSelector);
  const [expanded, setExpanded] = useState('panel1');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  console.log(changeLogData);

  useEffect(() => {
    dispatch(dispatchFetchChangeLogData());
  }, []);

  return (
    <LeftSideModal
      show={open}
      onClose={onClose}
      title={textForKey('last_changes_list') + ':'}
      className={styles.changeLogModal}
    >
      <div style={{ margin: '1rem', overflow: 'auto' }}>
        <Accordion
          expanded={expanded === 'panel1'}
          onChange={handleChange('panel1')}
        >
          <AccordionSummary>
            <Typography>Version 1</Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: styles.accordionDetails }}>
            {dummyData.map(renderMediaCard)}
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === 'panel2'}
          onChange={handleChange('panel2')}
        >
          <AccordionSummary>
            <Typography>Version 2</Typography>
          </AccordionSummary>
          <AccordionDetails>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptate
            illum a quaerat consequuntur minima magnam. Expedita, nemo omnis!
            Eligendi nulla error provident illo accusamus minus.
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === 'panel3'}
          onChange={handleChange('panel3')}
        >
          <AccordionSummary>
            <Typography>Version 3</Typography>
          </AccordionSummary>
          <AccordionDetails>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptate
            illum a quaerat consequuntur minima magnam. Expedita, nemo omnis!
            Eligendi nulla error provident illo accusamus minus.
          </AccordionDetails>
        </Accordion>
      </div>
    </LeftSideModal>
  );
};

const renderMediaCard = ({ imgSrc, title, description }) => {
  return (
    <Card style={{ marginBottom: '1rem' }}>
      <CardContent>
        <Typography variant='h5' component='div' className={styles.cardHeading}>
          {title}
        </Typography>
        <Typography className={styles.cardDescription}>
          {description}
        </Typography>
      </CardContent>
      <EASImage src={imgSrc} className={styles.cardImage} />
    </Card>
  );
};

export default ChangeLogModal;
