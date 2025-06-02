"use client";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { IMessage } from "@/model/User";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";

type MessageCardProps = {
  message: IMessage;
  onMessageDelete: (messageId: string) => void;
};

const formatDate = (date: any) => {
  return new Date(date).toLocaleString(); // Simple formatting
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleMessageDelete = async () => {
    if (!message._id) return;
    try {
      setIsDeleting(true);
      const response = await axios.delete(`/api/delete-message/${message._id}`);
      toast.success(response.data.message);
      onMessageDelete(message._id);
    } catch (error) {
      toast.error("Failed to delete the message.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
      <CardContent className="pt-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 leading-relaxed break-words">
              {message.content}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {formatDate(message.createdAt)}
            </p>
          </div>

          {/* Delete Button with Confirmation */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this message?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action is irreversible. Are you sure you want to delete it?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleMessageDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
