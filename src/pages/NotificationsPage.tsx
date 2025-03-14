import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, UserPlus } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="flex justify-center h-full">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between p-4">
          <h1 className="font-medium">Notifications</h1>
          <p className="text-sm">0 unread</p>
        </div>
        {/* <NotificationCard /> */}
        <div className="flex flex-col p-4 gap-4">
          <Card className="w-full">
              <CardHeader className="flex-row items-center">
                <div className="size-8 bg-primary/10 rounded-full" />
                <CardTitle className="font-medium">@shadowelkaiser liked your post</CardTitle>
                <Heart width={16} />
              </CardHeader>
              <CardContent>
                <div className="bg-primary/20 rounded-sm p-2">
                  <p>Happy new year everyone! 🎆🥳</p>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs">16 hours ago</p>
              </CardFooter>
          </Card>
          <Card className="w-full">
              <CardHeader className="flex-row items-center">
                <div className="size-8 bg-primary/10 rounded-full" />
                <CardTitle className="font-medium">@shadowelkaiser started following you</CardTitle>
                <UserPlus width={16} />
              </CardHeader>
              <CardFooter>
                <p className="text-xs">16 hours ago</p>
              </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
