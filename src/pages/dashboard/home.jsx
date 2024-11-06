import React,{useState,useEffect} from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  statisticsCardsData,
  statisticsChartsData,
  projectsTableData,
  ordersOverviewData,
} from "@/data";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { API_URL } from "@/App";
import axios from "axios";
export function Home() {
  const [statisticsChartsData, setStatisticsChartsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(`${API_URL}/auth/getalluser`);
        const users = userResponse.data;
        const userCounts = {};
        users.forEach(user => {
          const day = new Date(user.created_at).toLocaleDateString();
          if (!userCounts[day]) {
            userCounts[day] = 0;
          }
          userCounts[day]++;
        });
        const sortedUserDays = Object.keys(userCounts).sort((a, b) => new Date(a) - new Date(b));
        const userChartData = sortedUserDays.map(day => userCounts[day]);
        const userChart = {
          type: "bar",
          height: 220,
          series: [
            {
              name: "Users",
              data: userChartData,
            },
          ],
          options: {
            colors: "#388e3c",
            plotOptions: {
              bar: {
                columnWidth: "16%",
                borderRadius: 5,
              },
            },
            xaxis: {
              categories: sortedUserDays,
            },
          },
        };

        // Fetch feedback data
        const feedbackResponse = await axios.get(`${API_URL}/feedback/getFeedback`); // Adjust to your feedback API endpoint
        const feedbacks = feedbackResponse.data;
        // Process feedback data to count ratings
        const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let totalCount = 0;

        feedbacks.forEach(feedback => {
          if (feedback.rating >= 1 && feedback.rating <= 5) {
            ratingCounts[feedback.rating]++;
            totalCount++;
          }
        });
        // Calculate percentages for the feedback chart
        const ratingPercentages = Object.keys(ratingCounts).map(rating => {
          const count = ratingCounts[rating];
          return totalCount > 0 ? (count / totalCount) * 100 : 0;
        });

        const feedbackChart = {
          type: "bar",
          height: 220,
          series: [
            {
              name: "Rating Percentage",
              data: ratingPercentages,
            },
          ],
          options: {
            colors: "#388e3c", // Example color for feedback chart
            plotOptions: {
              bar: {
                columnWidth: "25%",
                borderRadius: 5,
              },
            },
            xaxis: {
              categories: ['1', '2', '3', '4', '5'], // Ratings 1-5
            },
            yaxis: {
              title: {
                text: 'Percentage (%)',
              },
            },
          },
        };

        // Set the statistics charts data
        setStatisticsChartsData([
          {
            color: "white",
            title: "User Registrations",
            description: "User Registrations Over Time",
            footer: "Last Updated",
            chart: userChart,
          },
          {
            color: "white",
            title: "Feedback Ratings Distribution",
            description: "Percentage of Ratings from 1 to 5",
            footer: "Last Updated",
            chart: feedbackChart,
          },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        <StatisticsCard />
      </div>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {statisticsChartsData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))}
      </div>
     
    </div>
  );
}

export default Home;
