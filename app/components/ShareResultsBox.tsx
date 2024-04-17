'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";

export default function ShareResultsBox() {
  const [pageUrl, setPageUrl] = useState<string | null>(null);

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  if (pageUrl) {
    return (
      <div className="flex items-center justify-center pt-8">
        <Card>
          <CardHeader className="pb-4 text-sm font-medium text-center">
            Share the results
          </CardHeader>
          <CardContent>
            <FacebookShareButton url={pageUrl} className="ml-1 mr-1">
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={pageUrl} className="ml-1 mr-1">
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <WhatsappShareButton url={pageUrl} className="ml-1 mr-1">
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            <EmailShareButton url={pageUrl} className="ml-1 mr-1">
              <EmailIcon size={32} round />
            </EmailShareButton>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (<span></span>);
}