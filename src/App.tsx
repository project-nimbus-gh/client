import './App.css'
import { LineGraph } from './components/graphs/LineGraph'
import type { LineGraphConfig } from './components/graphs/types';

function getRndInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const config: LineGraphConfig = {
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: true,
      text: 'Temperature',
    },
  },
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'left',
    }
  },
};

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const labels = (() => {
  const list: string[] = [];
  months.forEach(month => {
    for (let i = 0; i <= 10; i++) {
      list.push(`${month} ${i + 1}`);
    }
  });
  return list;
})();

const data = {
  labels,
  datasets: [
    {
      label: 'Temperature',
      data: labels.map(() => {
        return getRndInteger(5, 30);
      }),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      yAxisID: 'y',
    },
    {
      label: 'Humidity',
      data: labels.map(() => {
        return getRndInteger(50, 90);
      }),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      yAxisID: 'y1',
    },
  ],
};

function App() {
  return (
    <>
      <LineGraph data={data} config={config} />
    </>
  )
}

export default App
