import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { extractColorsAndLabels, lightColors, lightenColor } from "@/lib/utils";
import { CandidateGroup } from "@/lib/candidates";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
    scales: {
      x: {
        position: 'top' as const, // This will move the x-axis to the top of the chart
        beginAtZero: true,
        // THis property do not exist on type GridLineOptions
        // grid: {
        //   drawBorder: false, // This will remove the border on the x-axis
        // },
        ticks: {
          color: '#666666', // Set the font color of x-axis labels
          font: {
            family: 'Helvetica',
            weight: 'bold' as const,
            size: 14, // Set the font size of x-axis labels
          },
        },
      },
      y: {
        // We don't need to specify the position for y as it's already on the left
        beginAtZero: true,
        display: false,
        // THis property do not exist on type GridLineOptions
        // grid: {
        //   drawBorder: false, // This will remove the border on the x-axis
        // },
      }
    },
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    title: {
      display: false,
      text: 'Voting System Comparison',
    },
    datalabels: {
      color: 'white',
      anchor: 'center' as const,
      align: 'bottom' as const,
      formatter: (value: string) => {
        return value + ' %'; // Format the label to show value followed by a percentage sign
      },
      font: {
        weight: 'bold' as const,
        size: 10,
        family: 'Helvetica'
      }
    }
  },
}

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

export default function VoteSystemComparison({ candidates } : { candidates: CandidateGroup[]}) {
  const { optionColors, labels } = extractColorsAndLabels(candidates);

  const data = {
    labels: labels,
    datasets: [
        {
            label: 'Old voting system',
            // TODO: use data from firebase rtdb
            data: [12.1, 10.3, 9.6, 5.7, 24.8, 21.5, 15.12, 22.7, 12.9],
            backgroundColor: optionColors,
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 0
        },
        {
            label: 'New voting system',
            // TODO: use data from firebase rtdb
            data: [-5, 15, 8, 3, -7, 14, 30, -2, 6],
            backgroundColor: lightColors(optionColors),
            borderColor: 'rgba(255, 193, 7, 1)',
            borderWidth: 0
        }
    ]
  };

  return (
    <div>
      <div style={{ height: '450px', width: '100%' }}>
        <Bar
          data={data}
          options={options}
          plugins={[ChartDataLabels, alternatingBackgroundPlugin]}
        />
      </div>
    </div>
  );
}