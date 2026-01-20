"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn-ui/avatar";
import { Button } from "@/components/shadcn-ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { Input } from "@/components/shadcn-ui/input";
import { Label } from "@/components/shadcn-ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn-ui/tabs";
import SignOutButton from "@/components/shared-components/SignOutButton";
import { Loader2, Settings, User } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// Define types
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
}

interface ApiResponse {
  data: {
    name: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    avatar: "/placeholder.svg",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const { data: session, status } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const getProfile = useCallback(
    async (accessToken: string) => {
      setIsLoading(true);
      try {
        setError("");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = (await response.json()) as ApiResponse;
        const profileData = {
          avatar: data?.data.name || "/avatar.webp",
          email: data?.data.email || "",
          firstName: data?.data.firstName || "",
          lastName: data?.data.lastName || "",
        };
        setUser(profileData);
        reset(profileData);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Something went wrong";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [reset]
  );

  useEffect(() => {
    if (status === "authenticated" && session?.user?.accessToken) {
      getProfile(session.user.accessToken);
    }
  }, [status, session, getProfile]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const onSubmit = async (formData: ProfileFormData) => {
    if (!session?.user?.accessToken) {
      toast.error("Authentication token not found. Please log in again.");
      return;
    }

    try {
      setIsUpdating(true);
      setError("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setUser((prev) => ({ ...prev, ...formData }));
      toast.success("Profile updated successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container min-h-[70vh] mx-auto py-8 px-2">
      <h1 className="text-xl font-bold mb-5 tracking-tight text-primary">
        My Profile
      </h1>

      {error && (
        <div className="mb-5 p-3 bg-red-50 text-red-600 rounded text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1 border border-pink-100 shadow-none rounded-xl">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-primary">
              User Info
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="w-20 h-20 mb-3">
              <AvatarImage
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
              />
              <AvatarFallback>
                {user.firstName && user.lastName
                  ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                  : ""}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-semibold text-primary mb-1">
              {`${user.firstName} ${user.lastName}`}
            </h2>
            <p className="text-xs text-muted-foreground mb-2">{user.email}</p>

            <Link href="/profile/orders">
              <Button size="sm" variant="outline" className="mt-2 w-full">
                My Orders
              </Button>
            </Link>

            {session?.user?.role === "admin" && (
              <Link className="mt-2" href="/dashboard">
                <Button size="sm" variant="outline">
                  Admin Dashboard
                </Button>
              </Link>
            )}

            <SignOutButton className="mt-2 w-full" />
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 border border-pink-100 shadow-none rounded-xl">
          <Tabs defaultValue="details">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details" className="text-sm">
                  <User className="mr-2 h-4 w-4" />
                  Details
                </TabsTrigger>
                <TabsTrigger value="settings" className="text-sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="details">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  <div>
                    <Label htmlFor="firstName" className="text-xs">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      {...register("firstName")}
                      disabled={isUpdating}
                      aria-invalid={!!errors.firstName}
                      className="text-sm"
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-xs">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      {...register("lastName")}
                      disabled={isUpdating}
                      aria-invalid={!!errors.lastName}
                      className="text-sm"
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-xs">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      disabled={isUpdating}
                      aria-invalid={!!errors.email}
                      className="text-sm"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full text-sm"
                  >
                    {isUpdating && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isUpdating ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="settings">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <h3 className="font-medium text-sm">
                        Email Notifications
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Receive emails about your account activity
                      </p>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      Manage
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <h3 className="font-medium text-sm">Password</h3>
                      <p className="text-xs text-muted-foreground">
                        Change your password
                      </p>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      Update
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <h3 className="font-medium text-sm">
                        Two-Factor Authentication
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      Enable
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
