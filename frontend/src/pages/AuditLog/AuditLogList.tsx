import CardBox from "@/components/shared/CardBox";
import Search from "@/components/shared/Search";
import { format } from 'date-fns'
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type PaginationState, type SortingState } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast, Toaster } from 'react-hot-toast';
import type { AuditLogItem } from "@/types/audit-log";
import { getAuditLogs } from "@/api/audit-log.api";
import { router } from "@/routes/Router";
import BreadcrumbComp from "@/layouts/shared/breadcrumbs";

const BCrumb = [
  {
    title: 'Audit Logs',
  },
];

type ActionColumnProps = {
    onView: (auditLog: AuditLogItem) => void;
}

const getColumns = ({
    onView
}: ActionColumnProps): ColumnDef<AuditLogItem>[] => [
    {
        accessorKey: "id",
        header: "ID",
        cell: (info) => info.getValue()
    },
    {
        accessorKey: "user_name",
        header: "User",
        cell: (info) => info.getValue()
    },
    {
        accessorKey: "user_role",
        header: "Role",
        cell: (info) => info.getValue()
    },
    {
        accessorKey: "action",
        header: "Action",
        cell: (info) => info.getValue()
    },
    {
        accessorKey: "resource_type",
        header: "Resource Type",
        cell: (info) => info.getValue()
    },
    {
        accessorKey: "resource_id",
        header: "Resource ID",
        cell: (info) => info.getValue()
    },
    {
        accessorKey: "created_at",
        header: "Created At",
        cell: (info) => {
            const value = info.getValue() as string | Date;
            return format(new Date(value), "MMM d, y HH:MM a");
        }
    },
        {
    id: "actions",
        header: "Actions",
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ row }) => (
            <div className="flex gap-2">
                <Button onClick={() => onView(row.original)}>View</Button>
            </div>
        )
    }
];

const AuditLogList = () => {
    const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10
    });

    const [sorting, setSorting] = useState<SortingState>([
        {
            id: "created_at",
            desc: true
        }
    ]);
    const [search, setSearch] = useState("");

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await getAuditLogs({
                page: pagination.pageIndex + 1,
                limit: pagination.pageSize,
                search,
                sort: sorting[0]?.id,
                order: sorting[0]?.desc ? "desc" : "asc",
            });
            
            setAuditLogs(res.data);
            setTotal(res.meta.total);
        } catch (err) {
            setIsLoading(false);

            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error('Something went wrong');
            }
        } finally {
            setIsLoading(false);
        }
    }

    const handleSearch = (query: string) => {
        setPagination((p) => ({ ...p, pageIndex: 0 }))
        setSearch(query);
    }

    const handleView = (auditLog: AuditLogItem) => {
        router.navigate(`/audit-logs/${auditLog.id}`);
    }

    useEffect(() => {
        fetchData();
    }, [pagination, sorting, search]);

    const columns = useMemo(() => {
        return getColumns({
            onView: handleView
        })
    }, [])

    const table = useReactTable({
        data: auditLogs,
        columns,
        state: {
            pagination,
            sorting,
        },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        manualPagination: true,
        manualSorting: true,
        pageCount: Math.ceil(total / pagination.pageSize),
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <>
            <BreadcrumbComp title="Audit Logs" items={BCrumb} />
            <CardBox>
                <Toaster position="top-right"/>

                <div className="mb-6">
                    <div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <Search onSearch={handleSearch} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col min-w-0">
                    <div className="-m-1.5 overflow-x-auto min-w-0">
                        <div className="p-1.5 min-w-full inline-block align-middle">
                            <div className="overflow-x-auto border rounded-md border-ld">
                                <Table>
                                    <TableHeader>
                                        { table.getHeaderGroups().map(hg => (
                                            <TableRow className="hover:bg-primary/10 transition-colors" key={hg.id}>
                                                { hg.headers.map((header) => (
                                                    <TableHead 
                                                        key={header.id}
                                                        className="text-base font-semibold p-4 whitespace-nowrap cursor-pointer select-none "
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        { flexRender(header.column.columnDef.header, header.getContext()) }        
                                                        {{
                                                            asc: <ArrowUp className="ms-1 w-4 h-4 inline" />,
                                                            desc: <ArrowDown className="ms-1 w-4 h-4 inline" />,
                                                        }[header.column.getIsSorted() as string] ??
                                                            (header.column.id !== 'action' ? (
                                                            <ChevronsUpDown className="ms-1 w-2 h-2 inline" />
                                                            ) : null)}
                                                    </TableHead>
                                                )) }
                                            </TableRow>
                                        )) }
                                        
                                    </TableHeader>
                                    <TableBody>
                                        {isLoading ? (
                                            <tr>
                                            <td
                                                colSpan={columns.length}
                                                className="py-6 text-center text-sm"
                                            >
                                                <Skeleton>Loading</Skeleton>
                                            </td>
                                            </tr>
                                        ) : table.getRowModel().rows.length === 0 ? (
                                            <tr>
                                            <td
                                                colSpan={columns.length}
                                                className="py-6 text-center text-sm"
                                            >
                                                No results found
                                            </td>
                                            </tr>
                                        ) : (
                                            table.getRowModel().rows.map((row) => (
                                                <TableRow className="hover:bg-primary/10 transition-colors group/row bg-transparentodd:bg-transparent even:bg-gray-100 dark:even:bg-gray-100" key={row.id}>
                                                    { row.getVisibleCells().map(cell => (
                                                        <TableCell key={cell.id} 
                                                            className="p-4 px-6 whitespace-nowrap">
                                                            {flexRender(
                                                                cell.column.columnDef.cell,
                                                                cell.getContext()
                                                            )}
                                                        </TableCell>
                                                    )) }
                                                    
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table> 
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-end gap-4 p-4 border-t border-border dark:border-white/10">
                        <div className="flex gap-2">
                            <Button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                variant={'secondary'}
                            >
                                Previous
                            </Button>
                            <Button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </CardBox>
        </>
    )
}

export default AuditLogList;
