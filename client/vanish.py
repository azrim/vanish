#!/usr/bin/env python3
"""Vanish Temp Mail API Client — for farming automation."""
import requests
import time

BASE = "https://vanish.solvege.my.id"  # Custom subdomain

class VanishMail:
    def __init__(self, base_url=BASE):
        self.base = base_url

    def get_domains(self):
        """List available domains."""
        return requests.get(f"{self.base}/api/domains").json()

    def generate(self, domain=None):
        """Generate temp email. Returns dict with id, address, domain, expires_at."""
        if not domain:
            domains = self.get_domains()
            domain = domains[0]["domain"]
        r = requests.post(f"{self.base}/api/generate", json={"domain": domain})
        r.raise_for_status()
        return r.json()

    def inbox(self, address):
        """Get inbox messages. Returns list of {id, from_addr, subject, received_at}."""
        r = requests.get(f"{self.base}/api/inbox/{requests.utils.quote(address)}")
        return r.json()

    def read(self, message_id):
        """Read full message. Returns dict with body_text, body_html, etc."""
        r = requests.get(f"{self.base}/api/read/{message_id}")
        r.raise_for_status()
        return r.json()

    def wait_email(self, address, timeout=120, interval=3):
        """Poll inbox until email arrives. Returns first message dict."""
        start = time.time()
        while time.time() - start < timeout:
            msgs = self.inbox(address)
            if msgs:
                return self.read(msgs[0]["id"])
            time.sleep(interval)
        return None

    def get_address(self, domain=None):
        """Quick: generate + return email string."""
        return self.generate(domain)["address"]


if __name__ == "__main__":
    v = VanishMail()

    # Generate email
    mail = v.generate()
    print(f"Email: {mail['address']}")
    print(f"Expires: {mail['expires_at']}")

    # Wait for verification email
    print("Waiting for email...")
    msg = v.wait_email(mail["address"], timeout=120)
    if msg:
        print(f"From: {msg['from_addr']}")
        print(f"Subject: {msg['subject']}")
        print(f"Body: {msg['body_text'][:200]}")
    else:
        print("No email received")
