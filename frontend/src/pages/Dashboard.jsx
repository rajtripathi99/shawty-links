import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import CreateLinkDialog from "@/components/CreateLinkDialog";
import LinkCard from "@/components/LinkCard";
import { Badge } from "@/components/ui/badge";
import { Link2, Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyLinks().then((res) => {
      if (res.success) {
        setLinks(res.data);
      }
      setLoading(false);
    });
  }, []);

  const handleLinkCreated = (newLink) => {
    setLinks((prev) => [newLink, ...prev]);
  };

  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Your Links</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {user?.email}
          </p>
        </div>
        <CreateLinkDialog onCreated={handleLinkCreated} />
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-5 sm:mb-6">
        <Badge variant="secondary" className="gap-1.5 text-sm py-1 px-3">
          <Link2 className="h-3.5 w-3.5" />
          {links.length} links
        </Badge>
        <Badge variant="secondary" className="gap-1.5 text-sm py-1 px-3">
          {totalClicks} total clicks
        </Badge>
      </div>

      {/* Link List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : links.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Link2 className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p>No links yet. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link) => (
            <LinkCard key={link._id} link={link} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
