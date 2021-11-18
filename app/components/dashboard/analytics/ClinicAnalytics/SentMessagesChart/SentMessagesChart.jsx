import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import styles from "./SentMessagesChart.module.scss";
import { textForKey } from "../../../../../utils/localization";

const SentMessagesChart = () => {
  return (
    <Grid item xs={4} className={styles.sentMessagesChart}>
      <div className="chartItem">
        <Typography className="chartTitle">
          {textForKey('analytics_total_messages')}
        </Typography>
        <div className={styles.messagesCountContainer}>
          <Typography className={styles.counterLabel}>1,432</Typography>
        </div>
      </div>
    </Grid>
  );
};

export default SentMessagesChart;
