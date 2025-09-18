import { XMarkIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useTranslation } from "../contexts/LanguageProvider";
import CustomDropdown from "../components/CustomDropdown";
import clsx from "clsx";
import { createPost } from "../Hooks/useSeller";

export default function CreatePostPopupModel({ isOpen, setIsOpen, onSuccess }) {
  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("BLOG_ARTICLE");
  const [brief, setBrief] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const typeOptions = [
    { label: t("create_post.form.type_blog") || "Blog Article", value: "BLOG_ARTICLE" },
    { label: t("create_post.form.type_update") || "Project Update", value: "PROJECT_UPDATE" },
    { label: t("create_post.form.type_bts") || "Behind The Scenes", value: "BEHIND_THE_SCENES" },
    { label: t("create_post.form.type_tutorial") || "Tutorial", value: "TUTORIAL" },
    { label: t("create_post.form.type_inspiration") || "Inspiration", value: "INSPIRATION" },
  ];

  const dropdownLabels = typeOptions.map((o) => o.label);

  function labelToValue(label) {
    const opt = typeOptions.find((o) => o.label === label);
    return opt ? opt.value : typeOptions[0].value;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!title?.trim()) {
      setError(t("create_post.errors.title_required") || "Title is required");
      return;
    }
    if (!content?.trim()) {
      setError(t("create_post.errors.content_required") || "Content is required");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("type", type);
      fd.append("dsc", brief);
      fd.append("content", content);
      fd.append("tags", tags);
      fd.append("image_url", imageUrl);

      const res = await createPost(fd);
      console.log("Post created:", res);
      if (typeof onSuccess === "function") onSuccess(res);
      setIsOpen(false);
      setTitle("");
      setBrief("");
      setContent("");
      setTags("");
      setImageUrl("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh] scrollbar-hide">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label={t("create_post.close")}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Header */}
        <h2 className="text-md font-semibold mb-4">{t("create_post.title") || "Create Post"}</h2>

        {/* Features */}
        <div className="bg-blue-50 text-gray-700 border border-blue-200 p-4 rounded-md mb-6">
          <p className="mb-1 font-semibold">{t("create_post.features.title") || "What you can do"}</p>
          <ul className="space-y-1 text-xs font-regular text-gray-500">
            <li>• {t("create_post.features.list1") || "Write posts"}</li>
            <li>• {t("create_post.features.list2") || "Add images"}</li>
            <li>• {t("create_post.features.list3") || "Add tags"}</li>
            <li>• {t("create_post.features.list4") || "Publish"}</li>
          </ul>
        </div>

        {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Post Title + Post Type in one row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium">{t("create_post.form.title_label") || "Title"}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("create_post.form.title_placeholder") || "Enter post title"}
                className="w-full border rounded-md p-2 mt-1 text-xs form-input"
                required
                aria-label={t("create_post.form.title_label")}
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1">{t("create_post.form.type_label") || "Type"}</label>
              <CustomDropdown
                options={dropdownLabels}
                value={typeOptions.find((o) => o.value === type)?.label}
                setValue={(selectedLabel) => {
                  const v = labelToValue(selectedLabel);
                  setType(v);
                }}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium">{t("create_post.form.brief_label") || "Brief"}</label>
            <input
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder={t("create_post.form.brief_placeholder") || "Short description"}
              className="w-full border rounded-md p-2 mt-1 text-xs form-input"
              aria-label={t("create_post.form.brief_label")}
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-xs font-medium">{t("create_post.form.content_label") || "Content"}</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("create_post.form.content_placeholder") || "Write your post content"}
              className="w-full border rounded-md p-2 mt-1 text-xs form-input"
              rows="4"
              required
              aria-label={t("create_post.form.content_label")}
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-xs font-medium">{t("create_post.form.tags_label") || "Tags"}</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder={t("create_post.form.tags_placeholder") || "tag1,tag2,tag3"}
              className="w-full border rounded-md p-2 mt-1 text-xs form-input"
              aria-label={t("create_post.form.tags_label")}
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-xs font-medium">{t("create_post.form.featured_image_label") || "Featured Image URL"}</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder={t("create_post.form.featured_image_placeholder") || "https://..."}
              className="w-full border rounded-md p-2 mt-1 text-xs form-input"
              aria-label={t("create_post.form.featured_image_label")}
              disabled={loading}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={clsx("flex-1 px-4 py-2 font-semibold border rounded-md text-xs hover:bg-gray-50", { "opacity-50 pointer-events-none": loading })}
            >
              {t("create_post.actions.cancel") || "Cancel"}
            </button>
            <button
              type="submit"
              className={clsx("flex-1 px-4 py-2 font-semibold bg-teal-500 text-white rounded-md text-xs hover:bg-teal-600", { "opacity-60 pointer-events-none": loading })}
            >
              {loading ? (t("create_post.actions.publishing") || "Publishing...") : t("create_post.actions.publish") || "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
