"""JazzCash payment gateway integration (stub-ready).

Implements the JazzCash HTTP-POST (hosted checkout) request signing flow.
When credentials are missing the gateway returns mock data.
"""
from __future__ import annotations

import hashlib
import hmac
from datetime import datetime, timedelta
from decimal import Decimal

from django.conf import settings


class JazzCashGateway:
    """Build and verify JazzCash hosted-checkout payloads."""

    SANDBOX_URL = (
        "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/"
        "merchantform/"
    )

    def __init__(self) -> None:
        self.merchant_id = settings.JAZZCASH_MERCHANT_ID
        self.password = settings.JAZZCASH_PASSWORD
        self.salt = settings.JAZZCASH_INTEGRITY_SALT
        self.return_url = settings.JAZZCASH_RETURN_URL
        self.enabled = bool(self.merchant_id and self.password and self.salt)

    def _secure_hash(self, fields: dict) -> str:
        """Compute the HMAC-SHA256 secure hash over sorted field values."""
        sorted_values = [str(fields[key]) for key in sorted(fields) if fields[key] != ""]
        message = self.salt + "&" + "&".join(sorted_values)
        return hmac.new(
            self.salt.encode("utf-8"), message.encode("utf-8"), hashlib.sha256
        ).hexdigest()

    def initiate_payment(self, *, amount: Decimal, order_number: str) -> dict:
        """Build a signed JazzCash request payload for the given order."""
        now = datetime.now()
        amount_minor = str(int((amount * 100).to_integral_value()))
        txn_ref = f"T{now.strftime('%Y%m%d%H%M%S')}"

        if not self.enabled:
            return {
                "post_url": self.SANDBOX_URL,
                "fields": {
                    "pp_TxnRefNo": txn_ref,
                    "pp_Amount": amount_minor,
                    "pp_BillReference": order_number,
                },
                "mock": True,
            }

        fields = {
            "pp_Version": "1.1",
            "pp_TxnType": "MWALLET",
            "pp_Language": "EN",
            "pp_MerchantID": self.merchant_id,
            "pp_Password": self.password,
            "pp_TxnRefNo": txn_ref,
            "pp_Amount": amount_minor,
            "pp_TxnCurrency": "PKR",
            "pp_TxnDateTime": now.strftime("%Y%m%d%H%M%S"),
            "pp_TxnExpiryDateTime": (now + timedelta(hours=1)).strftime(
                "%Y%m%d%H%M%S"
            ),
            "pp_BillReference": order_number,
            "pp_Description": f"Bookshelf order {order_number}",
            "pp_ReturnURL": self.return_url,
        }
        fields["pp_SecureHash"] = self._secure_hash(fields)
        return {"post_url": self.SANDBOX_URL, "fields": fields, "mock": False}

    def verify_callback(self, data: dict) -> bool:
        """Verify the secure hash on a JazzCash callback payload."""
        if not self.enabled:
            return True
        received_hash = data.get("pp_SecureHash", "")
        fields = {k: v for k, v in data.items() if k != "pp_SecureHash"}
        expected = self._secure_hash(fields)
        return hmac.compare_digest(received_hash, expected)
