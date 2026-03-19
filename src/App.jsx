import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";

import Home from "./pages/Home";
import EventBrowse from "./pages/sponsor/EventBrowse";
import EventDetail from "./pages/sponsor/EventDetail";
import ShoppingCart from "./pages/sponsor/ShoppingCart";
import MeetingSchedule from "./pages/sponsor/MeetingSchedule";
import CreateEvent from "./pages/organizer/CreateEvent";
import ManageEvents from "./pages/organizer/ManageEvents";
import CreateSponsorshipPlans from "./pages/organizer/CreateSponsorshipPlans";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AgentPage from "./pages/AgentPage";
import MySponsorship from "./pages/sponsor/MySponsorship";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "events", element: <EventBrowse /> },
      { path: "events/:eventId", element: <EventDetail /> },
      { path: "cart", element: <ShoppingCart /> },
      { path: "meetings", element: <MeetingSchedule /> },
      { path: "create-event", element: <CreateEvent /> },
      { path: "manage-events", element: <ManageEvents /> },
      { path: "events/:eventId/sponsorship-plans", element: <CreateSponsorshipPlans /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "agent", element: <AgentPage /> },
      { path: "my-sponsorships", element: <MySponsorship /> },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
