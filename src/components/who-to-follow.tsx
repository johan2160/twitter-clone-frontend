import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface SuggestedUser {
  name: string
  username: string
  followers: number
  initials: string
}

const suggestedUsers: SuggestedUser[] = [
  {
    name: "Jack Smith",
    username: "@jacksmith",
    followers: 0,
    initials: "JS",
  },
  {
    name: "As a Programmer",
    username: "@asaprogrammerr",
    followers: 0,
    initials: "AP",
  },
  {
    name: "Bob Doe",
    username: "@bobdoe",
    followers: 0,
    initials: "BD",
  },
]

export default function WhoToFollow() {
  return (
    <Card className="w-full max-w-xs mx-4 h-fit hidden lg:block">
      <CardHeader className="pb-3">
        <h3 className="text-lg font-semibold">Who to Follow</h3>
      </CardHeader>
      <CardContent className="grid gap-4">
        {suggestedUsers.map((user) => (
          <div key={user.username} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-accent">{user.initials}</AvatarFallback>
              </Avatar>
              <div className="grid gap-0.5">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.username}</span>
                <span className="text-xs text-muted-foreground">{user.followers} followers</span>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="ml-auto">
              Follow
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

