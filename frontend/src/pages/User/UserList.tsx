import { deleteIPAddress, getIPAddresses } from "@/api/ip.api";
import CardBox from "@/components/shared/CardBox";
import Search from "@/components/shared/Search";
import { format } from 'date-fns'
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { IPAddress } from "@/types/ip";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type PaginationState, type SortingState } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, PlusIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { router } from "@/routes/Router";
import { toast, Toaster } from 'react-hot-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import BreadcrumbComp from "@/layouts/shared/breadcrumbs";

const BCrumb = [
  {
    title: 'IP Addresses',
  }
];

type ActionColumnProps = {
    onEdit: (ip: IPAddress) => void;
    onDelete: (ip: IPAddress) => void;
}

const getColumns = ({
    onEdit,
    onDelete
}: ActionColumnProps): ColumnDef<IPAddress>[] => [
    {
        accessorKey: "id",
        header: "ID",
        cell: (info) => info.getValue()
    },
    {
        accessorKey: "ip_address",
        header: "IP Address",
        cell: (info) => info.getValue()
    },
    {
        accessorKey: "label",
        header: "Label",
        cell: (info) => info.getValue()
    },
    {
        accessorKey: "created_by",
        header: "Created By",
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
                <Button onClick={() => onEdit(row.original)}>Edit</Button>
                <Button variant={'destructive'} className="text-white" onClick={() => onDelete(row.original)}>Delete</Button>
            </div>
        )
    }
];

const IPList = () => {
    const [ipAddresses, setIpAddresses] = useState<IPAddress[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIp, setSelectedIp] = useState<IPAddress | null>(null);
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

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
            const res = await getIPAddresses({
                page: pagination.pageIndex + 1,
                limit: pagination.pageSize,
                search,
                sort: sorting[0]?.id,
                order: sorting[0]?.desc ? "desc" : "asc",
            });
            
            setIpAddresses(res.data);
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

    const handleEdit = (ip: IPAddress) => {
        router.navigate(`ip/${ip.id}/edit`);
    }

    const handleDelete = (ip: IPAddress) => {
        setSelectedIp(ip);
        setOpenConfirmDelete(true);
    }

    const onDelete = async () => {
        setIsLoading(true);

        try {
            const res = await deleteIPAddress(Number(selectedIp?.id));
            toast.success(res.message)
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);

            if (err instanceof Error) {
                toast.error(err.message)
            } else {
                toast.error('Something went wrong')
            }
        } finally {
            setOpenConfirmDelete(false);
            setSelectedIp(null);
        }
    }

    const columns = useMemo(() => {
        return getColumns({
            onEdit: handleEdit,
            onDelete: handleDelete
        })
    }, [])

    useEffect(() => {
        fetchData();
    }, [pagination, sorting, search]);

    const table = useReactTable({
        data: ipAddresses,
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
            <BreadcrumbComp title="IP Addresses" items={BCrumb} />
            <CardBox>
                <Toaster position="top-right"/>
                <Dialog open={openConfirmDelete} onOpenChange={setOpenConfirmDelete}>
                    <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Delete IP</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this IP?</DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="flex gap-2 sm:justify-end">
                        <Button variant={'destructive'} onClick={onDelete} className="rounded-md">Delete</Button>
                        <Button variant={'outline'}  onClick={() => {
                            setOpenConfirmDelete(false);
                            setSelectedIp(null);
                        }} className="rounded-md">Cancel</Button>
                    </DialogFooter>
                    </DialogContent>
                </Dialog>

                <div className="mb-6">
                    <div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <Search onSearch={handleSearch} />
                            <Link to={'/ip/create'} className="mt-auto sm:mt-0 self-end sm:self-auto">
                                <Button variant="info" className="flex items-center gap-1">
                                    <PlusIcon className="w-3 h-3" />Add
                                </Button>
                            </Link>
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

export default IPList;
