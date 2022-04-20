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

  const post = await client.post.findUnique({
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
      answers: {
        select: {
          answer: true,
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
      _count: {
        select: {
          answers: true,
          wondering: true,
        },
      },
    },
  });

  const isWondering = Boolean(
    await client.wondering.findFirst({
      where: { postId: +id.toString(), userId: user?.id },
      select: {
        id: true,
      },
    })
  );

  res.json({ ok: true, post, isWondering });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
