// @ts-nocheck
'use client'

import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { extractColorsAndLabels, lightenColor } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { CandidateGroup } from '@/lib/candidates';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  ChartDataLabels,
  Legend
);


export default function VoteResultBySeat({ candidates } : {candidates: CandidateGroup[]}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const options = {
    plugins: {
      datalabels: {
        color: '#E5E5E5',
        textAlign: 'center',
        anchor: 'bottom' as const,
        // align: 'bottom',
        font: {
          weight: 'bold' as const,
        },
        display: !isMobile,
        formatter: (value: string, context: { chart: { data: { labels: { [x: string]: string; }; }; }; dataIndex: string | number; }) => {
          return context.chart.data.labels[context.dataIndex] +'\n '+ value +'';
        }
      },
      legend: {
        display: true // This would hide the default legend
      },
      tooltip: {
        callbacks: {
          label: function(context: { label: string; parsed: string | null; }) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed + ' seats';
            }
            return label;
          }
        }
      }
    },
    circumference: 180,
    rotation: -90,
  };

  const { optionColors, labels } = extractColorsAndLabels(candidates);
  const optionColorsLight = optionColors.map((x: string)=> lightenColor(x, 50));

  const data = {
    labels: labels,
    datasets: [{
      // TODO: use data from firebase rtdb
      data: [21, 2, 12, 14, 18, 25, 12, 5, 20],
      backgroundColor: optionColors,
      borderColor: ['#FFFFFF'],
      borderWidth: 4,
      cutout: "40%"
    },
    {
      // TODO: use data from firebase rtdb
      data: [10 , 20 , 5 , 15 , 7 , 9 , 6 , 8 , 12],
      backgroundColor: optionColorsLight,
      borderColor: ['#FFFFFF'],
      borderWidth: 2,
      cutout: "30%"
    }
  ]
  };

  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: (chart) => {
      if(!isMobile){
        const ctx = chart.ctx;
        const width = chart.width;
        const height = chart.height;
        const total = chart.data.datasets[0].data.reduce((sum: any, value: any) => sum + value, 0);
        const centerX = width / 2;
        const centerY = height / 2;

        ctx.save();
        ctx.font = '16px Helvetica';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#666666';
        ctx.font = '64px Helvetica';
        ctx.fillText('150', centerX, centerY+ centerY/2 - 40);
        ctx.font = '24px Helvetica';
        ctx.fillText('Seats', centerX, centerY+ centerY/2 - 5 ); // Adjust the position as needed
        ctx.font = '24px Helvetica';
        ctx.fillText('89', centerX -50, centerY + centerY/2 + 20); // Adjust the position as needed
        ctx.fillText('61', centerX + 50, centerY + centerY/2 + 20);
        ctx.font = '12px Helvetica';// Adjust the position as needed
        ctx.fillText('Flemish', centerX -50, centerY + centerY/2 + 35); // Adjust the position as needed
        ctx.fillText('French', centerX + 50, centerY + centerY/2 + 35);
        ctx.restore();
      }
    }
  };

  return (
    <div className='flex items-center justify-center'>
      <Doughnut data={data} options={options} plugins={[ChartDataLabels, centerTextPlugin]} />
    </div>
  );
}