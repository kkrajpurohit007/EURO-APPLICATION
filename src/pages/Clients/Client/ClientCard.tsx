import React from "react";
import { Card, CardBody, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { selectClient } from "../../../slices/clients/client.slice";

interface ClientCardProps {
  client: any;
  onDelete: (id: string) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onDelete }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Card className="h-100">
      <CardBody className="d-flex flex-column">
        <div className="flex-grow-1">
          <div className="d-flex align-items-center mb-3">
            <div className="flex-grow-1 ms-3">
              <h5 className="fs-14 mb-1">
                <span className="text-body">{client.name}</span>
              </h5>
              <p className="text-muted mb-0">Registration: {client.registeredNumber || "-"}</p>
              <p className="text-muted mb-0">GST: {client.gstNumber || "-"}</p>
            </div>
          </div>
          
          <div className="mt-2">
            <p className="text-muted mb-1">
              <i className="ri-user-line align-bottom me-1"></i>
              Manager: {client.managerFirstName} {client.managerLastName}
            </p>
            <p className="text-muted mb-1">
              <i className="ri-mail-line align-bottom me-1"></i>
              {client.managerEmailId || "-"}
            </p>
            <p className="text-muted mb-1">
              <i className="ri-map-pin-line align-bottom me-1"></i>
              Status: {client.isPriority ? (
                <span className="badge bg-warning">Priority</span>
              ) : (
                <span className="badge bg-secondary">Standard</span>
              )}
            </p>
          </div>
        </div>
        
        <div className="mt-auto pt-3 border-top">
          <div className="d-flex gap-2 flex-wrap">
            <Button
              size="sm"
              color="soft-primary"
              onClick={() => {
                dispatch(selectClient(client.id));
                navigate(`/clients/view/${client.id}`);
              }}
            >
              <i className="ri-eye-line align-bottom"></i> View
            </Button>
            <Button
              size="sm"
              color="soft-secondary"
              onClick={() => {
                dispatch(selectClient(client.id));
                navigate(`/clients/edit/${client.id}`);
              }}
            >
              <i className="ri-pencil-line align-bottom"></i> Edit
            </Button>
            <Button
              size="sm"
              color="soft-info"
              onClick={() => navigate(`/clients/${client.id}/rental-config`)}
            >
              <i className="ri-settings-line align-bottom"></i> Rental
            </Button>
            <Button
              size="sm"
              color="soft-danger"
              onClick={() => onDelete(client.id)}
            >
              <i className="ri-delete-bin-line align-bottom"></i> Delete
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ClientCard;