import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CardComponent } from "../../../shared/components";
import { selectClient, ClientItem } from "../index";

interface ClientCardProps {
  client: ClientItem;
  onDelete: (id: string) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onDelete }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleView = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    dispatch(selectClient(client.id));
    navigate(`/clients/view/${client.id}`);
  };

  const handleEdit = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    dispatch(selectClient(client.id));
    navigate(`/clients/edit/${client.id}`);
  };

  const handleDelete = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onDelete(client.id);
  };

  // Build metadata array
  const metadata = [];
  if (client.registeredNumber) {
    metadata.push({
      icon: <i className="ri-file-text-line align-middle"></i>,
      label: "Registration",
      value: client.registeredNumber,
    });
  }
  if (client.gstNumber) {
    metadata.push({
      icon: <i className="ri-file-list-line align-middle"></i>,
      label: "GST",
      value: client.gstNumber,
    });
  }
  if (client.managerFirstName || client.managerLastName) {
    metadata.push({
      icon: <i className="ri-user-line align-middle"></i>,
      label: "Manager",
      value: `${client.managerFirstName || ""} ${client.managerLastName || ""}`.trim(),
    });
  }
  if (client.managerEmailId) {
    metadata.push({
      icon: <i className="ri-mail-line align-middle"></i>,
      label: "",
      value: client.managerEmailId,
    });
  }

  return (
    <CardComponent
      title={client.name || "Client"}
      initials={client.name}
      status={client.isPriority ? "priority" : "standard"}
      metadata={metadata}
      actions={[
        {
          type: "view",
          onClick: handleView,
          show: true,
        },
        {
          type: "edit",
          onClick: handleEdit,
          show: true,
        },
        {
          type: "delete",
          onClick: handleDelete,
          show: true,
        },
      ]}
      hover={true}
      onClick={handleView}
    />
  );
};

export default ClientCard;

