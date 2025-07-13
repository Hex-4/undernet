
import os
import random
import base64
from itertools import accumulate

NUM_LINES = 1200
NUM_DECOY_BASE64 = 30
DRIVE_PATH = "D:\\"
INSERT_REAL_URL_RANGE = (0.75, 0.96)
NOTES_MD_CONTENT = """# UNDERNET INVESTIGATION NOTES
_by hex4 & Jenin, 2025-07-08_

This USB stick has a crash dump on it, which is probably our best bet for finding Orpheus' memories. I know she had an online-archive system in case something went wrong, but I can't seem to find the URL. The crash dump is HUGE, and for whatever stupid reason all URLs in the file are base64 encoded, so I can't just ctrl+f for undercity.quest. Good thing all the URLs (and anything else base64 encoded, of which there are a LOT) follow this format, on their own line:

base64://XXXXXXXXXXXXXX==

We'd have to write a script to find all the base64s and decode them, but I can't be bothered to do that right now.

ps. if you happen to find a memory fragment, save it to this usb stick. it'll make it easier to share with others, which we'll need to reboot orpheus.
"""

log_levels = [
    ("[DEBUG]", 0.3),
    ("[INFO]", 0.25),
    ("[WARN]", 0.15),
    ("[ERROR]", 0.15),
    ("[CRITICAL]", 0.1),
    ("[FATAL]", 0.05)
]

log_messages = [
    "Initializing memory subsystem...",
    "Thread pool deadlocked. Spawning recovery workers.",
    "Memory leak detected in core module.",
    "Unhandled signal received. Dumping state...",
    "Orpheus heartbeat lost. Attempting resync.",
    "Entropy pool depleted. Using fallback source.",
    "Checksum mismatch on core.dat, retrying...",
    "Reconstructing neural vector graph...",
    "Shadow buffer flushed prematurely.",
    "Kernel received malformed heartbeat.",
    "Finalizing backup to /dev/usb1...",
    "Node graph traversal interrupted midstream.",
    "Voltage spike on GPIO16. Switching to fallback.",
    "Error 0x71: Recursive hallucination detected.",
    "Fragment offset misaligned. Realigning memory...",
    "Artificial entropy generator halted.",
    "Pipeline CRC mismatch logged.",
    "Mounting crash dump to temp buffer...",
    "Message broker overload: queued 1421 unprocessed hints.",
    "Skipping body sync.",
    "0 hackers online.",
    "Initiating periodic reload of critical files...",
    "Done! Synced 0 files with 0 offsite backups."
]

base64_decoys = [
    "[INFO] Saving current timestamp as base64 for no reason:",
    "[DEBUG] Current thread, in base64:",
    "[WARN] Failed to ping server, base64 response received:",
    "[TRACE] Logging debug string in base64:",
    "[CACHE] Storing LRU cache key (base64):",
    "[SYS] Encoded session token in base64:",
    "[ERROR] base64 error report dump follows:",
    "[I/O] Base64 output of recent disk activity:",
    "[MEMORY] Encoded memory pointer in base64:",
]

codes = [
    "0948", "7736", "2863", "9376", "2663", "5723", "9038", "6425", "3482", "6959",
    "7140", "5780", "0143", "6493", "1073", "0111", "6697", "9671", "1525", "3343",
    "4566", "7419", "1065", "1830", "6344", "5810", "5066", "9074", "6288", "3071",
    "9399", "8719", "4951", "7065", "5327", "9015"
]

codes = [
    "9671", "1525", "3343",
    "4566", "7419", "1065", "1830", "6344", "5810", "5066", "9074", "6288", "3071",
    "9399", "8719", "4951", "7065", "5327", "9015"
]

def get_log_level(progress, cum_weights, levels):
    r = random.random() * (1 + progress)
    for lvl, threshold in zip(levels, cum_weights):
        if r <= threshold:
            return lvl
    return levels[-1]

def generate_crash_log(code, output_path):
    full_url = f"https://undercity.quest/{code}"
    real_encoded = base64.b64encode(full_url.encode()).decode()

    levels, weights = zip(*log_levels)
    cum_weights = list(accumulate(weights))
    log_lines = []
    inserted_base64 = 0

    for i in range(NUM_LINES):
        progress = i / NUM_LINES
        level = get_log_level(progress, cum_weights, levels)

        if inserted_base64 < NUM_DECOY_BASE64 and random.random() < 0.05:
            reason = random.choice(base64_decoys)
            rand_bytes = os.urandom(random.randint(10, 40))
            encoded = base64.b64encode(rand_bytes).decode()
            while base64.b64decode(encoded).decode(errors='ignore').startswith("https://"):
                rand_bytes = os.urandom(random.randint(10, 40))
                encoded = base64.b64encode(rand_bytes).decode()
            log_lines.append(reason)
            log_lines.append(f"base64://{encoded}")
            inserted_base64 += 1
        else:
            message = random.choice(log_messages)
            log_lines.append(f"{level} {message}")

    insert_index = int(NUM_LINES * random.uniform(*INSERT_REAL_URL_RANGE))
    log_lines.insert(insert_index, f"base64://{real_encoded}")
    log_lines.insert(insert_index, "[CRITICAL] Saving memory fragment to:")

    with open(output_path, "w") as f:
        f.write("\n".join(log_lines))

def write_to_usb(code):
    input(f"Insert USB for code {code} and press Enter...")
    notes_path = os.path.join(DRIVE_PATH, "NOTES.md")
    dump_path = os.path.join(DRIVE_PATH, "orpheus_crash_dump.log")

    with open(notes_path, "w") as f:
        f.write(NOTES_MD_CONTENT)

    generate_crash_log(code, dump_path)
    print(f"✅ USB written with code {code}")

def main():
    print("🔁 UNDERNET USB WRITER 🔁")
    for code in codes:
        write_to_usb(code)

if __name__ == "__main__":
    main()
