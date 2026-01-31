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
                const data = await getAuditLog(Number(id));
                console.log(data);
                console.log(data.before)
                setData(data);
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
                        <Input readOnly value={data?.id} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div>
                        <div className="mb-2 block">
                            <Label>User ID</Label>
                        </div>
                        <Input readOnly value={data?.user_id} />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label>User Name</Label>
                        </div>
                        <Input readOnly value={data?.user_name} />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label>User Role</Label>
                        </div>
                        <Input readOnly value={data?.user_role} />
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label>Session ID</Label>
                        </div>
                        <Input readOnly value={data?.session_id} />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label>User IP Address</Label>
                        </div>
                        <Input readOnly value={data?.ip_address} />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label>User Agent</Label>
                        </div>
                        <Input readOnly value={data?.user_agent} />
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label>Created At</Label>
                        </div>
                        <Input readOnly value={data?.created_at} />
                    </div>
                </div>

                <hr />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
                    <div>
                        <div className="mb-2 block">
                            <Label>Action</Label>
                        </div>
                        <Input readOnly value={data?.action} />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label>Resource Type</Label>
                        </div>
                        <Input readOnly value={data?.resource_type} />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label>Resource ID</Label>
                        </div>
                        <Input readOnly value={data?.resource_id} />
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