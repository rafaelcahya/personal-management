"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getUser, updateUser, uploadAvatar } from "@/lib/api/user";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
    const [loading, setLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const inputRef = useRef(null);

    const form = useForm({ defaultValues: { username: "", nickname: "" } });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const data = await getUser();
            form.setValue("username", data?.user?.username || "");
            form.setValue("nickname", data?.user?.nickname || "");
            if (data?.user?.avatar) {
                const avatarUrl =
                    typeof data.user.avatar === "string"
                        ? data.user.avatar
                        : data.user.avatar.url;
                setAvatarPreview(avatarUrl);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleFileChange = (file) => {
        if (!file) return;
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const onSubmit = async (values) => {
        setLoading(true);
        try {
            let avatarPath = avatarFile
                ? (await uploadAvatar(avatarFile)).path
                : null;

            await updateUser({
                username: values.username,
                nickname: values.nickname,
                avatar: avatarPath,
            });

            await fetchUserData();

            toast.success("Profile updated successfully");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full max-w-lg">
            <div className="px-5 py-4">
                <p className="font-semibold">Profile</p>
                <p className="text-sm font-medium text-slate-foreground">
                    Update your profile to keep your account info accurate.
                </p>
            </div>

            <Separator />

            <Form {...form} asChild>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col justify-between h-full"
                >
                    <div className="flex-1 px-5 py-4 space-y-6 overflow-y-auto">
                        <FormItem>
                            <Label className="font-medium">Avatar</Label>
                            <div className="flex items-center space-x-4">
                                <div
                                    className="w-16 h-16 rounded-full overflow-hidden cursor-pointer bg-gray-200 flex items-center justify-center"
                                    onClick={() => inputRef.current?.click()}
                                >
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt="avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-white font-bold text-xl">
                                            +
                                        </span>
                                    )}
                                </div>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={inputRef}
                                    onChange={(e) =>
                                        handleFileChange(e.target.files[0])
                                    }
                                />
                            </div>
                        </FormItem>

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <Label
                                        htmlFor="username"
                                        className="font-medium"
                                    >
                                        Username
                                    </Label>
                                    <Input
                                        id="username"
                                        className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                                        {...field}
                                    />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="nickname"
                            render={({ field }) => (
                                <FormItem>
                                    <Label
                                        htmlFor="nickname"
                                        className="font-medium"
                                    >
                                        Nickname
                                    </Label>
                                    <Input
                                        id="nickname"
                                        className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                                        {...field}
                                    />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end gap-2 border-t px-5 py-3 bg-background">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary-hover font-medium"
                        >
                            {loading ? "Saving..." : "Save Profile"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
