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
  const form = formidable({ multiples: false, uploadDir: "./public/uploads", keepExtensions: true });

  return new Promise((resolve, reject) => {
    interface ParsedForm {
      fields: formidable.Fields;
      files: formidable.Files;
    }

    form.parse(req, (err: any, fields: formidable.Fields, files: formidable.Files) => {
      if (err) reject(err);
      resolve({ fields, files } as ParsedForm);
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "GET") {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    return res.status(200).json(product);
  }

  if (req.method === "PUT") {
  try {
    const { fields, files } = await parseForm(req);

    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
    const priceRaw = Array.isArray(fields.price) ? fields.price[0] : fields.price;
    const status = Array.isArray(fields.status) ? fields.status[0] : fields.status;
    const dateRaw = Array.isArray(fields.date) ? fields.date[0] : fields.date;

    const price = parseFloat(priceRaw);
    const date = new Date(dateRaw);

    const updateData: any = {
      title,
      description,
      price,
      status,
      date,
    };

    const file = Array.isArray(files.image) ? files.image[0] : files.image;
    if (file?.filepath) {
      updateData.imageUrl = "/uploads/" + path.basename(file.filepath);
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error("PUT error:", error);
    return res.status(500).json({ error: "Update failed" });
  }
}


  if (req.method === "DELETE") {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    return res.status(200).json({ message: "Deleted successfully" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
