import SignupForm from "@/components/signup-page-components/SignupForm";
import Image from "next/image";
import { Card } from "@/components/shadcn-ui/card";
import Link from "next/link";
import { Suspense } from "react";

export default function SignupPage() {
  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col-reverse md:flex-row justify-around items-center gap-4 bg-white dark:bg-gray-950">
      <div className="hidden md:block">
        <Image
          src="/undraw_sign_up.svg"
          alt="signup page image"
          width={420}
          height={420}
          className="opacity-90"
        />
      </div>
      <div className="max-w-md w-full ">
        <Card className="mx-auto p-5 border border-gray-100 dark:border-gray-800 shadow-none rounded-xl bg-white dark:bg-gray-950">
          <div className="grid gap-1 text-center mb-2">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
              Signup
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Fill up the form to sign up
            </p>
          </div>
          <Suspense fallback={<></>}>
            <SignupForm />
          </Suspense>
          <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
            Have an account?
            <Link
              className="text-pink-600 hover:underline ml-1"
              href={"/login"}
            >
              Login now
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
