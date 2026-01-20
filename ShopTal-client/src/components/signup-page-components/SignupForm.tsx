"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { toast } from "sonner";

const formSchema = z.object({
  phone: z.string().min(10, {
    message: "10 digit phone number required",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  address: z.string({
    message: "Address is required",
  }),
});

export default function SignupForm() {
  const form = useForm<z.infer<typeof formSchema>, any, z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      password: "",
    },
  });
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const phone = `${values.phone.slice(0, 3)}-${values.phone.slice(
      3,
      6
    )}-${values.phone.slice(6, 10)}`;
    const password = values.password;
    const firstName = values.firstName;
    const lastName = values.lastName;
    const email = values.email;
    const address = values.address;
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          address,
          password,
        }),
      });

      if (response.ok) form.reset();

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to process request");
      }

      const responseData = await response.json();
      toast.info(responseData.message + " " + "Now you can login!", {
        duration: 4000,
      });
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.message, { duration: 960 });
    }
  };
  return (
    <div className="animate-fadein">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="min-w-40 md:min-w-52">
                <FormLabel className="text-xs">First Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="John"
                    {...field}
                    className="rounded-md border border-gray-200 dark:border-gray-800 text-sm placeholder:opacity-50"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="min-w-40 md:min-w-52">
                <FormLabel className="text-xs">Last Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Doe"
                    {...field}
                    className="rounded-md border border-gray-200 dark:border-gray-800 text-sm placeholder:opacity-50"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="min-w-40 md:min-w-52">
                <FormLabel className="text-xs">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="johndoe@example.com"
                    {...field}
                    className="rounded-md border border-gray-200 dark:border-gray-800 text-sm placeholder:opacity-50"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="min-w-40 md:min-w-52">
                <FormLabel className="text-xs">Phone</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="1234567890"
                    {...field}
                    className="rounded-md border border-gray-200 dark:border-gray-800 text-sm placeholder:opacity-50"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="min-w-40 md:min-w-52">
                <FormLabel className="text-xs">Address</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="123 Main St"
                    {...field}
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
              <FormItem className="min-w-40 md:min-w-52">
                <FormLabel className="text-xs">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="******"
                    {...field}
                    className="rounded-md border border-gray-200 dark:border-gray-800 text-sm placeholder:opacity-50"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <Button
            className="w-full bg-pink-50 hover:bg-pink-100 text-pink-600 font-semibold rounded-md shadow-none border border-pink-100 hover:border-pink-400 text-sm py-2 transition-colors duration-150 md:col-span-2"
            type="submit"
          >
            Submit
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
