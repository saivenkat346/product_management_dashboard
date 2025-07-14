import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductEditor from "@/components/ProductEditor";
import { getProductById } from "@/lib/apicalls";
import { GetServerSideProps } from "next/types";
import React, { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import {
  setTitle,
  setDescription,
  setPrice,
  setStatus,
  setAddedDate,
  setImage,
  setFormType,
  setProductId,
} from "@/redux/productSlice";

export default function EditProductPage({ product }: { product: any }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (product && product._id) {
      dispatch(setFormType("update"));
      dispatch(setProductId(product._id));
      dispatch(setTitle(product.title));
      dispatch(setDescription(product.description));
      dispatch(setPrice(product.price));
      dispatch(setStatus(product.status));
      dispatch(setAddedDate(product.date?.split("T")[0] || "")); // YYYY-MM-DD
      dispatch(setImage(product.imageUrl || null));
    }
  }, [product,dispatch]);

  return (
    <section className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <section className="p-8">
        <ProductEditor key={product._id || "new"} />
      </section>
      <Footer />
    </section>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const product = await getProductById(query.id);
   
  return {
    props: {
      product: product ? product : {},
    },
  };
};
