import { AppSidebar } from "@/components/app-sidebar";
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
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Bookmark, Heart, MessageCircle } from "lucide-react";

export default function MainPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="flex justify-center h-full">
          <div className="w-full px-4 lg:px-0 lg:max-w-2xl">
            <h1 className="text-xl text-foreground my-4">Feed</h1>
            <div className="flex flex-col gap-8">
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
                    The design maintains a clean and professional look while
                    only displaying the fields we have in our current database
                    schema.
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
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
