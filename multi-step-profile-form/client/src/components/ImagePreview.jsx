// client/src/components/ImagePreview.jsx
import React, { useState, useEffect } from "react";

const ImagePreview = ({ file }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (file && file instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    return () => setPreview(null);
  }, [file]);

  if (!preview) return null;

  return (
    <div className="image-preview">
      <img src={preview} alt="Profile preview" />
    </div>
  );
};

export default ImagePreview;
