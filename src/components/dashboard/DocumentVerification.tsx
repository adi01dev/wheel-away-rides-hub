
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Upload } from "lucide-react";

const DocumentVerification = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState({
    idProof: null as File | null,
    drivingLicense: null as File | null,
  });

  const handleFileUpload = (type: 'idProof' | 'drivingLicense', file: File) => {
    setDocuments(prev => ({ ...prev, [type]: file }));
    toast({
      title: "Document Uploaded",
      description: `Your ${type === 'idProof' ? 'ID Proof' : 'Driving License'} has been uploaded.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="max-w-md">
        <p className="text-sm text-gray-500 mb-4">
          Please upload your government ID and driving license. These documents will be verified at the time of pickup.
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <div>
                <h3 className="font-medium">Government ID Proof</h3>
                <p className="text-sm text-gray-500">Upload a valid government ID</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {documents.idProof && <span className="text-sm text-green-600">Uploaded</span>}
              <Button variant="outline" onClick={() => document.getElementById('idProof')?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <input
                type="file"
                id="idProof"
                className="hidden"
                accept="image/*,.pdf"
                onChange={(e) => e.target.files?.[0] && handleFileUpload('idProof', e.target.files[0])}
              />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <div>
                <h3 className="font-medium">Driving License</h3>
                <p className="text-sm text-gray-500">Upload your valid driving license</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {documents.drivingLicense && <span className="text-sm text-green-600">Uploaded</span>}
              <Button variant="outline" onClick={() => document.getElementById('drivingLicense')?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <input
                type="file"
                id="drivingLicense"
                className="hidden"
                accept="image/*,.pdf"
                onChange={(e) => e.target.files?.[0] && handleFileUpload('drivingLicense', e.target.files[0])}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DocumentVerification;
