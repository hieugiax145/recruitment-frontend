import { createBrowserRouter } from "react-router-dom";
import Login from "../../features/auth/Login";
import Layout from "../../components/Layout";
import RecruitmentRequests from "../../features/recruitment-requests/RecruitmentRequests";
import JobPositions from "../../features/job-positions/JobPositions";
import Calendar from "../../features/calendar/Calendar";
import Candidate from "../../features/candidate/Candidate";
import CandidateDetail from "../../features/candidate/CandidateDetail";
import Email from "../../features/email/Email";
import Users from "../../features/users/Users";
import UserForm from "../../features/users/UserForm";
import Employees from "../../features/employees/Employees";
import EmployeeForm from "../../features/employees/EmployeeForm";
import RecruitmentRequestAdd from "../../features/recruitment-requests/RecruitmentRequestAdd";
import RedirectIfAuth from "../../components/RedirectIfAuth";
import ProtectedRoute from "../../components/ProtectedRoute";
import JobPositionsAdd from "../../features/job-positions/JobPositionAdd";
import JobPositionCandidates from "../../features/job-positions/JobPositionCandidates";
import Home from "../../features/dashboard/Home";
import Roles from "../../features/roles/Roles";
import RoleForm from "../../features/roles/RoleForm";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <RedirectIfAuth>
        <Login />
      </RedirectIfAuth>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/users/new",
        element: <UserForm />,
      },
      {
        path: "/users/:id",
        element: <UserForm />,
      },
      {
        path: "/roles",
        element: <Roles />,
      },
      {
        path: "/roles/new",
        element: <RoleForm />,
      },
      {
        path: "/roles/:id",
        element: <RoleForm />,
      },
      {
        path: "/employees",
        element: <Employees />,
      },
      {
        path: "/employees/new",
        element: <EmployeeForm />,
      },
      {
        path: "/employees/:id",
        element: <EmployeeForm />,
      },
      {
        path: "/recruitment-requests",
        element: <RecruitmentRequests />,
      },
      {
        path: "/recruitment-requests/new",
        element: <RecruitmentRequestAdd />,
      },
      {
        path: "/recruitment-requests/:id",
        element: <RecruitmentRequestAdd />,
      },
      {
        path: "/job-positions",
        element: <JobPositions />,
      },
      {
        path: "/job-positions/new",
        element: <JobPositionsAdd />,
      },
      {
        path: "/job-positions/:id/candidates",
        element: <JobPositionCandidates />,
      },
      {
        path: "/calendar",
        element: <Calendar />,
      },
      {
        path: "/candidates",
        element: <Candidate />,
      },
      {
        path: "/candidates/:id",
        element: <CandidateDetail />,
      },
      {
        path: "/email",
        element: <Email />,
      },
    ],
  },
  {
    path: "/about",
    element: <div>About Page</div>,
  },
]);
