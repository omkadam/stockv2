require("dotenv").config();
const User = require("./UserModel");
const mongoose = require("mongoose");
const cors = require('cors');



const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("connected to the mongoDB"))
  .catch((err) => console.log("Not Connected To The Network", err));

  app.post("/signup", async (req, res) => {
    const { firstName, middleName, lastName, phone, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with the email" });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        firstName,
        middleName,
        lastName,
        phone,
        email,
        password: hashedPassword,
      });
  
      await newUser.save();
  
      // Send a JSON response
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  try {
    if (!existingUser) {
      res.status(401).json({ message: "User does not exists" });
    }

    //check if password is correct
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    //Generate JWT Token

    let token;
    token = jwt.sign(
      {
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        id: existingUser._id,
        role: existingUser.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    //Send Token in response
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.error("System error");
  }
});

app.listen(8888, () => console.log("auth server started on 8888"));
