import CardBox from "@/components/shared/CardBox"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { z } from "zod";
import {zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import Loader from "@/components/ui/loader";
import { toast, Toaster } from "react-hot-toast";
import BreadcrumbComp from "@/layouts/shared/breadcrumbs";
import { createUser, getUser, updateUser } from "@/api/user.api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BCrumb = [
  {
    to: '/users',
    title: 'Users',
  },
  {
    title: 'User Form',
  },
];

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  role: z.enum(['admin', 'user'], { message: "Role must be 'admin' or 'user'" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
});

type FormValues = z.infer<typeof formSchema>;

const UserForm = () => {
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
                const data = await getUser(Number(id));
                form.reset({
                    name: data.name,
                    email: data.email,
                    role: data.role
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
                res = await updateUser(Number(id), values);
                form.reset({
                    name: res.data.name,
                    email: res.data.email,
                    role: res.data.role,
                    password: ''
                });
            } else {
                res = await createUser(values);
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
            <BreadcrumbComp title={ isEditMode ? "Edit User" : "Create User" } items={BCrumb} />
            <CardBox>
                <Toaster position="top-right" />
                <div className="mb-6">
                    <div>
                        <FormProvider {...form}>
                            <form onSubmit={onSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="name">Name <span className="text-red-600">*</span></Label>
                                        </div>
                                        <Input
                                            id="name"
                                            {...form.register("name")} 
                                            className="w-full form-control"
                                        />
                                        { form.formState.errors.name && (
                                            <p className="mt-1 text-sm text-red-600">
                                                { form.formState.errors.name.message }
                                            </p>
                                        ) }
                                    </div>

                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="email">Email <span className="text-red-600">*</span></Label>
                                        </div>
                                        <Input
                                            type="email"
                                            id="email"
                                            {...form.register("email")} 
                                            className="w-full form-control"
                                        />
                                        { form.formState.errors.email && (
                                            <p className="mt-1 text-sm text-red-600">
                                                { form.formState.errors.email.message }
                                            </p>
                                        ) }
                                    </div>

                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="password">Password <span className="text-red-600">*</span></Label>
                                        </div>
                                        <Input
                                            type="password"
                                            id="password"
                                            {...form.register("password")} 
                                            className="w-full form-control"
                                        />

                                        { form.formState.errors.password && (
                                            <p className="mt-1 text-sm text-red-600">
                                                { form.formState.errors.password.message }
                                            </p>
                                        ) }
                                    </div>

                                    <div>
                                        <div className="mb-2 block">
                                            <Label htmlFor="role">Role</Label>
                                        </div>
                                        <Controller 
                                            control={form.control}
                                            name="role"
                                            render={({ field }) => (
                                                <Select 
                                                    value={field.value}
                                                    onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full form-control">
                                                    <SelectValue placeholder="Select an option" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="user">User</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            )}
                                        />

                                        { form.formState.errors.role && (
                                            <p className="mt-1 text-sm text-red-600">
                                                { form.formState.errors.role.message }
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
                                        onClick={() => navigate('/users')}
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

export default UserForm;