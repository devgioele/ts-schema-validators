import yup from "yup";
import { z } from "zod";

const schema = yup.object({
  a: yup.string(),
  b: yup.object({
    nested1: yup.number(),
  }),
  c: yup.string().required(),
  d: yup.object().when("c", {
    is: "apple",
    then: yup.object({
      count: yup.number().integer().required(),
    }),
  }),
});

type InferredType = yup.InferType<typeof schema>;

const test1: InferredType = { a: "", b: { nested1: 50 }, c: "" };
const test2: InferredType = { c: "" };
const test3: InferredType = {
  a: "",
  b: { nested1: 50 },
  c: "apple",
  d: { count: 2 },
};

type A = {
  count: number;
};

type B = {
  date: string;
};

type C = ({ count: 2 } & B) | A;

type D = {
  id: string;
} & ({ type: "A"; data: A } | { type: "B"; data: B });

const x: D = {
  id: "asdf",
  type: "B",
  data: {
    date: "asfd",
  },
};

const value1: C = { count: 2, date: "" };
const value2: C = { count: 3, date: "" };

const zodSchemaA = z.object({ count: z.number() });
const zodSchemaB = z.object({ date: z.string() });
const zodSchemaD = z
  .object({ id: z.string() })
  .and(
    z
      .object({ type: z.literal("A"), data: zodSchemaA })
      .or(z.object({ type: z.literal("B"), data: zodSchemaB }))
  );

type InferredZodD = z.infer<typeof zodSchemaD>;
