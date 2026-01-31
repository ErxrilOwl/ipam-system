import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import IPList from "../pages/IP/IPList";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import IPForm from "@/pages/IP/IPForm";
import AuditLogList from "../pages/AuditLog/AuditLogList";
import AuditLogView from "@/pages/AuditLog/AuditLogView";

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
                path: "ip/create",
                element: <IPForm />
            },
            {
                path: "ip/:id/edit",
                element: <IPForm />
            },
            {
                path: 'audit-logs',
                element: (
                    <ProtectedRoute role="admin">
                        <AuditLogList />
                    </ProtectedRoute>
                )
            },
            {
                path: 'audit-logs/:id',
                element: (
                    <ProtectedRoute role="admin">
                        <AuditLogView />
                    </ProtectedRoute>
                )
            }
        ]
    }
]);