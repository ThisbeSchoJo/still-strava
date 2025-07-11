// Import the ChartJS components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement, // Add this
} from "chart.js";

// Import the Bar component from react-chartjs-2
import { Bar, Pie } from "react-chartjs-2";
import "../../styling/userstats.css";

// Register the ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement // Add this
);

function UserStats({ userActivities }) {
  // Simple count function for total activities
  const totalActivities = userActivities ? userActivities.length : 0;

  if (!userActivities || userActivities.length === 0) {
    return (
      <div className="user-stats-container">
        <h3 className="user-stats-title">Activities This Month</h3>
        <p className="user-stats-placeholder">No activities logged yet</p>
      </div>
    );
  }

  // Count the number of activities by type
  const activityTypes = {};
  userActivities.forEach((activity) => {
    const type = activity.activity_type || "Unknown";
    activityTypes[type] = (activityTypes[type] || 0) + 1;
  });
  console.log("Activity types:", activityTypes);

  const pieData = {
    labels: Object.keys(activityTypes),
    datasets: [
      {
        data: Object.values(activityTypes),
        backgroundColor: ["#fc4c02", "#ff6b35", "#ff8c42", "#ffa726"],
      },
    ],
  };

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
