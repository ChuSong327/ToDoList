
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('todo').del()
    .then(function () {
      const todos = [{
        Title: "Build a ToDoList App",
        Priority: 1,
        Date: new Date()
      },
      {
        Title: "Play with Cats",
        Priority: 5,
        Date: new Date()
      },
      {
        Title: "Watch a Movie",
        Priority: 3,
        Date: new Date()
      }]
      return knex("todo").insert(todos);
    });
};
