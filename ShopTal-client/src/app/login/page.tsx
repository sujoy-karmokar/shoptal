import LoginForm from "@/components/login-page-components/LoginForm";
import Image from "next/image";
import { Card } from "@/components/shadcn-ui/card";
import { Suspense } from "react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col-reverse md:flex-row justify-around items-center gap-4 bg-white dark:bg-gray-950">
      <div className="hidden md:block">
        <Image
          src="/undraw_login.svg"
          alt="login image"
          width={420}
          height={420}
          className="opacity-90"
        />
      </div>
      <div className="max-w-md w-full ">
        <Card className="mx-auto p-5 border border-gray-100 dark:border-gray-800 shadow-none rounded-xl bg-white dark:bg-gray-950">
          <div className="grid gap-1 text-center mb-2">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
              Login
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enter your phone number and password below to login to your
              account
            </p>
          </div>
          <Suspense fallback={<></>}>
            <LoginForm />
          </Suspense>
          <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?
            <Link
              className="text-pink-600 hover:underline ml-1"
              href={"/signup"}
            >
              Register now
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
