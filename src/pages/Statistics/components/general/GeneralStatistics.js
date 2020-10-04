import React, { useEffect, useState } from 'react';

import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from 'recharts';

import { textForKey } from '../../../../utils/localization';
import ServiceView from './ServiceView';

const GeneralStatistics = props => {
  const [{ width, height }, setParentSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setParentSize(parentSize());
  }, [props]);

  const data = () => {
    const items = [];
    for (let i = 7; i < 20; i++) {
      items.push({
        name: `0${i}:00`,
        income: Math.random(),
      });
    }
    return items;
  };

  const parentSize = () => {
    const rect = document
      .getElementById('month-income-chart')
      ?.getBoundingClientRect();
    console.log(rect);
    return {
      width: rect?.width || 0,
      height: rect?.height || 0,
    };
  };

  return (
    <div className='general-statistics' id='general-statistics'>
      <div>
        <span className='chart-title'>{textForKey('Today income')}</span>
        <span className='chart-subtitle'>12,000 MDL</span>
      </div>
      <div id='month-income-chart' className='month-income'>
        <ResponsiveContainer>
          <AreaChart
            data={data()}
            margin={{
              bottom: 15,
            }}
          >
            <XAxis dataKey='name' />
            <Tooltip />
            <Area dataKey='income' fill='#93C1EF' />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <span className='chart-title' style={{ marginTop: '1.5rem' }}>
        {textForKey('Reports overview')}
      </span>
      <div className='reports-overview'>
        <ServiceView />
        <ServiceView color='#FF5C83' />
        <ServiceView color='#7DD7C8' />
        <ServiceView color='#FDC534' />
        <ServiceView color='#00E987' />
        <ServiceView color='#7DD7C8' />
        <ServiceView color='#FDC534' />
        <ServiceView total />
      </div>
    </div>
  );
};

export default GeneralStatistics;
