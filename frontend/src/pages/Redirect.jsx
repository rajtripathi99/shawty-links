import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";

const Redirect = () => {
  const { shortCode } = useParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const res = await api.getOriginalUrl(shortCode);
        if (res.success && res.data?.originalUrl) {
          window.location.href = res.data.originalUrl;
        } else {
          setError(res.message || "Link not found");
        }
      } catch (err) {
        setError("Failed to redirect.");
      }
    };

    fetchLink();
  }, [shortCode]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Link Not Found</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground animate-pulse">Redirecting...</p>
    </div>
  );
};

export default Redirect;
