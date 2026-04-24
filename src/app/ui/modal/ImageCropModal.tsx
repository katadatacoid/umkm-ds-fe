'use client';
import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';

interface ImageCropModalProps {
  imageSrc: string;
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
  originalFileName?: string;
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation: number,
  fileName: string
): Promise<File> {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => { image.onload = resolve; });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const rad = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const rotatedWidth = image.width * cos + image.height * sin;
  const rotatedHeight = image.width * sin + image.height * cos;

  // Canvas sementara untuk rotasi
  const rotCanvas = document.createElement('canvas');
  rotCanvas.width = rotatedWidth;
  rotCanvas.height = rotatedHeight;
  const rotCtx = rotCanvas.getContext('2d')!;
  rotCtx.translate(rotatedWidth / 2, rotatedHeight / 2);
  rotCtx.rotate(rad);
  rotCtx.drawImage(image, -image.width / 2, -image.height / 2);

  // Crop dari canvas yang sudah dirotasi
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.drawImage(
    rotCanvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Canvas kosong'));
      resolve(new File([blob], fileName, { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.9);
  });
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  imageSrc,
  onCropComplete,
  onCancel,
  originalFileName = 'cropped.jpg',
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropCompleteHandler = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels, rotation, originalFileName);
      onCropComplete(croppedFile);
    } catch (err) {
      console.error('Crop error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Rotate kiri/kanan 90 derajat
  const rotateLeft = () => setRotation((r) => (r - 90 + 360) % 360);
  const rotateRight = () => setRotation((r) => (r + 90) % 360);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col gap-4 p-6">
        <h3 className="text-base font-semibold text-gray-800">Crop Gambar (1:1)</h3>

        {/* Crop Area */}
        <div className="relative w-full bg-gray-900 rounded-md" style={{ height: '55vh' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropCompleteHandler}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-10 shrink-0">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-green-600"
            />
            <span className="text-xs text-gray-400 w-8 shrink-0">{zoom.toFixed(1)}x</span>
          </div>

          {/* Rotate Slider + Tombol */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-10 shrink-0">Putar</span>
            <button
              type="button"
              onClick={rotateLeft}
              className="px-2 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100 shrink-0"
              title="Putar kiri 90°"
            >
              ↺ 90°
            </button>
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full accent-green-600"
            />
            <button
              type="button"
              onClick={rotateRight}
              className="px-2 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100 shrink-0"
              title="Putar kanan 90°"
            >
              ↻ 90°
            </button>
            <span className="text-xs text-gray-400 w-8 shrink-0">{rotation}°</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center -mt-1">
          Geser gambar, zoom, dan putar sesuai kebutuhan
        </p>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isProcessing}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Memproses...' : 'Gunakan Foto'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;