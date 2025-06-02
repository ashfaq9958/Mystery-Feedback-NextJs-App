'use client'

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, MessageCircle, Send, Shield, User } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const AnonymousMessagePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const { username } = useParams<{ username: string }>();
  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const maxCharacters = 500;
  const characterCount = messageContent?.length || 0;

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });
      toast.success(response.data.message);
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? "Message sending failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedMessages = [
    "You're doing amazing! Keep up the great work! 🌟",
    "I really admire your creativity and passion 💡",
    "Your positive energy brightens everyone's day ☀️",
    "Thank you for being such an inspiration! 🙏",
    "You have a unique talent that deserves recognition 🎨",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-inter relative mt-18">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: "4s" }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-2xl animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 animate-scale-in">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3">
              Send Anonymous Message
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Share your thoughts with <span className="font-semibold text-blue-600">@{username}</span> anonymously
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Your identity is completely protected</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-6 animate-scale-in">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <User className="w-5 h-5" /> Your Anonymous Message
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            placeholder="Write your anonymous message here... Be kind 💝"
                            className="resize-none min-h-[120px] text-base border-2 border-gray-200 focus:border-blue-400 rounded-xl bg-white/50 transition-all duration-300"
                            {...field}
                          />
                          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                            {characterCount}/{maxCharacters}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={isLoading || !messageContent || characterCount < 10}
                    className="px-8 py-3 text-lg rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" /> Send Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 animate-scale-in">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Need inspiration? Try these:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestedMessages.map((msg, idx) => (
                <button
                  key={idx}
                  onClick={() => handleMessageClick(msg)}
                  className="text-left p-3 rounded-xl bg-white/60 hover:bg-white/80 border border-gray-200 hover:border-blue-300 transition-all duration-300 text-sm text-gray-700 hover:text-gray-900 hover:shadow-md transform hover:scale-105"
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center mt-8 text-sm text-gray-500">
            <p>Messages are sent anonymously. Please be respectful.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnonymousMessagePage;