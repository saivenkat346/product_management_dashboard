import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductList from "@/components/ProductList";
import { getProducts } from "@/lib/apicalls";
import { useAppDispatch } from "@/redux/hooks";
import { resetProduct } from "@/redux/productSlice";
import { GetServerSideProps } from "next/types";
import React, { useEffect } from "react";

export default function ProductListing({ products }: { products: any[] }) {

const dispatch = useAppDispatch()

useEffect(()=>{
 dispatch(resetProduct())


},[dispatch])
  return (
    <section className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <section className=" p-8 ">
        <ProductList initialProducts={products} />
      </section>
      <Footer />
    </section>
  );
}



export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const params: Record<string, string> = {};

  if (query.status && typeof query.status === "string") {
    params.status = query.status;
  }

  if (query.start && typeof query.start === "string") {
    params.start = query.start;
  }

  if (query.end && typeof query.end === "string") {
    params.end = query.end;
  }

  params.limit = "100";
  params.skip = "0";

  const products = await getProducts(params);

  return {
    props: {
      products,
    },
  };
};