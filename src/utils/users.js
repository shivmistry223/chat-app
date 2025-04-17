let users = [];

const addUser = (id, username, room) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return { error: "Username or Room must required!" };
  }

  const isUsernameExists = users.findIndex(
    (user) => user.username == username && user.room == room
  );

  if (isUsernameExists != -1) {
    return {
      error: "UserName Already Exists",
    };
  }

  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removerUser = (id) => {
  const index = users.findIndex((user) => user.id == id);

  if (index != -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  return users.find((user) => user.id == id);
};

const getUsersInRoom = (room) => users.filter((user) => user.room == room);

module.exports = {
  addUser,
  removerUser,
  getUser,
  getUsersInRoom,
};
