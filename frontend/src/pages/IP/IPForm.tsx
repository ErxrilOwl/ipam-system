import { createIPAddress, getIPAddress, updateIPAddress } from "@/api/ip.api";
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
import Loader from "@/components/ui/loader";
import { toast, Toaster } from "react-hot-toast";

const isValidIP = (value: string) => {
    const ipv4 =
        /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
    const ipv6 =
        /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::1|::)$/;

    return ipv4.test(value) || ipv6.test(value);
};

const formSchema = z.object({
    ip_address: z.string().min(1).refine(isValidIP, {
        message: 'Invalid IP Address'
    }),
    label: z.string().min(1).max(255),
    comment: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const IPForm = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        reValidateMode: 'onSubmit'
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
                    toast.error(err.message);
                } else {
                    toast.error('Something went wrong');
                }
            }
        }

        fetchData();
    }, [id, isEditMode, form]);

    const onSubmit = form.handleSubmit(async (values: FormValues) => {
        setIsLoading(true);

        try {
            let res = null;
            if (isEditMode) {
                res = await updateIPAddress(Number(id), values);
                form.reset({
                    ip_address: res.data.ip_address,
                    label: res.data.label,
                    comment: res.data.comment ?? ""
                });
            } else {
                res = await createIPAddress(values);
                form.reset();
            }

            setIsLoading(false);
            toast.success(res.message);
        } catch (err){
            setIsLoading(false);
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error('Something went wrong');
            }
        }
    });

    return (
        <>
            <CardBox>
                <Toaster position="top-right" />
                <div className="mb-6">
                    <div>
                        <h3 className="text-xl font-semibold mb-2">{ isEditMode ? "Edit IP Address" : "Create IP Address" }</h3>

                        <FormProvider {...form}>
                            <form onSubmit={onSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="ip_address">IP Address <span className="text-red-600">*</span></Label>
                                        </div>
                                        <Input
                                            id="ip_address"
                                            {...form.register("ip_address")} 
                                            className="w-full form-control"
                                        />
                                        { form.formState.errors.ip_address && (
                                            <p className="mt-1 text-sm text-red-600">
                                                { form.formState.errors.ip_address.message }
                                            </p>
                                        ) }
                                    </div>

                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="label">Label <span className="text-red-600">*</span></Label>
                                        </div>
                                        <Input
                                            id="label"
                                            {...form.register("label")} 
                                            className="w-full form-control"
                                        />

                                        { form.formState.errors.label && (
                                            <p className="mt-1 text-sm text-red-600">
                                                { form.formState.errors.label.message }
                                            </p>
                                        ) }
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

                                        { form.formState.errors.comment && (
                                            <p className="mt-1 text-sm text-red-600">
                                                { form.formState.errors.comment.message }
                                            </p>
                                        ) }
                                    </div>
                                </div>
           
                                <div className="flex gap-3 mt-3">
                                    <Button
                                        className="rounded-md bg-primary text-white hover:bg-primary/90"
                                        disabled={isLoading}
                                        type="submit">
                                            { isLoading ? <Loader /> : 'Save' }
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