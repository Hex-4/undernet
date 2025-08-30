
![UNDERNET](https://hc-cdn.hel1.your-objectstorage.com/s/v3/ca2bb9faef51183e66c910be711d4e3d4eb0ffae_undernet-banner.png)
---

Undernet was an [Alternate Reality Game](https://en.wikipedia.org/wiki/Alternate_reality_game) (ARG) hosted at [Undercity](https://undercity.hackclub.com/), the largest hardware hackathon for teens, at GitHub HQ.

It was organized by @Jenin (Toronto, Canada) and @hex4 (Alberta, Canada), with help, feedback, and support from @acon, @alexren, @bunnyguy, and @phthallo.

This repo holds all the code that went into making Undernet, the source for the extremely janky website, descriptions of all the puzzles, and a postmortem.

***[/// WATCH THE VIDEO ///](https://www.youtube.com/watch?v=vvpZQBC9xms)***

***[/// PUZZLES ///](/stages/)***

![A bunch of teen hackers crowded around a table, trying to solve a puzzle](https://hc-cdn.hel1.your-objectstorage.com/s/v3/c24a5899eb9b31959c1492af03d843dce6ff4e14_image.png)

![3 people looking at a laptop](https://hc-cdn.hel1.your-objectstorage.com/s/v3/d502657cdaf79f4e8a229a399631aa03ba2950e5_image.png)
*(yes, that's jenin on the left trying to get the site working)*

## what we learned (by hex4)

Undernet was put together in around a week, so a lot of things went wrong. But there were also a ton of things that went great! Starting with the biggest issue: procrastination. Two hours before the event was scheduled, we still didn't have the site deployed, the reconstructor working, or our QR code locations finalized. 

Luckily the vibes at Undercity were great, and with the help of Annabel (@phthallo) and Copilot (be quiet.), we were able to get most things deployed and ready. Oh, and the astro middleware I had put in place to fix one of the redirects didn't work, but we wouldn't learn about that until it was too late.

The event itself went really smoothly - people were running around, solving puzzles, and having a good time. Right up until people cracked the FILTER puzzle and got their memory fragment URLs. Due to the aforementioned middleware breaking, these URLs didn't work at all.

Not to worry! Jenin and I told everyone to DM us their URL, and we'd DM them the corresponding memory fragment. I finally learned what it feels like the be a Hack Club HQ member, with 20 unread DMs. Many people assumed I was a bot, probably because of my username, which was pretty funny.

It also turned out that the link we had put in the files - undercity.quest/reconstruct 404ed, and the actual page was undercity.quest/reconstructor. That was fun to fix! Now for the actual finale. This went pretty well, and eventually we got one reconstructed memory. This team was congratulated with the message `SERVER ERROR`. Yay!11!! 

Before the event, we had to find someone to wear an Orpheus costume for the finale. Once three memories were reconstructed, Orpheus would run out and give away exclusive Undernet stickers and Celsius energy drinks. Originally our plan was to have Zach be the person to do this, but he ended up leaving before the ARG started, so Acon (the GOAT) volunteered.

The team at Undercity had a few ~~furries~~ cosplay experts, and they were able to put together a flexible TAIL and an Orpheus head with only cardboard!

If we had the chance to do this all again, here's what we would have done differently:

- Make a more engaging story. Sure, Orpheus losing her memories was fun and made for quite a few good puzzles, but I think there was definitely room for a more exciting and less "cringe" storyline.

- Lock in. Don't procrastinate until the day-of.

- Test the whole thing - and individual parts - early and often. If we had did a full run-through before the event started, we would have caught all the big issues and had a chance to fix them.

- Choose a better time. Undernet ran at midnight on Sunday, which was also the last night to work on your project (demos started monday morning). While midnight events are fun, many people were sleeping or focusing on finishing their project.

- Scope creep is real and it can hurt you. Our original plan was to have 11 stages instead of the 6 we have now. Seeing how much we struggled with 6 stages, 11 would have been a disaster.

Undernet has been one of the most rewarding experiences of my life. I learned how to manage ambition, plan events, talk to people (🤯), and work under pressure. Thank you to Jenin, Hack Club, the Highway to Undercity organizing team, and everyone that participated for making this silly story a reality.

