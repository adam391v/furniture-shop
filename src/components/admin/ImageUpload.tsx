'use client';

// ============================================================
// ImageUpload Component - Upload ảnh bằng file
// Hỗ trợ: preview, drag & drop, multiple files
// Dùng chung cho Product, Category, Banner
// ============================================================

import { useState, useRef, useCallback } from 'react';
import { Upload, X, ImageIcon, Loader2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  /** Danh sách URL ảnh hiện tại */
  images: string[];
  /** Callback khi thay đổi danh sách ảnh */
  onChange: (images: string[]) => void;
  /** Số ảnh tối đa */
  maxFiles?: number;
  /** Cho phép upload nhiều ảnh */
  multiple?: boolean;
  /** Label hiển thị */
  label?: string;
}

const ImageUpload = ({
  images,
  onChange,
  maxFiles = 10,
  multiple = true,
  label = 'Hình ảnh',
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Upload files lên server
  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      if (fileArray.length === 0) return;

      // Kiểm tra số lượng
      if (images.length + fileArray.length > maxFiles) {
        toast.error(`Tối đa ${maxFiles} ảnh`);
        return;
      }

      setUploading(true);
      try {
        const formData = new FormData();
        fileArray.forEach((file) => formData.append('files', file));

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Upload thất bại');
        }

        const data = await res.json();
        const newUrls: string[] = data.urls;
        onChange([...images, ...newUrls]);
        toast.success(`Đã upload ${newUrls.length} ảnh`);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Lỗi upload';
        toast.error(message);
      } finally {
        setUploading(false);
      }
    },
    [images, maxFiles, onChange]
  );

  // Xóa ảnh
  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  // Di chuyển ảnh (đưa lên đầu)
  const moveToFirst = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    const [moved] = newImages.splice(index, 1);
    newImages.unshift(moved);
    onChange(newImages);
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      uploadFiles(e.target.files);
      e.target.value = ''; // Reset input
    }
  };

  // Drag & Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-navy mb-2">{label}</label>

      {/* Grid ảnh đã upload */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mb-3">
          {images.map((url, i) => (
            <div
              key={`${url}-${i}`}
              className="relative aspect-square rounded-lg overflow-hidden bg-bg-secondary group border border-border-light"
            >
              <img src={url} alt={`Ảnh ${i + 1}`} className="w-full h-full object-cover" />

              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => moveToFirst(i)}
                    className="p-1.5 bg-white rounded-full text-navy hover:text-primary transition-colors"
                    title="Đặt làm ảnh chính"
                  >
                    <GripVertical size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="p-1.5 bg-white rounded-full text-red hover:text-red-dark transition-colors"
                  title="Xóa ảnh"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Badge ảnh chính */}
              {i === 0 && (
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-primary text-white text-[10px] rounded font-medium">
                  Ảnh chính
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dropzone */}
      {images.length < maxFiles && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all',
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-bg-secondary',
            uploading && 'pointer-events-none opacity-60'
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple={multiple}
            onChange={handleFileChange}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={28} className="animate-spin text-primary" />
              <span className="text-sm text-text-secondary">Đang upload...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload size={20} className="text-primary" />
              </div>
              <p className="text-sm font-medium text-navy">
                Kéo thả ảnh vào đây hoặc <span className="text-primary">chọn file</span>
              </p>
              <p className="text-xs text-text-muted">
                JPG, PNG, WebP, GIF • Tối đa 5MB • Còn lại {maxFiles - images.length} ảnh
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
