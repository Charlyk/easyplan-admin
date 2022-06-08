import React from 'react';
import { ListItem, ListItemText } from '@material-ui/core';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslate } from 'react-polyglot';
import styles from './SupportArticles.module.scss';

const SupportArticles: React.FC = ({ children }) => {
  const textForKey = useTranslate();
  const router = useRouter();
  return (
    <div className={styles.supportArticles}>
      <div className={styles.menuContainer}>
        <Typography className={styles.title} variant='h6'>
          {textForKey('all_articles')}
        </Typography>
        <List className={styles.menuList}>
          <ListItem
            selected={router.pathname.includes('get-moizvonki-data')}
            classes={{
              root: styles.listItem,
              selected: styles.selected,
            }}
          >
            <ListItemText
              classes={{
                primary: styles.text,
              }}
              primary={
                <Link href='/how-to/get-moizvonki-data'>
                  {textForKey('how_to_get_moizvonki_data')}
                </Link>
              }
            />
          </ListItem>
        </List>
      </div>
      <div className={styles.children}>{children}</div>
    </div>
  );
};

export default SupportArticles;
