import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  Label,
  Button,
  Alert,
  Spinner,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import {
  fetchLeadAttachments,
  uploadLeadAttachment,
  deleteLeadAttachment,
  selectLeadAttachmentList,
  selectLeadAttachmentLoading,
  selectLeadAttachmentError,
} from "../../slices/leadAttachments/leadAttachment.slice";
import {
  LeadAttachmentItem,
  downloadLeadAttachment,
} from "../../services/leadAttachmentService";
import { getLoggedinUser } from "../../helpers/api_helper";
import { useFlash } from "../../hooks/useFlash";

interface LeadAttachmentManagerProps {
  leadId: string;
  readOnly?: boolean;
}

const LeadAttachmentManager: React.FC<LeadAttachmentManagerProps> = ({
  leadId,
  readOnly = false,
}) => {
  const dispatch = useDispatch<any>();
  const { showSuccess, showError } = useFlash();
  const attachments: LeadAttachmentItem[] = useSelector(selectLeadAttachmentList);
  const loading = useSelector(selectLeadAttachmentLoading);
  const error = useSelector(selectLeadAttachmentError);
  const authUser = getLoggedinUser();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (leadId) {
      dispatch(fetchLeadAttachments({ leadId }));
    }
  }, [dispatch, leadId]);

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (readOnly) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !leadId || !authUser?.tenantId) {
      showError("Please select files to upload");
      return;
    }

    setUploading(true);
    let successCount = 0;
    let failCount = 0;

    try {
      // Upload files sequentially to avoid overwhelming the server
      for (const file of selectedFiles) {
        try {
          const result = await dispatch(
            uploadLeadAttachment({
              tenantId: authUser.tenantId,
              leadId: leadId,
              attachment: file,
            })
          );

          if (result.meta.requestStatus === "fulfilled") {
            successCount++;
          } else {
            failCount++;
          }
        } catch (err) {
          failCount++;
        }
      }

      if (successCount > 0) {
        showSuccess(`${successCount} file(s) uploaded successfully${failCount > 0 ? `, ${failCount} failed` : ""}`);
      } else {
        showError("Failed to upload files");
      }

      setSelectedFiles([]);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      // Refresh attachments list
      dispatch(fetchLeadAttachments({ leadId }));
    } catch (err) {
      showError("Failed to upload files");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (attachmentId: string) => {
    if (window.confirm("Are you sure you want to delete this attachment?")) {
      try {
        const result = await dispatch(deleteLeadAttachment(attachmentId));
        if (result.meta.requestStatus === "fulfilled") {
          showSuccess("Attachment deleted successfully");
          // Refresh attachments list
          dispatch(fetchLeadAttachments({ leadId }));
        } else {
          showError("Failed to delete attachment");
        }
      } catch (err) {
        showError("Failed to delete attachment");
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };


  return (
    <Card>
      <CardBody>
        <h5 className="card-title mb-3">Attachments</h5>
        
        {error && (
          <Alert color="danger" className="mb-3">
            {error}
          </Alert>
        )}

        {!readOnly && (
          <>
            <div
              ref={dropZoneRef}
              className={`border-2 border-dashed rounded p-4 mb-3 text-center ${
                isDragging ? "border-primary bg-primary bg-opacity-10" : "border-secondary"
              }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{ cursor: "pointer", transition: "all 0.3s ease" }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="mb-2">
                <i className="ri-upload-cloud-2-line fs-1 text-primary"></i>
              </div>
              <h5 className="mb-1">
                {isDragging ? "Drop files here" : "Drag & drop files here"}
              </h5>
              <p className="text-muted mb-2">or</p>
              <Button
                color="primary"
                outline
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <i className="ri-folder-line align-bottom me-1"></i>
                Browse Files
              </Button>
              <p className="text-muted mt-2 mb-0 small">
                Supports multiple files and folders • Max file size: 10MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                disabled={uploading || loading}
                className="d-none"
                accept="*/*"
                {...({ webkitdirectory: "" } as any)}
              />
            </div>

            {selectedFiles.length > 0 && (
              <div className="mb-3">
                <Label className="form-label">Selected Files ({selectedFiles.length})</Label>
                <ListGroup>
                  {selectedFiles.map((file, index) => (
                    <ListGroupItem
                      key={index}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div className="d-flex align-items-center">
                        <i className="ri-file-line fs-5 text-primary me-2"></i>
                        <div>
                          <div className="fw-medium">{file.name}</div>
                          <small className="text-muted">
                            {formatFileSize(file.size)}
                          </small>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        color="soft-danger"
                        onClick={() => removeFile(index)}
                        disabled={uploading}
                      >
                        <i className="ri-close-line"></i>
                      </Button>
                    </ListGroupItem>
                  ))}
                </ListGroup>
                <div className="mt-2 d-flex gap-2">
                  <Button
                    color="primary"
                    onClick={handleUpload}
                    disabled={uploading || loading}
                    className="flex-grow-1"
                  >
                    {uploading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Uploading {selectedFiles.length} file(s)...
                      </>
                    ) : (
                      <>
                        <i className="ri-upload-line align-bottom me-1"></i>
                        Upload {selectedFiles.length} file(s)
                      </>
                    )}
                  </Button>
                  <Button
                    color="light"
                    onClick={() => {
                      setSelectedFiles([]);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    disabled={uploading}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {loading && attachments.length === 0 ? (
          <div className="text-center py-3">
            <Spinner color="primary" />
            <p className="mt-2 text-muted">Loading attachments...</p>
          </div>
        ) : !loading && attachments.length === 0 ? (
          <Alert color="info" className="mb-0">
            No attachments found
          </Alert>
        ) : (
          <ListGroup>
            {attachments.map((attachment) => (
              <ListGroupItem
                key={attachment.id}
                className="d-flex justify-content-between align-items-center"
              >
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center">
                    <i className="ri-file-line fs-4 text-primary me-2"></i>
                    <div>
                      <h6 className="mb-0">{attachment.fileName}</h6>
                      <small className="text-muted">
                        {formatFileSize(attachment.fileSizeBytes)}
                      </small>
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    color="soft-primary"
                    onClick={async () => {
                      try {
                        // Download directly from filePath URL
                        const blob = await downloadLeadAttachment(attachment);
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = attachment.fileName;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                      } catch (error) {
                        // Fallback to opening file path directly
                        if (attachment.filePath) {
                          window.open(attachment.filePath, "_blank");
                        } else {
                          showError("Download not available");
                        }
                      }
                    }}
                    title="Download"
                  >
                    <i className="ri-download-line"></i>
                  </Button>
                  {!readOnly && (
                    <Button
                      size="sm"
                      color="soft-danger"
                      onClick={() => handleDelete(attachment.id)}
                      title="Delete"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </Button>
                  )}
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        )}
      </CardBody>
    </Card>
  );
};

export default LeadAttachmentManager;

