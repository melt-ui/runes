# Migration plan

## Context

There's a lot of work to be done in Melt in general. Tons of issues and PRs.

But a lot of said work would be forgotten, or have to be rewritten, when migrating to Runes.
This is time-consuming, and a bit exhausting, if I'm being honest.

So I propose to start focusing fully on Runes, and migrating Melt to use them.

That being said, we've accumulated a lot of debt, and there are several enhancements that we sith to add, which were a bit harder to do.

But, since in this repo we can basically start "fresh", we should really take our time to make the first version of Melt w/ Runes as close to perfection as possible.

## Goals

There are several goals that we aim to achieve with Melt as a whole.

- [ ] Ease of use (enjoyable and intuitive DX)
- [ ] Make it easy to get started
- [ ] Developer ownership
  - [ ] Customizable (events, styles, overriding state and attributes)
  - [ ] Composable (avoiding too much duplication, while allowing to extend builders)
  - [ ] Package control
- [ ] Comprehensive documentation
- [ ] Straight-forward to contribute to
- [ ] Extras
  - [ ] Animation support
  - [ ] Performance
  - [ ] Bundle size

### What goes into these goals?

#### Ease of use

We kind of have this covered. Runes makes it much easier to interact with Melt. Passing in controlled props is straight-forward, no weird helpers, no need for pre-processores or extra tooling. Just install Melt and use it.

Nonetheless, Melt is still a bit more obtuse compared to something like Bits. Bits is a natural addition to Melt, and we've seen other libraries take similar approaches. React Aria offers both hooks and components, Zag js has Ark UI, and so on.

However, this does have its downsides. It's a bit harder to maintain two different repositories that tackle the same problem, the community gets fragmented, tracking the origin of bugs is harder to do, and so on.

Mostly though, it's about making sure that people who want to use Melt on its own, can do so without much hassle.

I want to tackle this problem at the source. So I want to...

#### Make it easy to get started

This one is massive. Currently we have some problems. The examples are often outdated, or not representative of a real-world use-case. It also uses external dependencies, making it a chore to copy-paste and actually use.

I have some ideas to mitigate this. For each builder, we may have several examples. However, they should all be _self-contained_, so that you can then use a CLI command to paste that example into your repository.

Some of them may have peer-dependencies. E.g. one would depend on Tailwind, another on pure CSS but have icons, etc. The important bit is to have it be super simple to get started, without much thought.

They also should be as close to a real-world use-case as possible. So it should work as a component would, with reactive props, and so on.

We can have multiple examples per component, such as what Ariakit does.

#### Developer ownership

This is also something we partially have covered. Melt is pretty customizable. However, it's not as composable. It'd be amazing to reach React Aria levels of composability, while also allowing us to really override anything we want.

#### Package control

Monorepo, nuff said.

#### Comprehensive documentation

Huge pain point currently. Our API reference is outdated, our JSDocs are lacking, and it's so hard to add a new builder.

We need:

- Auto-generated API reference from JSDocs
- JSDoc everywhere
- A easy-to-use markdown system
- Good folder structure

We should also tackle how to deal with versioning in documentation. I wonder if we can integrate that with changesets somehow. Or maybe have our doc generation tool that infers from JSDoc read the current version from the package.json, and separate it into folderrs. That'd be amazing.

#### Straight-forward to contribute to

This just boils down to having a good folder structure, clear documentation, and a comprehensive contributing guide.

#### Animation support

We currently support Svelte transitions. We should support CSS animations, auto-detecting when an animation ends in some cases before giving scroll back to the user. Other niceties such as `data-side` which are already present, etc.

#### Performance

Nuff said

#### Bundle size

Having this stated in the docs could be a plus. Not a big one. Being a monorepo with several packages helps too.

## How should we approach it?

Okay, so this is _a lot_ of work. If we just go in head-first without a plan, try and port 10 builders at once, we'll run over ourselves and make a mess out of it.

We should perfect _one_ single builder. get everything working butter smooth, where everything feels amazing. From authoring, to using it, to extending it, finding things out, etc.

We can then possibly gather feedback, see what people think about it.

Then on to the next one. Always being really careful to make sure everything is just right.

I'd also like to be extremly focused on clearing out bugs. Zag is amazing at this, they have a tight grip on issues and PRs. Taking it slow will help termendously with this.

## What about the current version of Melt?

We still support it for now, with bug fixes, community support, etc. But no major refactors or builders. We should focus on Runes.
