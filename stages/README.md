![Stages](https://hc-cdn.hel1.your-objectstorage.com/s/v3/1156a643c44ca761e0161da023e9b8db6fe51de2_undernet-stages.png)
---

Undernet had 6 main stages, and one video got everything started.

## 0. ORIGIN

This video was sent out in the #undercity-gates channel:

https://hc-cdn.hel1.your-objectstorage.com/s/v3/32917a22c9cdb2036cb81003de74f1f541a12d6b_video.mp4

It was made in Kdenlive.

That QR code at the end of the video leads to this image:

## 1. DECIPHER

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/6a235c37-76e5-4a7f-b658-20cd3d3d98a5" />

This is a simple subsitution alphabet made up of Orpheus sketches. The text decodes to `hack.club/wkn`, which leads to a website.

## 2. SEARCH

<img width="1161" height="1178" alt="image" src="https://github.com/user-attachments/assets/66799f7d-2c35-448c-8490-c656c522a849" />

This website - a "decryption portal" - has the user find and scan 5 QR codes hidden around GitHub HQ. Hashing is used so people can't just inspect element. The last QR code leads you to the next website.

More on the QR codes:

Random strings are encoded into each QR with qrcode-monkey.com. The website knows the hashes of these strings, but not the actual content. We get webcam access and continually scan for QRs using the `qr-scanner` library. If we find a QR, we hash it and check it against our list of hashes. 

The last QR works a little differently; instead of encoding a random string, we encode the URL to the next website. The website also knows the hash of this. If the scanned QR's content, hashed, matches the hashed URL, we redirect to the QR's content. 

Well, in theory. We had to hardcode the URL because it turned out to be different than what I printed on the QR.

## 3. INSPECT

You are greeted with an Undernet "member portal" - it has some events from years ago and a broken chat server. Unlike the last puzzle, this puzzle encourages you to use inspect element. One of the events listed is a talk about hiding messages in websites, and that's exactly what we've done here. This is hidden in the source code:

```
<!-- encrypted signal location: XXXXXXXXXXXX= -->

<!-- vignere key: SIGNAL -->
```

You'll need to unbase64 the location, then decrypt it using the Vigenere cipher with key signal. This gives you the hint "BEHIND THE STATUE".

We used [ciphereditor](https://ciphereditor.com/) to plan out layered ciphers - it's very useful for making *and* solving ARGs!

## 4. SIGNAL

Behind the statue is a breadboard with only an Orpheus Pico and LED. The LED is flashing Morse code for `6029`. Once you tell this code to an organizer, they hand you a USB stick.

*side note: We made the morse code flash way too slow, which made it very hard to understand. Someone ended up dumping the Circuitpython off of the Pico and figuring the code out that way, lol.*

## 5. FILTER

The USB stick contains a HUGE log file, as well as these instructions:

```
# UNDERNET INVESTIGATION NOTES
_by hex4 & Jenin, 2025-07-08_

This USB stick has a crash dump on it, which is probably our best bet for finding Orpheus' memories. I know she had an online-archive system in case something went wrong, but I can't seem to find the URL. The crash dump is HUGE, and for whatever stupid reason all URLs in the file are base64 encoded, so I can't just ctrl+f for undercity.quest. Good thing all the URLs (and anything else base64 encoded, of which there are a LOT) follow this format, on their own line:

base64://XXXXXXXXXXXXXX==

We'd have to write a script to find all the base64s and decode them, but I can't be bothered to do that right now.

ps. if you happen to find a memory fragment, save it to this usb stick. it'll make it easier to share with others, which we'll need to reboot orpheus.
```

If you do what it says, you'll get a link in the form of undercity.quest/XXXX. If the astro middleware works this should lead you to a memory fragment, starting the finale.

## FINALE. REMEMBER

The finale was the most broken part of Undernet, so there won't be much technical explanation here, but I can tell you how it was supposed to go:

- There are 40 memory fragments, each belonging to one of 8 core memories
- Each core memory has 5 fragments, and each corresponds to a major Hack Club event
- Memories are in this format:
  ```
  /// UNDERNET MEMORY FRAGMENT ///
  (fragment 2 of 5, memory code: DESIGN. the 4 other DESIGN fragments are required to reconstruct) 
  > reconstruction tool: undercity.quest/reconstruct
  THIS DATA IS USELESS AND NOT DECRYPTABLE WITHOUT THE OTHER FRAGMENTS.
  
  G45y7uFeD2FQ3xEiKuKTA7FRYH0fBu
  X0uoNHTUR2xndJh3DycnuACUQYXDXM
  okDKnZCLYh1SzfRroSBZt6b2UX4xn0
  Itytyq62Kf1kz8ZUT36s10bwGWjlpe
  8ck2dOjrfUdoE24itXI31GV65YzSZ4
  Trw9LeRcDvFzo5QTQFdsxgdvt0n13t
  FNk2p6F6rgZ4IriMBoVnt0C72NhyDZ
  bXqNyZUGZrmmZT6HLzSdbb4jj2hnvT
  JoznZpHdXnH9jaWjlMwj0GdJnyVRKG
  XKqR5b8hCEAofCcZoPaAS6iG400KA2
  ```
- Each person gets one memory fragment
- You need to find the other 4 people that have a fragment from the same memory as you, to "reconstruct" a core memory
- If three core memories are reconstructed before time runs out, yay! We win!
- If time runs out, the timer just keeps going lol.
