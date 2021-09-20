import * as randomstring from "randomstring";

export const genNumberCode = (length: number, charset: string) => {
  return randomstring.generate({
    length,
    charset,
  });
};

export const genCode = (length: number) => {
  return randomstring.generate(length);
};
