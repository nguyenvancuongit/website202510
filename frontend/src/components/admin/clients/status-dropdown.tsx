import { useState } from "react";

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CLIENT_MANAGEMENT } from "@/config/constants";
import { Client } from "@/hooks/api/use-clients";

interface StatusDropdownProps {
  client: Client;
  onStatusChange: (clientId: string, newStatus: typeof CLIENT_MANAGEMENT.STATUS.PENDING | typeof CLIENT_MANAGEMENT.STATUS.ACTIVE | typeof CLIENT_MANAGEMENT.STATUS.DISABLED) => void;
  disabled?: boolean;
}

export function StatusDropdown({ client, onStatusChange, disabled }: StatusDropdownProps) {
  const [isChanging, setIsChanging] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === client.status || isChanging) {return;}
    
    setIsChanging(true);
    try {
      await onStatusChange(client.id, newStatus as typeof CLIENT_MANAGEMENT.STATUS.PENDING | typeof CLIENT_MANAGEMENT.STATUS.ACTIVE | typeof CLIENT_MANAGEMENT.STATUS.DISABLED);
    } finally {
      setIsChanging(false);
    }
  };

  // Disable dropdown if client status is pending
  const isDisabled = disabled || client.status === CLIENT_MANAGEMENT.STATUS.PENDING || isChanging;

  return (
    <Select 
      value={client.status} 
      onValueChange={handleStatusChange}
      disabled={isDisabled}
    >
      <SelectTrigger className={`w-24 h-8 text-xs ${
        client.status === CLIENT_MANAGEMENT.STATUS.ACTIVE 
          ? "bg-green-100 text-green-800 border-green-300" 
          : client.status === CLIENT_MANAGEMENT.STATUS.PENDING
          ? "bg-yellow-100 text-yellow-800 border-yellow-300"
          : "bg-red-100 text-red-800 border-red-300"
      }`}>
        <SelectValue>
          {isChanging ? "..." : CLIENT_MANAGEMENT.STATUS_LABELS[client.status]}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {CLIENT_MANAGEMENT.STATUS_OPTIONS.map((option) => (
          <SelectItem 
            key={option.value} 
            value={option.value}
            disabled={option.value === CLIENT_MANAGEMENT.STATUS.PENDING}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
