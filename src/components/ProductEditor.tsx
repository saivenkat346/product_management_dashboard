"use client";

import React from "react";
import ProductForm from "./ProductForm";
import ProductPreview from "./ProductPreview";
import { motion } from "framer-motion";

export default function ProductEditor() {
  return (
    <section className="flex flex-col md:flex-row gap-6 justify-between items-start w-full">

      <motion.div
        className="w-full md:w-1/2"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <ProductForm />
      </motion.div>


      <motion.div
        className="w-full md:w-1/2"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      >
        <ProductPreview />
      </motion.div>
    </section>
  );
}
