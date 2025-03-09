import express from "express";
import cors from "cors";
import chalk from "chalk";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import mysql from "mysql2/promise";
import crypto from "crypto";
import qrcode from "qrcode";

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

<<<<<<< HEAD
app.use((req, res, next) => {
  let statusColor = res.statusCode >= 400 ? chalk.red : chalk.greenBright;
  console.log(
    `${chalk.blue("[INFO]")} [${new Date().toLocaleString()}] ${req.method} ${
      req.originalUrl
    } ${statusColor(res.statusCode)} ${req.ip}`
=======
  const handleVerifyPayment = async () => {
    if (!file) {
      alert('กรุณาเลือกไฟล์ก่อน!');
      return;
    }
    setIsVerifying(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('https://developer.easyslip.com/api/v1/verify', formData, {
        headers: {
          Authorization: 'Bearer 2a93891c-2b88-4afa-92f2-cf99d5c474a2',
        },
      });
      
      const dataPayment = response.data.data;
      const payAmount = dataPayment.amount.amount;
      if (dataPayment.receiver.bank.short === 'SCB' && dataPayment.receiver.account.name.th === 'นาย เจตนิพัทธ์ ท') {
        if (parseFloat(payAmount) === parseFloat(amount)) {
            alert('✅ ชำระเงินเรียบร้อย!');
            await fetchWithAuth('http://localhost:3100/orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ order_status: "จัดส่งแล้ว", total_amount: payAmount, payment_status: "ชำระเงินแล้ว" })
            })
            router.push('/'); // นำทางไปยังหน้าสำเร็จ
          } else {
            alert('❌ ยอดเงินไม่ตรง กรุณาตรวจสอบอีกครั้ง!');
          }
      } else {
        alert('❌ ชื่อบัญชีไม่ตรง กรุณาตรวจสอบอีกครั้ง!');
      }
    } catch (error) {
      console.error('Error verifying slip:', error);
      alert('❌ ตรวจสอบสลิปไม่สำเร็จ!');
    }
    
    setIsVerifying(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96 text-center">
        <h2 className="text-xl font-semibold mb-4">💳 ชำระเงิน</h2>
        <p className="text-gray-700">ยอดเงินที่ต้องชำระ: <strong>{amount} บาท</strong></p>
        <p className="text-gray-700">Bank: <strong>SCB</strong></p>
        <p className="text-gray-700">เลขบัญชี: <strong>1642885919</strong></p>
        <p className="text-gray-700">ชื่อบัญชี: <strong>นาย เจตนิพัทธ์ ทานะมัย</strong></p>
        
        {/* อัปโหลดไฟล์สลิป */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-600">อัปโหลดสลิปการชำระเงิน</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange} 
            className="mt-2 w-full px-4 py-2 border rounded-lg text-sm text-gray-700 focus:ring focus:ring-blue-200"
          />
        </div>
        
        {/* แสดงภาพตัวอย่างไฟล์ที่เลือก */}
        {preview && (
          <img src={preview} alt="สลิปที่อัปโหลด" className="mt-2 w-full h-auto rounded-lg shadow-md" />
        )}
        
        {/* ปุ่มยืนยันการชำระเงิน */}
        <button 
          onClick={handleVerifyPayment} 
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg w-full transition"
          disabled={isVerifying}
        >
          {isVerifying ? '⏳ กำลังตรวจสอบ...' : '✅ ยืนยันการชำระเงิน'}
        </button>
      </div>
    </div>
>>>>>>> 4bf3860e1baa32592bd9e82cd223a0f78f3c93fa
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
      {
        userId: user[0].id,
        username: userData.username,
        email: user[0].email,
        phone: user[0].phone,
        role: user[0].role,
      },
      userSecretKey,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { userId: user[0].id, username: userData.username },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false });

    res.json({ accessToken, role: user[0].role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query("SELECT * FROM products");
    connection.release();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.get("/products/custom/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();

    const [results] = await connection.query(
      "SELECT * FROM products WHERE is_custom = 1 AND id = ?",
      [id]
    );

    connection.release();

    if (results.length === 0) {
      return res.status(404).json({ message: "Custom product not found" });
    }

    res.json(results[0]);
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

// Add this to your index.js backend file
app.get("/ingredients", async (req, res) => {
  try {
    const customIds = req.query.custom_id.split(",");
    const connection = await pool.getConnection();

    // Query ingredients that match the requested custom_id values
    const [results] = await connection.query(
      "SELECT * FROM product_custom WHERE custom_id IN (?)",
      [customIds]
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
    const {
      product_id,
      custom_name,
      custom_ingredients,
      custom_price,
      concentration,
    } = req.body;

    const connection = await pool.getConnection();
    const [results] = await connection.query(
      `INSERT INTO user_cart 
       (username, product_id, custom_name, custom_ingredients, custom_price, concentration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.user.username,
        product_id,
        custom_name,
        custom_ingredients,
        custom_price,
        concentration,
      ]
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
    const { name, description, price, stock, category_id, images } = req.body;
    const connection = await pool.getConnection();
    const [results] = await connection.query(
      "INSERT INTO products (name, description, price, stock, category_id, images) VALUES (?, ?, ?, ?, ?, ?)",
      [name, description, price, stock, category_id, images]
    );
    connection.release();
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// สร้างคำสั่งซื้อ
app.post("/orders", verifyToken, async (req, res) => {
  const { order_status, total_amount, payment_status } = req.body;

  // ตรวจสอบข้อมูลที่จำเป็น
  if (!order_status || !total_amount || !payment_status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // ตรวจสอบว่า payment_status เป็น "ชำระเงินแล้ว"
  if (payment_status !== "ชำระเงินแล้ว") {
    return res.status(400).json({ error: "ยังไม่ชำระ" }); // "Not paid"
  }

  try {
    const connection = await pool.getConnection();

    // คำสั่ง SQL สำหรับการบันทึกคำสั่งซื้อ
    const query =
      "INSERT INTO orders (user_id, order_status, total_amount, payment_status) VALUES (?, ?, ?, ?)";
    const [result] = await connection.query(query, [
      req.user.userId,
      order_status,
      total_amount,
      payment_status,
    ]);

    connection.release();
    res.status(201).json({
      order_id: result.insertId,
      message: "Order created successfully",
    });
  } catch (err) {
    console.error("Error inserting order:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ดึงข้อมูลคำสั่งซื้อทั้งหมด
app.get("/orders", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query(`
      SELECT 
        orders.order_id,
        users.username,
        orders.order_date,
        orders.order_status,
        orders.payment_status,
        orders.total_amount
      FROM orders
      LEFT JOIN users ON orders.user_id = users.id
      ORDER BY orders.order_date DESC
    `);
    connection.release();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// อัพเดทสถานะคำสั่งซื้อ
app.put("/orders/:orderId/status", async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const connection = await pool.getConnection();
    await connection.query(
      "UPDATE orders SET order_status = ? WHERE order_id = ?",
      [status, orderId]
    );
    connection.release();
    res.json({ message: "Order status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ลบคำสั่งซื้อ
app.delete("/orders/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    const connection = await pool.getConnection();

    // ลบรายการสินค้าในคำสั่งซื้อก่อน (เพื่อรักษา referential integrity)
    await connection.query("DELETE FROM order_items WHERE order_id = ?", [
      orderId,
    ]);

    // ลบคำสั่งซื้อ
    await connection.query("DELETE FROM orders WHERE order_id = ?", [orderId]);

    connection.release();
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// เพิ่มรายการสินค้าลงในคำสั่งซื้อ
app.post("/order-items", verifyToken, async (req, res) => {
  const { order_id, product_id, quantity, price } = req.body;

  // ตรวจสอบข้อมูลที่จำเป็น
  if (!order_id || !product_id || !quantity || !price) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const connection = await pool.getConnection();

    // คำสั่ง SQL สำหรับการเพิ่มรายการสินค้า
    const query =
      "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)";
    await connection.query(query, [order_id, product_id, quantity, price]);

    connection.release();
    res.status(201).json({ message: "Order item added successfully" });
  } catch (err) {
    console.error("Error inserting order item:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/cart/:id", verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query(
      "DELETE FROM user_cart WHERE id = ? AND username = ?",
      [req.params.id, req.user.username]
    );
    connection.release();
    res.status(200).json({ message: "Cart item removed successfully" });
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

app.post("/generate-promptpay", async (req, res) => {
  const { accountNumber, amount } = req.body;

  if (!accountNumber) {
    return res.status(400).json({ message: "Account number is required" });
  }

  try {
    const formatAccount = accountNumber.replace(/-/g, "");
    const serviceCode = "000201";
    const promptPayPrefix = "010212";
    const accountData = `2937A000000677010111${formatAccount}`;
    const currency = "530376";
    const amountData = amount
      ? `54${parseFloat(amount).toFixed(2).replace(".", "")}`
      : "";
    const countryCode = "5802TH";
    const checksumPlaceholder = "6304";

    const payload = `${serviceCode}${promptPayPrefix}${accountData}${currency}${amountData}${countryCode}${checksumPlaceholder}`;
    const qrCode = await qrcode.toDataURL(payload);

    res.json({ qrCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate QR Code" });
  }
});

app.post("/paymentSuccess", verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query(
      "DELETE FROM `user_cart` WHERE username = ?",
      [req.user.username]
    );
    connection.release();
    res.send(results);
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