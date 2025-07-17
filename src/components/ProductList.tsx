import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter} from "next/navigation";
import { deleteProduct, getProducts } from "@/lib/apicalls";
import qs from "query-string";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductList({
  initialProducts,
}: {
  initialProducts: any[];
}) {
  const [products, setProducts] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(100);

  const router = useRouter();

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const handleDelete = async (id: string) => {
    setIsFetching(true);
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
    setIsFetching(false);
    toast.success("product deleted");
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/products/edit/${id}`);
  };

  const applyFilters = () => {
    const query: any = {};
    if (statusFilter !== "all") query.status = statusFilter;
    if (dateFrom) query.start = dateFrom;
    if (dateTo) query.end = dateTo;

    router.push(`/admin/products?${qs.stringify(query)}`);
  };

  const loadMore = async () => {
    setLoadingMore(true);
    const currentQuery: any = {};
    if (statusFilter !== "all") currentQuery.status = statusFilter;
    if (dateFrom) currentQuery.start = dateFrom;
    if (dateTo) currentQuery.end = dateTo;
    currentQuery.skip = skip;
    currentQuery.limit = 100;

    const data = await getProducts(currentQuery);
    if (data.length < 100) setHasMore(false);
    setProducts((prev) => [...prev, ...data]);
    setSkip((prev) => prev + 100);
    setLoadingMore(false);
  };

return (
  <div className="mt-8">
    <motion.h2
      className="text-lg font-semibold mb-4 text-gray-800"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      Product List
    </motion.h2>

    <motion.div
      className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-200"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Filter Products
      </h3>
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded-md text-black"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="p-2 border rounded-md text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="p-2 border rounded-md text-black"
          />
        </div>

        <motion.button
          onClick={applyFilters}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Apply Filters
        </motion.button>
      </div>
    </motion.div>

    <div className="grid gap-6">
      <AnimatePresence>
        {products.map((product) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {product.imageUrl && (
                <div className="w-full md:w-48 h-32 flex-shrink-0 rounded overflow-hidden">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    width={192}
                    height={128}
                    className="object-cover w-full h-full rounded-md border"
                  />
                </div>
              )}

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {product.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-700">
                    <span>
                      <span className="font-medium text-gray-800">Price:</span>{" "}
                      ₹{product.price}
                    </span>
                    <span>
                      <span className="font-medium text-gray-800">Status:</span>{" "}
                      {product.status}
                    </span>
                    <span>
                      <span className="font-medium text-gray-800">Added:</span>{" "}
                      {product.date?.split("T")[0] || ""}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(product._id)}
                    className="px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    disabled={isFetching}
                    className="px-4 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    {isFetching ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>

    {hasMore && (
      <motion.div
        className="text-center mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          onClick={loadMore}
          disabled={loadingMore}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.03 }}
          className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
        >
          {loadingMore ? "Loading..." : "Load More"}
        </motion.button>
      </motion.div>
    )}
  </div>
);

}


    // <div className="mt-8">
    //   <h2 className="text-lg font-semibold mb-4 text-gray-800">Product List</h2>

    //   {/* Filters */}
    //   <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-200">
    //     <h3 className="text-lg font-semibold mb-4 text-gray-800">
    //       Filter Products
    //     </h3>
    //     <div className="flex flex-wrap gap-4 items-end">
    //       <div>
    //         <label className="block text-sm font-medium text-gray-700 mb-1">
    //           Status
    //         </label>
    //         <select
    //           value={statusFilter}
    //           onChange={(e) => setStatusFilter(e.target.value)}
    //           className="p-2 border rounded-md text-black"
    //         >
    //           <option value="all">All</option>
    //           <option value="active">Active</option>
    //           <option value="inactive">Inactive</option>
    //         </select>
    //       </div>

    //       <div>
    //         <label className="block text-sm font-medium text-gray-700 mb-1">
    //           From
    //         </label>
    //         <input
    //           type="date"
    //           value={dateFrom}
    //           onChange={(e) => setDateFrom(e.target.value)}
    //           className="p-2 border rounded-md text-black"
    //         />
    //       </div>

    //       <div>
    //         <label className="block text-sm font-medium text-gray-700 mb-1">
    //           To
    //         </label>
    //         <input
    //           type="date"
    //           value={dateTo}
    //           onChange={(e) => setDateTo(e.target.value)}
    //           className="p-2 border rounded-md text-black"
    //         />
    //       </div>

    //       <button
    //         onClick={applyFilters}
    //         className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    //       >
    //         Apply Filters
    //       </button>
    //     </div>
    //   </div>

    //   {/* Product List */}
    //   <div className="grid gap-6">
    //     {products.map((product) => (
    //       <div
    //         key={product._id}
    //         className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
    //       >
    //         <div className="flex flex-col md:flex-row gap-4">
    //           {product.imageUrl && (
    //             <div className="w-full md:w-48 h-32 flex-shrink-0 rounded overflow-hidden">
    //               <Image
    //                 src={product.imageUrl}
    //                 alt={product.title}
    //                 width={192}
    //                 height={128}
    //                 className="object-cover w-full h-full rounded-md border"
    //               />
    //             </div>
    //           )}

    //           <div className="flex-1 flex flex-col justify-between">
    //             <div>
    //               <h3 className="text-lg font-semibold text-gray-900">
    //                 {product.title}
    //               </h3>
    //               <p className="text-sm text-gray-600 mt-1">
    //                 {product.description}
    //               </p>

    //               <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-700">
    //                 <span>
    //                   <span className="font-medium text-gray-800">Price:</span>{" "}
    //                   ₹{product.price}
    //                 </span>
    //                 <span>
    //                   <span className="font-medium text-gray-800">Status:</span>{" "}
    //                   {product.status}
    //                 </span>
    //                 <span>
    //                   <span className="font-medium text-gray-800">Added:</span>{" "}
    //                   {product.date}
    //                 </span>
    //               </div>
    //             </div>

    //             <div className="mt-4 flex gap-2">
    //               <button
    //                 onClick={() => handleEdit(product._id)}
    //                 className="px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
    //               >
    //                 Edit
    //               </button>
    //               <button
    //                 onClick={() => handleDelete(product._id)}
    //                 disabled={isFetching}
    //                 className="px-4 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
    //               >
    //                 {isFetching ? "Deleting..." : "Delete"}
    //               </button>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     ))}
    //   </div>

    //   {/* Load More */}
    //   {hasMore && (
    //     <div className="text-center mt-6">
    //       <button
    //         onClick={loadMore}
    //         disabled={loadingMore}
    //         className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
    //       >
    //         {loadingMore ? "Loading..." : "Load More"}
    //       </button>
    //     </div>
    //   )}
    // </div>
