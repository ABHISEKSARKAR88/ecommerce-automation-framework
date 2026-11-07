
import Ajv from 'ajv';

const ajv = new Ajv({
  allErrors: true,
});

export function validateSchema(schema, responseBody) {

  const validate = ajv.compile(schema);

  const isValid = validate(responseBody);

  if (!isValid) {
    const errors = validate.errors
      .map(error =>
        `${error.instancePath || '/'} ${error.message}`
      )
      .join('\n');

    throw new Error(`JSON Schema validation failed:\n${errors}`);
  }

  return true;
}
