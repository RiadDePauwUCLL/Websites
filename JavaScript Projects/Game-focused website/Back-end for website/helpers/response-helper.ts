import { Response } from "express"

export async function handle<T>(
  executor: () => Promise<T>,
  res: Response
) {
  try {
    const results = await executor();
    res.status(200).json(results);
  } catch (error) {
    const status = error.status || error.isValidationError
      ? 400
      : 500
    res.status(status).send({ status: 'error', message: error.message });
  }
}