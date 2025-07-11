// Import the ChartJS components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Import the Bar component from react-chartjs-2
import { Bar } from "react-chartjs-2";
import "../../styling/userstats.css";

// Register the ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function UserStats({ userActivities }) {
  const data = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Activities",
        data: [3, 5, 2, 7],
        backgroundColor: "#fc4c02", // Strava orange
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      title: {
        display: false, // Hide the title
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Start y-axis at 0
      },
    },
  };
  return (
    <div className="user-stats-container">
      <h3 className="user-stats-title">Activities This Month</h3>
      <Bar data={data} options={options} />
    </div>
  );
}

export default UserStats;
