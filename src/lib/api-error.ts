import { SerializedError } from '@/types/serialized-error';
import { AxiosError } from 'axios';
import { API_ERROR } from './constants';

export class ApiError<T = unknown> extends Error {
  public type: string = '';
  public axiosError?: AxiosError<T>;

  constructor(data: SerializedError | API_ERROR) {
    super(typeof data === 'string' ? data : data.error.type);
    this.name = 'ApiError';

    // API_ERROR
    if (typeof data === 'string') {
      this.type = data;
    }

    // Serialized Error
    else {
      const { error } = data;
      this.type = error.type;
      if (error.axiosError) {
        this.axiosError = JSON.parse(error.axiosError);
      }
    }

    // Esto es necesario en TypeScript para mantener la cadena de prototipos correctamente
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      axiosError: this.axiosError
        ? {
            message: this.axiosError.message,
            code: this.axiosError.code,
            response: {
              status: this.axiosError.response?.status,
              data: this.axiosError.response?.data
            }
          }
        : undefined
    };
  }
}
