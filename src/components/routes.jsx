import { createBrowserRouter } from "react-router-dom";
import LandingPage from "/src/pages/LandingPage";
import Login from "/src/pages/Login";
import Signup from "/src/pages/Signup";
import Contact from '/src/pages/contact'; // Make sure this matches your file name
import CreateQuiz from '/src/pages/createQuiz'; // Make sure this matches your file name
import AdminLayout from '/src/pages/admin/AdminLayout';
import QuizDetails from '/src/pages/quiz-details'; // Make sure this matches your file name

// Import Admin Pages - Fix the paths
import ViewQuizzes from '/src/pages/admin/ViewQuizzes'; // Capital V
import AddQuiz from '/src/pages/admin/AddQuiz';
import UpdateQuiz from '/src/pages/admin/UpdateQuiz';
import DeleteQuiz from '/src/pages/admin/DeleteQuiz';
import ManageUsers from "../pages/admin/ManageUsers";


const routes = createBrowserRouter([
    { path: "/", element: <LandingPage /> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { 
        path: "/admin", 
        element: <AdminLayout />,
        children: [
            { index: true, element: <ViewQuizzes /> },
            { path: "view", element: <ViewQuizzes /> },
            { path: "add", element: <AddQuiz /> },
            { path: "update", element: <UpdateQuiz /> },
            { path: "delete", element: <DeleteQuiz /> },
            { path: "users", element: <ManageUsers /> }
        ]
    },
    { path: "/contact", element: <Contact /> },
    { path: "/create-quiz", element: <CreateQuiz /> },
    { path: "/quiz/:id", element: <QuizDetails /> }
]);

export default routes;