import PostComposer from "@/components/post-composer";
import WhoToFollow from "@/components/who-to-follow";
import Post from "@/components/post";

export default function MainPage() {
  return (
    <div className="flex justify-center gap-8">
      <div className="flex flex-col items-center h-full">
        <PostComposer />
        <div className="w-full px-4 lg:px-0 max-w-2xl mt-8">
          <h1 className="font-medium text-sm text-foreground mb-2">Feed</h1>
          <div className="flex flex-col gap-8">
            <Post />
            <Post />
          </div>
        </div>
      </div>
      <WhoToFollow />
    </div>
  );
}
