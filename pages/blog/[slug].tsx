import Layout from "@components/layout";
import { readdirSync } from "fs";
import matter from "gray-matter";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import { unified } from "unified";

const Post: NextPage<{ post: string; data: any }> = ({ post, data }) => {
  return (
    <Layout title={data.title} seoTitle={data.title}>
      <div
        className="blog-post-content" //className을 지정해서 globlas.css에서 style 지정가능
        dangerouslySetInnerHTML={{ __html: post }}
        /* reactJS는 기본적으로 innerHtml을 못함. 그래서 dangerouslySetInnerHTML 추가하여 가능하게 변경 */
      />
    </Layout>
  );
};

// getStaticProps을 이용한 동적 경로는 getStaticPaths를 사용해야함. 기본적으로 빌드시에만 생성됨
export const getStaticPaths: GetStaticPaths = () => {
  const files = readdirSync("./posts").map((file) => {
    const [name, extension] = file.split(".");
    return { params: { slug: name } };
  });
  return {
    paths: files,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  //ctx는 getStaticPath의 slug를 받음
  const { content, data } = matter.read(`./posts/${ctx.params?.slug}.md`);
  const { value } = await unified() //mark-down 을 HTML로 변환
    .use(remarkParse)
    .use(remarkHtml)
    .process(content);
  return {
    props: {
      data,
      post: value,
    },
  };
};

export default Post;
