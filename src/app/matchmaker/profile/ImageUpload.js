// app/matchmaker/profile/ImageUpload.js
import React from "react";
import { Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";

const ImageUpload = ({ imageUrl, onUpload, index }) => {
  const handleChange = (info) => {
    if (info.file.status === "done") {
      // Get this url from response in real world.
      const localImageUrl = URL.createObjectURL(info.file.originFileObj);
      console.log(localImageUrl);
      onUpload(localImageUrl, index, info.file.originFileObj);
    }
  };

  return (
    <ImgCrop
      rotationSlider
      aspect={9 / 16}
      modalTitle="Crop Image"
      cropShape="rect"
    >
      <Upload
        listType="picture-card"
        showUploadList={false}
        className="!important rounded-lg overflow-hidden"
        beforeUpload={(file) => {
          // Return false to prevent default upload behavior
          return false;
        }}
        onChange={handleChange}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Profile ${index + 1}`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>
    </ImgCrop>
  );
};

export default ImageUpload;
