import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductEditor from "@/components/ProductEditor";
import React from "react";

export default function index() {
  return (
    <section className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <section className="p-8 w-full  mx-auto">
        <ProductEditor />
      </section>
      <Footer />
    </section>
  );
}
