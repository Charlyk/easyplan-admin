import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useRouter } from "next/router";
import Image from 'next/image';
import { textForKey } from "../../../../utils/localization";
import styles from './ErrorPage.module.scss';

const ErrorPage = ({ query }) => {
  const router = useRouter();

  const handleRetry = () => {
    router.replace('/analytics/general');
  };

  return (
    <div className={styles.errorPageRoot}>
      <div className={styles.errorContent}>
        <Image src='/broken_tooth.png' width={400} height={400}/>
        <Typography variant="h1" className={styles.errorStatus}>
          {query.status}
        </Typography>
        <Typography variant="h4" className={styles.errorMessage}>
          {query.message || textForKey('something_went_wrong')}
        </Typography>
        <Button
          variant="outlined"
          onPointerUp={handleRetry}
          classes={{
            root: styles.retryButton,
            outlined: styles.outlinedRetry,
          }}
        >
          <Typography className={styles.retryLabel}>{textForKey('Go to home')}</Typography>
        </Button>
      </div>
    </div>
  )
};

export default ErrorPage;
