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

function UserStats() {
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
  return (
    <div className="user-stats-container">
      <h1>User Stats Chart/Graph will go here</h1>
      <Bar data={data} />
    </div>
  );
}

export default UserStats;
