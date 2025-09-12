import { XMarkIcon, PencilIcon } from "@heroicons/react/24/outline";

export default function CreatePostPopupModel({ isOpen, setIsOpen }) {
  if (!isOpen) return null; // don’t render if closed

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh] scrollbar-hide">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Header */}
        <h2 className="text-md font-semibold mb-4">Create New Post</h2>

        {/* Features */}
        <div className="bg-blue-50 text-sm text-gray-700 border border-blue-200 p-4 rounded-md mb-6">
          <p className="mb-1 font-semibold">Free Account Features</p>
          <ul className="space-y-1">
            <li>• Unlimited blog posts and content uploads</li>
            <li>• Portfolio showcasing with unlimited images & videos</li>
            <li>• Share your creative process and insights</li>
            <li>• Build your personal brand and attract clients</li>
          </ul>
        </div>

        {/* Form */}
        <form className="space-y-4">
          {/* Post Title + Post Type in one row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Post Title *</label>
              <input
                type="text"
                placeholder="Enter post title..."
                className="w-full border rounded-md p-2 mt-1 text-sm form-input"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Post Type</label>
              <select className="w-full border rounded-md p-2 mt-1 text-sm form-input">
                <option>Blog Article</option>
                <option>Project Update</option>
                <option>Behind The Scenes</option>
                <option>Tutorial</option>
                <option>Inspiration</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Brief Description</label>
            <input
              placeholder="Brief description of your post..."
              className="w-full border rounded-md p-2 mt-1 text-sm form-input"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Content *</label>
            <textarea
              placeholder="Write your post content here..."
              className="w-full border rounded-md p-2 mt-1 text-sm form-input"
              rows="4"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Tags</label>
            <input
              type="text"
              placeholder="design, branding, tutorial (comma separated)"
              className="w-full border rounded-md p-2 mt-1 text-sm form-input"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Featured Image URL</label>
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              className="w-full border rounded-md p-2 mt-1 text-sm form-input"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 font-semibold border rounded-md text-xs hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 font-semibold bg-teal-500 text-white rounded-md text-xs hover:bg-teal-600"
            >
              Publish Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
