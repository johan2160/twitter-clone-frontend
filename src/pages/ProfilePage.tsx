"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {

  return (
    <div className="flex justify-center bg-background min-h-screen text-foreground">
      <div className="w-full max-w-2xl py-8 px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <Avatar className="w-24 h-24 border-2 border-border">
            <AvatarImage src="" alt="Profile picture" />
            <AvatarFallback className="bg-muted"></AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1">
            <h1 className="text-2xl font-bold">Johan Carrasco</h1>
            <p className="text-muted-foreground">@johandev21</p>
            <p className="text-muted-foreground text-sm">Member since February 10th of 2020</p>
            <div className="flex gap-2.5">
              <p className="text-muted-foreground text-sm">3 Following</p> 
              <p className="text-muted-foreground text-sm">3 Followers</p>
            </div>
          </div>

          <Button variant="outline" className="rounded-full px-6">
            Edit profile
          </Button>
        </div>

        <Tabs defaultValue="post" className="w-full">
          <TabsList className="w-full bg-transparent border-b border-border rounded-none h-auto p-0 flex justify-between">
            <TabsTrigger
              value="post"
              className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent py-3 bg-transparent text-center hover:bg-accent transition-colors"
            >
              Post
            </TabsTrigger>
            <TabsTrigger
              value="responses"
              className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent py-3 bg-transparent text-center hover:bg-accent transition-colors"
            >
              Responses
            </TabsTrigger>
            <TabsTrigger
              value="media"
              className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent py-3 bg-transparent text-center hover:bg-accent transition-colors"
            >
              Media
            </TabsTrigger>
            <TabsTrigger
              value="likes"
              className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent py-3 bg-transparent text-center hover:bg-accent transition-colors"
            >
              Likes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="post" className="pt-6">
            {/* Post content would go here */}
            <div className="p-4 border border-border rounded-lg bg-card">
              <p className="text-card-foreground">Your posts will appear here.</p>
            </div>
          </TabsContent>
          <TabsContent value="responses" className="pt-6">
            <div className="p-4 border border-border rounded-lg bg-card">
              <p className="text-card-foreground">Your responses will appear here.</p>
            </div>
          </TabsContent>
          <TabsContent value="media" className="pt-6">
            <div className="p-4 border border-border rounded-lg bg-card">
              <p className="text-card-foreground">Your media will appear here.</p>
            </div>
          </TabsContent>
          <TabsContent value="likes" className="pt-6">
            <div className="p-4 border border-border rounded-lg bg-card">
              <p className="text-card-foreground">Your likes will appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

