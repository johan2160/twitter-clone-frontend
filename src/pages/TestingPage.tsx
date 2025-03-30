import { TweetTester } from "@/components/testing/TweetTester";
import { ResponseTester } from "@/components/testing/ResponseTester";
import { UserTester } from "@/components/testing/UserTester";
import { LikeTester } from "@/components/testing/LikeTester";
import { FollowTester } from "@/components/testing/FollowTester";
import { BookmarkTester } from "@/components/testing/BookmarkTester";
import { Separator } from "@/components/ui/separator";

export default function TestingPage() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-5xl py-12 px-4 md:px-6 lg:px-8 space-y-16">
        <TweetTester />
        <Separator className="my-12 border-t-2 border-dashed" />

        <ResponseTester />
        <Separator className="my-12 border-t-2 border-dashed" />

        <UserTester />
        <Separator className="my-12 border-t-2 border-dashed" />

        <LikeTester />
        <Separator className="my-12 border-t-2 border-dashed" />

        <FollowTester />
        <Separator className="my-12 border-t-2 border-dashed" />

        <BookmarkTester />
      </div>
    </div>
  );
}
