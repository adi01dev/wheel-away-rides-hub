
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Shield, ShieldCheck, Upload } from "lucide-react";

interface DigilockerVerificationProps {
  documentType: string;
  documentName: string;
  onVerify: () => Promise<any>;
  verified?: boolean;
}

const DigilockerVerification = ({ documentType, documentName, onVerify, verified = false }: DigilockerVerificationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleVerify = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await onVerify();
      toast({
        title: "Verification initiated",
        description: "You'll be redirected to DigiLocker for authentication.",
      });
    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.");
      toast({
        title: "Verification failed",
        description: err.message || "An error occurred during verification.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {verified ? (
            <ShieldCheck className="h-5 w-5 text-green-500" />
          ) : (
            <Shield className="h-5 w-5 text-orange-500" />
          )}
          {documentName}
        </CardTitle>
        <CardDescription>
          {verified
            ? "This document has been verified through DigiLocker"
            : "Verify this document through DigiLocker for faster approval"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Verification Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {verified ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center">
            <ShieldCheck className="h-6 w-6 text-green-500 mr-3" />
            <div>
              <p className="font-medium text-green-700">Document Verified</p>
              <p className="text-sm text-green-600">
                This {documentType} has been successfully verified through DigiLocker
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <p className="text-sm text-amber-700 mb-2">
              DigiLocker verification helps us confirm your document's authenticity instantly.
              This secure process is faster than manual verification.
            </p>
            <p className="text-sm text-amber-700">
              You'll be redirected to DigiLocker to authenticate and share your {documentType}.
            </p>
          </div>
        )}
      </CardContent>
      {!verified && (
        <CardFooter>
          <Button 
            onClick={handleVerify} 
            disabled={isLoading || verified}
            className="w-full flex items-center gap-2"
          >
            {isLoading ? "Connecting..." : "Verify with DigiLocker"}
            {!isLoading && <Upload className="h-4 w-4" />}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default DigilockerVerification;
