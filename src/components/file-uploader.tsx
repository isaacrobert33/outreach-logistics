/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import {
  Dropzone,
  FileMosaic,
  FullScreen,
  ImagePreview,
  VideoPreview,
  ExtFile,
} from "@files-ui/react";
import React, { useEffect, useRef, useState } from "react";

const MAX_FILE_SIZE = 100 * 1024 * 1024;

const FileUpload = ({
  uploadUrl,
  onUploadFinish,
  onUploadStart = () => {},
  onFileExist,
  maxFiles = 15,
  behaviour = "add"
}: {
  uploadUrl: string;
  onUploadFinish?: (uploadedFiles: ExtFile[]) => void;
  onUploadStart?: () => void;
  onFileExist?: (exist:boolean) => void;
  maxFiles?: number;
  behaviour?: "replace" | "add";
}) => {
  const fileInputRef = useRef<HTMLDivElement>(null);
  const [extFiles, setExtFiles] = useState<ExtFile[]>([]);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [videoSrc, setVideoSrc] = useState<File | string | undefined>(
    undefined
  );

  const updateFiles = (incomingFiles: ExtFile[]) => {
    setExtFiles(incomingFiles);
    if (incomingFiles.length > maxFiles) {
      setExtFiles(incomingFiles.slice(0, maxFiles));
    }
    if (onFileExist) {
      onFileExist(incomingFiles.length > 0);
    }
  };
  const onDelete = (id: string | number | undefined) => {
    setExtFiles(extFiles.filter((x) => x.id !== id));
  };
  const handleSee = (imageSource: string | undefined) => {
    setImageSrc(imageSource);
  };

  const handleWatch = (videoSource: File | string | undefined) => {
    setVideoSrc(videoSource);
  };
  const handleFinish = (uploadedFiles: object[]) => {
    if (!onUploadFinish) return;
    onUploadFinish(uploadedFiles);
  };
  const handleAbort = (id: string | number | undefined) => {
    setExtFiles(
      extFiles.map((ef) => {
        if (ef.id === id) {
          return { ...ef, uploadStatus: "aborted" };
        } else return { ...ef };
      })
    );
  };
  const handleCancel = (id: string | number | undefined) => {
    setExtFiles(
      extFiles.map((ef) => {
        if (ef.id === id) {
          return { ...ef, uploadStatus: undefined };
        } else return { ...ef };
      })
    );
  };

  // const handleUpload = () => {
  //   if (fileInputRef.current) {
  //     fileInputRef.current.upload();
  //   }
  // }

  useEffect(() => {
    console.log(fileInputRef.current);
  }, [fileInputRef]);

  return (
    <div className="flex flex-col items-center w-full z-12">
      <Dropzone
        ref={fileInputRef}
        color={"#3a96cb"}
        onChange={updateFiles}
        minHeight="195px"
        value={extFiles}
        accept="image/*"
        maxFiles={maxFiles}
        maxFileSize={MAX_FILE_SIZE}
        label="Drag'n drop files here or click to browse"
        behaviour={behaviour}
        uploadConfig={{
          // autoUpload: true
          url: uploadUrl,
          cleanOnUpload: true,
          
        }}
        onUploadStart={onUploadStart}
        onUploadFinish={handleFinish}
        actionButtons={{
          position: "after",
          abortButton: { className: "!bg-primary" },
          // deleteButton: { className: "!bg-red-600" },
          uploadButton: { className: "!bg-primary" },
        }}
      >
        {extFiles.map((file) => (
          <FileMosaic
            {...file}
            key={file.id}
            onDelete={onDelete}
            onSee={handleSee}
            onWatch={handleWatch}
            onAbort={handleAbort}
            onCancel={handleCancel}
            resultOnTooltip
            alwaysActive
            preview
            info
          />
        ))}
      </Dropzone>
      <FullScreen
        open={imageSrc !== undefined}
        onClose={() => setImageSrc(undefined)}
      >
        <ImagePreview src={imageSrc} />
      </FullScreen>
      <FullScreen
        open={videoSrc !== undefined}
        onClose={() => setVideoSrc(undefined)}
      >
        <VideoPreview src={videoSrc} autoPlay controls />
      </FullScreen>
    </div>
  );
};

export default FileUpload;
