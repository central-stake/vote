// @ts-nocheck
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
// const isMobile = window.innerWidth < 768;
const isMobile = false;
function lightenColor(color, factor) {
  // Remove the "#" symbol if it exists
  color = color.replace(/^#/, '');

  // Parse the color as a hexadecimal number
  const num = parseInt(color, 16);

  // Extract the RGB components
  let red = (num >> 16) & 255;
  let green = (num >> 8) & 255;
  let blue = num & 255;

  // Calculate the new RGB values by increasing them
  // You can adjust the factor to control the lightness
  red = Math.min(255, red + factor);
  green = Math.min(255, green + factor);
  blue = Math.min(255, blue + factor);

  // Convert the new RGB values back to hexadecimal
  const newColor = `#${(blue | (green << 8) | (red << 16)).toString(16).padStart(6, '0')}`;

  return newColor;
}

const options = {
  plugins: {
    datalabels: {
      color: '#E5E5E5',
      textAlign: 'center',
      anchor: 'bottom',
     // align: 'bottom',
      font: {
        weight: 'bold'
      },
      display: !isMobile,
      formatter: (value, context) => {
        return context.chart.data.labels[context.dataIndex] +'\n '+ value +'';
      }
    },
    legend: {
      display: true // This would hide the default legend
    },
    tooltip: {
      callbacks: {
        label: function(context) {
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

const backC = ['#64DD17', '#FFD600', '#29B6F6', '#2962FF', '#FFAB00', '#FF6D00', '#8D6E63', '#DD2C00', '#C62828', '#B71C1C', '#D50000']
const backCL = backC.map((x)=> lightenColor(x, 50))
const data = {
  labels: ['Ecolo-Groen', 'DéFI', 'Open VLD', 'MR', 'Vlaams Belang', 'N-VA', 'CD&V', 'cdH', 'PS', 'PVDA/PTB', 'sp.a'],
  datasets: [{
    data: [21, 2, 12, 14, 18, 25, 12, 5, 20, 12, 9], // The number of seats per party
    backgroundColor: backC,
    borderColor: ['#FFFFFF'],
    borderWidth: 4,
    cutout: "40%"
  },
  {
    data: [10 , 20 , 5 , 15 , 7 , 9 , 6 , 8 , 12 , 25 , 23], // The number of seats per party
    backgroundColor: backCL,
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
      const total = chart.data.datasets[0].data.reduce((sum, value) => sum + value, 0);
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

export default function VoteResultBySeat() {
  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Doughnut data={data} options={options} plugins={[ChartDataLabels, centerTextPlugin]} />
    </div>
  );
}