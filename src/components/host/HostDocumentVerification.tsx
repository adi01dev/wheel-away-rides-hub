
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Upload, CheckCircle } from "lucide-react";
import DigilockerVerification from "@/components/verification/DigilockerVerification";

interface Document {
  file: string | null;
  verified: boolean;
  verificationDate?: string;
}

interface HostDocumentsProps {
  drivingLicense?: Document;
  identityProof?: Document;
  onUpload: (documentType: string, file: File) => Promise<any>;
  onVerify: (documentType: string) => Promise<any>;
}

const HostDocumentVerification = ({
  drivingLicense,
  identityProof,
  onUpload,
  onVerify,
}: HostDocumentsProps) => {
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(documentType);
      await onUpload(documentType, file);
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(null);
      // Clear the input value to allow re-uploading the same file
      e.target.value = "";
    }
  };

  const handleVerify = async (documentType: string) => {
    return onVerify(documentType);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Shield className="h-5 w-5 mr-2 text-wheelteal-600" />
        <h2 className="text-xl font-semibold">Identity Verification</h2>
      </div>
      
      <p className="text-gray-600">
        Host identity verification is required to ensure the safety and security of our platform.
        Please upload and verify your documents to get started.
      </p>
      
      {/* Driving License Section */}
      <Card>
        <CardHeader>
          <CardTitle>Driving License</CardTitle>
        </CardHeader>
        <CardContent>
          {drivingLicense?.file ? (
            <div className="space-y-4">
              <div className="border rounded-md overflow-hidden">
                {drivingLicense.file.endsWith('.pdf') ? (
                  <div className="bg-gray-100 p-4 text-center">
                    <p className="text-gray-600">PDF Document</p>
                    <a 
                      href={drivingLicense.file} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Document
                    </a>
                  </div>
                ) : (
                  <img 
                    src={drivingLicense.file} 
                    alt="Driving License" 
                    className="w-full h-auto max-h-60 object-contain"
                  />
                )}
              </div>
              
              <DigilockerVerification
                documentType="driving license"
                documentName="Driving License"
                verified={drivingLicense.verified}
                onVerify={() => handleVerify("drivingLicense")}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <Label htmlFor="drivingLicense" className="block">Upload your driving license</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">Drag and drop your driving license or click to browse</p>
                <p className="text-xs text-gray-400 mb-4">JPG, PNG, or PDF up to 5MB</p>
                <Input 
                  id="drivingLicense" 
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "drivingLicense")}
                  disabled={isUploading === "drivingLicense"}
                />
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("drivingLicense")?.click()}
                  disabled={isUploading === "drivingLicense"}
                >
                  {isUploading === "drivingLicense" ? "Uploading..." : "Choose File"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Identity Proof Section */}
      <Card>
        <CardHeader>
          <CardTitle>Government ID Proof</CardTitle>
        </CardHeader>
        <CardContent>
          {identityProof?.file ? (
            <div className="space-y-4">
              <div className="border rounded-md overflow-hidden">
                {identityProof.file.endsWith('.pdf') ? (
                  <div className="bg-gray-100 p-4 text-center">
                    <p className="text-gray-600">PDF Document</p>
                    <a 
                      href={identityProof.file} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Document
                    </a>
                  </div>
                ) : (
                  <img 
                    src={identityProof.file} 
                    alt="Identity Proof" 
                    className="w-full h-auto max-h-60 object-contain"
                  />
                )}
              </div>
              
              <DigilockerVerification
                documentType="identity proof"
                documentName="Government ID"
                verified={identityProof.verified}
                onVerify={() => handleVerify("identityProof")}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <Label htmlFor="identityProof" className="block">Upload your government ID (Aadhaar, PAN, Passport, etc.)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">Drag and drop your ID or click to browse</p>
                <p className="text-xs text-gray-400 mb-4">JPG, PNG, or PDF up to 5MB</p>
                <Input 
                  id="identityProof" 
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "identityProof")}
                  disabled={isUploading === "identityProof"}
                />
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("identityProof")?.click()}
                  disabled={isUploading === "identityProof"}
                >
                  {isUploading === "identityProof" ? "Uploading..." : "Choose File"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-wheelteal-600 mt-0.5" />
          <div>
            <h3 className="font-medium">Why we verify host documents</h3>
            <p className="text-sm text-gray-600 mt-1">
              Document verification helps us maintain a trusted community of hosts. Your documents are stored securely and handled according to our privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostDocumentVerification;
