import { useAppSelector } from "@/redux/hooks";
import React from "react";

export default function ProductPreview() {
  const title = useAppSelector((state) => state.product.title);
  const description = useAppSelector((state) => state.product.description);
  const price = useAppSelector((state) => state.product.price);
  const status = useAppSelector((state) => state.product.status);
  const image = useAppSelector((state) => state.product.image);
  const addedDate = useAppSelector((state) => state.product.addedDate);

  return (
    <div className="w-full m-8 p-0 bg-white rounded-2xl shadow-md text-black overflow-hidden flex flex-col min-h-[300px]">
      {/* Header */}
      <div className="bg-blue-600 text-white px-6 py-3 text-lg font-semibold">
        Product Preview
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Image Section */}
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-32 h-32 object-cover rounded-xl border border-gray-200"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded-xl text-gray-400 border border-gray-200">
              No Image
            </div>
          )}

          {/* Text Content */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-1">{title || "No Title"}</h2>
            <p className="text-sm text-gray-600 mb-2">
              {description || "No Description"}
            </p>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-lg font-bold">₹{price || "0.00"}</span>
              <span
                className={`text-sm font-medium px-2 py-1 rounded ${
                  status === "in stock"
                    ? "bg-green-100 text-green-700"
                    : status === "out of stock"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {status || "Unknown"}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              <span className="font-medium">Added Date:</span>{" "}
              {addedDate ? new Date(addedDate).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Footer Bar */}
      <div className="bg-blue-600 h-4 w-full" />
    </div>
  );
}
