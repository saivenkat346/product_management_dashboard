import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { createProduct, updateProduct } from "@/lib/apicalls";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  resetProduct,
  setAddedDate,
  setDescription,
  setImage,
  setPrice,
  setStatus,
  setTitle,
} from "@/redux/productSlice";
import toast from "react-hot-toast";

const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z.enum(["active", "inactive"]),
  price: z.coerce.number(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  image: z
    .any()
    .refine((file) => file?.length === 1, "Image is required")
    .refine(
      (file) => file?.[0]?.type?.startsWith("image/"),
      "File must be an image"
    ),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    // @ts-expect-error proper types for number need to be defined 
    resolver: zodResolver(productSchema),
  });

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const formType = useAppSelector((state) => state.product.formType);
  const stateTitle = useAppSelector((state) => state.product.title);
  const stateDescription = useAppSelector((state) => state.product.description);
  const statePrice = useAppSelector((state) => state.product.price);
  const stateStatus = useAppSelector((state) => state.product.status);
  const stateDate = useAppSelector((state) => state.product.addedDate);
  const productId = useAppSelector((state) => state.product.productId);
  const imageFileList = watch("image");
  const title = watch("title");
  const description = watch("description");
  const price = watch("price");
  const status = watch("status");
  const date = watch("date");
  const [hasInitialized, setHasInitialized] = useState(false);


  useEffect(() => {
  // 1. Initial sync: Redux → Form (only once in update mode)
  if (formType === "update" && !hasInitialized) {
    setValue("title", stateTitle);
    setValue("description", stateDescription);
    setValue("price", statePrice);
    setValue("status", stateStatus);
    setValue("date", stateDate);
    setHasInitialized(true);
    return; // Prevent dispatching before fields are pre-filled
  }

  // 2. Live sync: Form → Redux (only after initial setup)
  if (hasInitialized || formType === "create") {
    dispatch(setTitle(title));
    dispatch(setDescription(description));
    dispatch(setPrice(price));
    dispatch(setStatus(status));
    dispatch(setAddedDate(date));
  }

  // 3. Live image sync for both modes
  if (imageFileList && imageFileList[0]) {
    const file = imageFileList[0];
    const reader = new FileReader();
    reader.onloadend = () => dispatch(setImage(reader.result as string));
    reader.readAsDataURL(file);
  } else {
    dispatch(setImage(null));
  }
}, [
  formType,
  hasInitialized,
  title,
  description,
  price,
  status,
  date,
  imageFileList,
  dispatch,
  setValue,
  stateTitle,
  stateDescription,
  statePrice,
  stateStatus,
  stateDate,
]);



  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("status", data.status);
      formData.append("price", data.price.toString());
      formData.append("date", data.date);
      formData.append("image", data.image[0]);

      if (formType === "update" && productId) {
        await updateProduct(productId, formData);
        toast.success("Product updated successfully!");
      } else {
        await createProduct(formData);
        toast.success("Product created successfully!");
      }
      if (formType === "create") {
        dispatch(resetProduct());
        reset();
      }
    } catch (err) {
      toast.error("Failed to submit product. Please try again.");
      console.error(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full m-8 p-4 bg-white rounded-2xl shadow-md">
      {/* @ts-expect-error due to the number type for price on submit function gives type error */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-black">
        <h2 className="text-xl font-semibold text-center">Add Product</h2>

        {/* Title */}
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            {...register("title")}
            className="w-full p-2 border rounded-md"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            rows={4}
            {...register("description")}
            className="w-full p-2 border rounded-md"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            {...register("status")}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block mb-1 font-medium">Added Date</label>
          <input
            type="date"
            {...register("date")}
            className="w-full p-2 border rounded-md"
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-medium">Price</label>
          <input
            type="number"
            step="0.01"
            {...register("price")}
            className="w-full p-2 border rounded-md"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* Image */}
        <div>
          <label className="block mb-1 font-medium">Product Image</label>
          <input
            type="file"
            accept="image/*"
            name="image"
            className="w-full border p-1 rounded-md"
            onChange={(e) => {
              const fileList = e.target.files;
              if (fileList) setValue("image", fileList);
            }}
          />
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">
              {errors.image.message?.toString()}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex justify-center items-center gap-2"
          disabled={loading}
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
