import React from "react";
import { Card, CardBody, Button, Badge } from "reactstrap";
import { LeadAttachmentItem } from "../../services/leadAttachmentService";
import {
  formatFileSize,
  getFileIcon,
  getFileIconColor,
  isImageFile,
  isPdfFile,
} from "../../common/attachmentUtils";

interface AttachmentCardProps {
  attachment: LeadAttachmentItem;
  onPreview?: (attachment: LeadAttachmentItem) => void;
  onDownload?: (attachment: LeadAttachmentItem) => void;
  onDelete?: (attachmentId: string) => void;
  readOnly?: boolean;
}

const AttachmentCard: React.FC<AttachmentCardProps> = ({
  attachment,
  onPreview,
  onDownload,
  onDelete,
  readOnly = false,
}) => {
  const fileIcon = getFileIcon(attachment.fileName);
  const iconColor = getFileIconColor(attachment.fileName);
  const isImage = isImageFile(attachment.fileName);
  const isPdf = isPdfFile(attachment.fileName);

  return (
    <Card
      className="h-100 border shadow-sm"
      style={{
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <CardBody className="d-flex flex-column p-3">
        {/* Thumbnail/Icon Section */}
        <div className="text-center mb-3" style={{ minHeight: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {isImage && attachment.filePath ? (
            <>
              <img
                src={attachment.filePath}
                alt={attachment.fileName}
                className="img-fluid rounded"
                style={{
                  maxHeight: "150px",
                  maxWidth: "100%",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onClick={() => onPreview && onPreview(attachment)}
                onError={(e) => {
                  // Fallback to icon if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const iconContainer = target.nextElementSibling as HTMLElement;
                  if (iconContainer) iconContainer.style.display = "block";
                }}
              />
              <div className="d-none" style={{ fontSize: "3rem" }}>
                <i className={`${fileIcon} ${iconColor}`}></i>
              </div>
            </>
          ) : (
            <div style={{ fontSize: "3rem" }}>
              <i className={`${fileIcon} ${iconColor}`}></i>
            </div>
          )}
        </div>

        {/* File Info Section */}
        <div className="flex-grow-1 mb-3">
          <h6
            className="mb-2 text-truncate"
            title={attachment.fileName}
            style={{ fontSize: "0.9rem" }}
          >
            {attachment.fileName}
          </h6>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <small className="text-muted">
              <i className="ri-file-list-line align-middle me-1"></i>
              {formatFileSize(attachment.fileSizeBytes)}
            </small>
            {(isImage || isPdf) && (
              <Badge color="info" className="fs-11">
                {isImage ? "Image" : "PDF"}
              </Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-3 border-top">
          <div className="d-flex gap-1 flex-wrap">
            {onPreview && (isImage || isPdf) && (
              <Button
                size="sm"
                color="soft-info"
                className="flex-fill"
                onClick={() => onPreview(attachment)}
                title="Preview"
              >
                <i className="ri-eye-line align-bottom me-1"></i>
                Preview
              </Button>
            )}
            {onDownload && (
              <Button
                size="sm"
                color="soft-primary"
                className="flex-fill"
                onClick={() => onDownload(attachment)}
                title="Download"
              >
                <i className="ri-download-line align-bottom me-1"></i>
                Download
              </Button>
            )}
            {!readOnly && onDelete && (
              <Button
                size="sm"
                color="soft-danger"
                className="flex-fill"
                onClick={() => onDelete(attachment.id)}
                title="Delete"
              >
                <i className="ri-delete-bin-line align-bottom me-1"></i>
                Delete
              </Button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default AttachmentCard;

