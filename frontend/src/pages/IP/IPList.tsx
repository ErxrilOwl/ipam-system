import CardBox from "@/components/shared/CardBox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { IPAddress } from "@/types/ip";
import { useState } from "react";


const IPList = () => {
    const [ipAddresses, setIpAddresses] = useState<IPAddress[]>([]);

    return (
        <>
            <CardBox>
                <div className="mb-6">
                    <div>
                    <h5 className="card-title">IP Addresses</h5>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="-m-1.5 overflow-x-auto">
                        <div className="p-1.5 min-w-full inline-block align-middle">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-base font-semibold py-3 whitespace-nowrap">Id</TableHead>
                                            <TableHead className="text-base font-semibold py-3 whitespace-nowrap">IP Address</TableHead>
                                            <TableHead className="text-base font-semibold py-3 whitespace-nowrap">Label</TableHead>
                                            <TableHead className="text-base font-semibold py-3 whitespace-nowrap">Created By</TableHead>
                                            <TableHead className="text-base font-semibold py-3 whitespace-nowrap">Created At</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        { ipAddresses.map((ip) => (
                                            <TableRow key={ip.id}>
                                                <TableCell className="whitespace-nowrap">{ip.id}</TableCell>
                                                <TableCell className="whitespace-nowrap">{ip.ip_address}</TableCell>
                                                <TableCell className="whitespace-nowrap">{ip.label}</TableCell>
                                                <TableCell className="whitespace-nowrap">{ip.created_by}</TableCell>
                                                <TableCell className="whitespace-nowrap">{ip.created_at}</TableCell>
                                            </TableRow>
                                        )) }
                                    </TableBody>
                                </Table> 
                            </div>
                        </div>
                    </div>
                </div>
            </CardBox>
        </>
    )
}

export default IPList;
