"""JazzCash (Pakistan) gateway integration stub.

Implements the secure-hash request signing flow used by JazzCash. Operates in
mock mode when merchant credentials are not configured.
"""
from __future__ import annotations

import hashlib
import hmac
from datetime import datetime, timedelta
from decimal import Decimal

from django.conf import settings


class JazzCashGateway:
    def __init__(self) -> None:
        self.merchant_id = settings.JAZZCASH_MERCHANT_ID
        self.password = settings.JAZZCASH_PASSWORD
        self.salt = settings.JAZZCASH_INTEGRITY_SALT
        self.enabled = bool(self.merchant_id and self.salt)

    def _secure_hash(self, payload: dict) -> str:
        sorted_values = [str(payload[key]) for key in sorted(payload) if payload[key] != ""]
        message = self.salt + "&" + "&".join(sorted_values)
        return hmac.new(
            self.salt.encode("utf-8"), message.encode("utf-8"), hashlib.sha256
        ).hexdigest().upper()

    def initiate_payment(self, *, amount: Decimal, order_number: str) -> dict:
        """Build the signed payload for a JazzCash hosted-checkout redirect."""
        now = datetime.now()
        txn_ref = f"T{now.strftime('%Y%m%d%H%M%S')}"
        payload = {
            "pp_Version": "1.1",
            "pp_TxnType": "MWALLET",
            "pp_MerchantID": self.merchant_id,
            "pp_Password": self.password,
            "pp_TxnRefNo": txn_ref,
            "pp_Amount": str(int(Decimal(amount) * 100)),
            "pp_TxnCurrency": "PKR",
            "pp_TxnDateTime": now.strftime("%Y%m%d%H%M%S"),
            "pp_TxnExpiryDateTime": (now + timedelta(hours=1)).strftime("%Y%m%d%H%M%S"),
            "pp_BillReference": order_number,
            "pp_Description": f"Bookshelf.pk order {order_number}",
            "pp_ReturnURL": settings.JAZZCASH_RETURN_URL,
        }
        if not self.enabled:
            return {"mock": True, "payload": payload, "secure_hash": "MOCK_HASH"}
        payload["pp_SecureHash"] = self._secure_hash(payload)
        return {"mock": False, "payload": payload, "secure_hash": payload["pp_SecureHash"]}

    def verify_callback(self, data: dict) -> bool:
        """Validate the secure hash returned by JazzCash on callback."""
        if not self.enabled:
            return data.get("pp_ResponseCode") == "000"
        received_hash = data.get("pp_SecureHash", "")
        payload = {k: v for k, v in data.items() if k != "pp_SecureHash"}
        expected = self._secure_hash(payload)
        return hmac.compare_digest(received_hash, expected)
