import { getIPAddress } from "@/api/ip.api";
import CardBox from "@/components/shared/CardBox"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import {zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    ip_address: z.string().min(1).max(16),
    label: z.string().min(1).max(255),
    comment: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const IPForm = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema)
    });

    const isEditMode = Boolean(id);

    useEffect(() => {
        if (!isEditMode || !id) return;

        const fetchData = async () => {
            try {
                const data = await getIPAddress(Number(id));
                form.reset({
                    ip_address: data.ip_address,
                    label: data.label,
                    comment: data.comment ?? ""
                });
            } catch (err) {
                setIsLoading(false);

                if (err instanceof Error) {
                    setErrorMessage(err.message);
                } else {
                    setErrorMessage('Something went wrong');
                }
            }
        }

        fetchData();
    }, [id, isEditMode, form]);

    const onSubmit = form.handleSubmit(async (values: FormValues) => {
        if (isEditMode) {
            console.log('test', values)
        } else {
            console.log('test', values)
        }

        // navigate("/");
    });
    
    return (
        <>
            <CardBox>
                <div className="mb-6">
                    <div>
                        <h3 className="text-xl font-semibold mb-2">{ isEditMode ? "Edit IP Address" : "Create IP Address" }</h3>

                        <FormProvider {...form}>
                            <form onSubmit={onSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="ip_address">IP Address*</Label>
                                        </div>
                                        <Input
                                            id="ip_address"
                                            {...form.register("ip_address")} 
                                            className="w-full form-control"
                                        />
                                    </div>

                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="label">Label*</Label>
                                        </div>
                                        <Input
                                            id="label"
                                            {...form.register("label")} 
                                            className="w-full form-control"
                                        />
                                    </div>

                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="comment">Comment</Label>
                                        </div>
                                        <Textarea
                                            id="comment"
                                            {...form.register("comment")} 
                                            className="w-full form-control"
                                        ></Textarea>
                                    </div>
                                </div>
           
                                <div className="flex gap-3 mt-3">
                                    <Button
                                        className="rounded-md bg-primary text-white hover:bg-primary/90"
                                        type="submit">
                                        Save
                                    </Button>
                                    <Button
                                        className="rounded-md bg-red-500 text-white hover:bg-red-600"
                                        onClick={() => navigate('/')}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </FormProvider>
                        
                    </div>
                </div>
            </CardBox>
        </>
    )
}

export default IPForm;