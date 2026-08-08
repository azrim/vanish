#!/usr/bin/env python3
"""Example: Auto register on a website using Vanish."""
import sys
sys.path.insert(0, '..')
from vanish import VanishMail

v = VanishMail()

# 1. Generate email
mail = v.generate("azrim.biz.id")
email = mail["address"]
print(f"[*] Using email: {email}")

# 2. Register on target site (example)
# import requests
# r = requests.post("https://target.com/api/register", json={
#     "email": email,
#     "password": "your_password",
#     "name": "John Doe"
# })
# print(f"[*] Registration: {r.status_code}")

# 3. Wait for verification email
print("[*] Waiting for verification email...")
msg = v.wait_email(email, timeout=120)

if msg:
    print(f"[+] Got email from: {msg['from_addr']}")
    print(f"[+] Subject: {msg['subject']}")

    # 4. Extract verification link (example)
    # import re
    # link = re.search(r'(https://target\.com/verify\?token=[^\s"<>]+)', msg['body_html'] or msg['body_text'] or '')
    # if link:
    #     verify_url = link.group(1)
    #     requests.get(verify_url)
    #     print("[+] Email verified!")
else:
    print("[-] No verification email received")
