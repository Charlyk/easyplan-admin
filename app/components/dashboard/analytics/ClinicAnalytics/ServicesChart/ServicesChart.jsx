import React from "react";
import clsx from "clsx";
import PropTypes from 'prop-types';
import { Line } from "react-chartjs-2";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { getServicesChartData, noLegendOptions } from "../ClinicAnalytics.utils";
import styles from "./ServicesChart.module.scss";
import { textForKey } from "../../../../../utils/localization";

const ServicesChart = ({ services }) => {
  return (
    <Grid item xs={12} className={styles.servicesChart}>
      <div className={clsx(styles.servicesChart, 'chartItem')}>
        <Typography className="chartTitle">
          {textForKey('analytics_services_completed_planned')}
        </Typography>
        <div className={styles.chartWrapper}>
          <Line
            type="line"
            height={50}
            data={getServicesChartData(services)}
            options={noLegendOptions}
          />
        </div>
      </div>
    </Grid>
  )
};

export default ServicesChart;

ServicesChart.propTypes = {
  services: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    planned: PropTypes.arrayOf(PropTypes.number),
    completed: PropTypes.arrayOf(PropTypes.number),
  }),
}
