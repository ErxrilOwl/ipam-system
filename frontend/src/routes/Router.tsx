import { createBrowserRouter, Outlet } from "react-router-dom";
import Login from "../pages/Login";
import IPList from "../pages/IP/IPList";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import IPForm from "@/pages/IP/IPForm";
import AuditLogList from "../pages/AuditLog/AuditLogList";
import AuditLogView from "@/pages/AuditLog/AuditLogView";
import Error from "@/pages/Error";
import UserList from "@/pages/User/UserList";
import UserForm from "@/pages/User/UserForm";

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <IPList />,
            },
            {
                path: 'ip',
                children: [
                    {
                        index: true,
                        element: <IPList />
                    },
                    {
                        path: "create",
                        element: <IPForm />
                    },
                    {
                        path: ":id/edit",
                        element: <IPForm />
                    }                
                ]
            },
            {
                path: 'users',
                children: [
                    {
                        index: true,
                        element: <UserList />
                    },
                    {
                        path: "create",
                        element: <UserForm />
                    },
                    {
                        path: ":id/edit",
                        element: <UserForm />
                    }                
                ]
            },
            {
                path: 'audit-logs',
                element: <ProtectedRoute role="admin"><Outlet /></ProtectedRoute>,
                children: [
                    {
                        index: true,
                        element: <AuditLogList />
                    },
                    {
                        path: ':id',
                        element: <AuditLogView />
                    }
                ]
            }
        ]
    },
    {
        path: '*',
        element: <Error />
    }
]);