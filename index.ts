import yup from "yup";

const schema = yup.object({
  a: yup.string().optional(),
  b: yup
    .object({
      nested1: yup.number(),
    })
    .optional(),
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
