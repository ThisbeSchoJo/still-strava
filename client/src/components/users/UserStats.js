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

// Calendar component to show activity dots
function ActivityCalendar({ userActivities }) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Get the first day of the month and number of days
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Create array of activity dates for quick lookup
  const activityDates = new Set();
  userActivities.forEach((activity) => {
    const activityDate = new Date(activity.datetime);
    if (
      activityDate.getMonth() === currentMonth &&
      activityDate.getFullYear() === currentYear
    ) {
      activityDates.add(activityDate.getDate());
    }
  });

  // Generate calendar grid
  const calendarDays = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Group days into weeks
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <div className="activity-calendar">
      <h4>Activity Calendar</h4>
      <div className="calendar-grid">
        <div className="calendar-header">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="calendar-week">
            {week.map((day, dayIndex) => (
              <div key={dayIndex} className="calendar-day">
                {day && (
                  <div
                    className={`day-cell ${
                      activityDates.has(day) ? "has-activity" : ""
                    }`}
                  >
                    <span className="day-number">{day}</span>
                    {activityDates.has(day) && (
                      <div className="activity-dot"></div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

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

  const pieData = {
    labels: Object.keys(activityTypes),
    datasets: [
      {
        data: Object.values(activityTypes),
        backgroundColor: ["#fc4c02", "#ff6b35", "#ff8c42", "#ffa726"],
      },
    ],
  };

  // Calculate weekly activities for the past 4 weeks
  const weeklyActivities = {};
  const today = new Date();
  const fourWeeksAgo = new Date(today.getTime() - 3 * 7 * 24 * 60 * 60 * 1000);

  // Initialize all 4 weeks with 0 using the same week calculation
  for (let i = 0; i < 4; i++) {
    const weekDate = new Date(
      fourWeeksAgo.getTime() + i * 7 * 24 * 60 * 60 * 1000
    );
    const dayOfWeek = weekDate.getDay();
    const weekStart = new Date(
      weekDate.getTime() - dayOfWeek * 24 * 60 * 60 * 1000
    );
    weekStart.setHours(0, 0, 0, 0);
    const weekKey = weekStart.toISOString().split("T")[0];
    weeklyActivities[weekKey] = 0;
  }

  // Count activities in each week using the same calculation
  userActivities.forEach((activity) => {
    const date = new Date(activity.datetime);
    const dayOfWeek = date.getDay();
    const weekStart = new Date(
      date.getTime() - dayOfWeek * 24 * 60 * 60 * 1000
    );
    weekStart.setHours(0, 0, 0, 0);
    const weekKey = weekStart.toISOString().split("T")[0];
    if (weeklyActivities.hasOwnProperty(weekKey)) {
      weeklyActivities[weekKey]++;
    }
  });

  const data = {
    labels: Object.keys(weeklyActivities).slice(-4), // Last 4 weeks
    datasets: [
      {
        label: "Activities",
        data: Object.values(weeklyActivities).slice(-4), // Last 4 weeks
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

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 10,
          usePointStyle: true,
        },
      },
    },
  };

  return (
    <div className="user-stats-container">
      <h3 className="user-stats-title">Activity Stats</h3>
      <div className="user-stats-content">
        <div className="user-stats-total">
          <span className="user-stats-number">{totalActivities}</span>
          <span className="user-stats-label">activities this month</span>
        </div>
        <div className="user-stats-charts">
          <div className="user-stats-chart">
            <Bar data={data} options={options} />
          </div>
          <div className="user-stats-chart">
            <Pie data={pieData} options={pieOptions} />
          </div>
          <div className="user-stats-chart">
            <ActivityCalendar userActivities={userActivities} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserStats;
