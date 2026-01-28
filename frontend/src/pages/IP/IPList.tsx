import { getIPAddresses } from "@/api/ip.api";
import CardBox from "@/components/shared/CardBox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { IPAddress } from "@/types/ip";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type PaginationState, type SortingState } from "@tanstack/react-table";
import { useEffect, useState } from "react";

const columns: ColumnDef<IPAddress>[] = [
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
        cell: (info) => info.getValue()
    }
];


const IPList = () => {
    const [ipAddresses, setIpAddresses] = useState<IPAddress[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 1
    });

    const [sorting, setSorting] = useState<SortingState>([]);
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
                        <h5 className="card-title">IP Addresses</h5>
                        <Input
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => {
                                setPagination((p) => ({ ...p, pageIndex: 0 }))
                                setSearch(e.target.value);
                            }}
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="-m-1.5 overflow-x-auto">
                        <div className="p-1.5 min-w-full inline-block align-middle">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        { table.getHeaderGroups().map(hg => (
                                            <TableRow key={hg.id}>
                                                { hg.headers.map((header) => (
                                                    <TableHead 
                                                        key={header.id}
                                                        className="text-base font-semibold py-3 whitespace-nowrap"
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        { flexRender(header.column.columnDef.header, header.getContext()) }        
                                                        {header.column.getIsSorted() === "asc" && " ↑"}
                                                        {header.column.getIsSorted() === "desc" && " ↓"}
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
                                                <TableRow key={row.id}>
                                                    { row.getVisibleCells().map(cell => (
                                                        <TableCell key={cell.id} 
                                                            className="whitespace-nowrap">
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

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border dark:border-white/10">
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
