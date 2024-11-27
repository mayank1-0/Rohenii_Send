const asyncHandler = require("../middleware/asyncHandler");
const ErrorHandler = require("../middleware/ErrorHandler");
const Hospital = require("../models/hospital");
const ExcelJS = require("exceljs")
const InsuranceCompany = require("../models/insuranceCompany");



require('dotenv').config();

// ------------------- signup  --------------------
exports.signupHospital = asyncHandler(async (req, res, next) => {
    const { name,
        contactPerson,
        email,
        contactNumber,
        address,
        district,
        pincode,
        state,
        password
    } = req.body;

    // Create new Hospital instance
    const newHospital = new Hospital({
        name,
        contactPerson,
        email,
        contactNumber,
        address,
        district,
        pincode,
        state,
        password
    });

    // Save the Hospital to the database
    await newHospital.save();

    res.status(201).json({
        success: true,
        message: 'Hospital registered successfully. Please verify your email using the OTP sent.',
    });
});
// ------------------- signup --------------------

// ------------------ getAllHospitalsDetails -------------------
exports.getAllHospitalsDetails = asyncHandler(async (req, res, next) => {
    const hospitals = await Hospital.find({ isVerified: 'Approve' });
    res.status(200).json({
        success: true,
        hospitals,
        message: "Hospitals fetched successfully"
    });
  });
  // ------------------ getAllHospitalsDetails -------------------

  
//export
exports.exportExcel = asyncHandler(async(req,res,next)=>{
  
    const hospital = await Hospital.find({}).sort({_id:-1}).select("+password")
if(hospital?.length ===0) return next(new ErrorHandler("Select Order First"))
    const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('reports');
  
  
  // Define Excel headers
  worksheet.columns = [
      { header: 'Hospital Name'},
      { header: 'Email'},
      { header: 'Address'},
      { header: 'State'},
      { header: 'District'},
      { header: 'Pincode'},
      { header: 'Contact Number'},
      { header: 'Contact Person'},
      { header: 'Password'},
      { header: 'Created Date'},
  ];
  
  
  
  hospital.forEach(hospital => {
      const row =[
        `${hospital?.name}`,
        `${hospital?.email}`,
        `${hospital.address}`,
        `${hospital.state}`,
        `${hospital.district}`,
        `${hospital.pincode}`,
        `${hospital?.contactNumber}`,
        `${hospital?.contactPerson}`,
        `${hospital?.password}`,
        `${new Date(hospital?.createdAt).toLocaleDateString()}`
      ]
  
      worksheet.addRow(row);
  });
  
  // Set response headers
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=export.xlsx');
  
  // Write the workbook to the response
  workbook.xlsx.write(res)
      .then(() => {
          res.end();
        })
        .catch(error => {
          res.status(500).send('Internal Server Error');
      });
  })
  //export

  
//import
exports.importExcel = asyncHandler(async(req,res,next)=>{

    // try {

        if(!req?.file?.path) return next(new ErrorHandler("Please select file first"))
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(req.file.path);
        const worksheet = workbook.worksheets[0]; // Get the first worksheet

        const hospitals = [];
        
        // Read rows from the worksheet
        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            if (rowNumber === 1) return; 

            const hospitalData = {
                name: row.getCell(1).value,
                email: row.getCell(2).value,
                address: row.getCell(3).value,
                state: row.getCell(4).value,
                district: row.getCell(5).value,
                pincode:row.getCell(6).value,
                contactNumber: row.getCell(7).value,
                contactPerson: row.getCell(8).value,
                password: row.getCell(9).value
                // Add other fields as necessary
            };

            hospitals.push(hospitalData);
        });

        // Insert data into MongoDB
        const createdHospital = await Hospital.insertMany(hospitals);
        console.log(createdHospital,"createdHospital")

        // Optionally, delete the uploaded file after processing
        fs.unlinkSync(req.file.path);

        res.status(200).json({ message: 'Data imported successfully', count: hospitals.length });
    // } catch (error) {
    //     let message = error.message;
    //     if (error.code === 11000) {
    //         console.log(error.keyValue,"error.keyValue")
    //         message = `${Object.keys(error.keyValue)} Must be Unique`;
    //       }
    //     res.status(500).json({ message: message});
    // }
})
  //import
  
  