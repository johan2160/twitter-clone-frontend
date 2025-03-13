import Post from "@/components/post";

export default function BookmarksPage() {
  return (
    <div className="flex justify-center h-full">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between p-4">
          <h1 className="font-medium">Bookmarks</h1>
          <p className="text-sm">3 saved</p>
        </div>
        <div className="flex flex-col p-4 gap-4">
          <Post />
          <Post />
          <Post />
        </div>
      </div>
    </div>
  );
}
