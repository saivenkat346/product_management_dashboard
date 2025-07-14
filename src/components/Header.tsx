"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-blue-600 text-white py-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Title */}
        <Link href="/">
          <h1 className="text-white text-xl font-bold cursor-pointer hover:underline">
            Product Management Dashboard
          </h1>
        </Link>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <Link
            href="/admin/products"
            className="bg-white text-blue-600 font-medium px-4 py-2 rounded-md hover:bg-blue-100 transition"
          >
            Product List
          </Link>

          {pathname === "/admin/products" && (
            <Link
              href="/admin/products/create"
              className="bg-green-500 text-white font-medium px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              + Create Product
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
