
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { File, Upload, CheckCircle } from "lucide-react";
import DigilockerVerification from "@/components/verification/DigilockerVerification";

interface Document {
  file: string | null;
  verified: boolean;
  verificationDate?: string;
}

interface CarDocuments {
  registrationCertificate?: Document;
  insurance?: Document;
  pucCertificate?: Document;
}

interface CarDocumentVerificationProps {
  carId: string;
  documents?: CarDocuments;
  onUpload: (documentType: string, file: File) => Promise<any>;
  onVerify: (documentType: string) => Promise<any>;
}

const CarDocumentVerification = ({
  carId,
  documents,
  onUpload,
  onVerify
}: CarDocumentVerificationProps) => {
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
      e.target.value = "";
    }
  };

  const handleVerify = async (documentType: string) => {
    return onVerify(documentType);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <File className="h-5 w-5 mr-2 text-wheelteal-600" />
        <h2 className="text-xl font-semibold">Car Documents</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        To list your car on our platform, please upload and verify the following required documents.
        All cars must have valid registration, insurance, and PUC certification.
      </p>
      
      {/* Registration Certificate */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Certificate (RC)</CardTitle>
        </CardHeader>
        <CardContent>
          {documents?.registrationCertificate?.file ? (
            <div className="space-y-4">
              <div className="border rounded-md overflow-hidden">
                {documents.registrationCertificate.file.endsWith('.pdf') ? (
                  <div className="bg-gray-100 p-4 text-center">
                    <p className="text-gray-600">PDF Document</p>
                    <a 
                      href={documents.registrationCertificate.file} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Document
                    </a>
                  </div>
                ) : (
                  <img 
                    src={documents.registrationCertificate.file} 
                    alt="Registration Certificate" 
                    className="w-full h-auto max-h-60 object-contain"
                  />
                )}
              </div>
              
              <DigilockerVerification
                documentType="registration certificate"
                documentName="Registration Certificate"
                verified={documents.registrationCertificate.verified}
                onVerify={() => handleVerify("registration")}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <Label htmlFor="registration" className="block">Upload the car's registration certificate</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">Drag and drop the RC or click to browse</p>
                <p className="text-xs text-gray-400 mb-4">JPG, PNG, or PDF up to 5MB</p>
                <Input 
                  id="registration" 
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "registration")}
                  disabled={isUploading === "registration"}
                />
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("registration")?.click()}
                  disabled={isUploading === "registration"}
                >
                  {isUploading === "registration" ? "Uploading..." : "Choose File"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Insurance */}
      <Card>
        <CardHeader>
          <CardTitle>Insurance Policy</CardTitle>
        </CardHeader>
        <CardContent>
          {documents?.insurance?.file ? (
            <div className="space-y-4">
              <div className="border rounded-md overflow-hidden">
                {documents.insurance.file.endsWith('.pdf') ? (
                  <div className="bg-gray-100 p-4 text-center">
                    <p className="text-gray-600">PDF Document</p>
                    <a 
                      href={documents.insurance.file} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Document
                    </a>
                  </div>
                ) : (
                  <img 
                    src={documents.insurance.file} 
                    alt="Insurance Policy" 
                    className="w-full h-auto max-h-60 object-contain"
                  />
                )}
              </div>
              
              <DigilockerVerification
                documentType="insurance policy"
                documentName="Insurance Policy"
                verified={documents.insurance.verified}
                onVerify={() => handleVerify("insurance")}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <Label htmlFor="insurance" className="block">Upload the car's insurance policy</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">Drag and drop the insurance document or click to browse</p>
                <p className="text-xs text-gray-400 mb-4">JPG, PNG, or PDF up to 5MB</p>
                <Input 
                  id="insurance" 
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "insurance")}
                  disabled={isUploading === "insurance"}
                />
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("insurance")?.click()}
                  disabled={isUploading === "insurance"}
                >
                  {isUploading === "insurance" ? "Uploading..." : "Choose File"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* PUC Certificate */}
      <Card>
        <CardHeader>
          <CardTitle>PUC Certificate</CardTitle>
        </CardHeader>
        <CardContent>
          {documents?.pucCertificate?.file ? (
            <div className="space-y-4">
              <div className="border rounded-md overflow-hidden">
                {documents.pucCertificate.file.endsWith('.pdf') ? (
                  <div className="bg-gray-100 p-4 text-center">
                    <p className="text-gray-600">PDF Document</p>
                    <a 
                      href={documents.pucCertificate.file} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Document
                    </a>
                  </div>
                ) : (
                  <img 
                    src={documents.pucCertificate.file} 
                    alt="PUC Certificate" 
                    className="w-full h-auto max-h-60 object-contain"
                  />
                )}
              </div>
              
              <DigilockerVerification
                documentType="PUC certificate"
                documentName="PUC Certificate"
                verified={documents.pucCertificate.verified}
                onVerify={() => handleVerify("puc")}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <Label htmlFor="puc" className="block">Upload the car's PUC certificate</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">Drag and drop the PUC certificate or click to browse</p>
                <p className="text-xs text-gray-400 mb-4">JPG, PNG, or PDF up to 5MB</p>
                <Input 
                  id="puc" 
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "puc")}
                  disabled={isUploading === "puc"}
                />
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("puc")?.click()}
                  disabled={isUploading === "puc"}
                >
                  {isUploading === "puc" ? "Uploading..." : "Choose File"}
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
            <h3 className="font-medium">Why do we need these documents?</h3>
            <p className="text-sm text-gray-600 mt-1">
              We verify all car documents to ensure they meet legal requirements and provide a safe experience for our users.
              Verification through DigiLocker speeds up the approval process for your car listing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDocumentVerification;
