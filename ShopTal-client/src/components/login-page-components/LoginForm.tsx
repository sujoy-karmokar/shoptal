"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn-ui/form";
import { Input } from "../shadcn-ui/input";
import { Button } from "../shadcn-ui/button";
import { Switch } from "../shadcn-ui/switch";

// Form validation schema
const loginSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(10, "Phone number must not exceed 10 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const destination = callbackUrl || (isAdmin ? "/dashboard" : "/profile");

  const form = useForm<LoginFormData, any, LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const formatPhoneNumber = (phone: string): string => {
    // Assuming the backend expects the format xxx-xxx-xxxx
    return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        phone: formatPhoneNumber(data.phone),
        password: data.password,
        callbackUrl: destination,
      });

      if (result?.error) {
        const errorMessage = "Invalid phone number or password.";
        setError(errorMessage);
        toast.error(errorMessage);
      } else if (result?.ok) {
        toast.success("Login successful!");
      }
    } catch (err) {
      const errorMessage = "An unexpected error occurred during login.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setIsAdmin(checked);
    // Pre-fill form with test credentials for convenience
    form.reset({
      phone: checked ? "1234567890" : "9876543210",
      password: checked ? "test@123" : "123456",
    });
  };

  return (
    <div className="animate-fadein">
      <div className="flex items-center space-x-2 mb-3">
        <Switch
          id="login-role"
          checked={isAdmin}
          onCheckedChange={handleSwitchChange}
          className="scale-90"
        />
        <label htmlFor="login-role" className="ml-2 text-xs text-pink-600">
          {isAdmin ? "Admin" : "Customer"}
        </label>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Phone</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="1234567890"
                    {...field}
                    disabled={isLoading}
                    className="rounded-md border border-gray-200 dark:border-gray-800 text-sm placeholder:opacity-50"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••"
                    {...field}
                    disabled={isLoading}
                    className="rounded-md border border-gray-200 dark:border-gray-800 text-sm placeholder:opacity-50"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-50 hover:bg-pink-100 text-pink-600 font-semibold rounded-md shadow-none border border-pink-100 hover:border-pink-400 text-sm py-2 transition-colors duration-150"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
      <style jsx global>{`
        .animate-fadein {
          animation: fadein 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadein {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
