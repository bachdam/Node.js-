import pool from "../configs/connectDB";
import multer from "multer";

let getHomePage = async (req, res) => {
  //if we have await in the function, the function has to have async (phuong trinh bat dong bo)

  const [rows, fields] = await pool.execute("SELECT * FROM users");
  return res.render("./index.ejs", { dataUser: rows, test: "abc string test" });
};

let getDetailPage = async (req, res) => {
  let userId = req.params.userId;
  let user = await pool.execute("select * from users where id = ?", [userId]);

  return res.send(JSON.stringify(user[0]));
};

let createNewUser = async (req, res) => {
  console.log(">>>check new user data:", req.body);
  let { firstName, lastName, email, address } = req.body;

  await pool.execute(
    "insert into users(firstName, lastName, email, address) values (?, ?, ?, ?)",
    [firstName, lastName, email, address]
  );
  return res.redirect("/");
};

let getEditPage = async (req, res) => {
  let userId = req.params.userId;
  let [user] = await pool.execute("Select * from users where id =?", [userId]); // has to be [user] or it will take both user and fields
  //return res.send(JSON.stringify(user));
  return res.render(`update.ejs`, { dataUser: user[0] });
};
let deleteUser = async (req, res) => {
  let userId = req.body.userId;
  await pool.execute(`delete from users where id = ?`, [userId]);
  return res.redirect("/");
};

let postUpdateUser = async (req, res) => {
  let { firstName, lastName, email, address, userId } = req.body;
  await pool.execute(
    "update users set firstname = ?, lastName = ?, email = ?, address = ? where id = ?",
    [firstName, lastName, email, address, userId]
  );
  console.log(">>>check data: ", req.body);
  return res.redirect("/");
};

let getUploadFilePage = async (req, res) => {
  return res.render("uploadFile.ejs");
};

//upload a single photo
const upload = multer().single("profile_pic");

let handleUploadFile = async (req, res) => {
  // 'profile_pic' is the name of our file input field in the HTML form
  console.log(req.file);

  upload(req, res, function (err) {
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any

    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.file) {
      return res.send("Please select an image to upload");
    }

    // Display uploaded image for user validation
    res.send(
      `You have uploaded this image: <hr/><img src="/img/${req.file.filename}" width="500"><hr /><a href="./upload">Upload another image</a>`
    );
  });
};

//upload multiple photos
//const uploadMultiple = multer().array('multiple_images');

let handleUploadMultipleFile = async (req, res) => {
  if (req.fileValidationError) {
    return res.send(req.fileValidationError);
  } else if (!req.files) {
    return res.send("Please select an image to upload");
  }

  let result = "You have uploaded these images: <hr />";
  const files = req.files;
  console.log(">>>>>> check files: ", files);
  let index, len;

  // Loop through all the uploaded images and display them on frontend
  for (index = 0, len = files.length; index < len; ++index) {
    result += `<img src="/img/${files[index].filename}" width="300" style="margin-right: 20px;">`;
  }
  result += '<hr/><a href="/upload">Upload more images</a>';
  res.send(result);
};
//use this objects export to export many elements at once
module.exports = {
  getHomePage,
  getDetailPage,
  createNewUser,
  deleteUser,
  getEditPage,
  postUpdateUser,
  getUploadFilePage,
  handleUploadFile,
  handleUploadMultipleFile,
};
