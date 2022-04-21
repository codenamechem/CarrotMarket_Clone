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

  const alreadyExits = await client.record.findFirst({
    where: {
      kind: "Fav",
      productId: +id.toString(),
      userId: user?.id,
    },
  });

  if (alreadyExits) {
    await client.record.delete({
      where: {
        id: alreadyExits.id,
      },
    });
  } else {
    await client.record.create({
      data: {
        kind: "Fav",
        user: {
          connect: {
            id: user?.id,
          },
        },
        product: {
          connect: {
            id: +id.toString(),
          },
        },
      },
    });
  }

  res.json({ ok: true });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
