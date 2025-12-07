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
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import {
  fetchLeadAttachments,
  uploadLeadAttachment,
  deleteLeadAttachment,
  selectLeadAttachmentLoading,
  selectLeadAttachmentError,
  selectLeadAttachmentsByLeadId,
} from "../../slices/leadAttachments/leadAttachment.slice";
import {
  LeadAttachmentItem,
} from "../../services/leadAttachmentService";
import { getLoggedinUser } from "../../helpers/api_helper";
import { useFlash } from "../../hooks/useFlash";
import AttachmentCard from "./AttachmentCard";
import DeleteModal from "./DeleteModal";
import { formatFileSize } from "../../common/attachmentUtils";
import { isImageFile, isPdfFile } from "../../common/attachmentUtils";

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
  // Use selector that filters by leadId
  const attachments: LeadAttachmentItem[] = useSelector((state: any) =>
    selectLeadAttachmentsByLeadId(state, leadId)
  );
  const loading = useSelector(selectLeadAttachmentLoading);
  const error = useSelector(selectLeadAttachmentError);
  const authUser = getLoggedinUser();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<LeadAttachmentItem | null>(null);
  const [previewModal, setPreviewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [attachmentToDelete, setAttachmentToDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (leadId) {
      dispatch(fetchLeadAttachments({ leadId, pageNumber: 1, pageSize: 100 }));
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
      dispatch(fetchLeadAttachments({ leadId, pageNumber: 1, pageSize: 100 }));
    } catch (err) {
      showError("Failed to upload files");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (attachmentId: string) => {
    setAttachmentToDelete(attachmentId);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (attachmentToDelete) {
      try {
        const result = await dispatch(deleteLeadAttachment(attachmentToDelete));
        if (result.meta.requestStatus === "fulfilled") {
          showSuccess("Attachment deleted successfully");
          // Refresh attachments list
          dispatch(fetchLeadAttachments({ leadId, pageNumber: 1, pageSize: 100 }));
        } else {
          showError("Failed to delete attachment");
        }
      } catch (err) {
        showError("Failed to delete attachment");
      }
    }
    setDeleteModal(false);
    setAttachmentToDelete(null);
  };

  const handlePreview = (attachment: LeadAttachmentItem) => {
    setPreviewAttachment(attachment);
    setPreviewModal(true);
  };

  const handleDownload = (attachment: LeadAttachmentItem) => {
    if (attachment.filePath) {
      // For direct blob URLs, open in new tab for images/PDFs, download for others
      if (isImageFile(attachment.fileName) || isPdfFile(attachment.fileName)) {
        window.open(attachment.filePath, "_blank");
      } else {
        // Trigger download for other file types
        const link = document.createElement("a");
        link.href = attachment.filePath;
        link.download = attachment.fileName;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      showError("Download not available");
    }
  };


  return (
    <>
      <Card>
        <CardBody>
          <h5 className="card-title mb-3">Attachments</h5>
          
          {/* Only show error if there's an actual error from rejected thunk */}
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
            <div className="text-center py-5">
              <Spinner color="primary" />
              <p className="mt-2 text-muted">Loading attachments...</p>
            </div>
          ) : !loading && attachments.length === 0 ? (
            <Alert color="info" className="mb-0">
              <i className="ri-inbox-line align-middle me-2"></i>
              No attachments found for this lead
            </Alert>
          ) : (
            <Row className="row-cols-xxl-4 row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-4">
              {attachments.map((attachment) => (
                <Col key={attachment.id}>
                  <AttachmentCard
                    attachment={attachment}
                    onPreview={handlePreview}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                    readOnly={readOnly}
                  />
                </Col>
              ))}
            </Row>
          )}
        </CardBody>
      </Card>

      {/* Preview Modal */}
      <Modal
        isOpen={previewModal}
        toggle={() => {
          setPreviewModal(false);
          setPreviewAttachment(null);
        }}
        size="lg"
        centered
      >
        <ModalHeader toggle={() => {
          setPreviewModal(false);
          setPreviewAttachment(null);
        }}>
          {previewAttachment?.fileName}
        </ModalHeader>
        <ModalBody>
          {previewAttachment && (
            <>
              {isImageFile(previewAttachment.fileName) && previewAttachment.filePath ? (
                <div className="text-center">
                  <img
                    src={previewAttachment.filePath}
                    alt={previewAttachment.fileName}
                    className="img-fluid"
                    style={{ maxHeight: "70vh" }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const errorDiv = target.nextElementSibling as HTMLElement;
                      if (errorDiv) errorDiv.style.display = "block";
                    }}
                  />
                  <div className="d-none mt-3">
                    <Alert color="warning">
                      <i className="ri-error-warning-line align-middle me-2"></i>
                      Image failed to load. Please try downloading the file.
                    </Alert>
                  </div>
                </div>
              ) : isPdfFile(previewAttachment.fileName) && previewAttachment.filePath ? (
                <div className="text-center">
                  <iframe
                    src={previewAttachment.filePath}
                    title={previewAttachment.fileName}
                    style={{ width: "100%", height: "70vh", border: "none" }}
                  />
                </div>
              ) : (
                <Alert color="info">
                  <i className="ri-information-line align-middle me-2"></i>
                  Preview is not available for this file type. Please download to view.
                </Alert>
              )}
              <div className="mt-3 d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  Size: {formatFileSize(previewAttachment.fileSizeBytes)}
                </small>
                <Button
                  color="primary"
                  onClick={() => {
                    handleDownload(previewAttachment);
                  }}
                >
                  <i className="ri-download-line align-bottom me-1"></i>
                  Download
                </Button>
              </div>
            </>
          )}
        </ModalBody>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={deleteModal}
        onDeleteClick={confirmDelete}
        onCloseClick={() => {
          setDeleteModal(false);
          setAttachmentToDelete(null);
        }}
      />
    </>
  );
};

export default LeadAttachmentManager;

