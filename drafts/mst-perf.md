Tyler Williams
23 hours ago
Have any of y'all ever run hermes standalone on your machine? I'm hitting a bunch of errors that I think are because I'm missing React Native polyfills. Kind of like this:
./build/hermes/create-10k-model-instances.bundle.js:19:46741: warning: the variable "Promise" was not declared in function "r 1#"
I bundled with metro and babel, but I must have missed a step because hermes ./build/hermes/create-10k-model-instances.bundle.js is giving me the above error.

Tyler Williams
23 hours ago
Maybe this? https://github.com/facebook/hermes/issues/342#issuecomment-689114812

Andy Isaacson
22 hours ago
No idea, but that interpretation sounds solid

Andy Isaacson
22 hours ago
Interesting - so the compiler is throwing warnings, that you can essentially ignore because Promise will be there once the environment is actually up and interpreting
:100:
1

Andy Isaacson
22 hours ago
Curious what you're getting up to, in the bigger sense...

Tyler Williams
22 hours ago
I am doing some benchmarking for MST and I wanna run some of the benchmarks with Hermes. I don't know enough about how these pieces fit together, but I get the sense I actually want to figure out how to build an executable from: https://github.com/tmikov/hermes/tree/fb7a2486787a2659f194936573c9a2cd1370541b/tools/node-hermes

Andy Isaacson
22 hours ago
looks like it's setup for cmake

Andy Isaacson
22 hours ago
https://github.com/tmikov/hermes/blob/fb7a2486787a2659f194936573c9a2cd1370541b/doc/BuildingAndRunning.md

Tyler Williams
22 hours ago
Yup, that'll build hermes

Tyler Williams
22 hours ago
but that doesn't include Promise and console, and a few other things that I think React Native polyfills for them

Tyler Williams
22 hours ago
whereas node-hermes seems to implement those as well. I can't quite figure out what cmake steps I need to follow to end up with an executable that will run hermes like a CLI version of Node, if that makes sense.

Andy Isaacson
22 hours ago
ah, you specifically want to build node-hermes makes sense

Tyler Williams
22 hours ago
Yeah. I've used cmake like, three times ever haha. And always on the happy-path. Was able to build the hermes binary locally with no problem, but that's where I hit the issues in my OP

Andy Isaacson
22 hours ago
https://github.com/tmikov/hermes/blob/fb7a2486787a2659f194936573c9a2cd1370541b/CMakeLists.txt#L267

Andy Isaacson
22 hours ago
Try changing that line

Andy Isaacson
22 hours ago
there's probably a way to pass flags to cmake

Tyler Williams
22 hours ago
OH

Andy Isaacson
22 hours ago
not entirely sure

Tyler Williams
22 hours ago
yes that's waht I needed

Tyler Williams
22 hours ago
I was looking at the cmakelists.txt in the node-hermes folder, but I think this'll do

Andy Isaacson
22 hours ago
I take tips through cashapp :laughing:

Andy Isaacson
22 hours ago
(very kidding)

Andy Isaacson
22 hours ago
Looks like maybe it's set up to do something like
HERMES_BUILD_NODE_HERMES=1 cmake

Tyler Williams
22 hours ago
lol you oughta, you probably just saved my whole evening from getting nerd sniped to hell

Andy Isaacson
22 hours ago
Keep me posted... I'm curious now

Andy Isaacson
22 hours ago
Never considered using Hermes for node type stuff

Tyler Williams
22 hours ago
This seems close but not quite there, I'm probably gonna reset a few things but I think this was the unlock

Tyler Williams
22 hours ago
Yeah hermes has talked a little about node replacement, basically seems like a non-starter: https://github.com/facebook/hermes/issues/60

Andy Isaacson
22 hours ago
Hah, probably why I hadn't considered it too much before :rolling_on_the_floor_laughing:

Tyler Williams
21 hours ago
cmake -S hermes -B build_release -G Ninja -DCMAKE_BUILD_TYPE=Release -DHERMES_BUILD_NODE_HERMES=ON
cmake --build ./build_release

Tyler Williams
21 hours ago
the -D is how you pass those flags in cmake apparently

Tyler Williams
21 hours ago
And given:
// test.js
console.log(1)
/Users/tylerwilliams/build_release/bin/node-hermes test.js gives me 1
:clap:
2

Tyler Williams
1 minute ago
Ope, apparently I should not do this lol: https://x.com/tmikov/status/1710346203647602727?s=20

X (formerly Twitter)X (formerly Twitter)
Tzvetan Mikov on X
@coolsoftwaredev @MSTjavascript node-hermes runs JS directly from source, without performing any optimizations.
OTOH, Hermes is designed to run optimized bytecode. It supports running directly from source for convenience in dev mode, but that can be more than 2x slower.
