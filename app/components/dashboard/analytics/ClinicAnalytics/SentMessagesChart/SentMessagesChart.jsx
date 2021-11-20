import React from "react";
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { textForKey } from "../../../../../utils/localization";
import formattedNumber from "../../../../../utils/formattedNumber";
import styles from "./SentMessagesChart.module.scss";

const SentMessagesChart = ({ messages }) => {
  return (
    <Grid item xs={4} className={styles.sentMessagesChart}>
      <div className="chartItem">
        <Typography className="chartTitle">
          {textForKey('analytics_total_messages')}
        </Typography>
        <div className={styles.messagesCountContainer}>
          <Typography className={styles.counterLabel}>{formattedNumber(messages)}</Typography>
        </div>
      </div>
    </Grid>
  );
};

export default SentMessagesChart;

SentMessagesChart.propTypes = {
  messages: PropTypes.number,
}
