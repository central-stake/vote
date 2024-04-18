// @ts-nocheck
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function lightenColor(color: string, factor: number) {
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
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      position: 'top', // This will move the x-axis to the top of the chart
      beginAtZero: true,
      grid: {
        drawBorder: false, // This will remove the border on the x-axis
      },
      ticks: {
        color: '#666666', // Set the font color of x-axis labels
        font: {
          family: 'Helvetica',
          weight: 'bold',
          size: 14, // Set the font size of x-axis labels
        },
      },
    },
    y: {
      // We don't need to specify the position for y as it's already on the left
      beginAtZero: true,
      display: false,
      grid: {
        drawBorder: false, // This will remove the border on the x-axis
      },
    }
  },
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: false,
      text: 'Voting System Comparison',
    },
    datalabels: {
      color: 'white',
      anchor: 'center',
      //align: 'bottom',
      formatter: (value: string) => {
        return value + ' %'; // Format the label to show value followed by a percentage sign
      },
      font: {
        //weight: 'bold',
        size: 8,
        family: 'Helvetica'
      }
    }
  },
};

const optionColors = ['#03407F', '#7BB151', '#D94E0B','#D14057','#570B18', '#CEA10E', '#A40A22', '#D14057']
// Function to generate alternating colors
const alternatingColors = (length: number, color1: string, color2: string) => {
  return Array.from({ length }, (_, i) => (i % 2 === 0 ? color1 : color2));
};

const lightColors = (colors: string[]) => {
  return colors.map((color) => lightenColor(color, 80))
};

const data = {
  labels: ['Open VLD', 'Groen', 'CD&V', 'PVDA', 'Vlaams Belang', 'N-VA', 'Vooruuit'], // Replace these with your actual options
  datasets: [
      {
          label: 'Old voting system',
          data: [12.1, 10.3, 9.6, 5.7, 24.8, 21.5, 15.12], // Replace these with your actual data points
          backgroundColor: optionColors,
          borderColor: 'rgba(0, 123, 255, 1)',
          borderWidth: 0
      },
      {
          label: 'New voting system',
          data: [-5, 15, 8, 3, -7, 14, 30], // Replace these with your actual data points
          backgroundColor: lightColors(optionColors), // alternatingColors(5, 'red', 'green')
          borderColor: 'rgba(255, 193, 7, 1)',
          borderWidth: 0
      }
  ]
};

const alternatingBackgroundPlugin = {
  id: 'alternatingBackgroundPlugin',
  beforeDraw: (chart: any) => {
    const ctx = chart.ctx;
    const xAxis = chart.scales.x;
    const yAxis = chart.scales.y;
    const chartArea = chart.chartArea;

    ctx.save();

    const sectionWidth = chartArea.width / chart.data.labels.length;
    const backColor = '#F3F3F3'
    const lbackColor = lightenColor(backColor, 20)
    chart.data.labels.forEach((label: string, index: number) => {
      const x = xAxis.getPixelForValue(label) - sectionWidth / 2;

      const color = index % 2 === 0 ? backColor : lbackColor;

      ctx.fillStyle = color;
      ctx.fillRect(x, chartArea.top, sectionWidth, yAxis.bottom - yAxis.top);
    });

    ctx.restore();
  }
};

export default function VoteSystemComparison() {
  return (
    <div>
      <div style={{ height: '450px', width: '100%' }}>
        <Bar data={data} options={options} plugins={[ChartDataLabels, alternatingBackgroundPlugin]} />
      </div>
    </div>
  );
}