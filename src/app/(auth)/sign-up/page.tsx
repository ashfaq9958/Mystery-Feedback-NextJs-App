"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";

import axios, { AxiosError } from "axios";
import { useDebounceCallback } from "usehooks-ts";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

const SignUpPage = () => {
  const router = useRouter();

  const [typedUsername, setTypedUsername] = useState("");
  const [usernameStatusMessage, setUsernameStatusMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const debouncedUsernameUpdate = useDebounceCallback(setTypedUsername, 500);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      const trimmed = typedUsername.trim();
      if (!trimmed) {
        setUsernameStatusMessage("Username is required");
        return;
      }

      setIsCheckingUsername(true);
      setUsernameStatusMessage("");

      try {
        const response = await axios.get<ApiResponse>(
          `/api/check-username?username=${trimmed}`
        );
        setUsernameStatusMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameStatusMessage(
          axiosError.response?.data.message || "Error checking username"
        );
      } finally {
        setIsCheckingUsername(false);
      }
    };

    checkUsernameAvailability();
  }, [typedUsername]);

  const handleFormSubmit = async (formData: z.infer<typeof signUpSchema>) => {
    setIsSubmittingForm(true);

    try {
      const response = await axios.post<ApiResponse>("/api/signup", formData);
      // toast.success(response.data.message);
      toast(response.data.message);
      router.replace(`/verify/${formData.username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data?.message || "Signup failed");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-gray-200">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-sm text-gray-500 mt-1">
            Join True Feedback to get started
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            {/* Username */}
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="yourusername"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debouncedUsernameUpdate(e.target.value);
                      }}
                      className="rounded-lg border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
                    />
                  </FormControl>
                  {isCheckingUsername && (
                    <div className="flex items-center gap-2 mt-1 text-sm text-black">
                      <LoaderCircle className="h-4 w-4 animate-spin text-black" />
                      Checking availability...
                    </div>
                  )}

                  {!isCheckingUsername &&
                    usernameStatusMessage &&
                    field.value && (
                      <p
                        className={`text-sm mt-1 ${
                          usernameStatusMessage === "Username is available"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {usernameStatusMessage}
                      </p>
                    )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                      className="rounded-lg border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      className="rounded-lg border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmittingForm}
              className="w-full bg-gray-900 text-white hover:bg-gray-800 transition rounded-lg text-sm py-3"
            >
              {isSubmittingForm ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-gray-900 font-medium hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
