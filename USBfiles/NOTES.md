# UNDERNET INVESTIGATION NOTES
_by hex4 & Jenin, 2025-07-08_

This USB stick has a crash dump on it, which is probably our best bet for finding Orpheus' memories. I know she had an online-archive system in case something went wrong, but I can't seem to find the URL. The crash dump is HUGE, and for whatever stupid reason all URLs in the file are base64 encoded, so I can't just ctrl+f for undercity.quest. Good thing all the URLs (and anything else base64 encoded, of which there are a LOT) follow this format, on their own line:

base64://XXXXXXXXXXXXXX==

We'd have to write a script to find all the base64s and decode them, but I can't be bothered to do that right now.

ps. if you happen to find a memory fragment, save it to this usb stick. it'll make it easier to share with others, which we'll need to reboot orpheus.