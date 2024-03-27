import http from 'k6/http';

export const options = {
  scenarios: {
    open_model: {
      executor: 'constant-arrival-rate',
      rate: 1400,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 20,
    },
  },
};

export default function () {
  http.get(`http://localhost:3000/products/${Math.ceil(Math.random() * 99.99 + 0.01)}/styles`);
};


// export default function () {
//   for (let id=1; id <= 5; id += 1) {
//     http.get(`http://localhost:3000/products/${id}/styles`);
//   }
// }