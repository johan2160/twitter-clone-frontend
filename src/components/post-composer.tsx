import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Image, Send } from "lucide-react"

export default function PostComposer() {
  const [postText, setPostText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async () => {
    if (!postText.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Reset form
    setPostText("")
    setIsSubmitting(false)
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full max-w-2xl px-4 lg:px-0">
      <div className="bg-sidebar/60 rounded-lg px-4 py-6 shadow-xs border border-border">
        <div className="flex items-start gap-3 mb-4">
          <div className="size-10 rounded-full bg-accent"></div>

          <div className="flex-1">
            <textarea
              className="w-full bg-transparent border-none outline-none resize-none text-base min-h-[60px]"
              placeholder="What's on your mind?"
              rows={3}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />
          </div>
        </div>

        <div className="h-px bg-border my-5" />

        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePhotoClick}
          >
            <Image className="h-5 w-5 mr-2" />
            Photo
          </Button>

          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />

          <Button
            variant="default"
            size="sm"
            disabled={!postText.trim() || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <span className="animate-pulse">Posting...</span>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Post
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

