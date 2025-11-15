import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const Download = () => {
  useEffect(() => {
    // Automatically trigger download
    const link = document.createElement('a');
    link.href = '/Visora.zip';
    link.download = 'Visora.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Download Started!</h1>
            <p className="text-xl text-muted-foreground">
              Your Visora extension is downloading. Follow the steps below to install it.
            </p>
          </div>

          {/* Installation Steps */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-8">
            <h2 className="text-3xl font-bold mb-6">Installation Instructions</h2>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Extract the ZIP file</h3>
                  <p className="text-muted-foreground">
                    Locate the downloaded <code className="bg-muted px-2 py-1 rounded">Visora.zip</code> file and extract it to a folder on your computer.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Open Chrome Extensions</h3>
                  <p className="text-muted-foreground mb-2">
                    Open Google Chrome and navigate to:
                  </p>
                  <code className="block bg-muted px-4 py-2 rounded font-mono text-sm">
                    chrome://extensions/
                  </code>
                  <p className="text-muted-foreground mt-2">
                    Or click the three dots menu → Extensions → Manage Extensions
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                    3
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Enable Developer Mode</h3>
                  <p className="text-muted-foreground">
                    Toggle the "Developer mode" switch in the top right corner of the Extensions page.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                    4
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Load Unpacked Extension</h3>
                  <p className="text-muted-foreground">
                    Click "Load unpacked" button and select the extracted Visora folder.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">You're All Set!</h3>
                  <p className="text-muted-foreground">
                    Visora is now installed and ready to use. You'll see the Visora icon in your Chrome toolbar.
                  </p>
                </div>
              </div>
            </div>

            {/* Troubleshooting */}
            <div className="mt-8 p-6 bg-muted/50 rounded-2xl">
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-muted-foreground mb-4">
                If you encounter any issues during installation, please contact us:
              </p>
              <Link 
                to="/landing#contact" 
                className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
              >
                Contact Support
              </Link>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-12">
            <Link 
              to="/landing" 
              className="text-lg text-muted-foreground hover:text-foreground transition"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Download;
