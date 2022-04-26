import { PrismaClient } from "@prisma/client";
import { stringify } from "querystring";

const client = new PrismaClient();

async function main() {
  //500개의 아이템 생성
  [...Array.from(Array(100).keys())].forEach(async (item) => {
    await client.product.create({
      data: {
        name: String(item),
        description: String(item),
        price: item,
        image: String(item),
        user: {
          connect: {
            id: 1,
          },
        },
      },
    });
    console.log(`${item}/100`);
  });
}

main()
  .catch((e) => console.log(e))
  .finally(() => client.$disconnect());
