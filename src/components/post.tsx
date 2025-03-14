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
import { useState } from "react";

export default function Post() {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  return (
    <Card>
      <CardHeader className="flex-row items-center">
        <div className="size-8 rounded-full bg-accent"></div>
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
        <Button className="flex gap-3 items-center" variant={"ghost"} onClick={() => setIsLiked(!isLiked)}>
          <Heart size={16} className={ isLiked ? 'text-red-500': 'text-inherit' }/>
          <span>24</span>
        </Button>
        <Button className="flex gap-3 items-center" variant={"ghost"} onClick={() => setIsSaved(!isSaved)} >
          <Bookmark size={16} className={ isSaved ? 'text-green-500': 'text-inherit' }/>
          <span>24</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
