const PDFDocument = require("pdfkit");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const Application = require("../models/Application");

exports.generateIDCard = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status !== "approved") {
      return res.status(400).json({ message: "Application is not approved yet!" });
    }

    // Create the PDF in memory
    const doc = new PDFDocument();
    let buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", async () => {
      const pdfBuffer = Buffer.concat(buffers);

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw", // PDF is a raw file
            folder: "college-idcards"
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        streamifier.createReadStream(pdfBuffer).pipe(stream);
      });

      // Save Cloudinary URL to the database
      application.idCardUrl = result.secure_url;
      await application.save();

      res.status(200).json({
        message: "ID Card generated and uploaded successfully!",
        idCardUrl: result.secure_url
      });
    });

    // Write student info on the PDF
    doc.fontSize(16).text("College ID Card", { align: "center" }).moveDown();
    doc.fontSize(12).text(`Name: ${application.name}`);
    doc.text(`Course: ${application.course}`);
    doc.text(`Mobile: ${application.mobile}`);
    doc.text(`Email: ${application.email}`);
    
    // Add document information if available
    if (application.academicDocuments && application.academicDocuments.length > 0) {
      doc.moveDown().text("Submitted Documents:", { underline: true });
      application.academicDocuments.forEach((doc, index) => {
        const docName = doc.name || `Document ${index + 1}`;
        doc.text(`- ${docName}`);
      });
    }
    
    doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong while generating ID card" });
  }
};
