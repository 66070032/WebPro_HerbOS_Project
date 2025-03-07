import express from "express";
import cors from "cors";
import chalk from "chalk";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import mysql from "mysql2/promise";
import crypto from "crypto";

const PORT = 3100;
const REFRESH_SECRET =
  "ac62576998604bc5bd26a0177596238c2012915717a4727feeff2099f0fa48529924f08e3ff78c19af326ab94695dfd2f01e23f264f006ec9ef19179a4c2d84e";

const pool = mysql.createPool({
  host: "db.jokeped.xyz",
  user: "herbos",
  password: "Scbm(UTNTbf!3KMw",
  database: "herbos",
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3100"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req, res, next) => {
  let statusColor = res.statusCode >= 400 ? chalk.red : chalk.greenBright;
  console.log(
    `${chalk.blue("[INFO]")} [${new Date().toLocaleString()}] ${req.method} ${
      req.originalUrl
    } ${statusColor(res.statusCode)} ${req.ip}`
  );
  next();
});

const generateUserSecretKey = () => {
  return crypto.randomBytes(64).toString("hex");
};
app.get("/viewproduct", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query("SELECT * FROM products");
    connection.release();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query error" });
  }
});
app.post("/register", async (req, res) => {
  const userData = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  try {
    const connection = await pool.getConnection();

    const [existingUser] = await connection.query(
      "SELECT * FROM users WHERE username = ?",
      [userData.username]
    );
    if (existingUser.length > 0) {
      connection.release();
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userSecretKey = generateUserSecretKey();

    await connection.query(
      "INSERT INTO users (username, firstname, lastname, email, password, secret_key) VALUES (?, ?, ?, ?, ?, ?)",
      [
        userData.username,
        userData.firstname,
        userData.lastname,
        userData.email,
        hashedPassword,
        userSecretKey,
      ]
    );
    connection.release();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  const userData = {
    username: req.body.username,
    password: req.body.password,
  };

  try {
    const connection = await pool.getConnection();
    const [user] = await connection.query(
      "SELECT * FROM users WHERE username = ?",
      [userData.username]
    );
    connection.release();

    if (user.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(userData.password, user[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const userSecretKey = user[0].secret_key;

    const accessToken = jwt.sign(
      { userId: user[0].id, username: userData.username },
      userSecretKey,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { userId: user[0].id, username: userData.username },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false });

    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query(`
      SELECT 
        products.*, 
        category.name AS category_name 
        FROM products
        INNER JOIN category
        ON products.category_id = category.id
        WHERE is_custom = 0
    `);

    connection.release();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.get("/custom", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query(`
      SELECT 
        products.*, 
        category.name AS category_name 
        FROM products
        INNER JOIN category
        ON products.category_id = category.id
        WHERE is_custom = 1
    `);

    connection.release();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/products/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query(
      "SELECT * FROM products WHERE id = ?",
      [productId]
    );
    connection.release();

    if (results.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(results[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/category", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query("SELECT * FROM category");
    connection.release();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/selFromCategory", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query(
      "SELECT * FROM products WHERE category_id = ?",
      [req.body.category]
    );
    connection.release();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
//////////////   Need authen to access   //////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) return res.status(403).json({ message: "Token required" });

  try {
    const decodedTemp = jwt.decode(token);
    if (!decodedTemp) return res.status(401).json({ message: "Invalid Token" });

    const connection = await pool.getConnection();
    const [user] = await connection.query(
      "SELECT secret_key FROM users WHERE id = ?",
      [decodedTemp.userId]
    );
    connection.release();

    if (user.length === 0)
      return res.status(401).json({ message: "Invalid Token" });

    const userSecretKey = user[0].secret_key;

    const decoded = jwt.verify(token, userSecretKey);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

app.get("/profile", verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [user] = await connection.query(
      "SELECT id, username FROM users WHERE id = ?",
      [req.user.userId]
    );
    connection.release();

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/profile/update", verifyToken, async (req, res) => {
  const { username, email, phone } = req.body;

  try {
    const connection = await pool.getConnection();
    await connection.query(
      "UPDATE users SET username = ?, email = ?, phone = ? WHERE id = ?",
      [username, email, phone, req.user.userId]
    );
    connection.release();

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
});

app.post("/addcart", verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query(
      "INSERT INTO user_cart (username, product_id) VALUES (?, ?)",
      [req.user.username, req.body.product_id]
    );
    connection.release();
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.post("/addproduct", verifyToken, async (req, res) => {
  try {
    const {shop, name, description, price, stock, category_id, images } = req.body;
    const [results] = await connection.query(
      "INSERT INTO products (name, description, price, stock, category_id, images) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [shop, name, description, price, stock, category_id, images]
    );
    connection.release();
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/allCart", verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query(
      "SELECT * FROM user_cart WHERE username = ?",
      [req.user.username]
    );
    connection.release();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

try {
  console.clear();
  await pool.getConnection();
  console.log(`
    ██╗  ██╗███████╗██████╗ ██████╗  ██████╗ ███████╗     █████╗ ██████╗ ██╗
    ██║  ██║██╔════╝██╔══██╗██╔══██╗██╔═══██╗██╔════╝    ██╔══██╗██╔══██╗██║
    ███████║█████╗  ██████╔╝██████╔╝██║   ██║███████╗    ███████║██████╔╝██║
    ██╔══██║██╔══╝  ██╔══██╗██╔══██╗██║   ██║╚════██║    ██╔══██║██╔═══╝ ██║
    ██║  ██║███████╗██║  ██║██████╔╝╚██████╔╝███████║    ██║  ██║██║     ██║
    ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝  ╚═════╝ ╚══════╝    ╚═╝  ╚═╝╚═╝     ╚═╝
    `);
  console.log(
    `${chalk.blue(
      "[INFO]"
    )} [${new Date().toLocaleString()}] Database connected`
  );
  app.listen(PORT, () => {
    console.log(
      `${chalk.blue(
        "[INFO]"
      )} [${new Date().toLocaleString()}] Server is running on port ${chalk.greenBright(
        PORT
      )}`
    );
    pool.releaseConnection();
  });
} catch (error) {
  console.log(
    `${chalk.red("[ERROR]")} [${new Date().toLocaleString()}] ${error}`
  );
  process.exit(1);
}
