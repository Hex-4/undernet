# Generated with ChatGPT. I'm sorry.

import random
import base64
import sys
from itertools import accumulate

# === Settings ===
NUM_LINES = 1200
NUM_DECOY_BASE64 = 30
INSERT_REAL_URL_AT = 0.8  # ~80% of the way through the file

# === Log Level Escalation Probabilities ===
log_levels_escalation_ordered = [
    ("[DEBUG]", 0.3),
    ("[INFO]", 0.25),
    ("[WARN]", 0.15),
    ("[ERROR]", 0.15),
    ("[CRITICAL]", 0.1),
    ("[FATAL]", 0.05)
]
levels, weights = zip(*log_levels_escalation_ordered)
cum_weights = list(accumulate(weights))

def get_log_level(progress):
    r = random.random() * (1 + progress)
    for lvl, threshold in zip(levels, cum_weights):
        if r <= threshold:
            return lvl
    return levels[-1]

# === Log message pools ===
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
]

base64_decoy_reasons = [
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

# === Input ===
if len(sys.argv) != 3:
    print("Usage: python generate_crash_log.py <url-to-hide> <output-filename>")
    sys.exit(1)

real_url = sys.argv[1]
output_filename = sys.argv[2]
real_encoded = base64.b64encode(real_url.encode()).decode()

# === Generate log ===
log_lines = []
inserted_base64 = 0

for i in range(NUM_LINES):
    progress = i / NUM_LINES
    level = get_log_level(progress)

    if inserted_base64 < NUM_DECOY_BASE64 and random.random() < 0.05:
        reason = random.choice(base64_decoy_reasons)
        rand_bytes = random.randbytes(random.randint(10, 40))
        encoded = base64.b64encode(rand_bytes).decode()
        while base64.b64decode(encoded).decode(errors='ignore').startswith("https://"):
            rand_bytes = random.randbytes(random.randint(10, 40))
            encoded = base64.b64encode(rand_bytes).decode()
        log_lines.append(reason)
        log_lines.append(f"base64://{encoded}")
        inserted_base64 += 1
    else:
        message = random.choice(log_messages)
        log_lines.append(f"{level} {message}")

# === Insert real line ===
insert_index = int(NUM_LINES * INSERT_REAL_URL_AT)
log_lines.insert(insert_index, f"base64://{real_encoded}")
log_lines.insert(insert_index, "[CRITICAL] Saving memory fragment to:")

# === Write file ===
with open(output_filename, "w") as f:
    f.write("\n".join(log_lines))

print(f"✅ Done! Hidden URL is in `{output_filename}`.")

