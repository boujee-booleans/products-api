import http from 'k6/http';

// export default function () {
//   for (let id=1; id <= 5; id += 1) {
//     http.get(`http://localhost:3000/products/${id}/styles`);
//   }
// }

export const options = {
  scenarios: {
    open_model: {
      executor: 'constant-arrival-rate',
      rate: 100,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 1,
    },
  },
};

export default function () {
  http.get(`http://localhost:3000/products/${Math.ceil(Math.random() * 9.99 + 0.01)}/styles`);
}