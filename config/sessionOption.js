const options = {
  host: "localhost",
  user: "root",
  password: "123456789",
  database: "closet",
  port: 3306,

  clearExpired: true, // 만료된 세션 자동 확인 및 지우기 여부
  checkExpirationInterval: 10000, // 만료된 세션이 지워지는 빈도
  expiration: 1000 * 60 * 60 * 2, // 유효 세션 시간 : 2시간
};

module.exports = options;
