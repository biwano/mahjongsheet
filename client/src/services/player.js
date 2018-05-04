import http from './http';

export default {
  create(name) {
    return http.post('player', { name });
  },
};
