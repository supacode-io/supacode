import { makeUseAxios } from 'axios-hooks';

import { cmsRequest, request } from './request';

export const useCmsRequest = makeUseAxios({ axios: cmsRequest, cache: false, defaultOptions: { ssr: false } });
export const useRequest = makeUseAxios({ axios: request, cache: false, defaultOptions: { ssr: false } });
