import * as randomstring from "randomstring";

export const genCode = (length: number, charset: string) => {
  return randomstring.generate({
    length,
    charset,
  });
};
