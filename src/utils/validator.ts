import { emailRegex } from 'src/constants';

interface IValidationOption {
  name: string;
  value: any;
  options?: {
    required?: boolean;
    isEmail?: boolean;
    isString?: boolean;
    isNumber?: boolean;
    isPhoneNumber?: boolean;
    isDate?: boolean;
    isArray?: boolean;
    isPassword?: boolean;
    regex?: RegExp;
    length?: number;
    lengthGreatherThan?: number;
    lengthLesserThan?: number;
    equalTo?: any;
    limit?: number;
    equalToAny?: any[];
    isBoolean?: boolean;
  };
}

export function validator(
  inputs: Array<IValidationOption>,
): Array<{ valid: boolean; msg: Array<string> }> | null {
  let output: Array<{ valid: boolean; msg: Array<string> }> = new Array(
    inputs.length,
  );

  for (const index in inputs) {
    // console.log(
    //   inputs[index]?.value,
    //   inputs[index]?.value?.length,
    //   inputs[index]?.options,
    //   inputs[index].options.required && !inputs[index].value,
    // );

    if (!inputs[index]) continue;

    if (
      (inputs[index].options.required &&
        !inputs[index].options.isBoolean &&
        !inputs[index].value &&
        inputs[index].value !== 0) ||
      inputs[index]?.value?.toString()?.length === 0
    ) {
      output[index] = {
        valid: false,
        msg: [`${inputs[index].name} cannot be empty`],
      };
      continue;
    }

    if (
      inputs[index].options.isEmail &&
      !emailRegex.test(inputs[index].value?.toString())
    ) {
      output[index] = {
        valid: false,
        msg: [
          ...(output[index]?.msg || []),
          `${inputs[index].name} is not a valid email address`,
        ],
      };
    }

    if (
      inputs[index].options.isEmail &&
      typeof inputs[index].value !== 'string'
    ) {
      output[index] = {
        valid: false,
        msg: [
          ...(output[index]?.msg || []),
          `${inputs[index].name} is not a valid string`,
        ],
      };
    }

    if (
      inputs[index].options.isString &&
      typeof inputs[index].value !== 'string'
    ) {
      output[index] = {
        valid: false,
        msg: [
          ...(output[index]?.msg || []),
          `${inputs[index].name} is not a valid string`,
        ],
      };
    }

    if (
      inputs[index].options.isNumber &&
      typeof inputs[index].value !== 'number'
    ) {
      output[index] = {
        valid: false,
        msg: [
          ...(output[index]?.msg || []),
          `${inputs[index].name} is not a valid number`,
        ],
      };
    }

    if (
      inputs[index].options.isDate &&
      new Date(inputs[index].value as string).getDate() === NaN
    ) {
      output[index] = {
        valid: false,
        msg: [
          ...(output[index]?.msg || []),
          `${inputs[index].name} is not a valid date stamp`,
        ],
      };
    }

    if (
      inputs[index].options.isPhoneNumber &&
      !/(^(\+234)|^0)\d{10}$/g.test(inputs[index]?.value?.toString())
    ) {
      output[index] = {
        valid: false,
        msg: [
          ...(output[index]?.msg || []),
          `${inputs[index].name} is not a valid phone number`,
        ],
      };
    }

    if (
      inputs[index].options.regex &&
      inputs[index].options.regex.test(inputs[index].value.toString())
    ) {
      output[index] = {
        valid: false,
        msg: [
          ...(output[index]?.msg || []),
          `${inputs[index].name} is not a valid value`,
        ],
      };
    }

    if (
      inputs[index].options.length &&
      inputs[index].value.toString()?.length !== inputs[index].options.length
    ) {
      output[index] = {
        valid: false,
        msg: [
          ...(output[index]?.msg || []),
          `length of ${inputs[index].name} must be equal to ${inputs[index].options.length}`,
        ],
      };
    }

    if (
      inputs[index].options.lengthGreatherThan &&
      inputs[index].value.toString()?.length <=
        inputs[index].options.lengthGreatherThan
    ) {
      output[index] = {
        valid: false,
        msg: [
          ...(output[index]?.msg || []),
          `length of ${inputs[index].name} must be greater than ${inputs[index].options.lengthGreatherThan}`,
        ],
      };
    }

    if (
      inputs[index].options?.lengthLesserThan &&
      inputs[index].value.toString()?.length >=
        inputs[index].options.lengthLesserThan
    ) {
      output[index] = {
        valid: false,
        msg: [
          ...(output[index]?.msg || []),
          `length of ${inputs[index].name} must be greater than ${inputs[index].options.lengthLesserThan}`,
        ],
      };
    }

    if (
      inputs[index].options.equalTo &&
      inputs[index].value !== inputs[index].options.equalTo
    ) {
      output[index] = {
        valid: false,
        msg: [
          ...(output[index]?.msg || []),
          `${inputs[index].name} must be the same as ${inputs[index].options.equalTo}`,
        ],
      };
    }
    if (
      inputs[index].options.equalToAny &&
      inputs[index].options.equalToAny.indexOf(inputs[index].value) === -1
    ) {
      output[index] = {
        valid: false,
        msg: [
          ...(output[index]?.msg || []),
          `${inputs[index].name} must be either of '${inputs[index].options.equalToAny}'`,
        ],
      };
    }

    if (
      inputs[index].options.isBoolean &&
      typeof inputs[index].value !== 'boolean'
    ) {
      output[index] = {
        valid: false,
        msg: [
          ...(output[index]?.msg || []),
          `${inputs[index].name} is not a valid boolean value`,
        ],
      };
    }

    if (
      inputs[index].options.isPassword &&
      (!/[a-z]/g.test(inputs[index].value as string) ||
        !/[A-Z]/g.test(inputs[index].value as string) ||
        !/[0-9]/g.test(inputs[index].value as string) ||
        !/[!|@|#|\$|%|\^|&|\*|\(|\)|\-|=|\+|\\|\||\[|\]|\{|\}|:|;|'|"|~|`|\/|?|\.|\,|<|>]/g.test(
          inputs[index].value as string,
        ))
    ) {
      output[index] = {
        valid: false,
        msg: [
          ...(output[index]?.msg || []),
          `${inputs[index].name} must contain at least one capital & small letter, number and special characters`,
        ],
      };
    }

    if (
      inputs[index].options.limit &&
      Object.keys(inputs[index]?.value)?.length > inputs[index].options.limit
    ) {
      output[index] = {
        valid: false,
        msg: [
          `${inputs[index].name} cannot be more than ${inputs[index]?.options?.limit}`,
        ],
      };
    }

    if (
      inputs[index].options.isArray &&
      typeof inputs[index].value === 'object' &&
      !Array.isArray(inputs[index].value)
    ) {
      output[index] = {
        valid: false,
        msg: [
          ...(output[index]?.msg || []),
          `${inputs[index].name} is not a valid array`,
        ],
      };
    }
  }
  output = output.filter((item) => item);

  return output.length === 0 ? null : output;
}

export const randStringGenerator = () => {
  let value = Math.random()
    .toString(16)
    .match(/(?<=\.)\w+$/g)?.[0]
    ?.slice(0, 14);
  value = value.length !== 13 ? randStringGenerator() : value;
  return value;
};
