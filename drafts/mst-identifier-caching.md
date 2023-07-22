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

For sure!
I also asked ChatGPT about the performance and got an interesting answer that sounds reasonable/confirms my suspicions, but I may end up testing for validity:
In general, using references in MobX-State-Tree (MST) models can offer better performance compared to using strings for representing relationships. Here are some reasons why references might be faster:
Direct References: When you use references, MST maintains direct references between related objects. This means that accessing related models is a direct memory access operation, which is very efficient. On the other hand, using strings requires additional lookups and comparisons to find the associated objects, which can be slower, especially as the number of objects grows.
Efficient Updates: When you modify a reference field in an MST model, MST automatically handles the updates to the related objects and ensures the data consistency. This process is more efficient than manually updating the pivot table, which might require multiple updates and lookups.
MobX Reactive System: MST leverages the MobX reactive system to track dependencies and efficiently update only the affected parts of the data. This mechanism allows MST to optimize computations and reduce unnecessary re-renders.
Easier Traversal: References provide a more natural way to traverse relationships, making your code easier to read and maintain. With strings and a pivot table, you need to write additional views or functions to access the related objects, which can add complexity and potentially decrease performance.
However, it's important to note that the actual performance difference depends on the size and complexity of your data, the number of relationships, and how you use the models in your application. In some cases, the difference in performance might be negligible, especially with smaller datasets.
In scenarios where performance is a crucial concern, you can consider benchmarking both approaches with realistic data and usage patterns to measure their performance in your specific use case. This will help you determine the most suitable approach for your application.
In summary, using references in MST models is generally a more efficient and natural way to represent relationships between objects. It can provide better performance and easier code maintenance compared to using strings and a pivot table, especially for larger datasets and more complex relationships.
