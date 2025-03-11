import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { MessageCircle, Heart, Bookmark } from "lucide-react";

export default function Post() {
  return (
    <Card className="hover:bg-sidebar transition-colors">
      <CardHeader className="flex-row items-center">
        <div className="size-8 rounded-full bg-stone-200 dark:bg-stone-800"></div>
        <CardTitle>Shadow</CardTitle>
        <CardDescription className="text-sm">
          @shadowelkaiser - <span className="text-xs">8 min ago</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          The design maintains a clean and professional look while only
          displaying the fields we have in our current database schema.
        </p>
      </CardContent>
      <CardFooter className="gap-6">
        <Button className="flex gap-3 items-center" variant={"ghost"}>
          <MessageCircle size={16} />
          <span>24</span>
        </Button>
        <Button className="flex gap-3 items-center" variant={"ghost"}>
          <Heart size={16} />
          <span>24</span>
        </Button>
        <Button className="flex gap-3 items-center" variant={"ghost"}>
          <Bookmark size={16} />
          <span>24</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
