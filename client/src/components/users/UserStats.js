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
  console.log("User activities:", userActivities);

  // Simple count function
  const totalActivities = userActivities ? userActivities.length : 0;
  console.log("Total activities:", totalActivities);

  if (!userActivities || userActivities.length === 0) {
    return (
      <div className="user-stats-container">
        <h3 className="user-stats-title">Activities This Month</h3>
        <p style={{ textAlign: "center", color: "#666", marginTop: "2rem" }}>
          No activities logged yet
        </p>
      </div>
    );
  }

  const data = {
    labels: ["Total Activities"],
    datasets: [
      {
        label: "Activities",
        data: [totalActivities],
        backgroundColor: "#fc4c02",
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
