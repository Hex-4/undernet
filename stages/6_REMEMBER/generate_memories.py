import random
import string

memories = ["BUILD", "DESIGN", "LIVE", "VIRAL", "DREAM", "SAIL", "ADVENTURE", "HIKE"]

codes = [
    "4808", "9574", "9008", "4182", "0948", "7736", "2863", "9376", "2663", "5723", "9038", "6425", "3482", "6959",
    "7140", "5780", "0143", "6493", "1073", "0111", "6697", "9671", "1525", "3343",
    "4566", "7419", "1065", "1830", "6344", "5810", "5066", "9074", "6288", "3071",
    "9399", "8719", "4951", "7065", "5327", "9015"
]

cm = 0
idx = 0
fg = 1

for i in memories:
    fg = 1
    for e in range(1,6): # 1, 2, 3, 4, 5
        with open(f"{codes[idx]}.txt", "w") as f:
            f.write(f"""/// UNDERNET MEMORY FRAGMENT ///
 (fragment {fg} of 5, memory code: {memories[cm]}. the 4 other {memories[cm]} fragments are required to reconstruct) 
> reconstruction tool: undercity.quest/reconstruct
THIS DATA IS USELESS AND NOT DECRYPTABLE WITHOUT THE OTHER FRAGMENTS.

""")
            for j in range(10):
                f.write(''.join(random.choices(string.ascii_letters + string.digits, k=30)) + "\n")
            
        idx += 1
        fg += 1
    cm += 1