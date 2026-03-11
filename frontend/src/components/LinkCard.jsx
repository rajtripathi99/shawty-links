import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, ExternalLink, QrCode, MousePointerClick } from "lucide-react";

const LinkCard = ({ link }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const shortUrl = link.shortUrl;
  const clicks = link.clicks || 0;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col gap-3">
          {/* URLs */}
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-sm sm:text-base text-primary hover:underline truncate"
              >
                {shortUrl}
              </a>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleCopy}>
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
            <a
              href={link.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-muted-foreground hover:underline truncate block"
            >
              <ExternalLink className="h-3 w-3 inline mr-1" />
              {link.originalUrl}
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 text-xs sm:text-sm">
              <MousePointerClick className="h-3 w-3" />
              {clicks} clicks
            </Badge>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8"
              onClick={() => setShowQr(!showQr)}
            >
              <QrCode className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        {showQr && link.qrCode && (
          <div className="mt-3 pt-3 border-t flex justify-center">
            <img src={link.qrCode} alt="QR Code" className="h-28 w-28 sm:h-32 sm:w-32 rounded" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LinkCard;
