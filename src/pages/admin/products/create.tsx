import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductEditor from "@/components/ProductEditor";
import Head from "next/head";
import React from "react";

export default function index() {
  return (
    <section className="min-h-screen flex flex-col bg-gray-100">
      <Head>
        <title>Create Product | Product Management Dashboard</title>
        <meta
          name="description"
          content="Easily add new products to your inventory using the Product Management Dashboard."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <section className="p-8 w-full  mx-auto">
        <ProductEditor />
      </section>
      <Footer />
    </section>
  );
}
