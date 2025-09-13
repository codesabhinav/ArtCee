import { XMarkIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "../contexts/LanguageProvider";

export default function CreatePostPopupModel({ isOpen, setIsOpen }) {
  const { t } = useTranslation();

  if (!isOpen) return null; // don’t render if closed

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
        <h2 className="text-md font-semibold mb-4">{t("create_post.title")}</h2>

        {/* Features */}
        <div className="bg-blue-50 text-sm text-gray-700 border border-blue-200 p-4 rounded-md mb-6">
          <p className="mb-1 font-semibold">{t("create_post.features.title")}</p>
          <ul className="space-y-1">
            <li>• {t("create_post.features.list1")}</li>
            <li>• {t("create_post.features.list2")}</li>
            <li>• {t("create_post.features.list3")}</li>
            <li>• {t("create_post.features.list4")}</li>
          </ul>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); /* handle publish */ }}>
          {/* Post Title + Post Type in one row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">{t("create_post.form.title_label")}</label>
              <input
                type="text"
                placeholder={t("create_post.form.title_placeholder")}
                className="w-full border rounded-md p-2 mt-1 text-sm form-input"
                required
                aria-label={t("create_post.form.title_label")}
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t("create_post.form.type_label")}</label>
              <select className="w-full border rounded-md p-2 mt-1 text-sm form-input" aria-label={t("create_post.form.type_label")}>
                <option>{t("create_post.form.type_blog")}</option>
                <option>{t("create_post.form.type_update")}</option>
                <option>{t("create_post.form.type_bts")}</option>
                <option>{t("create_post.form.type_tutorial")}</option>
                <option>{t("create_post.form.type_inspiration")}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">{t("create_post.form.brief_label")}</label>
            <input
              placeholder={t("create_post.form.brief_placeholder")}
              className="w-full border rounded-md p-2 mt-1 text-sm form-input"
              aria-label={t("create_post.form.brief_label")}
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t("create_post.form.content_label")}</label>
            <textarea
              placeholder={t("create_post.form.content_placeholder")}
              className="w-full border rounded-md p-2 mt-1 text-sm form-input"
              rows="4"
              required
              aria-label={t("create_post.form.content_label")}
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t("create_post.form.tags_label")}</label>
            <input
              type="text"
              placeholder={t("create_post.form.tags_placeholder")}
              className="w-full border rounded-md p-2 mt-1 text-sm form-input"
              aria-label={t("create_post.form.tags_label")}
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t("create_post.form.featured_image_label")}</label>
            <input
              type="text"
              placeholder={t("create_post.form.featured_image_placeholder")}
              className="w-full border rounded-md p-2 mt-1 text-sm form-input"
              aria-label={t("create_post.form.featured_image_label")}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 font-semibold border rounded-md text-xs hover:bg-gray-50"
            >
              {t("create_post.actions.cancel")}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 font-semibold bg-teal-500 text-white rounded-md text-xs hover:bg-teal-600"
            >
              {t("create_post.actions.publish")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
