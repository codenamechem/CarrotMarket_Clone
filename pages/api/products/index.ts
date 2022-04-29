import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const {
      query: { page },
    } = req;

    const products = await client.product.findMany({
      include: {
        _count: {
          select: {
            favs: true,
          },
        },
      },
      take: 10,
      skip: page ? (+page - 1) * 10 : 0,
    });
    const productCount = await client.product.count();
    res.json({
      ok: true,
      products,
      pages: Math.ceil(productCount / 10),
    });
  }

  if (req.method === "POST") {
    const {
      body: { name, price, description, photoId },
      session: { user },
    } = req;

    const product = await client.product.create({
      data: {
        name,
        price: +price, //string to int
        description,
        image: photoId,
        user: { connect: { id: user?.id } },
      },
    });

    res.json({ ok: true, product });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
