---
layout: post
title:  "Hardware Vertex Skinning in WebGL"
date:   2016-03-03 10:00:00 +0100
---

FBX is a [3D data interchange][fbx] format supported by practically all 3D modelling programs and as such
has become a de facto standard source format for many game engines. For example, Unity and Unreal Engine
assets are predominantly FBX files.

Currently, Stardazed can import data from v7.x FBX files in both binary and ASCII encodings and extract
skeleton hierarchies, skeletal animations, geometries (meshes only), materials, textures, etc.
ready for use in-engine. The final part in development now is the vertex skinning information.

To ensure that SD would not get a biased implementation of vertex skinning and rigged models I took a
quick detour to import the [MD5 file format][md5] used by Doom 3. The format is particularly suited to make
a reference implementation against as it is clutter-free, well-organised and easy to understand, things
I would not immediately say about the FBX file format.

In addition, while Doom 3 is an older game from 2004, the core principles of rigging and skinning have
not really changed since then (as far as I know). A model has a hierarchy of joints (or bones) and
each of the meshes' vertex positions are calculated from 1 or more weighted joint-relative positions.

While Doom 3 calculated the final positions using optimized SIMD code on the CPU, I decided from the beginning
that the skinning would take place on the GPU in the vertex shader. Even if the [mythical SIMD instructions][simd]
ever become generally available in browsers, it's still more efficient to just let the GPU handle
it as we've got a lot more GPU time than CPU time available per frame.

#### Implementation

For the vertex shader to be able to calculate the vertex's final position, it needs a few pieces of
information:

- The current transforms of the joints
- The indexes of the joints of each of the weights
- The joint-relative position and bias of each weight

I initially wanted to just pass in the joint data as a uniform array of positions and weights and then
just index into that array with each of weight's joint index but that is not allowed in WebGL 1.

In WebGL we only have vertex attributes, uniforms and samplers to pass data to shader functions.
No uniform blocks, texture buffers or stuff like that. In addition, and more importantly, any array may
only be indexed by either a constant value or the index variable of a for-loop. Using an arbitrary
variable as an index is _verboten_.

So, change of plans, what is arbitrarily indexable? Textures. I went with the following data layout:

{% highlight glsl %}
// Per-vertex data in attributes
vec4 vertexJointIndexes;         // Four joint indexes (-1 means end of array)
vec4 vertexWeightedPos0_joint;   // xyz = joint-relative pos, w = weight
vec4 vertexWeightedPos1_joint;   //       "          "          "
vec4 vertexWeightedPos2_joint;   //       "          "          "
vec4 vertexWeightedPos3_joint;   //       "          "          "

// Uniforms
sampler2D jointData;
{% endhighlight %}

The `jointData` is a texture with 4-component float element pixels. Each joint is encoded in
8 pixels, the last 4 forming a `mat4` describing the full transform of the joint in model-space.
In the vertex shader, the weight positions are then transformed by the corresponding joint
and scaled by their bias and added together for the final position.

The main downside of this data layout is that each vertex can have no more than 4 weights.
Some of the MD5 models use 5 for some vertexes but ever since vertex skinning moved to hardware
I've understood that a limit of 4 has become quite common. Additionally, if a vertex uses less
than 4 weights, the unused attribute vectors still need to be in the vertex buffer. Simple
models will thus have quite a bit of dead weight, but looking at more modern models I've seen
3 or 4 bones per vertex being the average so I feel this is a reasonable compromise, especially
for a first implementation.

Another minor point is that float textures are not part of standard WebGL, but an extension.
It is a very common extension though, mostly being unavailable on lower-end mobile phones. I
am completely fine with that as those lower-end devices are not very suitable for browser-based
3D games anyway.

But enough of that. Here's Bob, a free MD5 model I used for testing:

![Model of Bob in skeletal and skinned views](/assets/bob-skel.gif "Bob's got some big hands")

The image alternates between a visualisation of the joint nodes and the skinned mesh. Joints in
Stardazed are just represented by normal hierarchical entities and can be mixed with non-skeletal
entities such as the light that I added manually as a child of the lamp's joint node.

What's left now is just cleaning up and ordering the prototype code and wrangling the FBX data to
work in this model as well. Piece of cake…


[fbx]: http://www.autodesk.com/products/fbx/overview
[md5]: http://tfc.duke.free.fr/coding/md5-specs-en.html
[simd]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SIMD
