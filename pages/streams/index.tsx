/* eslint-disable @next/next/link-passhref */
import type { GetServerSideProps, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import FloatingButton from "@components/floating-button";
import Layout from "@components/layout";
import { Stream } from "@prisma/client";
import { SWRConfig } from "swr";
import { useInfiniteScroll } from "@libs/client/useInfiniteScroll";
import { useEffect } from "react";
import useSWRInfinite, { unstable_serialize } from "swr/infinite";
import client from "@libs/server/client";
import streams from "pages/api/streams";

interface StreamsResponse {
  ok: boolean;
  streams: Stream[];
  pages: number;
}

const getKey = (pageIndex: number, previousPageData: StreamsResponse) => {
  if (previousPageData && !previousPageData.streams.length) return null;
  return `/api/streams?page=${pageIndex + 1}`;
};

const Streams: NextPage = () => {
  //const { data } = useSWR<StreamsResponse>("/api/streams");

  const { data, setSize } = useSWRInfinite<StreamsResponse>(getKey);

  const page = useInfiniteScroll();

  useEffect(() => {
    setSize(page);
  }, [setSize, page]);

  return (
    <Layout hasTabBar title="라이브" seoTitle="Stream">
      <div className="space-y-4 divide-y-[1px]">
        {data?.map((result) => {
          return result?.streams?.map((stream) => (
            <Link key={stream?.id} href={`/streams/${stream?.id}`}>
              <a className="block  cursor-pointer px-4 pt-4">
                <div className="aspect-video w-full rounded-md bg-slate-300 shadow-sm" />
                <h1 className="mt-2 text-2xl font-bold text-gray-900">
                  {stream.name}
                </h1>
              </a>
            </Link>
          ));
        })}
        <FloatingButton href="/streams/create">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            ></path>
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

const Page: NextPage<StreamsResponse> = ({ streams, pages }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          [unstable_serialize(getKey)]: [
            {
              ok: true,
              streams,
              pages,
            },
          ],
        },
      }}
    >
      <Streams />
    </SWRConfig>
  );
};

export async function getServerSideProps() {
  const streams = await client.stream.findMany({
    take: 10,
    skip: 0,
  });
  const streamsCount = await client.product.count();

  if (!streams) return { props: {} };

  return {
    props: {
      ok: true,
      products: JSON.parse(JSON.stringify(streams)),
      pages: Math.ceil(streamsCount / 10),
    },
  };
}

export default Page;
