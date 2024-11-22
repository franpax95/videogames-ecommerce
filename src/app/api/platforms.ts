import { AxiosRequestConfig } from 'axios';
import { api } from '.';

export const getPlatforms = (options: AxiosRequestConfig = {}) =>
  api({
    ...options,
    url: `platforms?populate=icon&sort=order:asc`
  }).then((res) => res.data);
