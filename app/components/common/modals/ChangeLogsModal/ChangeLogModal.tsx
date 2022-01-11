import React, { useState, useEffect } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { textForKey } from 'app/utils/localization';
import { getAppLanguage } from 'app/utils/localization';
import EASImage from '../../EASImage';
import LeftSideModal from '../../LeftSideModal';
import styles from './ChangeLogModal.module.scss';
import { dispatchFetchChangeLogData } from './ChangeLogModal.reducer';
import { changeLogModalSelector } from './ChangeLogModal.selector';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ChangeLogModal: React.FC<Props> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { changes } = useSelector(changeLogModalSelector);
  const [expanded, setExpanded] = useState('panel1');

  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    setExpanded(`panel${Object.keys(changes).length}`);
  }, [changes]);

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
        {Object.keys(changes).map((key, idx) => {
          return (
            <Accordion
              key={key}
              expanded={expanded === `panel${idx + 1}`}
              onChange={handleChange(`panel${idx + 1}`)}
            >
              <AccordionSummary>
                <Typography>{key}</Typography>
              </AccordionSummary>
              <AccordionDetails classes={{ root: styles.accordionDetails }}>
                {changes[key].map(renderMediaCard)}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    </LeftSideModal>
  );
};

const renderMediaCard = ({ imageUrl, title, message, version, id }) => {
  const parsedTitle = title ? JSON.parse(title) : null;
  const parsedMessage = message ? JSON.parse(message) : null;

  const cardNotNull = parsedTitle || imageUrl;

  return cardNotNull ? (
    <Card key={`${version}/${id}`} style={{ marginBottom: '1rem' }}>
      <CardContent>
        {parsedTitle && (
          <Typography
            variant='h5'
            component='div'
            className={styles.cardHeading}
          >
            {parsedTitle[getAppLanguage()]}
          </Typography>
        )}
        {parsedMessage && (
          <Typography className={styles.cardDescription}>
            {parsedMessage[getAppLanguage()]}
          </Typography>
        )}
      </CardContent>
      {imageUrl && <EASImage src={imageUrl} className={styles.cardImage} />}
    </Card>
  ) : null;
};

export default ChangeLogModal;
