import CardBox from "@/components/shared/CardBox";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { getAuditLog } from "@/api/audit-log.api";
import type { AuditLog } from "@/types/audit-log";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BreadcrumbComp from "@/layouts/shared/breadcrumbs";

const BCrumb = [
  {
    to: '/audit-logs',
    title: 'Audit Logs',
  },
  {
    title: 'View Audit Logs',
  },
];

const AuditLogView = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<AuditLog | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const resData = await getAuditLog(Number(id));
                
                setData({
                    ...resData,
                    before: resData.before ? JSON.stringify(resData.before, null, 2) : '',
                    after: resData.after ? JSON.stringify(resData.after, null, 2) : ''
                });
            } catch (err) {
                if (err instanceof Error) {
                    toast.error(err.message);
                } else {
                    toast.error('Something went wrong');
                }
            }
        }

        fetchData();
    }, [id]);

    if (!data) {
        return (
            <>
            <BreadcrumbComp title="View Audit Log" items={BCrumb} />
            <CardBox>Loading audit log…</CardBox>
            </>
        );
    }

    return (
    <>
        <BreadcrumbComp title="View Audit Log" items={BCrumb} />
        <CardBox>
            <Toaster position="top-right" />
            <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div>
                        <div className="mb-2 block">
                            <Label>ID</Label>
                        </div>
                        <Input readOnly value={data?.id?.toString() ?? ''} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div>
                        <div className="mb-2 block">
                            <Label>User ID</Label>
                        </div>
                        <Input readOnly value={data?.user_id?.toString() ?? ''} />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label>User Name</Label>
                        </div>
                        <Input readOnly value={data?.user_name?.toString() ?? ''} />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label>User Role</Label>
                        </div>
                        <Input readOnly value={data?.user_role?.toString() ?? ''} />
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label>Session ID</Label>
                        </div>
                        <Input readOnly value={data?.session_id?.toString() ?? ''} />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label>User IP Address</Label>
                        </div>
                        <Input readOnly value={data?.ip_address?.toString() ?? ''} />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label>User Agent</Label>
                        </div>
                        <Input readOnly value={data?.user_agent?.toString() ?? ''} />
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label>Created At</Label>
                        </div>
                        <Input readOnly value={data?.created_at?.toString() ?? ''} />
                    </div>
                </div>

                <hr />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
                    <div>
                        <div className="mb-2 block">
                            <Label>Action</Label>
                        </div>
                        <Input readOnly value={data?.action?.toString() ?? ''} />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label>Resource Type</Label>
                        </div>
                        <Input readOnly value={data?.resource_type?.toString() ?? ''} />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label>Resource ID</Label>
                        </div>
                        <Input readOnly value={data?.resource_id?.toString() ?? ''} />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
                    <div>
                        <div className="mb-2 block">
                            <Label>Before</Label>
                        </div>
                        <div className="bg-gray-50 text-gray-800 p-4 rounded-md border text-sm font-mono whitespace-pre-wrap break-words">{data?.before}</div>
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label>After</Label>
                        </div>
                        <div className="bg-gray-50 text-gray-800 p-4 rounded-md border text-sm font-mono whitespace-pre-wrap break-words">{data?.after}</div>
                    </div>
                </div>
            </div>
        </CardBox>
    </>)
}

export default AuditLogView;