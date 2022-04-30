import Layout from "@components/layout";
import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";

interface Post {
  title: string;
  date: string;
  category: string;
  slug: string;
}

const Blog: NextPage<{ posts: Post[] }> = ({ posts }) => {
  return (
    <Layout title="Blog" seoTitle="Blog">
      <h1 className="mt-5 mb-10 text-center text-xl font-semibold">
        Latest Posts:
      </h1>
      {posts.map((post, index) => (
        <div key={index} className="mb-5">
          <Link href={`/blog/${post.slug}`}>
            <a>
              <span className="text-lg text-red-500">{post.title}</span>
              <div>
                <span>
                  {post.date} / {post.category}
                </span>
              </div>
            </a>
          </Link>
        </div>
      ))}
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = () => {
  //정적페이지 생성시 사용 빌드시 만들어짐
  const blogPosts = readdirSync("./posts").map((file) => {
    //파일디렉터리 읽음
    const content = readFileSync(`./posts/${file}`, "utf8"); //파일 내부 읽음
    const [slug, _] = file.split(".");
    return { ...matter(content).data, slug }; //mark-down 파일 parser
  });
  return {
    props: { posts: blogPosts.reverse() },
  };
};

export default Blog;
