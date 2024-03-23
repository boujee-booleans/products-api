import http from 'k6/http';

export default function () {
  for (let id=1; id <= 1000000; id += 99988) {
    http.get(`http://localhost:3000/products/${id}/styles`);
  }
}