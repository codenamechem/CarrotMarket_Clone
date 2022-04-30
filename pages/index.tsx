import type { GetServerSideProps, NextPage } from "next";
import FloatingButton from "@components/floating-button";
import Item from "@components/item";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import Head from "next/head";
import useSWRInfinite, { unstable_serialize } from "swr/infinite";
import { useInfiniteScroll } from "@libs/client/useInfiniteScroll";
import { Product } from "@prisma/client";
import { useEffect } from "react";
import useSWR, { SWRConfig } from "swr";
import client from "@libs/server/client";

export interface ProductWithCount extends Product {
  _count: {
    favs: number;
  };
}
interface productsResponse {
  ok: boolean;
  products: ProductWithCount[];
  pages: number;
}

const getKey = (pageIndex: number, previousPageData: productsResponse) => {
  if (previousPageData && !previousPageData.products.length) return null;
  return `/api/products?page=${pageIndex + 1}`;
};

const Home: NextPage = () => {
  const { user, isLoading } = useUser();
  //const { data } = useSWR<productsResponse>("api/products");

  // useSWRInfinite 사용법
  // https://swr.vercel.app/ko/docs/pagination#useswrinfinite
  const { data, setSize } = useSWRInfinite<productsResponse>(getKey);

  const page = useInfiniteScroll();

  useEffect(() => {
    setSize(page);
  }, [setSize, page]);

  return (
    <Layout title="홈" hasTabBar seoTitle="Home">
      <Head>
        <title>Home</title>
      </Head>
      <div className="flex flex-col space-y-5 divide-y">
        {data
          ? data?.map((result) => {
              return result?.products?.map((product) => (
                <Item
                  id={product?.id}
                  title={product?.name}
                  price={product?.price}
                  hearts={product?._count?.favs}
                  key={product?.id}
                  image={product?.image}
                />
              ));
            })
          : "Loading"}
        <FloatingButton href="/products/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

const Page: NextPage<productsResponse> = ({ products, pages }) => {
  // unstable_serialize 사용
  // https://github.com/vercel/swr/issues/1520#issuecomment-933247768
  return (
    <SWRConfig
      value={{
        fallback: {
          [unstable_serialize(getKey)]: [
            {
              ok: true,
              products,
              pages,
            },
          ],
        },
      }}
    >
      <Home />
    </SWRConfig>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const products = await client.product.findMany({
    include: {
      _count: {
        select: {
          favs: true,
        },
      },
    },
    take: 10,
    skip: 0,
  });

  if (!products) return { props: {} };

  const productCount = await client.product.count();

  return {
    props: {
      ok: true,
      products: JSON.parse(JSON.stringify(products)),
      pages: Math.ceil(productCount / 10),
    },
  };
};

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   console.log(ctx);
//   const products = await client.product.findMany({
//     include: {
//       _count: {
//         select: {
//           favs: true,
//         },
//       },
//     },
//     take: 10,
//     skip: 0,
//   });

//   if (!products) return { props: {} };

//   const productCount = await client.product.count();
//   // await new Promise((resolve) => setTimeout(resolve, 5000));

//   return {
//     props: {
//       ok: true,
//       products: JSON.parse(JSON.stringify(products)),
//       pages: Math.ceil(productCount / 10),
//     },
//   };
// };

export default Page;
