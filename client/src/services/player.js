import http from '@/framework/services/http';

export default {
  create(name) {
    return http.post('player', { name });
  },
  find(query) {
    return http.get(`player/search/${query}`);
  },
};
