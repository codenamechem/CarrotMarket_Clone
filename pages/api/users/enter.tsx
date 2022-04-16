import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body);
  return res.status(200).end();
}

// function 안에 또다른 function 호출
export default withHandler("POST", handler);
