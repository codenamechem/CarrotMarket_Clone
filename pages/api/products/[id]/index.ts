import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;

  const product = await client.product.findUnique({
    where: {
      id: +id.toString(), //ts는 query를 string, string[]인식 (catch-all route[...id]) 그래서 string로 변형하고 +붙여 int화
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  const terms = product?.name.split(" ").map((word) => ({
    name: { contains: word },
  })); //단어를 공뱍으로 쪼개어 오브제트로 넣어줌
  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms, //단어와 같은것들을 찾음
      AND: {
        id: {
          not: product?.id, //해당제품은 빼고
        },
      },
    },
  });

  const isLiked = Boolean(
    await client.record.findFirst({
      where: {
        kind: "Fav",
        productId: product?.id,
        userId: user?.id,
      },
      select: {
        id: true,
      },
    })
  );

  res.json({ ok: true, product, relatedProducts, isLiked });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
