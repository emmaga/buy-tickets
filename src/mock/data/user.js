import Mock from 'mockjs'
const LoginUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456'
  }
]

const Users = []

for (let i = 0; i < 5; i++) {
  Users.push(Mock.mock({
    UserID: Mock.Random.guid(),
    UserName: Mock.Random.first(),
    UserLoginName: Mock.Random.first()
  }))
}

export {LoginUsers, Users}
