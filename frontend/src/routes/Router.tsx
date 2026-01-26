import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import IPList from "../pages/IPList";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import AuditLog from "../pages/AuditLog";

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
                element: <IPList />
            },
            {
                path: 'audit-logs',
                element: (
                    <ProtectedRoute role="admin">
                        <AuditLog />
                    </ProtectedRoute>
                )
            }
        ]
    }
]);