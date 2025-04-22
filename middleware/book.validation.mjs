import jwt from 'jsonwebtoken';

export const validateCreateBookData = (req, res, next) => {
  const { title, author, description, category_id } = req.body;

  const missingFields = [];
  if (!title) missingFields.push("title");
  if (!author) missingFields.push("author");
  if (!description) missingFields.push("description");
  if (!category_id) missingFields.push("category_id");

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Incomplete information: ${missingFields.join(", ")}`,
    });
  }

  next();
};

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    console.log("All Headers:", req.headers);
    console.log("Authorization Header:", authHeader);
    console.log("Token:", token);

    if (!token) {
      return res.status(401).json({ message: "Access token missing" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();

  } catch (err) {
    console.error("JWT Error:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};



