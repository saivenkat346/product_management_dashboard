import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import Head from "next/head";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {


  return (
    <div
      className={`min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 ${geistSans.variable} ${geistMono.variable}`}
    >
      <Head>
  <title>Product Management Dashboard | Manage Your Products Efficiently</title>
        <meta name="description" content="A simple yet powerful dashboard to create, update, and manage products with ease." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex-1 px-4 py-8 max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <motion.h1
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-700 mb-2"
        >
          Product Management Dashboard
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto mb-6"
        >
          Easily manage, create, and organize your product listings in one place. Designed for efficiency, built for productivity.
        </motion.p>

        {/* Create Product Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mb-10"
        >
          <Link
            href="/admin/products/create"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
          >
            + Create Product
          </Link>
        </motion.div>

       
      </main>
      <Footer />
    </div>
  );
}
