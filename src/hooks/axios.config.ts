import ax, {AxiosResponse} from 'axios';

export interface IApiError<T = string> {
  errors: T[];
}

export const DEV_URL = 'https://api.evolvevw.com';

export const BASE_PATH = DEV_URL;

export const axios = ax.create({
  baseURL: BASE_PATH,
  headers: {
    'Content-Type': 'application/json', // Add the Content-Type header here
  },
});

axios.interceptors.response.use(
  function (
    res: AxiosResponse<
      [{success: boolean; message: string; [x: string]: any}],
      any
    >,
  ) {
    if (!res.data[0]?.success === false) {
      console.log('ERROR :: ', res.data[0]);

      return Promise.reject({errors: [res.data[0].message]});
    }

    return res;
  },

  function (error) {
    console.log('error', error.response, error.request);
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    const defaultMessage = 'Something went wrong, please try again.';

    console.log('ERROR :: ', error.response.data);
    const message = error?.response?.data ||
      error?.response?.data?.detail ||
      error?.response?.data?.message || [error?.message, defaultMessage]; // on PROD we'll change this to [defaultMessage, error?.message]

    return Promise.reject({errors: [message].flat(2)});
  },
);
