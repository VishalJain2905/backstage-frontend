import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, Check, X } from "lucide-react";

interface AdminPageProps {
  onBack: () => void;
}

interface AccessRequest {
  id: string;
  email: string;
  name: string;
  status: 'pending' | 'approved' | 'revoked';
  requestDate: string;
}

const mockRequests: AccessRequest[] = [
  { id: '1', email: 'john.doe@example.com', name: 'John Doe', status: 'pending', requestDate: '2025-01-15' },
  { id: '2', email: 'jane.smith@example.com', name: 'Jane Smith', status: 'approved', requestDate: '2025-01-14' },
  { id: '3', email: 'mike.wilson@example.com', name: 'Mike Wilson', status: 'pending', requestDate: '2025-01-13' },
  { id: '4', email: 'sara.johnson@example.com', name: 'Sara Johnson', status: 'revoked', requestDate: '2025-01-12' },
];

export function AdminPage({ onBack }: AdminPageProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-accent text-accent-foreground border-border';
      case 'pending': return 'bg-secondary text-secondary-foreground border-border';
      case 'revoked': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1>Access Management</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="mb-2">User Access Requests</h2>
            <p className="text-muted-foreground">Manage user access approvals and permissions</p>
          </div>

          <div className="space-y-4">
            {mockRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4>{request.name}</h4>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{request.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Requested: {request.requestDate}
                  </p>
                </div>

                <div className="flex gap-2">
                  {request.status === 'pending' && (
                    <>
                      <Button size="sm" variant="outline" className="text-primary border-border">
                        <Check className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive border-destructive/20">
                        <X className="h-3 w-3 mr-1" />
                        Deny
                      </Button>
                    </>
                  )}
                  
                  {request.status === 'approved' && (
                    <Button size="sm" variant="outline" className="text-destructive border-destructive/20">
                      <X className="h-3 w-3 mr-1" />
                      Revoke
                    </Button>
                  )}
                  
                  {request.status === 'revoked' && (
                    <Button size="sm" variant="outline" className="text-primary border-border">
                      <Check className="h-3 w-3 mr-1" />
                      Restore
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}