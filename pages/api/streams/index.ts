import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    body: { name, price, description },
  } = req;

  if (req.method === "POST") {
    const stream = await client.stream.create({
      data: {
        name,
        price,
        description,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({ ok: true, stream });
  } else if (req.method === "GET") {
    const {
      query: { page },
    } = req;

    const streams = await client.stream.findMany({
      take: 10,
      skip: page ? (+page - 1) * 10 : 0,
    });
    const streamsCount = await client.product.count();
    res.json({ ok: true, streams, pages: Math.ceil(streamsCount / 10) });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
