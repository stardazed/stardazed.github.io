---
layout: post
title:  "Tiling Light"
date:   2016-12-31 16:00:00 +0100
---

Stardazed supports 3 types of lights: directional, point and spot lights. These are the basic types of
lights supported by most, if not all game engines. Up to recently SD had a hard limit of 4 active lights
at any time. The light information was stored in a couple of uniform arrays like so:

{% highlight glsl %}
const int MAX_FRAGMENT_LIGHTS = 4;

uniform int lightTypes[MAX_FRAGMENT_LIGHTS];
uniform vec4 lightPositions_cam[MAX_FRAGMENT_LIGHTS];
uniform vec4 lightPositions_world[MAX_FRAGMENT_LIGHTS];
uniform vec4 lightDirections[MAX_FRAGMENT_LIGHTS];
uniform vec4 lightColours[MAX_FRAGMENT_LIGHTS];
uniform vec4 lightParams[MAX_FRAGMENT_LIGHTS];
{% endhighlight %}



[tian]: https://hacks.mozilla.org/2014/01/webgl-deferred-shading/

