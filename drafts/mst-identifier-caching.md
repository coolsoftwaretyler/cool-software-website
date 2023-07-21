Hey all, does anyone know the best way to map a model to a pivot table within MST. I’m currently doing it manually with getters but wondering if its possible to use reference and if that would help performance at all.

Tyler Williams
3 hours ago
I never took the time to really understand pivot tables in Excel. Can you say a little more about how you want it to work/maybe post a code snippet or code sandbox?
References might be faster, depending on what your getters are doing. A little hard to say.

Dean Mraz
2 hours ago
I use the pivot table to store relationship id between to models.
// Models
const Task = types
.model("Task", {
id: types.maybe(types.string),
content: types.maybe(types.string),
createdAt: types.maybe(types.string),
updatedAt: types.maybe(types.string),
inProgressAt: types.maybeNull(types.string),
completedAt: types.maybeNull(types.string),
})
.views((self) => {
return {
get userTasks() {
// pivot
const root = getRoot<any>(self);
return root.userTasks.filter(
(userTask: any) => userTask.task === self.id
);
},
get users() {
return this.userTasks.map((userTask: any) => userTask.userModel);
},
};
});

const User = types.model("User", {
id: types.maybe(types.string),
createdAt: types.maybe(types.string),
updatedAt: types.maybe(types.string),
first: types.maybe(types.string),
last: types.maybe(types.string),
email: types.maybe(types.string),
}).views((self) => {
return {
get userTasks() {
// pivot
const root = getRoot<any>(self);
return root.userTasks.filter(
(userTask: any) => userTask.user === self.id
);
},
get tasks() {
return this.userTasks.map((userTask: any) => userTask.taskModel);
},
};
});

// Pivot
const UserTask = types
.model("UserTask", {
id: types.maybe(types.string),
createdAt: types.maybe(types.string),
updatedAt: types.maybe(types.string),
workspace: types.maybe(types.string),
user: types.maybe(types.string),
task: types.maybe(types.string),
})
.views((self) => {
return {
get userModel() {
const root = getRoot<any>(self);
return root.users.find((user: any) => user.id === self.user);
},
get taskModel() {
const root = getRoot<any>(self);
return root.tasks.find((task: any) => task.id === self.task);
},
};
});

Tyler Williams
2 hours ago
I am about to run out and about but I can respond later if no one else does. Thanks for the extra details!

Tyler Williams
5 minutes ago
Ok, so yes I think you'll be better off using references. Two thoughts:
It's more conventional, and IMO, more ergonomic. I think you'll have an easier time writing code (even if you keep these computed views) that uses identifier resolution. But of course, that's purely preferential.
I haven't benchmarked this, but I believe the built in reference system will be more performant even than your cached views. I say that because the docs say:
The default implementation uses the identifier cache to resolve references
Which leads me to believe there is one single caching mechanism for identifier.
The way you have it now, you'll get the caching from the computed views get someView() - but you only really get the caching improvements after the first use of it, and that cache can get busted if your computed function has some more frequently-changing dependency.
The identifier caching mechanism is (likely) more stable, and will already exist for your models in separate parts of the tree.
I don't know the internals well enough to say that with 100% certainty, but given what I do know about the codebase and existing docs, I would bet money on this. (edited)
