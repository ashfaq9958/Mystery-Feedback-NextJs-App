"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { IMessage } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import {
  ClipboardCopy,
  Link,
  Loader2,
  MessageSquare,
  RefreshCcw,
  Settings,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const DashboardPage = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [isToggleLoading, setIsToggleLoading] = useState(false);
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message._id !== messageId)
    );
  };

  const fetchAcceptMessageSetting = useCallback(async () => {
    setIsToggleLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to load settings."
      );
    } finally {
      setIsToggleLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh = false) => {
      setIsMessageLoading(true);
      setIsToggleLoading(false);
      try {
        const response = await axios.get("/api/get-messages");
        setMessages(response.data?.messages || []);
        if (refresh) {
          toast.success("Messages refreshed", {
            description: "You are now viewing the latest messages.",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error("Failed to fetch messages", {
          description:
            axiosError.response?.data.message ||
            "An error occurred while loading messages.",
        });
      } finally {
        setIsMessageLoading(false);
        setIsToggleLoading(false);
      }
    },
    [setMessages]
  );

  useEffect(() => {
    if (!session?.user) return;
    fetchMessages();
    fetchAcceptMessageSetting();
  }, [session, fetchMessages, fetchAcceptMessageSetting]);

  const handleToggleAcceptMessages = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Failed to update setting", {
        description:
          axiosError.response?.data.message ||
          "Could not update message preferences.",
      });
    }
  };

  if (!session || !session.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Authentication Required
              </h3>
              <p className="text-gray-600">
                Please login to access your dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { username } = session?.user;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Copied Successfully", {
      description: "The profile link has been copied to your clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 mt-12">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage your anonymous messages and settings
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Link Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Link className="h-5 w-5" />
                Your Message Link
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={profileUrl}
                    disabled
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-mono text-gray-700 focus:outline-none"
                  />
                </div>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <ClipboardCopy className="h-4 w-4" />
                  Copy
                </Button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Share this link to receive anonymous messages
              </p>
            </CardContent>
          </Card>

          {/* Settings Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="h-5 w-5" />
                Message Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Accept Messages
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Allow others to send you anonymous messages
                  </p>
                </div>
                <Switch
                  {...register("acceptMessages")}
                  checked={acceptMessages}
                  onCheckedChange={handleToggleAcceptMessages}
                  disabled={isToggleLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Messages Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="h-5 w-5" />
                  Messages
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                  }}
                  disabled={isMessageLoading}
                  className="gap-2"
                >
                  {isMessageLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCcw className="h-4 w-4" />
                  )}
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isMessageLoading && messages.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <MessageCard
                      key={message._id}
                      message={message}
                      onMessageDelete={handleDeleteMessage}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    No messages yet
                  </h3>
                  <p className="text-sm text-gray-500">
                    Share your link to start receiving anonymous messages
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
