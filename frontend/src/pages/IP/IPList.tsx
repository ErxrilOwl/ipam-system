import { getIPAddresses } from "@/api/ip.api";
import CardBox from "@/components/shared/CardBox";
import Search from "@/components/shared/Search";
import { format } from 'date-fns'
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { IPAddress } from "@/types/ip";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type PaginationState, type SortingState } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, TriangleAlert, PlusIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
    const [errorMessage, setErrorMessage] = useState('');

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10
    });

    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");

    const fetchData = async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const res = await getIPAddresses({
                page: pagination.pageIndex + 1,
                limit: pagination.pageSize,
                search,
                sort: sorting[0]?.id,
                order: sorting[0]?.desc ? "desc" : "asc",
            });
            console.log(res);
            setIpAddresses(res.data);
            setTotal(res.meta.total);

        } catch (err) {
            setIsLoading(false);

            if (err instanceof Error) {
                setErrorMessage(err.message);
            } else {
                setErrorMessage('Something went wrong');
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
        console.log(ip);
    }

    const handleDelete = (ip: IPAddress) => {
        console.log(ip);
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
      })

    return (
        <>
            <CardBox>
                <div className="mb-6">
                    <div>
                        <h3 className="text-xl font-semibold mb-2">IP Addresses</h3>

                        <div className="flex justify-between mt-2">
                            <Search onSearch={handleSearch} />
                            <Link to={'/ip/create'}>
                                <Button variant="info">
                                    <PlusIcon className="w-3 h-3" />Add
                                </Button>
                            </Link>
                        </div>
                        
                    </div>
                </div>

                {
                    errorMessage && (
                        <>
                            <Alert variant="destructive" className="flex border-2 flex-col gap-2">
                                <TriangleAlert className="w-4 h-4" />
                                <AlertTitle>Something went wrong!</AlertTitle>
                                <AlertDescription className="text-gray-900">{ errorMessage }</AlertDescription>
                            </Alert>
                        </>
                    )
                }

                <div className="flex flex-col">
                    <div className="-m-1.5 overflow-x-auto">
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
                                                Loading...
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
                        </div>
                    </div>
                </div>
            </CardBox>
        </>
    )
}

export default IPList;
