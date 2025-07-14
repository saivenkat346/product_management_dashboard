// === 📦 Backend: pages/api/products/index.ts ===
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";
import formidable from "formidable";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseForm(req: NextApiRequest): Promise<any> {
  const form = formidable({
    multiples: false,
    uploadDir: "./public/uploads",
    keepExtensions: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const { status, start, end, limit = "10", skip = "0" } = req.query;
      const filters: any = {};

      if (status && typeof status === "string") filters.status = status;
      if (start || end) {
        filters.date = {};
        if (start) filters.date.$gte = new Date(start as string);
        if (end) filters.date.$lte = new Date(end as string);
      }

      const products = await Product.find(filters)
        .sort({ createdAt: -1 })
        .skip(parseInt(skip as string))
        .limit(parseInt(limit as string));

      const total = await Product.countDocuments(filters);

      return res.status(200).json({ products, total });
    } catch (error) {
      console.error("GET error:", error);
      return res.status(500).json({ error: "Error fetching products" });
    }
  }

  if (req.method === "POST") {
    try {
      const { fields, files } = await parseForm(req);

      const title = Array.isArray(fields.title)
        ? fields.title[0]
        : fields.title;
      const description = Array.isArray(fields.description)
        ? fields.description[0]
        : fields.description;
      const priceRaw = Array.isArray(fields.price)
        ? fields.price[0]
        : fields.price;
      const status = Array.isArray(fields.status)
        ? fields.status[0]
        : fields.status;
      const dateRaw = Array.isArray(fields.date) ? fields.date[0] : fields.date;

      const price = parseFloat(priceRaw);
     

      // Ensure valid Date object
      const date = new Date(dateRaw);
     
      const file = Array.isArray(files.image) ? files.image[0] : files.image;
      if (!file?.filepath)
        return res.status(400).json({ error: "No file uploaded" });

      const imageUrl = "/uploads/" + path.basename(file.filepath);
      console.log(
        {
          title,
          description,
          price,
          status,
          date,
          imageUrl,
        },
        "before raw object "
      );
      const product = await Product.create({
        title,
        description,
        price,
        status,
        date,
        imageUrl,
      });


      return res.status(201).json(product);
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
