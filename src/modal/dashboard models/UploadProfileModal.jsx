import React, { useEffect, useState } from "react";
import { FaTimes, FaCloudUploadAlt } from "react-icons/fa";
import { getGuestDashboardData } from "../../Hooks/useSeller";
import { uploadProfileMedia } from "../../Hooks/useDashboard";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"];
const MAX_SIZE_BYTES = 8 * 1024 * 1024;

const UploadProfileModal = ({ isOpen, onClose, uuid, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setPreviewUrl(null);
      setError(null);
      setLoading(false);
      setProgress(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileSelect = (f) => {
    if (!f) return;
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setError("Unsupported file type");
      return;
    }
    if (f.size > MAX_SIZE_BYTES) {
      setError("File too large (max 8MB)");
      return;
    }
    setFile(f);
    setError(null);
  };

  const handleUpload = async () => {
    if (!uuid) {
      setError("Missing user id");
      return;
    }
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const result = await uploadProfileMedia({
        uuid,
        file,
        onProgress: setProgress,
      });

      await getGuestDashboardData();

      onUploaded?.(result);
      onClose();
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-auto max-h-[90vh]">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Upload Profile Image / Video</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <FaTimes />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Drop zone */}
          <label className="border-dashed border-2 border-gray-200 rounded-md p-6 text-center cursor-pointer block">
            <input
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              onChange={(e) => handleFileSelect(e.target.files[0])}
              className="hidden"
            />
            <FaCloudUploadAlt className="text-3xl text-gray-400 mx-auto mb-2" />
            <p className="text-xs">Click to select or drag & drop</p>
          </label>

          {/* Preview */}
          {previewUrl && (
            <div className="rounded-md border p-2">
              {file.type.startsWith("image/") ? (
                <img src={previewUrl} alt="preview" className="max-h-56 mx-auto object-contain" />
              ) : (
                <video src={previewUrl} className="max-h-56 mx-auto" controls />
              )}
            </div>
          )}

          {/* Progress */}
          {loading && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-teal-500 h-2 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {error && <div className="text-xs text-red-600">{error}</div>}

          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 border rounded text-xs">
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className="px-4 py-2 bg-teal-500 text-white rounded text-xs disabled:opacity-60"
            >
              {loading ? `Uploading ${progress}%` : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadProfileModal;
