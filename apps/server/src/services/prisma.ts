import { PrismaClient} from "@prisma/client";
import exp from "constants";

const prisma = new PrismaClient({
    log: ['query'],
});

export default prisma;