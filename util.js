let records = [
  {
    id: 1,
    username: "sam",
    password: "codec@demy10",
  },
  {
    id: 2,
    username: "jill",
    password: "p@ssword123!",
  },
];

const getNewId = (array) => {
  if (array.length > 0) {
    return array[array.length - 1].id + 1;
  } else {
    return 1;
  }
};

const createNewUser = (a, b)=>{
  const newUser = {id: getNewId(records), username: a, password: b}
  return newUser;
}

const findById = (id) => {
  const element = records.find((item) => item.id == id);
  if (element) {
    console.log(element);
  } else {
    return false;
  }
};

const findByUsername = (name) => {
  const foundUser = records.find((user) => user.username == name);

  if (foundUser) {
    return foundUser;
  } else {
    return false;
  }
};

module.exports = {records, getNewId, findById, findByUsername, createNewUser};
