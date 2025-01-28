"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { forgotPassword } from "./action";
import { useSearchParams } from "next/navigation";

const formSchema = z.object({
  email: z.string().email(),
});

export default function ForgotPassword() {
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setServerError(null);
    setIsLoading(true);

    try {
      const response = await forgotPassword({
        email: data.email,
      });

      if (response.error) {
        setServerError(response.message);
      } else {
        router.push("/forgot-password/confirmation");
      }
    } catch (error) {
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordForm
        form={form}
        handleSubmit={handleSubmit}
        serverError={serverError}
        isLoading={isLoading}
      />
    </Suspense>
  );
}

function ForgotPasswordForm({
  form,
  handleSubmit,
  serverError,
  isLoading,
}: {
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
  handleSubmit: (data: z.infer<typeof formSchema>) => Promise<void>;
  serverError: string | null;
  isLoading: boolean;
}) {
  const searchParams = useSearchParams();

  React.useEffect(() => {
    form.setValue("email", decodeURIComponent(searchParams.get("email") ?? ""));
  }, [searchParams, form]);

  return (
    <main className="flex bg-custom-gradient justify-center items-center min-h-screen">
      <Card className="w-[380px]">
        <CardHeader>
          <CardTitle className="text-white text-2xl">Password Reset</CardTitle>
          <CardDescription className="text-white text-sm">
            Enter your email address to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-2"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {serverError && (
                <p className="text-red-500 text-sm mt-2">{serverError}</p>
              )}
              <Button
                className="bg-blue-500 hover:bg-blue-500"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Forget password"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="text-muted-foreground text-sm">
            Remember your password?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
          <div className="text-muted-foreground text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="underline">
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
